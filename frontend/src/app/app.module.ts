import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {RegistrationComponent} from './components/registration/registration.component';
import {AgenciesComponent} from './components/agencies/agencies.component';
import {HomeComponent} from './components/home/home.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatGridListModule} from "@angular/material/grid-list";
import {ProfileComponent} from './components/profile/profile.component';
import {AgencyComponent} from './components/agency/agency.component';
import {MatListModule} from "@angular/material/list";
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {FooterComponent} from './components/footer/footer.component';
import {MatTabsModule} from "@angular/material/tabs";
import {AdminLoginComponent} from './components/admin-login/admin-login.component';
import {PropertyComponent} from './components/property/property.component';
import {MatSelectModule} from "@angular/material/select";
import { PropertyListComponent } from './components/property-list/property-list.component';
import {MatTableModule} from "@angular/material/table";
import { PopupComponent } from './components/popup/popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { JobsComponent } from './components/jobs/jobs.component';
import { PopupFormComponent } from './components/popup-form/popup-form.component';
import { UpdateJobComponent } from './components/update-job/update-job.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { WorkerComponent } from './components/worker/worker.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    AgenciesComponent,
    HomeComponent,
    ProfileComponent,
    AgencyComponent,
    AdminPanelComponent,
    FooterComponent,
    AdminLoginComponent,
    PropertyComponent,
    PropertyListComponent,
    PopupComponent,
    JobsComponent,
    PopupFormComponent,
    UpdateJobComponent,
    WorkerComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,

        //MATERIAL UI
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        FormsModule,
        MatPaginatorModule,
        MatGridListModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSnackBarModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
