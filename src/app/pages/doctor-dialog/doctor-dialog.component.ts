import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/services/models/user.model';

@Component({
  selector: 'app-doctor-dialog',
  templateUrl: './doctor-dialog.component.html',
  styleUrls: ['./doctor-dialog.component.scss']
})
export class DoctorDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DoctorDialogComponent>) { }

  user: User = {
    'doctorName': undefined,
    'doctorEmail': undefined,
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.user);
    this.dialogRef.close(this.user);
  }
}
