import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface egfrModel {
  gender: string;
  race: string;
  age: number;
  scr: number;
  scys: number;
  egfr?: number;
}

@Component({
  selector: 'app-egfr',
  templateUrl: './egfr.component.html',
  styleUrls: ['./egfr.component.scss']
})
export class EgfrComponent {

  @Output() egfrEvent = new EventEmitter<egfrModel>();

  egfrForm = this.fb.group({
    gender: [null, Validators.required],
    race: [null, Validators.required],
    age: [null, Validators.compose(
      [Validators.required,
      Validators.min(1),
      Validators.max(100)])],
    scr: [null,
      Validators.compose(
        [Validators.required,
        Validators.min(1),
        Validators.max(100)])],
    scys: [null,
      Validators.compose(
        [Validators.required,
        Validators.min(1),
        Validators.max(100)])],
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
    const egfrTest = this.egfrForm.value as egfrModel
    const eGFR = this.calculator(egfrTest);
    egfrTest.egfr = eGFR;
    this.egfrEvent.emit(egfrTest);
    alert(`Your eGFR is ${eGFR}`);
  }

  private calculator({ gender,
    race,
    age,
    scr,
    scys }: egfrModel) {

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
