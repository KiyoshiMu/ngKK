import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
// import 'firebase/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './models/user.model';
import { egfrModel } from './models/egft.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      }))
  }

  async loginGoogle() {
    // await auth().setPersistence(auth.Auth.Persistence.LOCAL);
    const provider = new auth.GoogleAuthProvider();
    try {
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    } catch (error) {
      console.log(error);
    }
  }

  private updateUserData({ uid,
    email,
    displayName,
    photoURL }: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    }
    return userRef.set(data, { merge: true });
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
    }
  }

  async addEgfrRecord({ gender, race, age, scr, scys, egfr }: egfrModel,
    uid: string) {
    const collection: AngularFirestoreCollection = this.afs.collection("egfrRecords");
    const time = Date.now();
    const data = {
      uid,
      time,
      gender,
      race,
      age,
      scr,
      scys,
      egfr,
    }
    try {
      await collection.add(data);
      console.log(data);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  updateProfile(profile: User, uid: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = profile
    return userRef.update(data);
  }

  fetchEgrf(uid: string) {
    const docs: AngularFirestoreCollection<egfrModel> =
      this.afs.collection(
        "egfrRecords",
        ref => ref.where("uid", "==", uid)
      )
    return docs.snapshotChanges()
  }
}