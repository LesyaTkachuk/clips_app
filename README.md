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

Will generate module with routing-module
ng g module NameOfModule --routing

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

# Forms

Reactive(harder to learn, scalable, conf in class) and Template (easier to lear, better for small forms, conf in template) Forms

- Two-way binding is the feature for being able to listen to event and update values simultaniously.
  We can add property binding and event binding to ngModel simultaneously:
  <input [(ngModel)]=''> replaces this syntax <input [value]='' (change)=''>

"#" allows us to create variable in template, but it can be used only in template (not in component): #loginForm
We can set it with the value of ngForm directive to get access to its properties: #loginForm='ngForm'
We have to validate inputs by adding attributes, then NgModule directive will invert them to Validators

# Firebase

Create a new project on Firebase page, add Firebase database. Add AngularFire package to your app
ng add @angular/fire
Each service of Firebase has its own module

Authentification - unable authentification with email in your project
import module into app.module and add service AngularFireAuth into constructor of register class component
constructor(private auth: AngularFireAuth) {}
this.auth.createUserWithEmailAndPassword({...})

Storing data- we should add data to collection document, if collection doesn't exist Firebase will automatically create one with this name.
db.collection('users').doc(userCred.user.uid).set({...})

# Async pipe

Async pipe is used to subscribe to the Observable inside the template.
Async pipe accepts an Observable or Promise.
Angular will pass an Observable to the async pipe, behind the scenes the async pipe will subscribe to the observable.

 <li *ngIf="!(auth.isAuthenticated$ | async); else authLinks">

# Custom Validators

They can be a class or a function. Custom validators can be asyncronous.
We just have to add our custom validators functions into second argument of new Form group instance creation, which is an array of custom validator functions
registerForm = new FormGroup(
{ ...}, [RegisterValidators.match('password', 'confirm_password')]
);

# Routing

we have two functions for registering routing in our app RouterModule.forRoot(routes) register a service Router and RouterModule.forChild(routes)

We can redirect user to different url using:

- add routerLink directive to ancor element <a routerLink="/about" >
- Router.navigateByUrl('/absolutePath') to redirect user programatically
- uaing redirectTo propertyin routes configurations {path:'/learn-about', redirectTo: '/about'}

We can use RoutingGuard to prevent our routes from non-authenticated users

# Uploading files

We create EventBlocker directive to prevent default browser behaviour at some events (drop, dragOver)
There is a wierd bug of Chrome that we can't see file in dataTransfer object in console. We have manually set the first item of event.dataTransfer.files to a variable file.

MIME types - that is a label identifying the type of data in a file (audio/mp3, audio/ogg, application/msword, video/mp4)

Logic connected with the file upload can be found in upload.component.ts and services/clip.ts

Firebase reference - is an object that points to a location in your application, allows you to read/write references, create new references, so manage multiple locations (so we use references to upload a file to the storage and add data to the database)
Firebase snapshot - is an object that is a copy of a location in your application, they are read only and immutable. They are memory efficient and makes app more lightweight. Snapshots are ussually returned whenever you are listened to changes to a reference, so when some event occur

# Behavior subject

Behavior subject is a new type of observable. Normally we can subscribe to observable to wait for value pushed by the observable. Subscribers don't have the power to force the observable to push a new value. But behavior subject can push a value while being subscribed to an observable. We can create an object that acts like an observable and an observer.
We will use it to handle sorting when getting users clips.

# Composite indexes

Helps the database sort through data by multiple fields. You can think of an index as a table of contents for your data. We have to create composite indexes in Indexes section of Firebase Database.
