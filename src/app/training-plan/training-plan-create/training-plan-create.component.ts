import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableEditAction } from '../common/enums/table-edit-action.enum';
import { TrainingPlanService } from '../services/training-plan.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-training-plan-create',
  templateUrl: './training-plan-create.component.html',
  styleUrls: ['./training-plan-create.component.css']
})
export class TrainingPlanCreateComponent implements OnInit {

  createForm: FormGroup;
  showTableEditMenu: boolean = false;
  selectedRow: number;
  selectedFileName: string;

  constructor(private formBuilder: FormBuilder, private trainingPlanService: TrainingPlanService) { }

  public get exercises(): FormArray {
    return this.createForm.get('exercises') as FormArray;
  }

  ngOnInit(): void {
    this.createForm = this.initCreateForm();
    this.exercises.push(this.createExerciseRow());
  }

  private initCreateForm(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(64)]],
      description: ['', [Validators.required, Validators.maxLength(128)]],
      sport: ['', [Validators.required, Validators.maxLength(64)]],
      image: [null, Validators.required],
      price: [null, [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]],
      rating: [0],
      exercises: this.formBuilder.array([])
    });
  }

  private createExerciseRow(): FormGroup {
    return this.formBuilder.group({
      week: [null, [Validators.required]],
      weekday: [null, [Validators.required]],
      exerciseName: ['', [Validators.required]],
      sets: [null],
      repetitions: [null],
      weight: [null],
      time: [''],
      restPeriod: ['']
    });
  }

  onSubmitCreateForm(): void {
    const formData = new FormData();
    formData.append('name', this.createForm.get('name').value);
    formData.append('description', this.createForm.get('description').value);
    formData.append('image', this.createForm.get('image').value);
    formData.append('sport', this.createForm.get('sport').value);
    formData.append('price', this.createForm.get('price').value);
    formData.append('rating', this.createForm.get('rating').value);
    formData.append('creatorId', '1'); //change it
    formData.append('exercises', this.createForm.get('exercises').value);

    this.trainingPlanService.createTrainingPlan(formData).subscribe((response: HttpResponse<any>) => {
      console.log(response);
      
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  onEditTableClick(event: MouseEvent): void {
    event.preventDefault();
    this.showTableEditMenu = true;
  }

  onRowClick(row: number): void {
    this.selectedRow = row;
  }

  onActionSelected(action: TableEditAction): void {
    this.showTableEditMenu = false;

    switch (action) {
      case TableEditAction.ADD_ROW_ABOVE:
        this.addRow(this.selectedRow);
        break;
      case TableEditAction.ADD_ROW_AFTER:
        this.addRow(this.selectedRow + 1);
        break;
      case TableEditAction.DELETE_ROW:
        if (this.exercises.length > 1) {
          this.deleteRow(this.selectedRow);
        }
        break;
    }

    this.selectedRow = null;
  }

  private addRow(row: number): void {
    this.exercises.insert(row, this.createExerciseRow());
  }
  
  private deleteRow(row: number): void {
    this.exercises.removeAt(row);
  }

  onImageChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.createForm.get('image').patchValue(file);
      this.selectedFileName = file.name;
    }
  }
}
