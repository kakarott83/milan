import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BusinessAppComponent } from './business-app.component';
import { CreateOrUpdateTravelComponent } from './create-or-update-travel/create-or-update-travel.component';
import { HomeComponent } from './home/home.component';
import { TravelListComponent } from './travel-list/travel-list.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessAppComponent,
    children: [{ path: 'home', component: HomeComponent }],
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
