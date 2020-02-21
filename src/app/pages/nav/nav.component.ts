import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/services/models/user.model';
import { egfrModel } from 'src/app/services/models/egft.model';
import { toAge } from 'src/app/services/utils/calculators';
import { Weight } from 'src/app/services/models/weight.model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  _board = 'board';
  user: User;
  age: number;
  egfrs: any[];
  weights: any[];
  egfrSeries = [];
  weightSeries = [];
  show = false;
  ngOnInit() {
    setTimeout(async () => {
      this.userService.keepEgrf(this.user.uid).subscribe(
        actions => {
          actions.forEach(action => {
            const data = action.payload.doc.data();
            this.egfrSeries.push({
              "name": data.time,
              "value": data.egfr
            })
          }
          );
          this.egfrs = [{
            "name": "eGFR",
            "series": this.egfrSeries
          }]
          console.log(this.egfrs);
        }
      )
    }, 300);

    setTimeout(async () => {
      this.userService.keepWeight(this.user.uid).subscribe(
        actions => {
          actions.forEach(action => {
            const data = action.payload.doc.data();
            this.weightSeries.push({
              "name": data.time,
              "value": data.weight
            })
          }
          );
          this.weights = [{
            "name": "Weight",
            "series": this.weightSeries
          }]
          console.log(this.weights);
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

  switchBoard(name: string) {
    this._board = name;
  }

  public get board(): string {
    return this._board
  }

  getEgfr(egfr: egfrModel) {
    egfr.uid = this.user.uid;
    this.userService.addEgfrRecord(
      egfr
    )
  }

  getWeight(weight: Weight) {
    weight.uid = this.user.uid;
    this.userService.addWeight(
      weight
    )
  }

  getProfile(profile: User) {
    // console.log(profile);
    this.userService.updateProfile(
      profile, this.user.uid
    )
  }
}
