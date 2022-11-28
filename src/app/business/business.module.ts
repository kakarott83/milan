import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../shared/material/material.module';
import { CreateOrUpdateTravelComponent } from './create-or-update-travel/create-or-update-travel.component';
import { HomeComponent } from './home/home.component';
import { TravelListComponent } from './travel-list/travel-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
];

@NgModule({
  declarations: [
    CreateOrUpdateTravelComponent,
    TravelListComponent,
    HomeComponent,
  ],
  imports: [CommonModule, MaterialModule,FormsModule,ReactiveFormsModule],
})
export class BusinessModule {}
