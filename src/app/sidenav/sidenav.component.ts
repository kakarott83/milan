import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

const SMALL_WIDTH_BEAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public isScreenSmall!: boolean;

  public sideNacActions = [
    { action: 'worktime', path: '', display: 'Arbeitszeit', icon: 'schedule' },
    { action: 'newTravel', path: '', display: 'Neue Reise', icon: 'luggage' },
    {
      action: 'allTravels',
      path: '',
      display: 'Alle Reisen',
      icon: 'format_list_bulleted',
    },
    {
      action: 'newCustomer',
      path: '',
      display: 'Neuer Kunde',
      icon: 'person_add',
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BEAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches;
      });

    this.router.events.subscribe(() => {
      if (this.isScreenSmall) {
        this.sidenav.close();
      }
    });
  }
}
