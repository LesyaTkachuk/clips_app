# Clips

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## My notes:

We will use tailwind package for adding css clases:
npm install -D tailwindcss/@latest
npx init tailwind

- adjust tailwind.config.js file
- add to src/styles/css @tailwind imports

To create component inside module user:
ng generate component user/auth-modal

To pass the desired content in this place:
<ng-content select="[heading]"></ng-content>

Services are used to manage data between different components. They are used to store global data in them. Ussualy are placed in app directory

Dependancy injection is a programming practice for creating objects.DI has two jobs: first to create an object outside of our classes, second to pass this object to our components or classes. Ussually it is created as class, but we don't need to create an instance of this class, Angular will do it for us. Compilar understands it with the help of class types annotations and create an instance of ModalServise class.
Typescript-->Angular and Typescript Compiler-->Javascript
constructor(public modal: ModalService)

3 ways to make class injectable:

1.  We can import @Injectable decorator and pass property providedIn to appoint where this class can be injectable.Usually it is root
    2.Injectable from modules or components, delete providedIn property from @Injectable decorator and import ModalService inside module that will use it and add into providers array, that is array of services. Or we can import it inside component and add to component providers array

To avoid memory leaks we should register service on component init and unregister on component destroy:
export class AuthModalComponent implements OnInit,OnDestroy {
constructor(public modal: ModalService) {}

ngOnInit(): void {
this.modal.register('auth');
}

ngOnDestroy():void {
this.modal.unregister('auth');
}
}
