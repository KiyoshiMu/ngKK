import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
// import 'firebase/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

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
      this.router.navigate(['home'])
    } catch (error) {
      console.log(error);
    }
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(data, { merge: true })

  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
  }

}