import { from, merge, Observable, of as observableOf } from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Travel } from '../../models/travel';
import { DataServiceService } from '../../shared/service/data-service.service';

@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit, AfterViewInit {
  selection = new SelectionModel<Travel>(true, []);
  filterValue = '';
  displayedColumns: string[] = [
    'select',
    'id',
    'start',
    'end',
    'customer',
    'total',
    'actions',
  ];
  customerList: any;
  dataSource = new MatTableDataSource<Travel>();
  travels: Travel[];
  userId = 'ea5eg'; // localStorage.getItem('userId');
  loading = true;
  dataObservable: any;
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, public dataService: DataServiceService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getTravel();
  }

  applyFilter(filter: string) {
    if (filter !== null) {
      this.dataSource.filter = filter.trim().toLowerCase();
    }
  }

  createTravel() {
    this.router.navigate(['business/createTravel']);
  }

  updateTravel(id: any) {
    this.router.navigate(['business/updateTravel', id]);
  }

  deleteTravel(rowId: number, id: string) {
    this.dataSource.data.splice(rowId, 1);
    this.dataSource._updateChangeSubscription();
  }

  clearFilter(event: Event) {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  submitTravel() {
    console.log(this.selection.selected, 'Selection');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getTravel() {
    this.dataService
      .getTravels()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.doc.data() as Travel;
              data.id = a.payload.doc.id;
              return { ...data };
            })
            .filter((t) => t.userId == this.userId)
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.travels = dates;
        this.dataSource.data = this.travels;
        this.loading = false;
      });
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Travel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }
}
