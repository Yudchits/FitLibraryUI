import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingPlanModuleComponent } from './training-plan/training-plan-module/training-plan-module.component';
import { TrainingPlanMainComponent } from './training-plan/training-plan-main/training-plan-main.component';
import { TrainingPlanDetailComponent } from './training-plan/training-plan-detail/training-plan-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'training-plan', component: TrainingPlanModuleComponent, children: [
    { path: 'training-plans', component: TrainingPlanMainComponent },
    { path: 'training-plans/:id', component: TrainingPlanDetailComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
