import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  // we add ViewEncapsulation to prevent encapsulation of css to a single component to prevent issues with videojs package css
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  //@ViewChild decorator will provide a query ont he template, with this decorator we can select components, directives and regular HTML elements
  // the property target will store the instance of the Element Reference class
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;
  clip?: IClip;

  constructor(public route: ActivatedRoute) {}

  // we can get dynamic parameters from snapshot object
  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    // this.id = this.route.snapshot.params.id;

    // we subscribe to params observable, it will push values whenever router params have changed
    // this.route.params.subscribe((params: Params) => {
    //   this.id = params.id;
    // });

    this.route.data.subscribe((data) => {
      this.clip = data.clip as IClip;
      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4',
      });
    });
  }
}
