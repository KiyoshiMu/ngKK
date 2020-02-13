import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from 'src/app/services/user.model';

export function birthdayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const date = Date.parse(control.value);
    return date < (-2208970800000) || date > (1577854800000)
      ? { 'invalidBirthday': { value: control.value } } : null;
  };
}

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

  hasUnitNumber = false;

  genders = [
    'Male', 'Female'
  ];

  races = [
    'Black', 'Other'
  ];

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    const profile = this.profileForm.value;
    profile.birthday = Date.parse(profile.birthday);
    this.profileEvent.emit(this.profileForm.value as User);
    alert('Thanks!');
  }

}
