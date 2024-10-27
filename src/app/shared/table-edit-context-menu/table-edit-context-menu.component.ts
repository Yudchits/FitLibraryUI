import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TableEditAction } from 'src/app/training-plan/common/enums/table-edit-action.enum';

@Component({
  selector: 'app-table-edit-context-menu',
  templateUrl: './table-edit-context-menu.component.html',
  styleUrls: ['./table-edit-context-menu.component.css']
})
export class TableEditContextMenuComponent implements AfterViewInit {

  @Output() actionSelected = new EventEmitter<TableEditAction>();
  @ViewChild('tableEditWrapper') tableEditWrapperRef: ElementRef;

  actions = Object.keys(TableEditAction)
    .map(key => ({ key, value: TableEditAction[key as keyof typeof TableEditAction] }));

  constructor() { }
  
  ngAfterViewInit(): void {
    if (this.tableEditWrapperRef) {
      this.tableEditWrapperRef.nativeElement.style.opacity = 1;
    }
  }

  onAction(action: string): void {
    const selectedAction = TableEditAction[action as keyof typeof TableEditAction];
    this.actionSelected.emit(selectedAction);
  }
}
