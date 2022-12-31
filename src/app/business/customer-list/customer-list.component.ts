import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

const customer = [
  {
    id: '4711',
    city: 'Horgen',
    name: 'Bank-now',
    country: { name: 'Schweiz', rate: 64, halfRate: 32 },
  },
  {
    id: '4712',
    city: 'Linz',
    name: 'Oberbank',
    country: { name: 'Österreich', rate: 24, halfRate: 12 },
  },
  {
    id: '4713',
    city: 'Grünwald',
    name: 'AIL',
    country: { name: 'Deutschland', rate: 24, halfRate: 12 },
  },
];

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  filterValue = '';
  displayedColumns: string[] = ['id', 'name', 'city', 'country', 'actions'];
  dataSource = new MatTableDataSource(customer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
  }

  clearFilter(e: Event) {
    this.filterValue = '';
    this.dataSource.filter = '';
  }
}
