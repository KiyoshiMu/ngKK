import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  _uid: string;
  @Output() selectEvent = new EventEmitter<string>();
  @Input() set uid(uid: string) {
    this._uid = uid;
  }

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'eGFR', cols: 2, rows: 1 },
          { title: 'Weight', cols: 2, rows: 1 },
          { title: 'Nothing', cols: 2, rows: 1 },
          { title: 'Nothing', cols: 2, rows: 1 }
        ];
      }
      return [
        { title: 'eGFR', cols: 2, rows: 1 },
        { title: 'Weight', cols: 1, rows: 1 },
        { title: 'Nothing', cols: 1, rows: 2 },
        { title: 'Nothing', cols: 1, rows: 1 }
      ];
    })
  );

  _multi: any[];
  @Input() set multi(v: any[]) {
    this._multi = v;
  }
  get multi() {
    return this._multi;
  }

  view: any[] = [300, 300];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = false;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'eGFR';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
  }
}
