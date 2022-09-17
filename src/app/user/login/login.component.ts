import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please wait until your data will be processed';
  alertColor = 'blue';

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    this.showAlert = true;
    this.inSubmission = true;
    this.alertMsg = 'Please wait until your data will be processed';
    this.alertColor = 'blue';
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );

      this.alertMsg = 'You are successfully logined to the app';
      this.alertColor = 'green';
      return;
    } catch (e) {
      this.alertMsg = 'Email or password is incorrect';
      this.alertColor = 'red';
      this.inSubmission = false;

      console.log(e);
      return;
    }
  }
}
