import { Component, OnInit, Output, Input, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/services/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Doctor } from 'src/app/services/models/doctor.model';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.scss']
})
export class DoctorComponent implements OnInit {
  @Output() backEvent = new EventEmitter<string>();
  @Input() user: User;
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
      data: {
        'doctorName': values.name,
        'doctorEmail': values.email,
      } as Doctor,
    }).afterClosed().toPromise();

    doctorInfo.then(
      sendEmail => {
        if (sendEmail) {
          this.getProfile(
            {
              'doctorName': values.name,
              'doctorEmail': values.email,
              'doctorNotified': true,
              'doctorVerified': false,
            },
            {
              'doctorEmail': values.email,
              'doctorName': values.name,
              'patientName': this.user.firstName,
              'message': values.message,
            }
          )
          this._snackBar.open('Doctor Updated', 'OK', {
            duration: 3000
          });
        }
        else {
          this.getProfile({
            'doctorName': values.name,
            'doctorEmail': values.email,
            'doctorNotified': false,
            'doctorVerified': false,
          })
          this._snackBar.open('Canceled', 'OK', {
            duration: 3000
          });
        }
      }
    )

    this.backEvent.emit('board')
  }

  getProfile(profile: User, doctor?: Doctor) {
    // console.log(profile);
    this.userService.updateProfile(
      profile, this.user.uid
    );
    if (doctor) {
      this.userService.updateDoctor(
        doctor, this.user.uid
      );
    }
  }
}

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctorDialog.html',
})
export class DoctorDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DoctorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public doctorData: Doctor) { }

  ngOnInit(): void {
  }

}