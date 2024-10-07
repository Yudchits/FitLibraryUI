import { Component, OnInit } from '@angular/core';
import { TrainingPlanShort } from '../models/training-plan-short.model';
import { TrainingPlanService } from '../services/training-plan.service';

@Component({
  selector: 'app-training-plan-main',
  templateUrl: './training-plan-main.component.html',
  styleUrls: ['./training-plan-main.component.css']
})
export class TrainingPlanMainComponent implements OnInit {

  isTrainingPlansLoaded: boolean = false;
  trainingPlans: TrainingPlanShort[] = [];

  constructor(private trainingPlanService: TrainingPlanService) { }

  ngOnInit() {
    this.initTrainingPlans();
  }

  private initTrainingPlans() {
    this.isTrainingPlansLoaded = false;
    this.trainingPlanService.getAllTrainingPlans().subscribe((trainingPlans: TrainingPlanShort[]) => {
      this.trainingPlans = trainingPlans || [];
      this.isTrainingPlansLoaded = true;
    })
  }

}
