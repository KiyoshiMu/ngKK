import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Weight } from 'src/app/services/models/weight.model';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit {
  sliderValue = 60;
  constructor() { }
  @Output() backEvent = new EventEmitter<string>();
  @Output() weightEvent = new EventEmitter<Weight>();

  ngOnInit(): void {
  }

  submit() {
    console.log(this.sliderValue);
    const weight = { 'weight': this.sliderValue } as Weight;
    this.weightEvent.emit(weight);
    this.backEvent.emit('board')
  }
}
