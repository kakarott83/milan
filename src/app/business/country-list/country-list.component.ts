import { Country } from 'src/app/models/country';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

const countries: Country[] = [
  { id: '1', name: 'Schweiz', rate: 64, halfRate: 32 },
  { id: '2', name: 'Österreich', rate: 24, halfRate: 12 },
  { id: '3', name: 'Deutschland', rate: 24, halfRate: 12 },
];

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit, AfterViewInit {
  filterValue = '';
  displayedColumns: string[] = ['id', 'name', 'rate', 'halfRate', 'actions'];
  dataSource = new MatTableDataSource(countries);

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

  updateCountry(id: any) {
    if (id !== null) {
      this.router.navigate(['/business/updateCountry', id]);
    }
  }

  deleteCountry(rowId: number, id: string) {
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
