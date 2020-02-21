import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/services/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.scss']
})
export class DoctorComponent implements OnInit {
  @Output() backEvent = new EventEmitter<string>();
  @Input() uid: string;
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private _snackBar: MatSnackBar, ) { }

  ngOnInit(): void {
  }

  onSubmit(values) {
    console.log(values);
    const doctorInfo = this.dialog.open(DoctorDialogComponent, {
      width: '300px',
      // data: egfrData,
    }).afterClosed().toPromise();

    doctorInfo.then(
      sendEmail => {
        if (sendEmail) {
          this.getProfile({
            'doctorName': values.name,
            'doctorEmail': values.email,
            'doctorNotified': true,
            'doctorVerified': false,
          })
        }
        else {
          this.getProfile({
            'doctorName': values.name,
            'doctorEmail': values.email,
            'doctorNotified': false,
            'doctorVerified': false,
          })
        }
      }
    )

    this._snackBar.open('Doctor Updated', 'OK', {
      duration: 3000
    });
    this.backEvent.emit('board')
  }

  getProfile(profile: User) {
    // console.log(profile);
    this.userService.updateProfile(
      profile, this.uid
    )
  }
}

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctorDialog.html',
})
export class DoctorDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DoctorDialogComponent>) { }

  user: User = {
    'doctorName': undefined,
    'doctorEmail': undefined,
  }

  ngOnInit(): void {
  }

}