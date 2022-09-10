import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  // Input decorator will help us to access the input data
  @Input() color = 'blue';

  get bgColor() {
    return `bg-${this.color}-400`;
  }
  constructor() {}

  ngOnInit(): void {}
}
