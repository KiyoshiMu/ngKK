import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/models/user.model';
import { egfrModel } from 'src/app/services/models/egft.model';
import { toAge } from 'src/app/services/utils/calculators';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  _board = 'board';
  user: User;
  age: number;
  multi: any[];
  show = false;
  ngOnInit() {
    setTimeout(async () => {

      this.userService.fetchEgrf(this.user.uid).subscribe(
        actions => {
          const series = [];
          actions.forEach(action => {
            const data = action.payload.doc.data()
            series.push({
              "name": new Date(data.time).toLocaleString(),
              "value": data.egfr
            })
          }
          );
          this.multi = [{
            "name": "eGFR",
            "series": series
          }],
            console.log(this.multi);
        }
      )
    }, 300);
    setTimeout(() => {
      this.show = true;
    }, 1000);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public userService: UserService) {
    this.userService.user$.subscribe(
      user => {
        this.age = toAge(user.birthday);
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
