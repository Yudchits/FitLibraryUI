import { 
  AfterViewInit, 
  Component, 
  ElementRef, 
  HostListener, 
  OnDestroy, 
  OnInit, 
  ViewChild 
} from '@angular/core';
import { 
  FormArray, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { TableEditAction } from '../../shared/common/enums/table-edit-action.enum';
import { TrainingPlanService } from '../common/services/training-plan.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Photo } from 'src/app/shared/common/models/photo.model';
import { Weekday } from '../common/helpers/weekday';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-training-plan-create',
  templateUrl: './training-plan-create.component.html',
  styleUrls: ['./training-plan-create.component.css']
})
export class TrainingPlanCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  createForm: FormGroup;
  showTableEditMenu: boolean = false;
  selectedRow: number = null;
  showPhotoEdit: boolean = false;
  photo: Photo = new Photo();
  photoUrl: string;
  weekdays: number[];

  @ViewChild('photoContainer') photoContainerRef: ElementRef;

  private onDestroy$ = new Subject<void>();
  private requestCancel$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder, 
    private trainingPlanService: TrainingPlanService,
  ) { }

  get exercises(): FormArray {
    return this.createForm.get('exercises') as FormArray;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event?: Event): void {
    const photoWidth = this.photoContainerRef.nativeElement.clientWidth;
    const photoHeight = photoWidth / 1.5;
    this.photoContainerRef.nativeElement.style.height = photoHeight + 'px';
  }

  ngOnInit(): void {
    this.createForm = this.initCreateForm();
    this.exercises.push(this.createExerciseRow());
    this.weekdays = Object.values(Weekday).filter(value => typeof value === 'number') as number[];
  }

  ngAfterViewInit(): void {
    this.onWindowResize();
  }

  private initCreateForm(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(64)]],
      description: ['', [Validators.required, Validators.maxLength(128)]],
      sport: ['', [Validators.required, Validators.maxLength(64)]],
      photo: [''], 
      price: [null, [Validators.required, Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]],
      rating: [0],
      exercises: this.formBuilder.array([]),
      creatorId: 1
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
      time: [null],
      restPeriod: [null]
    });
  }

  onSaveClick(): void {
    console.log(this.createForm.value);
    
    this.trainingPlanService.create(this.createForm.value)
      .pipe(takeUntil(this.requestCancel$), takeUntil(this.onDestroy$))
        .subscribe(
          (response) => {
          }, 
          (error) => {
            console.log(error);
          });
  }

  onEditTableClick(event: MouseEvent): void {
    event.preventDefault();
    this.showTableEditMenu = true;
  }

  onRowClick(row: number): void {
    this.selectedRow = row;
  }

  onTableEditActionSelected(action: TableEditAction): void {
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

  onTableEditClose(): void {
    this.showTableEditMenu = false;
  }

  private addRow(row: number): void {
    this.exercises.insert(row, this.createExerciseRow());
  }
  
  private deleteRow(row: number): void {
    this.exercises.removeAt(row);
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.photo.photo = file;
      this.showPhotoEdit = true;          

      input.value = null;
    }
  }

  onPhotoSaved(photoUrl: string): void {
    this.showPhotoEdit = false;
    this.createForm.get('photo').patchValue(photoUrl);
    this.photoUrl = photoUrl;
  }

  onPhotoError(message): void {
    console.log(message);
  }

  onPhotoClose(): void {
    this.showPhotoEdit = false;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
