import { Component, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { egfrModel } from 'src/app/services/models/egft.model';
import { User } from 'src/app/services/models/user.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { birthdayValidator } from 'src/app/services/utils/validators';
import { calculatorMDRD, toAge } from 'src/app/services/utils/calculators';
import { Profile } from 'src/app/services/models/profile.model';

interface egfrDialogData {
  eGFR: number;
  showTip: boolean;
}

@Component({
  selector: 'egfr-dialog',
  templateUrl: 'egfrDialog.html',
})
export class egfrDialog {
  constructor(
    public dialogRef: MatDialogRef<egfrDialog>,
    @Inject(MAT_DIALOG_DATA) public egfrData: egfrDialogData) { }
}


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
  @Output() backEvent = new EventEmitter<string>();
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

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public profile: Profile) {
  }

  openDialog(egfrData: egfrDialogData) {
    return this.dialog.open(egfrDialog, {
      width: '250px',
      data: egfrData,
    })
      .afterClosed().toPromise()
  }

  async onSubmit() {
    const egfrTestV = this.egfrForm.value;
    if (!this.user.birthday) {
      egfrTestV.birthday = Date.parse(egfrTestV.birthday)
    }
    const egfrTest = egfrTestV as egfrModel;
    egfrTest.age = toAge(egfrTestV.birthday);
    const eGFR = calculatorMDRD(egfrTest);
    egfrTest.egfr = eGFR;
    this.egfrEvent.emit(egfrTest);

    const result = await this.openDialog({ eGFR, showTip: this.showTip });
    if (this.showTip && result) {
      this.userEvent.emit(
        {
          race: egfrTest.race,
          birthday: egfrTest.birthday,
          gender: egfrTest.gender,
        }
      )
    }
    this.backEvent.emit('board');
  }
}

