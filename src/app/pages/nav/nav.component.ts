import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/user.model';
import { egfrModel } from 'src/app/services/egft.model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  _board = 'board';
  user: User;
  age: number;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public userService: UserService) {
    this.userService.user$.subscribe(
      user => {
        this.age = Math.floor((Date.now() - user.birthday) / 31556952000);
        user.age = this.age;
        this.user = user;
      }
    )
  }

  switchBoard(name: 'egfr' | 'board' | "profile") {
    this._board = name;
  }

  public get board(): string {
    return this._board
  }

  getEgfr(egfr: egfrModel) {
    this.userService.addEgfrRecord(
      egfr, this.user.uid
    )
  }

  getProfile(profile: User) {
    console.log(profile);
    this.userService.updateProfile(
      profile, this.user.uid
    )
  }
}
