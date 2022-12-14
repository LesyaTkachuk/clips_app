import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import IUser from 'src/app/models/user.model';
import { delay, map, filter, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // if there is no such collection firebase will create new one wth this name and add user to it
    this.usersCollection = db.collection('users');

    // auth.user.subscribe(console.log);
    // we create an observable
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    // as our service is outsede of the router outlet directive we don't have access to the route directly
    // our router emits events whenever the user navigates the app
    // to listen to specific event we should filter it from others
    // throug map function we are accessing the first child of the routes tree (exactly the tree of ActivatedRoutes objects)
    // we need to subscribe to observable inside the observable, we will use switchMap operator (the previous observable will be completed if the new value will be pushed by observable, so, only one inner subscription in a time)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({})) // nullish coalescing operator(check if value is null or undefined) and  fallback observable(of operator creates a new observable and pushes empty object value)
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password is not provided');
    }

    //to add new user to authentification server. Firebase SDK will provide for us token and automatically add it to this user requests
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    if (!userCred.user) {
      throw new Error("user can't be found");
    }

    // to store information about user in database in users collection this.usersCollection.add()
    // to connect our user in authentification service and database we will provide userId(uid) from auth service and find or create new document with such id and set to it user info
    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    // auth service can store addition information in profile: displayName and photoUrl(profileImage)
    await userCred.user.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
