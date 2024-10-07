import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrainingPlanShort } from '../models/training-plan-short.model';
import { TrainingPlanFull } from '../models/training-plan-full.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingPlanService {

  private readonly trainingPlanApi: string;
  private readonly getAllUrl: string;
  private readonly getByIdUrl: string;

  constructor(private http: HttpClient) { 
    this.trainingPlanApi = environment.url + '/api/trainingPlan';
    this.getAllUrl = '/getAllTrainingPlans';
    this.getByIdUrl = '/getTrainingPlanById?id=';
  }

  getAllTrainingPlans(): Observable<TrainingPlanShort[]> {
    return this.http.get<TrainingPlanShort[]>(this.trainingPlanApi + this.getAllUrl);
  }

  getTrainingPlanById(id: number): Observable<TrainingPlanFull> {
    return this.http.get<TrainingPlanFull>(this.trainingPlanApi + this.getByIdUrl + id);
  }
}