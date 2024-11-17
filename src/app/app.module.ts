import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { TrainingPlanModuleComponent } from './training-plan/training-plan-module/training-plan-module.component';
import { TrainingPlanMainComponent } from './training-plan/training-plan-main/training-plan-main.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrainingPlanDetailComponent } from './training-plan/training-plan-detail/training-plan-detail.component';
import { WeekdayPipe } from './training-plan/common/pipes/weekday.pipe';
import { TrainingPlanCreateComponent } from './training-plan/training-plan-create/training-plan-create.component';
import { TextareaAutosizeDirective } from './training-plan/common/directives/textarea-autosize.directive';
import { TableEditContextMenuComponent } from './shared/table-edit-context-menu/table-edit-context-menu.component';
import { TruncatePipe } from './training-plan/common/pipes/truncate.pipe';
import { PhotoComponent } from './shared/photo/photo.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/common/services/auth.service';
import { JwtInterceptor } from './auth/common/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TrainingPlanModuleComponent,
    TrainingPlanMainComponent,
    TrainingPlanDetailComponent,
    WeekdayPipe,
    TrainingPlanCreateComponent,
    TextareaAutosizeDirective,
    TableEditContextMenuComponent,
    TruncatePipe,
    PhotoComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
