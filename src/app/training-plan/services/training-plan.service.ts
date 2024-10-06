import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrainingPlanShort } from '../models/training-plan-short.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingPlanService {

  private readonly trainingPlanApi: string;
  private readonly getAllUrl: string;

  constructor(private http: HttpClient) { 
    this.trainingPlanApi = environment.url + '/api/trainingPlan';
    this.getAllUrl = '/getAllTrainingPlans';
  }

  getAllTrainingPlans(): Observable<TrainingPlanShort[]> {
    return this.http.get<TrainingPlanShort[]>(this.trainingPlanApi + this.getAllUrl);
  }
}