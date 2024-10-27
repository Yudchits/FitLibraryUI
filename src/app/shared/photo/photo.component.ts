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
import { Photo } from '../models/photo.model';
import { PhotoService } from '../services/photo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements AfterViewInit, OnDestroy {

  @Input() photo: Photo;
  @Output() photoSaved: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('photoWrapper') photoWrapperRef: ElementRef;
  @ViewChild('photo') photoRef: ElementRef;
  @ViewChild('frame') frameRef: ElementRef;
  @ViewChild('headerSection') headerSectionRef: ElementRef;
  @ViewChild('submitSection') submitSectionRef: ElementRef;

  isPhotoProccessed: boolean = false;
  photoSrc: string | ArrayBuffer | null = null;

  private readonly _minFrameHeight: number = 80;
  private currentFrameHeight: number = this._minFrameHeight;
  private readonly _widthToHeightRatio: number = 1.5;
  private currentFrameWidth: number = this.currentFrameHeight * this._widthToHeightRatio;

  private currentPhotoHeight: number = this.currentFrameHeight + 40;
  private currentPhotoWidth: number;

  private onDestroy$ = new Subject<void>();
  private requestCancel$ = new Subject<void>();

  constructor(private photoService: PhotoService, private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit() {
    if (this.photo && this.photo.photo) {
      const reader = new FileReader();

      reader.readAsDataURL(this.photo.photo);

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          this.photoSrc = img.src;
          this.isPhotoProccessed = true;
          this.changeDetector.detectChanges();

          const imageWidth = this.currentPhotoHeight / (img.height / img.width);
          if (imageWidth >= this.currentFrameWidth) {
            this.frameRef.nativeElement.style.width = this.currentFrameWidth + 'px';
            this.frameRef.nativeElement.style.height = this.currentFrameHeight + 'px';

            this.currentPhotoWidth = imageWidth;
            this.photoRef.nativeElement.style.width = this.currentPhotoWidth + 'px';
            this.photoRef.nativeElement.style.height = this.currentPhotoHeight + 'px';

            this.resizePhoto();
          } else {
            this.photoSrc = null;
            console.log("can't proccess selected image");
          }

          this.photoWrapperRef.nativeElement.style.opacity = 1;
        }

        img.onerror = () => {
          this.isPhotoProccessed = true;
          this.photoWrapperRef.nativeElement.style.opacity = 1;
        }
      }

      reader.onerror = () => {
        this.isPhotoProccessed = true;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event?: Event): void {
    this.resizePhoto();
  }

  private resizePhoto(): void {
    this.currentFrameHeight = this._minFrameHeight;
    this.currentFrameWidth = this.currentFrameHeight * this._widthToHeightRatio;

    const photoRatio = this.currentPhotoHeight / this.currentPhotoWidth;

    this.currentPhotoHeight = this.currentFrameHeight + 40;
    this.currentPhotoWidth = this.currentPhotoHeight / photoRatio;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const windowPadding = 30;
    const photoPadding = 20;
    const editorMargin = 30;
    const boxShadow = 6;
    const headerSectionHeight = this.headerSectionRef.nativeElement.clientHeight;
    const submitSectionHeight = this.submitSectionRef.nativeElement.clientHeight;

    const widthLimit = windowWidth - windowPadding - photoPadding - boxShadow;
    const heightLimit = windowHeight - windowPadding - photoPadding - editorMargin - boxShadow 
      - headerSectionHeight - submitSectionHeight;

    //console.log('limit: width =', widthLimit, 'height =', heightLimit);

    //console.log('photo: width =', this.currentPhotoWidth, 'height =', this.currentPhotoHeight);
    //console.log('frame: width =', this.currentFrameWidth, 'height =', this.currentFrameHeight);

    const initialPhotoHeight = this.currentPhotoHeight;

    while ((this.currentPhotoHeight <= heightLimit) 
          && ((this.currentPhotoWidth <= widthLimit) && (((this.currentPhotoHeight + 1) / photoRatio) < widthLimit))) {
      this.currentPhotoHeight++;
      this.currentPhotoWidth = this.currentPhotoHeight / photoRatio;
    }

    const difference = this.currentPhotoHeight / initialPhotoHeight;

    this.currentFrameHeight *= difference;
    this.currentFrameWidth *= difference;

    //console.log('photo: width =', this.currentPhotoWidth, 'height =', this.currentPhotoHeight);
    //console.log('frame: width =', this.currentFrameWidth, 'height =', this.currentFrameHeight);

    this.photoRef.nativeElement.style.height = this.currentPhotoHeight + 'px';
    this.photoRef.nativeElement.style.width = this.currentPhotoWidth + 'px';
    this.frameRef.nativeElement.style.height = this.currentFrameHeight + 'px';
    this.frameRef.nativeElement.style.width = this.currentFrameWidth + 'px';
  }

  onSaveClick(): void {
    if (this.photoSrc) {
      this.requestCancel$.next();

      this.photoService.addPhoto(this.photo).pipe(takeUntil(this.requestCancel$), takeUntil(this.onDestroy$))
        .subscribe(
          (result) => this.photoSaved.emit(result.photoUrl),
          (error) => console.log(error.error || error.message)
        );
    } else {
      console.log('image is not valid');
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
