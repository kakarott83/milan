import { map, tap } from 'rxjs/operators';
import { Country } from 'src/app/models/country';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataServiceService } from '../../shared/service/data-service.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit, AfterViewInit {
  filterValue = '';
  displayedColumns: string[] = ['id', 'name', 'rate', 'halfRate', 'actions'];
  countryList: any;
  dataSource = new MatTableDataSource();
  countries: Country[];
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, public dataService: DataServiceService) {}

  ngOnInit(): void {
    this.loading = true;
    this.getCountries();
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

  createCountry() {
    this.router.navigate(['business/createCountry']);
  }

  updateCountry(id: any) {
    if (id !== null) {
      this.router.navigate(['business/updateCountry', id]);
    }
  }

  deleteCountry(rowId: number, id: string) {
    this.dataSource.data.splice(rowId, 1);
    this.dataSource._updateChangeSubscription();
    this.dataService.deleteCountryById(id);
  }

  clearFilter(e: Event) {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  getCountries() {
    this.dataService
      .getCountries()
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Country;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        ),
        tap((dates) => console.log(dates, 'Tap'))
      )
      .subscribe((dates) => {
        this.countries = dates;
        this.dataSource.data = this.countries;
        this.loading = false;
      });
  }
}
