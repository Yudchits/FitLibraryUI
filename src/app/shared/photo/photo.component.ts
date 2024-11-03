import { 
  AfterViewInit,
  ChangeDetectorRef,
  Component, 
  ElementRef, 
  EventEmitter, 
  HostListener, 
  Input, 
  OnDestroy, 
  Output,
  ViewChild, 
} from '@angular/core';
import { Photo } from '../common/models/photo.model';
import { PhotoService } from '../common/services/photo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { PhotoResizerService } from '../common/services/photo-resizer.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements AfterViewInit, OnDestroy {

  @Input() photo: Photo;
  @Output() photoSaved: EventEmitter<string> = new EventEmitter<string>();
  @Output() photoError: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('photoWrapper') photoWrapperRef: ElementRef;
  @ViewChild('photo') photoRef: ElementRef;
  @ViewChild('frame') frameRef: ElementRef;
  @ViewChild('headerSection') headerSectionRef: ElementRef;
  @ViewChild('submitSection') submitSectionRef: ElementRef;

  photoSrc: string | ArrayBuffer | null = null;

  private readonly _minFrameSize: number = 80;
  private readonly _widthToHeightFrameRatio: number = 1.5;

  private currentFrameHeight: number;
  private currentFrameWidth: number;

  private currentPhotoHeight: number;
  private currentPhotoWidth: number;

  private isPhotoRatioLessThanOne: boolean = null;

  private readonly _opacityDelay: number = 500;

  private onDestroy$ = new Subject<void>();
  private requestCancel$ = new Subject<void>();

  constructor(private photoService: PhotoService, 
    private photoResizerService: PhotoResizerService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (this.photo && this.photo.photo) {
      const reader = new FileReader();

      reader.readAsDataURL(this.photo.photo);

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          this.initPhotoArea(img.width, img.height);

          this.photoSrc = img.src;
          this.changeDetector.detectChanges();

          this.resizePhoto();
          this.adjustOpacityWithDelay(this.photoWrapperRef, 1, this._opacityDelay);
        }

        img.onerror = () => {
          this.adjustOpacityWithDelay(this.photoWrapperRef, 1, this._opacityDelay);
        }
      }

      reader.onerror = () => {
        this.adjustOpacityWithDelay(this.photoWrapperRef, 1, this._opacityDelay);
      }
    }
  }

  private initPhotoArea(currentWidth: number, currentHeight: number): void {
    const photoRatio = currentWidth / currentHeight;
    this.isPhotoRatioLessThanOne = photoRatio < 1;

    if (this.isPhotoRatioLessThanOne) {
      this.currentFrameWidth = this._minFrameSize;
      this.currentFrameHeight = this.currentFrameWidth / this._widthToHeightFrameRatio;

      this.currentPhotoWidth = this.currentFrameWidth + 10;
      this.currentPhotoHeight = this.currentPhotoWidth / photoRatio;
    } else {
      this.currentFrameHeight = this._minFrameSize;
      this.currentFrameWidth = this.currentFrameHeight * this._widthToHeightFrameRatio;

      this.currentPhotoHeight = this.currentFrameHeight + 40;
      this.currentPhotoWidth = this.currentPhotoHeight * photoRatio;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event?: Event): void {
    this.resizePhoto();
  }

  private resizePhoto(): void {
    this.initPhotoArea(this.photoRef.nativeElement.width, this.photoRef.nativeElement.height);

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const windowPadding = 30;
    const photoPadding = 20;
    const editorPadding = 30;
    const boxShadow = 6;
    const headerSectionHeight = this.headerSectionRef.nativeElement.clientHeight;
    const submitSectionHeight = this.submitSectionRef.nativeElement.clientHeight;

    const widthLimit = windowWidth - windowPadding - photoPadding - editorPadding - boxShadow;
    const heightLimit = windowHeight - windowPadding - photoPadding - editorPadding - boxShadow 
      - headerSectionHeight - submitSectionHeight;

    const initialPhotoHeight = this.currentPhotoHeight;

    const newPhotoSize = this.photoResizerService.resize(this.currentPhotoWidth, this.currentPhotoHeight, widthLimit, heightLimit);

    this.currentPhotoWidth = newPhotoSize.width;
    this.currentPhotoHeight = newPhotoSize.height;

    const transformationRatio = this.currentPhotoHeight / initialPhotoHeight;

    this.currentFrameHeight *= transformationRatio;
    this.currentFrameWidth *= transformationRatio;

    this.photoRef.nativeElement.style.height = this.currentPhotoHeight + 'px';
    this.photoRef.nativeElement.style.width = this.currentPhotoWidth + 'px';
    this.frameRef.nativeElement.style.height = this.currentFrameHeight + 'px';
    this.frameRef.nativeElement.style.width = this.currentFrameWidth + 'px';
  }

  onSaveClick(): void {
    if (this.photoSrc) {
      this.requestCancel$.next();

      this.photoService.addPhoto(this.photo)
        .pipe(takeUntil(this.requestCancel$), takeUntil(this.onDestroy$))
          .subscribe(
            (result) => {
              this.adjustOpacityWithDelay(this.photoWrapperRef, 0, this._opacityDelay);
              this.photoSaved.emit(result.photoUrl)
            },
            (error) => {
              this.adjustOpacityWithDelay(this.photoWrapperRef, 0, this._opacityDelay);
              this.photoError.emit(error.error.message)
            }
          );
    }
  }

  private adjustOpacityWithDelay(elementRef: ElementRef, value: number, delayMs: number): void {
    setTimeout(() => {
      if (value >= 0 && value <= 1) {
        elementRef.nativeElement.style.opacity = value;
      }
    }, delayMs);
  }

  onCloseClick(): void {
    this.adjustOpacityWithDelay(this.photoWrapperRef, 0, this._opacityDelay);
    this.close.emit();
  }

  onDragEnded(event: CdkDragEnd): void {
    const draggableElement = event.source.element.nativeElement;
    const dragRect = draggableElement.getBoundingClientRect();
    const photoRect = this.photoRef.nativeElement.getBoundingClientRect();

    this.photo.left = dragRect.left - photoRect.left;
    this.photo.top = dragRect.top - photoRect.top;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
