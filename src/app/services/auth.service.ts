import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import IUser from 'src/app/models/user.model';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    // if there is no such collection firebase will create new one wth this name and add user to it
    this.usersCollection = db.collection('users');

    // auth.user.subscribe(console.log);
    // we create an observable
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(delay(1000))
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
}
