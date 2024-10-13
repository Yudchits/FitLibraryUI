import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  @ViewChildren('weekTd') weekTds: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute, 
    private trainingPlanService: TrainingPlanService, 
    private changeDetector: ChangeDetectorRef
  ) { 
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
      this.trainingPlan.exercises = this.trainingPlan.exercises.sort((a, b) => a.week - b.week);
      this.isPlanLoaded = true;
      this.changeDetector.detectChanges();
      this.mergeWeekRows();
    });
  }

  private mergeWeekRows(): void {
    const weekTds = this.weekTds.toArray();

    let currentWeek = null;
    let currentWeekId = null;

    const exercises = this.trainingPlan.exercises;
    const exercisesLength = exercises.length;

    for (let i = 0; i < exercisesLength; i++) {
      if (exercises[i].week != currentWeek) {
        currentWeek = exercises[i].week;
        currentWeekId = i;
        
        weekTds[currentWeekId].nativeElement.setAttribute('rowspan', 1);
      } else {
        const mergedTd = weekTds[currentWeekId];
        const mergedTdRowspan = parseInt(mergedTd.nativeElement.getAttribute('rowspan'));
        mergedTd.nativeElement.setAttribute('rowspan', mergedTdRowspan + 1)
  
        weekTds[i].nativeElement.style = 'display: none';
      }
    }
  }

}
