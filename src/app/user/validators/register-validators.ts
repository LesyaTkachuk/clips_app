import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

// we will create factory class
export class RegisterValidators {
  // static methods don't have an access to properties and methods of the given class
  // we have to pass formGroup element inside match method and return an object of errors or null if there is no errors
  static match(controlName: string, matchingСontrolName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingСontrol = group.get(matchingСontrolName);

      if (!control || !matchingСontrol) {
        console.error('Form controls can not be found in the form group');
        return { controlNotFound: false };
      }

      const error =
        control.value === matchingСontrol.value ? null : { noMatch: true };

      // we have to add our custom error to control
      matchingСontrol.setErrors(error);
      return error;
    };
  }
}
