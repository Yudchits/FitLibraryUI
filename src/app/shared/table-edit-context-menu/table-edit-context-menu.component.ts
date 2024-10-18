import { Component, EventEmitter, Output } from '@angular/core';
import { TableEditAction } from 'src/app/training-plan/common/enums/table-edit-action.enum';

@Component({
  selector: 'app-table-edit-context-menu',
  templateUrl: './table-edit-context-menu.component.html',
  styleUrls: ['./table-edit-context-menu.component.css']
})
export class TableEditContextMenuComponent {

  @Output() actionSelected = new EventEmitter<TableEditAction>();

  actions = Object.keys(TableEditAction)
    .map(key => ({ key, value: TableEditAction[key as keyof typeof TableEditAction] }));

  constructor() { }

  onAction(action: string): void {
    const selectedAction = TableEditAction[action as keyof typeof TableEditAction];
    this.actionSelected.emit(selectedAction);
  }
}
