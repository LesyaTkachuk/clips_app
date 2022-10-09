import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  isSubmitting = false;
  isAlertShown = false;
  alertMessage = '';
  alertColor = 'blue';
  showPercentage = false;
  percentage = 0;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
  ) {
    // we need to extract user data immidiately before file upload started
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    // to cancel the uploading request if we are moving out from our page
    this.task?.cancel();
  }

  storeFile($event: Event) {
    console.log($event);
    this.isDragover = false;

    // we need to extract the first file in files array of dataTransfer object
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, '')); // to replace extention with empty string
    this.nextStep = true;
  }

  uploadFile() {
    // to disable changes in form during file uploading
    this.uploadForm.disable();
    this.isSubmitting = true;
    this.isAlertShown = true;
    this.alertMessage = 'Your file is being uploaded, please wait ...';
    this.alertColor = 'blue';
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipsPath = `clips/${clipFileName}.mp4`; // path to the file (firebase will automatically create clips folder if it doesn't exist)

    // upload our video to the Firebase database
    this.task = this.storage.upload(clipsPath, this.file);
    // a reference object points to a specific file in our storage, and it is a separate action from upload
    const clipRef = this.storage.ref(clipsPath);

    // subscribe to percentageChanges method to display upload percentage
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = progress as number;
    });

    // to get last snapshot to obtain success upload state and then subscribe to getDownloadURL method to get public file url
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        // we need to subscribe to the inner observable clipRef.getDownloadUrl() observable to get public url value. From this moment we are loosing our snapshot value and passing url value to the next function
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        // next will be executed after successful file upload
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertMessage = 'Your file was successfully uploaded!';
          this.alertColor = 'green';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 2000);
        },
        error: (error) => {
          // error will be executed if error occur during file upload to database
          this.uploadForm.enable();
          this.isSubmitting = false;
          this.alertMessage = 'OOoops! An error occured during file upload';
          this.alertColor = 'red';
          this.showPercentage = false;
        },
      });
  }
}
