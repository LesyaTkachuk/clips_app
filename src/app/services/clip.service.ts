import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, of, map, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  // combineLatest operator helps us to subscribe to multiple observables at the same time.
  // Whenever either observable pushes the value, the combined latest operator will push the value onto the pipeline,along with the new value, values fron the other observables will get pushed too.
  // the values will be the latest values from the other observables, therefor, will receive values from each observables
  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;

        if (!user) {
          return of([]);
        }

        // orderBy function will sort an array
        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');

        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({ title });
  }

  // to delete clip we shoul delete file in the Storage and delete document in the database
  async deleteClip(clip: IClip) {
    // if we want to interact with the file in the storage we should create a reference, that is the object that points to a specific file
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);

    // to delete file from the storage
    await clipRef.delete();

    // to delete document from database
    await this.clipsCollection.doc(clip.docID).delete();
  }
}
