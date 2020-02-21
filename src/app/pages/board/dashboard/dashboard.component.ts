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
  @Input() eGFRs: any[];
  @Input() weights: any[];
  ngOnInit(): void { }

  // options
  // view: any[] = [250, 200];
  handset = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return false;
      }
      else {
        return true;
      }
    }
    )
  );
  legend = this.handset;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = true;
  showYAxisLabel = this.handset;
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
