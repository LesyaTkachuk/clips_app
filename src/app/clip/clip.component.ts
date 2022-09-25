import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id = '';

  constructor(public route: ActivatedRoute) {}

  // we can get dynamic parameters from snapshot object
  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;

    // we subscribe to params observable, it will push values whenever router params have changed
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}
