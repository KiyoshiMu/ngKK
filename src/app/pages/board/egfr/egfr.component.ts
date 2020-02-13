import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { egfrModel } from 'src/app/services/egft.model';
import { User } from 'src/app/services/user.model';
import { MatDialog, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { birthdayValidator } from '../../profile/profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-egfr',
  templateUrl: './egfr.component.html',
  styleUrls: ['./egfr.component.scss']
})
export class EgfrComponent {
  showTip = false;
  egfrForm: FormGroup;
  @Output() egfrEvent = new EventEmitter<egfrModel>();
  @Output() userEvent = new EventEmitter<User>();
  _user: User;


  @Input() set user(user: User) {
    this._user = user;
    if (!this.user.age
      || !this.user.race
      || !this.user.gender) {
      this.showTip = true;
    };

    this.egfrForm = this.fb.group({
      gender: [user?.gender, Validators.required],
      race: [user?.race, Validators.required],
      birthday: [user?.birthday,
      [Validators.required, , birthdayValidator()]],
      scr: [null,
        Validators.compose(
          [Validators.required,
          Validators.min(1),
          Validators.max(100)])],
      scys: [null,
        [Validators.min(1),
        Validators.max(100)]],
    });

  }

  get user(): User {
    return this._user
  }

  hasUnitNumber = false;

  genders = [
    'Male', 'Female'
  ];

  races = [
    'Black-American', 'Other', 'Japanese', 'Chinese'
  ];

  constructor(private fb: FormBuilder, public dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  openDialog() {
    return this.dialog.open(DialogEgfr, {
      width: '250px',
    })
      .afterClosed().toPromise()
  }

  async onSubmit() {
    const egfrTestV = this.egfrForm.value;
    if (!this.user.birthday) {
      egfrTestV.birthday = Date.parse(egfrTestV.birthday)
    }
    const egfrTest = egfrTestV as egfrModel;
    egfrTest.age = Math.floor((Date.now() - egfrTestV.birthday) / 31556952000);
    const eGFR = this.calculator(egfrTest);
    egfrTest.egfr = eGFR;
    this.egfrEvent.emit(egfrTest);

    this._snackBar.open(`Your eGFR is ${eGFR}`);

    if (this.showTip) {
      const result = await this.openDialog();
      if (result) {
        this.userEvent.emit(
          {
            race: egfrTest.race,
            birthday: egfrTest.birthday,
            gender: egfrTest.gender,
          } as User
        )
      }
    }
  }

  private calculator({
    gender,
    race,
    age,
    scr,
  }: egfrModel) {


    const genderAdjust = gender === 'Female' ? 0.742 : 1
    let raceAdjust: number;
    switch (race) {
      case 'Black-American':
        raceAdjust = 1.21;
      case 'Japanese':
        raceAdjust = 0.763;
      case 'Chinese':
        raceAdjust = 1.233;
      default:
        raceAdjust = 1;
        break;
    }

    const eGFR = 186 * scr ** (-1.154)
      * age ** (-0.203)
      * genderAdjust
      * raceAdjust
    return eGFR
  }

  private calculator2({
    gender,
    race,
    birthday,
    scr,
    scys,
  }: egfrModel) {
    const age = Math.floor((Date.now() - birthday) / 31556952000);
    const k = gender === 'Female' ? 0.7 : 0.9
    const genderAdjust = gender === 'Female' ? 0.969 : 1
    const a = gender === 'Female' ? -0.248 : -0.207
    const raceAdjust = race == 'Black' ? 1.01 : 1;

    const eGFR = 135 * (Math.min(scr / k, 1) ** a)
      * (Math.max(scr / k, 1) ** (-0.601))
      * (Math.min(scys / 0.8, 1) ** (-0.375))
      * (Math.max(scys / 0.8, 1) ** (-0.711))
      * (0.995 ** age)
      * genderAdjust
      * raceAdjust
    return eGFR
  }
}

@Component({
  selector: 'egfr-dialog',
  templateUrl: 'egfrDialog.html',
})
export class DialogEgfr {

  constructor(
    public dialogRef: MatDialogRef<DialogEgfr>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}