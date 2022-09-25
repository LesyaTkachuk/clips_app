import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  // isAuthenticated = false;

  constructor(public modal: ModalService, public auth: AuthService) {
    // we subscribe to the isAuthenticated$ observable from authService. But we don't need it if we are using async pipe
    // this.auth.isAuthenticated$.subscribe((status) => {
    //   this.isAuthenticated = status;
    // });
  }

  ngOnInit(): void {}

  openModal($event: Event) {
    $event.preventDefault();

    this.modal.toggleModal('auth');
  }
}
