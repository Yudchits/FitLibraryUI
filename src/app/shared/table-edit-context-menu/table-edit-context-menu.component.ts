import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TableEditAction } from 'src/app/shared/common/enums/table-edit-action.enum';

@Component({
  selector: 'app-table-edit-context-menu',
  templateUrl: './table-edit-context-menu.component.html',
  styleUrls: ['./table-edit-context-menu.component.css']
})
export class TableEditContextMenuComponent implements AfterViewInit {

  @Output() actionSelected = new EventEmitter<TableEditAction>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('tableEditWrapper') tableEditWrapperRef: ElementRef;

  private readonly opacityTiming: number = 500;

  actions = Object.keys(TableEditAction)
    .map(key => ({ key, value: TableEditAction[key as keyof typeof TableEditAction] }));

  constructor() { }
  
  ngAfterViewInit(): void {
    if (this.tableEditWrapperRef) {
      this.adjustOpacityWithDelay(this.tableEditWrapperRef, 1, this.opacityTiming);
      this.tableEditWrapperRef.nativeElement.style.opacity = 1;
    }
  }

  private adjustOpacityWithDelay(elementRef: ElementRef, value: number, delayMs: number): void {
    setTimeout(() => {
      if (value >= 0 && value <= 1) {
        elementRef.nativeElement.style.opacity = value;
      }
    }, delayMs);
  }

  onTableActionClick(action: string): void {
    const selectedAction = TableEditAction[action as keyof typeof TableEditAction];
    this.adjustOpacityWithDelay(this.tableEditWrapperRef, 0, this.opacityTiming);
    this.actionSelected.emit(selectedAction);
  }

  onCloseClick(): void {
    this.adjustOpacityWithDelay(this.tableEditWrapperRef, 0, this.opacityTiming);
    this.close.emit();
  }
}