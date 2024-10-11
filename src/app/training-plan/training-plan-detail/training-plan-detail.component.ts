import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingPlanService } from '../services/training-plan.service';
import { TrainingPlanFull } from '../models/training-plan-full.model';

@Component({
  selector: 'app-training-plan-detail',
  templateUrl: './training-plan-detail.component.html',
  styleUrls: ['./training-plan-detail.component.css']
})
export class TrainingPlanDetailComponent implements OnInit {

  private id: number;

  trainingPlan: TrainingPlanFull = null;
  isPlanLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private trainingPlanService: TrainingPlanService) { 
  }

  ngOnInit(): void {
    const paramId = parseInt(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(paramId)) {
      this.id = paramId;
      this.initTrainingPlan(this.id);
    }
  }

  private initTrainingPlan(id: number): void {
    this.isPlanLoaded = false;
    this.trainingPlanService.getTrainingPlanById(id).subscribe((trainingPlan: TrainingPlanFull) => {
      this.trainingPlan = trainingPlan || null;
      this.isPlanLoaded = true;
    });
  }

}
