import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BusinessAppComponent } from './business-app.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CreateOrUpdateCountryComponent } from './create-or-update-country/create-or-update-country.component';
import { CreateOrUpdateCustomerComponent } from './create-or-update-customer/create-or-update-customer.component';
import { CreateOrUpdateTravelComponent } from './create-or-update-travel/create-or-update-travel.component';
import { SpendsDialogComponent } from './create-or-update-travel/spendDialog/spends-dialog/spends-dialog.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class BusinessModule {}
