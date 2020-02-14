import { Component, OnInit } from '@angular/core';
import {
  lightSpeedInOnEnterAnimation, bounceOutLeftOnLeaveAnimation,
  rubberBandAnimation, fadeInExpandOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    lightSpeedInOnEnterAnimation(),
    bounceOutLeftOnLeaveAnimation(),
    rubberBandAnimation(),
    fadeInExpandOnEnterAnimation()]
})
export class HomeComponent implements OnInit {

  iconSrc = "assets/icons/icon.png";
  start = false;
  rubberState = false;
  home = false;
  // showNav = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.start = true;
    }, 1500);
    setTimeout(() => {
      this.rubberState = true;
    }, 2000);
    setTimeout(() => {
      this.start = false;
    }, 3500);
    setTimeout(() => {
      this.home = true;
    }, 4000);
    // setTimeout(() => {
    //   this.showNav = true;
    // }, 4000);
    ;
  }

}
