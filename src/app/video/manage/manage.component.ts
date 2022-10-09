import { Component, OnInit } from '@angular/core';
// ActivatedRoute class is a service injected into our component to gather information about the route the user is currently on
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  // $ is appended to indentify an observable
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    // we instantiate Behavior subject class. We set the sort property to a new instance of the BehaviorSubject class. We will pass an initial value as this.videoOder to push by the observable
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((qParams: Params) => {
      this.videoOrder = qParams.sort === '2' ? qParams.sort : '1';

      // we have to push the selected order whenever user changes the order with the help of next method of our sort observable
      this.sort$.next(this.videoOrder);
    });
    // we subscribe to getUserClips observable and pass sort subjectinto it as an argument
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  // we create update method which accepts one $event argument, that will be the data emitted by the child components
  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID === $event.docID) {
        this.clips[index].title = $event.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);

    //  to delete clip from the page
    this.clips = this.clips.filter((element) => element.docID !== clip.docID);
  }
}
