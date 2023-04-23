import { from, merge, Observable, of as observableOf } from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  tap,
  timeout,
} from 'rxjs/operators';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Travel } from '../../models/travel';
import { DataServiceService } from '../../shared/service/data-service.service';
import { MailService } from '../../shared/service/mail.service';
import { ConfirmComponent } from '../dialog/confirm/confirm.component';

@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html',
  styleUrls: ['./travel-list.component.scss'],
})
export class TravelListComponent implements OnInit, AfterViewInit {
  selection = new SelectionModel<Travel>(true, []);
  filterValue = '';
  dataFromDialog: any;
  displayedColumns: string[] = [
    'select',
    'icon',
    'id',
    'start',
    'end',
    'customer',
    'total',
    'submit',
    'payout',
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
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    public dataService: DataServiceService,
    private mail: MailService,
    private announcer: LiveAnnouncer,
    public confirmDialog: MatDialog
  ) {
    this.dataSource.filterPredicate = (data: Travel, filter: string) => {
      return (
        data.id.toLocaleLowerCase().includes(filter) ||
        data.start.toLocaleLowerCase().includes(filter) ||
        data.end.toLocaleLowerCase().includes(filter) ||
        data.customer.name.toLocaleLowerCase().includes(filter)
      );
    };
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getTravel();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortChange(sortState: Sort) {
    if (sortState.direction) {
      this.announcer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.announcer.announce(`Sorting cleared`);
    }
  }

  createTravel() {
    this.router.navigate(['business/createTravel']);
  }

  updateTravel(id: any) {
    this.router.navigate(['business/updateTravel', id]);
  }

  deleteTravel(rowId: number, id: string) {
    const dialogRef = this.confirmDialog.open(ConfirmComponent, {
      width: '350px',
      height: '200px',
      data: {
        title: 'Reise löschen',
        icon: 'fal-trash',
        text: 'Soll die Reise wirklich gelöscht werden',
        color: 'red',
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data === 'OK') {
        this.dataSource.data.splice(rowId, 1);
        this.dataSource._updateChangeSubscription();
        this.dataService.deleteTravel(id);
      }
    });
  }

  clearFilter(event: Event) {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  submitTravel() {
    console.log(this.selection.selected, 'Selection');
    this.mail.sendMail(this.selection.selected);
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
        )
        //timeout(10000),
        //tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        //console.error;
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
