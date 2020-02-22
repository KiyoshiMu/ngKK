import { Component, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { egfrModel } from 'src/app/services/models/egft.model';
import { User } from 'src/app/services/models/user.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { birthdayValidator } from 'src/app/services/utils/validators';
import { calculatorMDRD, toAge } from 'src/app/services/utils/calculators';
import { Profile } from 'src/app/services/models/profile.model';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';

interface egfrDialogData {
  eGFR: number;
  comment: string;
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
          Validators.min(0),
          Validators.max(50)])],
      scys: [null,
        [Validators.min(0),
        Validators.max(50)]],
    });

  }

  get user(): User {
    return this._user
  }

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public profile: Profile,
    private userService: UserService,
    private http: HttpClient) {
  }

  async onSubmit() {
    const egfrTestV = this.egfrForm.value;
    if (!this.user.birthday) {
      egfrTestV.birthday = Date.parse(egfrTestV.birthday)
    }
    const egfrTest = egfrTestV as egfrModel;
    egfrTest.age = toAge(egfrTestV.birthday);
    const eGFR = calculatorMDRD(egfrTest);
    if (!isFinite(eGFR)) {
      return
    }

    egfrTest.egfr = eGFR;
    const comment = this.checkNormal(eGFR);
    console.log(comment);
    this.getEgfr(egfrTest);
    const result = await this.dialog.open(egfrDialog, {
      width: '250px',
      data: { eGFR, comment, showTip: this.showTip },
    }).afterClosed().toPromise()

    if (this.showTip && result) {
      this.userService.updateProfile(
        {
          race: egfrTest.race,
          birthday: egfrTest.birthday,
          gender: egfrTest.gender,
        },
        this.user.uid
      )
    }
    this.backEvent.emit('board');
  }

  getEgfr(egfr: egfrModel) {
    egfr.uid = this.user.uid;
    this.userService.addEgfrRecord(
      egfr
    )
  }

  readonly normalBins = [90, 60, 45, 30, 15]
  readonly labels = [
    'Normal or high',
    "Mildly decreased",
    'Mildly to moderately decreased',
    'Moderately to severely decreased',
    'Severely decreased',
    'Kidney failure'
  ]
  checkNormal(eGFR: number) {
    for (let index = 0; index < this.normalBins.length; index++) {
      const element = this.normalBins[index];
      if (eGFR > element) {
        const comment = this.labels[index];
        return comment;
      }
    }
    const comment = this.labels[this.normalBins.length];
    return comment;

  }

  notifyDoctor(comment: string) {
    if (!comment.includes('Normal') && this.user.doctorVerified) {
      this.http.post(
        `https://us-central1-predmeal.cloudfunctions.net/notifyDoctor?email=${this.user.doctorEmail}`,
        comment
      )
    }
  }
}

