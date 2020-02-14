import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar
  ) { }
  @Output() selectEvent = new EventEmitter<string>();
  @Input() multi: any[];
  show = false;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(() => {
      this.show = true;
    }, 300);
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

  // options
  view: any[] = [250, 200];
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = false;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'eGFR';
  timeline: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  onSelect(event) {
    console.log(event);
    this.openSnackBar(
      new Date(event.name).toLocaleString())
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', { duration: 2500 });
  }
}
