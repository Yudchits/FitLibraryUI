import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrainingPlanShort } from '../models/training-plan-short.model';
import { TrainingPlanFull } from '../models/training-plan-full.model';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TrainingPlanService {

  private trainingPlanApi: string = environment.url + '/api/trainingPlan';
  private getAllUrl: string = '/getAll';
  private getByIdUrl: string = '/getById?id=';
  private createUrl: string = '/create';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TrainingPlanShort[]> {
    return this.http.get<TrainingPlanShort[]>(this.trainingPlanApi + this.getAllUrl);
  }

  getById(id: number): Observable<TrainingPlanFull> {
    return this.http.get<TrainingPlanFull>(this.trainingPlanApi + this.getByIdUrl + id);
  }

  create(form: NgForm): Observable<number> {
    return this.http.post<number>(this.trainingPlanApi + this.createUrl, form);
  }
}