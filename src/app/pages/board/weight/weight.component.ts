import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Weight } from 'src/app/services/models/weight.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit {
  sliderValue = 60;
  constructor(private userService: UserService) { }
  @Output() backEvent = new EventEmitter<string>();
  @Input() uid: string;

  ngOnInit(): void {
  }

  submit() {
    console.log(this.sliderValue);
    const weight = { 'weight': this.sliderValue } as Weight;

    weight.uid = this.uid;
    this.userService.addWeight(
      weight
    )

    this.backEvent.emit('board')
  }
}
