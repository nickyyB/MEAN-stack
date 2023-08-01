import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {HomeComponent} from "./components/home/home.component";
import {AgencyComponent} from "./components/agency/agency.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {AdminPanelComponent} from "./components/admin-panel/admin-panel.component";
import {AdminLoginComponent} from "./components/admin-login/admin-login.component";
import {PropertyComponent} from "./components/property/property.component";
import {PropertyListComponent} from "./components/property-list/property-list.component";
import {JobsComponent} from "./components/jobs/jobs.component";
import {UpdateJobComponent} from "./components/update-job/update-job.component";


const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'registration', component:RegistrationComponent},
  {path:'agencies/:pib', component:AgencyComponent},
  {path:'profile', component:ProfileComponent},
  {path:'admin', component:AdminPanelComponent},
  {path:'admin-login', component:AdminLoginComponent},
  {path:'properties', component:PropertyListComponent},
  {path:'creat-property', component:PropertyComponent},
  {path:'jobs', component:JobsComponent},
  {path:'jobs/:id', component:UpdateJobComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



