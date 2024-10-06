import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainingPlanModuleComponent } from './training-plan/training-plan-module/training-plan-module.component';
import { TrainingPlanMainComponent } from './training-plan/training-plan-main/training-plan-main.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'training-plan', component: TrainingPlanModuleComponent, children: [
    { path: '', component: TrainingPlanMainComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
