import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';

// by default plain classes can't be injected with the services, we have manually add this behaviour by decorating the class with @Injectable decorator (in components that is by default)
// the second benefit of @Injectable is ability to inject this class into other classes
@Injectable({
  providedIn: 'root',
})
// we will create custom asyncronous validatoe
export class EmailTaken implements AsyncValidator {
  // we need to inject authentication service into async validator class as a private property "auth" for checking of existing email
  constructor(private auth: AngularFireAuth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return this.auth
      .fetchSignInMethodsForEmail(control.value)
      .then((response) => (response.length ? { emailTaken: true } : null));
  };
}
