import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

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
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

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
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    // we need to extract user data immidiately before file upload started
    auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    // to cancel the uploading request if we are moving out from our page
    this.task?.cancel();
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }
    this.isDragover = false;

    // we need to extract the first file in files array of dataTransfer object
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, '')); // to replace extention with empty string
    this.nextStep = true;
  }

  async uploadFile() {
    // to disable changes in form during file uploading
    this.uploadForm.disable();
    this.isSubmitting = true;
    this.isAlertShown = true;
    this.alertMessage = 'Your file is being uploaded, please wait ...';
    this.alertColor = 'blue';
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipsPath = `clips/${clipFileName}.mp4`; // path to the file (firebase will automatically create clips folder if it doesn't exist)

    const screenshotBlob = await this.ffmpegService.blobFronURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;

    // upload our video to the Firebase database
    this.task = this.storage.upload(clipsPath, this.file);
    // a reference object points to a specific file in our storage, and it is a separate action from upload
    const clipRef = this.storage.ref(clipsPath);

    // upload selected screenshot to the Firebase database
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef=this.storage.ref(screenshotPath)

    // subscribe to percentageChanges method to display upload percentage
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screeshotProgress] = progress;

      if (!clipProgress || !screeshotProgress) {
        return;
      }

      const total = clipProgress + screeshotProgress;
      this.percentage = (total as number) / 200;
    });

    // to get last snapshot to obtain success upload state and then subscribe to getDownloadURL method to get public file url
   forkJoin([this.task
    .snapshotChanges(), this.screenshotTask.snapshotChanges()]) 
      .pipe(
        // we need to subscribe to the inner observable clipRef.getDownloadUrl() observable to get public url value. From this moment we are loosing our snapshot value and passing url value to the next function
        switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
      )
      .subscribe({
        // next will be executed after successful file upload
        next: async (urls) => {
const [clipUrl, screenshotUrl]=urls;

          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
           url: clipUrl,
           screenshotUrl,
           screenshotFileName: `${clipFileName}.png`,
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
