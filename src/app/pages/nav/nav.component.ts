import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { egfrModel } from '../board/egfr/egfr.component';
import { User } from 'src/app/services/user.model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  _board = 'board';
  user: User;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public userService: UserService) {
    this.userService.user$.subscribe(
      user => this.user = user
    )
  }

  openEGFR() {
    this._board = 'egfr';
  }

  openBoard() {
    this._board = 'board';
  }

  public get board(): string {
    return this._board
  }

  onEgfr(egfr: egfrModel) {
    this.userService.addEgfrRecord(
      egfr, this.user.uid
    )

  }
}
