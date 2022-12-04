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
