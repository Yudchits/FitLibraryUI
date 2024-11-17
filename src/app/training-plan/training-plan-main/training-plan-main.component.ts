import { Component, OnInit } from '@angular/core';
import { TrainingPlanShort } from '../common/models/training-plan-short.model';
import { TrainingPlanService } from '../common/services/training-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-plan-main',
  templateUrl: './training-plan-main.component.html',
  styleUrls: ['./training-plan-main.component.css']
})
export class TrainingPlanMainComponent implements OnInit {

  private trainingPlans: TrainingPlanShort[] = [];

  isTrainingPlansLoaded: boolean = false;
  trainingPlansDisplay: TrainingPlanShort[] = [];
  searchKey: string = '';

  constructor(private router: Router, private trainingPlanService: TrainingPlanService) { }

  ngOnInit(): void {
    this.initTrainingPlans();
  }

  private initTrainingPlans(): void {
    this.isTrainingPlansLoaded = false;
    this.trainingPlanService.getAll().subscribe((trainingPlans: TrainingPlanShort[]) => {
      this.trainingPlans = trainingPlans || [];
      this.trainingPlansDisplay = this.trainingPlans;
      this.isTrainingPlansLoaded = true;
    })
  }

  onSearch(): void {
    if (this.searchKey && this.searchKey.length > 0) {
      this.trainingPlansDisplay = this.trainingPlans.filter((plan: TrainingPlanShort) => {
        return plan.name.toLowerCase().includes(this.searchKey.toLowerCase()) 
          || plan.sport.toLowerCase().includes(this.searchKey.toLowerCase());
      });
    }
    else {
      this.trainingPlansDisplay = this.trainingPlans;
    }
  }

  onTrainingPlanClick(trainingPlan: TrainingPlanShort): void {
    this.router.navigate(['/training-plans', trainingPlan.id]);
  }

}
