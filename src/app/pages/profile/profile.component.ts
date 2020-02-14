import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/services/models/user.model';
import { birthdayValidator } from 'src/app/services/utils/validators';
import { Profile } from 'src/app/services/models/profile.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Output() profileEvent = new EventEmitter<User>();
  @Input() user: User;
  profileForm = this.fb.group({
    firstName: [null,],
    lastName: [null,],
    gender: [null, Validators.required],
    race: [null, Validators.required],
    birthday: [null,
      [Validators.required, , birthdayValidator()]]
  });

  constructor(private fb: FormBuilder,
    public profile: Profile,
    private _snackBar: MatSnackBar) { }

  onSubmit() {
    const profile = this.profileForm.value;
    profile.birthday = Date.parse(profile.birthday);
    this.profileEvent.emit(this.profileForm.value as User);
    this._snackBar.open('Profile Updated', 'OK', {
      duration: 3000
    });
  }

}
