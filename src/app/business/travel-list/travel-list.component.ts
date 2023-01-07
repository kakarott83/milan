import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  filterValue = '';
  displayedColumns: string[] = [
    'id',
    'start',
    'end',
    'customer',
    'total',
    'actions',
  ];
  customerList: any;
  dataSource = new MatTableDataSource();
  travels: Travel[];
  userId = 'ea5eg'; // localStorage.getItem('userId');
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, public dataService: DataServiceService) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    console.log(this.dataSource.data, 'After');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filter: string) {
    if (filter !== null) {
      this.dataSource.filter = filter.trim().toLowerCase();
    }
  }

  async getData() {
    this.loading = true;
    let t = await this.dataService.getTravelListByUser(this.userId);

    t.snapshotChanges().subscribe((data) => {
      this.travels = [];
      data.forEach((item) => {
        let x = item.payload.toJSON();
        x['id'] = item.key;
        this.travels.push(x as Travel);
        console.log(this.travels, 'WithUserId');
      });
      this.dataSource.data = this.travels;
      console.log(this.dataSource.data, 'DataSource');
      this.loading = false;
    });
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
}
