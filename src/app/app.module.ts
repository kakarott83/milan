import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

/*Ländereinstellungen*/
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { LOCALE_ID, NgModule } from '@angular/core';
// Import Firebase modules + environment
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService } from './shared/service/auth.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((a) => a.AuthModule),
  },
  {
    path: 'business',
    loadChildren: () =>
      import('./business/business.module').then((a) => a.BusinessModule),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 1000, // 15 seconds
      progressBar: true,
    }),
  ],

  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    AuthService,
    CurrencyPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
