import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DataServiceService } from 'src/app/shared/service/data-service.service';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  filterValue = '';
  displayedColumns: string[] = ['id', 'name', 'city', 'country', 'actions'];
  dataSource = new MatTableDataSource();
  loading = false;
  customers: Customer[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, public dataService: DataServiceService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getCustomer();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    if (filter !== null) {
      this.dataSource.filter = filter.trim().toLowerCase();
    }
  }

  createCustomer() {
    this.router.navigate(['business/createCustomer']);
  }

  updateCustomer(id: any) {
    if (id !== null) {
      this.router.navigate(['/business/updateCustomer', id]);
    }
  }

  deleteCustomer(rowId: number, id: string) {
    console.log(rowId);
    console.log(id);
    this.dataSource.data.splice(rowId, 1);
    this.dataSource._updateChangeSubscription();
    this.dataService.deleteCustomerById(id);
  }

  clearFilter(e: Event) {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  getCustomer() {
    this.dataService
      .getCustomers()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Customer;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.customers = dates;
        this.dataSource.data = this.customers;
        this.loading = false;
      });
  }
}
