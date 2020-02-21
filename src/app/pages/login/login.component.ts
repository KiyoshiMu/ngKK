import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import {
  lightSpeedInOnEnterAnimation
} from 'angular-animations';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    lightSpeedInOnEnterAnimation(),]
})
export class LoginComponent implements OnInit {

  user: firebase.User;
  logo = "assets/icons/icon.png";
  start = false;
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(public userService: UserService,
    private router: Router) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.start = true;
    }, 500);
  }

  onLogin() {
    this.userService.loginGoogle()
  }

}
