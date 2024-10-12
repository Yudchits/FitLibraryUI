import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TrainingPlanModuleComponent } from './training-plan/training-plan-module/training-plan-module.component';
import { TrainingPlanMainComponent } from './training-plan/training-plan-main/training-plan-main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingPlanDetailComponent } from './training-plan/training-plan-detail/training-plan-detail.component';
import { WeekdayPipe } from './training-plan/common/pipes/weekday.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TrainingPlanModuleComponent,
    TrainingPlanMainComponent,
    TrainingPlanDetailComponent,
    WeekdayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
