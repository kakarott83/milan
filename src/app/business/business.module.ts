import { NgApexchartsModule } from 'ng-apexcharts';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BusinessAppComponent } from './business-app.component';
import { TravelChartComponent } from './charts/travel-chart/travel-chart.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CreateOrUpdateCountryComponent } from './create-or-update-country/create-or-update-country.component';
import { CreateOrUpdateCustomerComponent } from './create-or-update-customer/create-or-update-customer.component';
import { CreateOrUpdateTravelComponent } from './create-or-update-travel/create-or-update-travel.component';
import { SpendsDialogComponent } from './create-or-update-travel/spendDialog/spends-dialog/spends-dialog.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { DropzoneDirective } from './dropzone.directive';
import { FileDropComponent } from './file-drop/file-drop.component';
import { HomeComponent } from './home/home.component';
import { LabComponent } from './lab/lab.component';
import { SpendListComponent } from './spend-list/spend-list.component';
import { TravelDetailComponent } from './travel-detail/travel-detail.component';
import { TravelListComponent } from './travel-list/travel-list.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { UploaderComponent } from './uploader/uploader.component';
import { UserComponent } from './user/user.component';
import { WorktimeComponent } from './worktime/worktime.component';
import { ItemWorktimeComponent } from './dashboard/item-worktime/item-worktime.component';
import { ItemLastTravelComponent } from './dashboard/item-last-travel/item-last-travel.component';
import { ItemOpenAmountComponent } from './dashboard/item-open-amount/item-open-amount.component';
import { ItemSubmittedTravelComponent } from './dashboard/item-submitted-travel/item-submitted-travel.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessAppComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'worktime', component: WorktimeComponent },
      { path: 'createTravel', component: CreateOrUpdateTravelComponent },
      { path: 'updateTravel/:id', component: CreateOrUpdateTravelComponent },
      { path: 'user', component: UserComponent },
      { path: 'travel-list', component: TravelListComponent },
      { path: 'country-list', component: CountryListComponent },
      { path: 'customer-list', component: CustomerListComponent },
      { path: 'createCustomer', component: CreateOrUpdateCustomerComponent },
      {
        path: 'updateCustomer/:id',
        component: CreateOrUpdateCustomerComponent,
      },
      { path: 'createCountry', component: CreateOrUpdateCountryComponent },
      { path: 'updateCountry/:id', component: CreateOrUpdateCountryComponent },
      { path: 'test', component: LabComponent },
    ],
  },
];

@NgModule({
  declarations: [
    BusinessAppComponent,
    CreateOrUpdateTravelComponent,
    TravelListComponent,
    HomeComponent,
    SidenavComponent,
    ToolbarComponent,
    UserComponent,
    WorktimeComponent,
    SpendsDialogComponent,
    SpendListComponent,
    CreateOrUpdateCustomerComponent,
    CustomerListComponent,
    CreateOrUpdateCountryComponent,
    CountryListComponent,
    TravelDetailComponent,
    LabComponent,
    FileDropComponent,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent,
    ConfirmComponent,
    TravelChartComponent,
    ItemWorktimeComponent,
    ItemLastTravelComponent,
    ItemOpenAmountComponent,
    ItemSubmittedTravelComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class BusinessModule {}
