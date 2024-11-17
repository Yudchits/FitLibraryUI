import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingPlanModuleComponent } from './training-plan/training-plan-module/training-plan-module.component';
import { TrainingPlanMainComponent } from './training-plan/training-plan-main/training-plan-main.component';
import { TrainingPlanDetailComponent } from './training-plan/training-plan-detail/training-plan-detail.component';
import { TrainingPlanCreateComponent } from './training-plan/training-plan-create/training-plan-create.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/common/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'training-plan', component: TrainingPlanModuleComponent, children: [
    { path: '', component: TrainingPlanMainComponent, canActivate: [AuthGuard] },
    { path: 'create', component: TrainingPlanCreateComponent },
    { path: ':id', component: TrainingPlanDetailComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
