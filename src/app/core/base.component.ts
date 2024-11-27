import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextContainer } from './context/context-container';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected context: ContextContainer;

  //#Datatable common properties. These can be moved to the common class such as Datatable Service.
  rows: any;
  totalRowsCount: any;
  pageCnt: any;
  columns: any;
  tableSettings: any;
  pageNumber = 1;
  pageSize = 10;
  roleList$!: Observable<any>;
  roleList!: any[];
  filterColumns: any;
  activeRoute: string = '';

  //#endregion

  constructor(context: ContextContainer) {
    this.context = context;
  }

  ngOnInit() {}

  ngOnDestroy() {
  }

  protected initializeTableSettings(tableName: string): void {
    this.tableSettings = {
      rows: [],
      columns: this.columns,
      tablename: tableName,
    };
  }
}
