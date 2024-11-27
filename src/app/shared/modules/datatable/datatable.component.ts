import { FORM_MODE } from '../../../models/constants';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTS } from 'src/app/models/constants';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../services/loader/loader.service';
import { ColumnGroupDialogComponent } from '../../components/column-group-dialog/column-group-dialog.component';
import { UnitAvailabilityDialogComponent } from 'src/app/admin/components/properties/components/unit/components/unit-availability-dialog/unit-availability-dialog.component';
import { UnitService } from 'src/app/admin/services/unit.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent {
  toggle: boolean = false;
  @ViewChild('table') table: any = ElementRef;
  prevSelectedColumns: any;
  sectorIds: any;
  propertyIds: any;
  @Output() cellClick = new EventEmitter<any>();
  @Input() emitClicks: boolean = false;
  RangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 van ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `Showing ${startIndex + 1} - ${endIndex} of ${length}`;
  };
  tablename: any;
  tableid: any;
  selectedRows: any = [];
  selectedStatuses: any;
  presentationStatuses: any;
  statusIds: any;
  debtsStatusIds: any;
  categoryIds: any;
  presentationStatusIds: any;
  selectedPresentationStatuses: any = [];
  selectedCategories: any = [];
  selectedDebtStatuses: any = [];
  selectedTypes: any = [];
  selectedYears: any = [];
  peopleStatusIds: any;
  typeIds: any;
  yearIds: any;
  statuse$ = [
    { value: '1', label: 'Available' },
    { value: '2', label: 'Unavailable' },
    { value: '3', label: 'Under Offer' },
    { value: '4', label: 'Under Negotiation' },
    { value: '5', label: 'Let' },
  ];
  selectedStatus: any;
  mediaColumn: any;

  onCellClick(rowData: any, column: any) {
    if (this.emitClicks && column.click) {
      this.cellClick.emit({ rowData, column });
    }
  }

  @ViewChild('paginator') set paginator(pager: MatPaginator) {
    if (pager) {
      this.rows.paginator = pager;
      this.rows.paginator._intl = new MatPaginatorIntl();
      this.rows.paginator._intl.itemsPerPageLabel = 'Rows per page';
      this.rows.paginator._intl.getRangeLabel = this.RangeLabel;
    }
  }
  @Input() tableSettings: any = MatTableDataSource<any>;
  @Output() rowBasedAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFeaturedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() unitOperations: EventEmitter<any> = new EventEmitter<any>();
  @Input() roles$: any;
  @Input() statuses$: any;
  @Input() Year$: any;
  @Input() filterColumns: any;
  @Input() sectors$: any;
  @Input() presentationStatuses$: any;
  @Input() categories$: any;
  @Input() types$: any;
  @Input() debtStatuses$: any;

  rows: any = [];
  columns: any;
  totalRowsCount: number = 0;
  displayedColumns: any;
  customRowsPerPageOptions: Array<number> = [];
  pageIndex: any = 0;
  pageSize: any = 10;
  @Output() getTableData: any = new EventEmitter<any>();
  pageObject = {
    pageSize: this.pageSize,
    pageIndex: 0,
    pageNumber: 1,
    sortBy: '',
    sortOrder: '',
    pageCount: 0,
    roleIds: '',
    sectorIds: '',
    propertyIds: '',
    searchValue: '',
    statusIds: '',
    debtStatusIds: '',
    peopleStatusIds: '',
    presentationStatusIds: '',
    categoryIds: '',
    typesIds: '',
    yearsIds: '',
  };
  activePageNumber: any;
  displayRows: any = [];
  roleIds: any;
  searchBar: boolean = false;
  searchText: any = null;
  selectedRoles: any = [];
  selectedSectors: any = [];
  selectedProperties: any = [];
  selectedColumns: any = [];
  allRows: any;
  downlaodExcel: boolean = false;
  pinColumn: any;
  isLoading: boolean = false;
  isNoData: boolean = false;
  @ViewChild('searchForm') searchForm!: ElementRef;
  @ViewChild('search') searchInput!: ElementRef;
  @Output() toolbarEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  selection = new SelectionModel<any>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  public masterToggle(event: any) {
    this.selectedRows = [];
    const rows = [];
    this.isAllSelected()
      ? this.selection.clear()
      : this.rows.forEach((row: any) => this.selection.select(row));
    if (event.target.checked) {
      rows.push(this.rows);
      this.selectedRows = rows[0];
    } else {
      this.selectedRows = [];
      this.selection.clear();
    }
    this.unitOperations.emit(this.selectedRows);
  }

  isObjEqual(a: any, b: any) {
    const x = JSON.stringify(a);
    const y = JSON.stringify(b);

    return x !== y;
  }

  selectedRow(event: any, row: any) {
    if (event.target.checked) {
      this.selectedRows.push(row);
      this.selection.select(row);
    } else {
      this.selectedRows = this.selectedRows.filter((objInArr: any) =>
        this.isObjEqual(objInArr, row)
      );
      this.selection.deselect(row);
    }
    this.isAllSelected();
    this.unitOperations.emit(this.selectedRows);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }
  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private unitService: UnitService
  ) { }

  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    if (changes['tableSettings']) {
      const { previousValue, currentValue } = changes['tableSettings'];
      if (previousValue != undefined && currentValue != undefined) {
        const prevRowsLength = previousValue.rows?.length || 0;
        const currRowsLength = currentValue.rows?.length || 0;
        this.isNoData = currRowsLength === 0;
        this.isLoading = false;
      }else if(previousValue == undefined && currentValue?.id == 'PropertyUnitId'){
        this.isLoading = false;
      }else if(previousValue == undefined && currentValue?.id == 'ApplicationHistory'){
        this.isLoading = false;
      }
    }

    this.selectedRows = [];
    this.selection.clear();
    this.rows = this.tableSettings.rows;
    this.allRows = this.tableSettings.rows;
    this.columns = this.tableSettings.columns;
    this.columns.map((pin: any) => {
      if (pin.field === 'Pin') {
        this.pinColumn = pin;
      }
      if (pin.field === 'Url') {
        this.mediaColumn = pin;
      }
    });

    this.tablename = this.tableSettings.tablename;
    this.tableid = this.tableSettings.tableid;
    this.totalRowsCount = this.tableSettings.totalRowsCount;
    this.customRowsPerPageOptions = this.rowsPerPagination();
    this.displayedColumns = this.columns.map((c: any) => c.field);
    if (this.prevSelectedColumns && this.prevSelectedColumns.length > 0) {
      this.applyColumns(this.prevSelectedColumns);
    }
    if (this.downlaodExcel && this.rows) {
      this.createExcel();
    }
  }

  rowsPerPagination(): number[] {
    return [10, 20, 30, 40, 50, 75, 100];
  }

  paginate(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageObject.pageSize = event.pageSize;
    this.pageObject.pageIndex = event.pageIndex;
    this.activePageNumber = event.pageIndex + 1;
    this.pageObject.pageNumber = event.pageIndex + 1;
    this.pageObject.pageSize = event.pageSize;
    this.getTableData.emit(this.pageObject);
    this.onToolbarClick({ name: 'Pagination' });
  }

  rowWiseAction(operationName: string, data: any) {
    this.rowBasedAction.emit({
      operation: operationName.toLowerCase(),
      rowData: data,
      activePageNumber: this.activePageNumber,
      pageSize: this.pageObject.pageSize,
    });
  }

  assignTitle(column: string, data: any) {
    switch (column) {
      case 'actions': {
        return 'Action';
      }
      case 'checkbox': {
        return '';
      }
      default: {
        return data[column] != null ? data[column] : '';
      }
    }
  }

  toggleSearch(show: boolean) {
    let sd = this.searchForm.nativeElement as HTMLFormElement;
    if (show) {
      sd.classList.add('search-active');
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 10);
    } else {
      this.searchText = null;
      sd.classList.remove('search-active');
      this.pageObject.pageNumber = 1;
      this.pageIndex = 0;
      this.pageObject.searchValue = '';
      this.pageObject.pageSize = 10;
      this.getTableData.emit(this.pageObject);
    }
  }

  keydown(event: any, searchText: any) {
    if (event.key?.toUpperCase() == 'ENTER') {
      this.applyFilter(searchText);
    }
  }

  applyFilter(filterValue: string, tool: any = undefined) {
    filterValue = filterValue?.trim()?.toLocaleLowerCase();
    this.pageObject.pageNumber = 1;
    this.pageIndex = 0;
    this.pageObject.searchValue = filterValue;
    this.onToolbarClick(tool);
    this.getTableData.emit(this.pageObject);
  }

  resetTable() {
    this.selectedColumns = [];
    this.prevSelectedColumns = [];
    if (this.pageObject.pageNumber === 0) {
      this.pageObject.pageNumber = 1;
    } else {
      this.pageObject.pageNumber = this.pageObject.pageNumber;
    }
    this.getTableData.emit(this.pageObject);
  }

  columnGroupDialogOpen() {
    if (this.selectedColumns.length != 0)
      this.selectedColumns.forEach((element: any, index: any) => {
        if (element.field !== 'actions' && element.field !== 'checkbox') {
          element.checked = true;
        }
      });
    const dialogRef = this.dialog.open(ColumnGroupDialogComponent, {
      data: {
        id: 'column',
        label: 'Show Columns',
        filterColumns: this.filterColumns,
        selectedColumns: this.selectedColumns,
        tablename: this.tablename,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
        this.applyColumns(result);
      } else {
        // this.resetTable();
      }
    });
  }

  addTodisplayColumns(dataArray: any, object: any) {
    if (dataArray.findIndex((f: any) => f.field === object.field) === -1) {
      dataArray?.push(object);
    }
  }

  applyColumns(result: any) {
    this.displayRows = [];
    this.prevSelectedColumns = result;
    let displayColumns = result?.filter((x: any) => x.checked);
    const checkbox = result?.find((x: any) => x.field === 'checkbox');
    const actionObject = result?.find((x: any) => x.field === 'actions');
    if (displayColumns && displayColumns.length > 0) {
      if (checkbox) {
        if (
          displayColumns.findIndex((f: any) => f.field === 'checkbox') === -1
        ) {
          displayColumns.splice(0, 0, checkbox);
        }
      }

      if (this.tableSettings.showActions && actionObject) {
        this.addTodisplayColumns(displayColumns, actionObject);
      }

      this.selectedColumns = displayColumns;
      this.allRows.forEach((row: any) => {
        var displayData: any = {};
        displayColumns.map((y: any) => {
          displayData[y.field] = row[y.field];
          if (row[this.tableSettings.id]) {
            displayData[this.tableSettings.id] = row[this.tableSettings.id];
          }
          if (row[this.tableSettings.Id]) {
            displayData[this.tableSettings.Id] = row[this.tableSettings.Id];
          }
          if (row['operations']) {
            displayData['operations'] = row['operations'];
          }
        });
        this.displayRows.push(displayData);
      });

      displayColumns.forEach((element: any) => {
        element.show = true;
      });
      this.rows = this.displayRows;
      this.columns = displayColumns;
      this.displayedColumns = this.columns.map((c: any) => c.field);
    } else {
      this.resetTable();
    }
  }

  filterDialogOpen() {
    this.tableid = this.tableSettings?.tableid?.replace(/\s+/g, '-');
    const dialogRef = this.dialog.open(ColumnGroupDialogComponent, {
      data: {
        id: 'filter',
        label: 'Filter',
        tablename: this.tablename,
        roles: this.roles$,
        sectors: this.sectors$,
        selectedRoles: this.selectedRoles,
        selectedSectors: this.selectedSectors,
        selectedProperties: this.selectedProperties,
        statuses: this.statuses$,
        presentationStatuses: this.presentationStatuses$,
        categories: this.categories$,
        types: this.types$,
        years: this.Year$,
        debtStatuses: this.debtStatuses$,
        selectedStatuses: this.selectedStatuses,
        selectedPresentationStatuses: this.selectedPresentationStatuses,
        selectedCategories: this.selectedCategories,
        selectedDebtStatuses: this.selectedDebtStatuses,
        selectedTypes: this.selectedTypes,
        selectedYears: this.selectedYears,
      },
      panelClass: `${this.tableid}`,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
        this.selectedRoles = result ? result.roles : [];
        this.selectedSectors = result ? result.sector : [];
        this.selectedProperties = result ? result.property : [];
        this.selectedStatuses = result ? result.status : [];
        this.selectedCategories = result ? result.category : [];
        this.selectedDebtStatuses = result ? result.Debtstatus : [];
        this.selectedTypes = result ? result.type : [];
        this.selectedYears = result ? result.year : [];

        // if (this.pageObject.pageNumber === 0) {
        //   this.pageObject.pageNumber = 1;
        // } else {
        //   this.pageObject.pageNumber = this.pageObject.pageNumber;
        // }
        this.pageObject.pageNumber = 1;
        this.pageIndex = 0;

        if (result?.roles != undefined) {
          this.roleIds = result?.roles.map((x: any) => x.Id).toString();
          this.pageObject.roleIds = this.roleIds;
        } else {
          this.pageObject.roleIds = '';
        }
        if (result?.sector != undefined) {
          this.sectorIds = result?.sector.map((x: any) => x.Id).toString();
          this.pageObject.sectorIds = this.sectorIds;
        } else {
          this.pageObject.sectorIds = '';
        }
        if (result?.property != undefined) {
          this.propertyIds = result?.property
            .map((x: any) => x.PropertyId)
            .toString();
          this.pageObject.propertyIds = this.propertyIds;
        } else {
          this.pageObject.propertyIds = '';
        }

        if (result?.status && result?.status?.Id != undefined) {
          this.statusIds = result?.status?.Id.toString();
          this.pageObject.statusIds = this.statusIds;
        } else {
          this.pageObject.statusIds = '';
        }

        if (result?.Debtstatus && result?.Debtstatus?.Id != undefined) {
          this.debtsStatusIds = result?.Debtstatus?.Id.toString();
          this.pageObject.debtStatusIds = this.debtsStatusIds;
        } else {
          this.pageObject.debtStatusIds = '';
        }

        if (result?.Peoplestatus && result?.Peoplestatus.Id != undefined) {
          this.peopleStatusIds = result?.Peoplestatus?.Id.toString();
          this.pageObject.peopleStatusIds = this.peopleStatusIds;
        } else {
          this.pageObject.peopleStatusIds = '';
        }

        if (result?.type != undefined && !(result?.type instanceof Array)) {
          if (result?.type?.id != undefined) {
            this.typeIds = result?.type.id.toString();
            this.pageObject.typesIds = this.typeIds;
          } else {
            this.pageObject.typesIds = '';
          }
        }

        if (result?.year != undefined && !(result?.year instanceof Array)) {
          if (result?.year?.Name != undefined) {
            this.yearIds = result?.year.Name.toString();
            this.pageObject.yearsIds = this.yearIds;
          } else {
            this.pageObject.yearsIds = '';
          }
        }

        if (
          result?.category &&
          result?.category.DebtCreditCategoryId != undefined
        ) {
          this.categoryIds = result?.category.DebtCreditCategoryId.toString();
          this.pageObject.categoryIds = this.categoryIds;
        } else {
          this.pageObject.categoryIds = '';
        }

        this.getTableData.emit(this.pageObject);
      }
    });
  }

  resetPageObject() {
    this.pageObject.pageCount = 0;
    this.pageObject.pageIndex = 0;
    this.pageObject.pageNumber = 0;
    (this.pageObject.propertyIds = ''),
      (this.pageObject.searchValue = ''),
      (this.pageObject.roleIds = ''),
      (this.pageObject.sectorIds = ''),
      (this.pageObject.sortBy = ''),
      (this.pageObject.sortOrder = '');
  }

  download() {
    this.downlaodExcel = true;
    this.pageObject.pageSize = 'all';
    // this.resetPageObject();
    this.getTableData.emit(this.pageObject);
  }

  createExcel() {
    this.downlaodExcel = false;
    var res: any = [];
    const fileName = this.tableSettings.tablename + '.xlsx';
    this.rows.forEach((item: any) => {
      var tempItem = Object.assign({}, item);
      delete tempItem.operations;
      delete tempItem.actions;
      delete tempItem.checkbox;
      Object.entries(tempItem).forEach((key) => {
        if (key[1] == null) delete tempItem[key[0]];
      });
      if (tempItem.hasOwnProperty('Type')) {
        delete tempItem?.Type;
      }
      if (tempItem.hasOwnProperty('AdditionalInformation')) {
        tempItem.Description = tempItem.AdditionalInformation;
        delete tempItem.AdditionalInformation;
      }
      if (tempItem.hasOwnProperty('AddedBy')) {
        tempItem['CreatedBy'] = tempItem.AddedBy;
        delete tempItem.AddedBy;
      }
      if (tempItem.hasOwnProperty('DebtCreditTypeId')) {
        delete tempItem.DebtCreditTypeId;
      }
      delete tempItem[this.tableSettings.id];
      delete tempItem[this.tableSettings.Id];
      var keys = Object.keys(tempItem);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j].replace(/([a-z])([A-Z])/g, '$1 $2');
        tempItem[key] = tempItem[keys[j]];
        if (key?.split(' ')?.length > 1) delete tempItem[keys[j]];
      }
      res.push(tempItem);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.tableSettings.tablename);

    XLSX.writeFile(wb, fileName);
  }

  sortData(column: any, asc: boolean) {
    if (this.pageObject.pageNumber === 0) {
      this.pageObject.pageNumber = 1;
    } else {
      this.pageObject.pageNumber = this.pageObject.pageNumber;
    }
    this.pageObject.sortBy = column;
    this.pageObject.sortOrder = asc ? 'Asc' : 'Desc';
    this.getTableData.emit(this.pageObject);
    this.onToolbarClick({ name: 'Sort' });
  }

  sortingDescending(column: any) {
    if (this.pageObject.pageNumber === 0) {
      this.pageObject.pageNumber = 1;
    } else {
      this.pageObject.pageNumber = this.pageObject.pageNumber;
    }
    this.pageObject.sortBy = column;
    this.pageObject.sortOrder = 'Desc';
    this.getTableData.emit(this.pageObject);
  }
  getColumnToDisplay() {
    this.columns = this.columns.filter((column: any) => column.show);
    this.displayedColumns = this.columns.map((c: any) => c.field);
    return this.columns;
  }
  // onSwitchToggle(event: any, row: any) {
  //   if (event.checked) {
  //     row.UnitStatus = 'Yes';
  //   } else {
  //     row.UnitStatus = 'No';
  //   }
  //   const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
  //     data: {
  //       text1:
  //         row.UnitStatus === 'Yes'
  //           ? CONSTANTS.UNIT_AVAILABILITY_TEXT1
  //           : CONSTANTS.UNIT_AVAILABILITY_UNAVAILABLE,
  //       text2: CONSTANTS.UNIT_AVAILABILITY_TEXT2,
  //       label: 'Setting Availability',
  //       btn1Text: CONSTANTS.CANCEL,
  //       btn2Text: CONSTANTS.YES,
  //       tablename: this.tablename,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((action: any) => {
  //     var unitObject = {
  //       PropertyId: row.PropertyId,
  //       Status: row.UnitStatus === 'Yes' ? 1 : 2,
  //       Units: [row.PropertyUnitId],
  //     };
  //     if (action === CONSTANTS.YES) {
  //       // this.loaderService.show();
  //       this.unitService.unitStatusUpdate(unitObject).subscribe({
  //         next: (res: any) => {
  //           this.toasterService.success(res.message);
  //           this.loaderService.hide();
  //           this.rowWiseAction('Availability', unitObject);
  //           this.selectedRows = [];
  //         },
  //         error: (error: any) => {
  //           this.loaderService.hide();
  //           this.toasterService.error(error.error.message);
  //         },
  //       });
  //     } else {
  //       row.UnitStatus = event.checked ? 'No' : 'Yes';
  //     }
  //   });
  // }

  onSwitchToggle(event: any, row: any) {
    const newStatus = this.getStatusByValue(event);

    const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
      data: {
        text1: [
          'Available',
          'Under Offer',
          'Under Negotiation',
          'Let',
        ].includes(newStatus)
          ? `Are you sure you want to set this availability to ${newStatus}?`
          : CONSTANTS.UNIT_AVAILABILITY_UNAVAILABLE,
        text2: CONSTANTS.UNIT_AVAILABILITY_TEXT2,
        label: 'Setting Availability',
        btn1Text: CONSTANTS.CANCEL,
        btn2Text: CONSTANTS.YES,
        tablename: this.tablename,
        rowId: newStatus,
      },
    });

    dialogRef.afterClosed().subscribe((action: any) => {
      if (
        [
          'Available',
          'Unavailable',
          'Under Offer',
          'Under Negotiation',
          'Let',
        ].includes(action)
      ) {
        const unitObject = {
          PropertyId: row.PropertyId,
          Status: this.getStatusValue(newStatus),
          Units: [row.PropertyUnitId],
        };
        this.loaderService.show();
        this.unitService.unitStatusUpdate(unitObject).subscribe({
          next: (res: any) => {
            this.toasterService.success(res.message);
            this.loaderService.hide();
            row.UnitStatus = newStatus;
            this.rowWiseAction('Availability', unitObject);
            this.selectedRows = [];
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
      }
    });
  }

  getStatusByValue(value: string): string {
    switch (value) {
      case '1':
        return 'Available';
      case '2':
        return 'Unavailable';
      case '3':
        return 'Under Offer';
      case '4':
        return 'Under Negotiation';
      case '5':
        return 'Let';
      default:
        return '';
    }
  }

  getStatusValue(status: string): number {
    switch (status) {
      case 'Available':
        return 1;
      case 'Unavailable':
        return 2;
      case 'Under Offer':
        return 3;
      case 'Under Negotiation':
        return 4;
      case 'Let':
        return 5;
      default:
        return 0;
    }
  }

  /*
   *********************************************************
   *     Dynamic Toolbar and grid action implementation    *
   *********************************************************
   */

  onToolbarClick(event: any) {
    if (event && event?.name === 'Filter') {
      this.pageObject.pageNumber = 1;
      this.pageIndex = 0;
    }
    this.toolbarEvent.emit({ ...event, filter: this.pageObject });
  }
  onActionClick(event: any) {
    this.actionEvent.emit(event);
  }
  setToggle(data: string) {
    return { checked: data === 'Yes' ? true : false };
  }

  changeAvailability(data: any) {
    const dialogRef = this.dialog.open(UnitAvailabilityDialogComponent, {
      data: {
        text1:
          data === 'Available'
            ? CONSTANTS.UNIT_AVAILABILITY_TEXT1
            : CONSTANTS.UNIT_AVAILABILITY_UNAVAILABLE,
        text2: CONSTANTS.UNIT_AVAILABILITY_TEXT2,
        label: 'Setting Availability',
        btn1Text: CONSTANTS.CANCEL,
        btn2Text: CONSTANTS.YES,
        tablename: this.tablename,
      },
    });
    dialogRef.afterClosed().subscribe((action: any) => {
      const units = [];
      units.push(this.selectedRows.map((x: any) => x.PropertyUnitId));
      var unitObject = {
        PropertyId: this.selectedRows[0].PropertyId,
        Status: data === 'Available' ? 1 : 2,
        Units: units[0],
      };
      if (action === CONSTANTS.YES) {
        // this.loaderService.show();
        this.unitService.unitStatusUpdate(unitObject).subscribe({
          next: (res: any) => {
            this.toasterService.success(res.message);
            this.loaderService.hide();
            this.rowWiseAction('Availability', unitObject);
            this.selectedRows = [];
            this.selection.clear();
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.toasterService.error(error.error.message);
          },
        });
      } else {
      }
    });
  }

  updateBrokerCommissionIncentive() {
    var data = {
      rowData: this.selectedRows,
    };
    this.rowWiseAction('Broker Commission Incentive', data);
    // this.selectedRows = [];
    // this.selection.clear();
  }
  updateTenantIncentive() {
    var data = {
      rowData: this.selectedRows,
    };
    this.rowWiseAction('Tenant Incentive', data);
    // this.selectedRows = [];
    // this.selection.clear();
  }
  searchData(tool: any) {
    if (this.searchText != '') {
      this.pageObject = {
        ...this.pageObject,
        searchValue: this.searchText,
        pageNumber: 1,
      };
      this.pageIndex = 0;
      this.onToolbarClick(tool);
    }
  }
  clearSearch(tool: any) {
    let sd = this.searchForm.nativeElement as HTMLFormElement;
    if (this.pageObject.searchValue != '') {
      this.searchText = null;
      this.pageObject.pageSize = 10;
      sd.classList.remove('search-active');
      this.searchData(tool);
    } else {
      this.searchText = null;
      sd.classList.remove('search-active');
    }
  }

  viewProperty(row: any) {
    this.rowWiseAction(FORM_MODE.VIEW, row);
  }

  onFeaturedSwitchToggle(event: any, row: any) {
    this.isFeaturedEvent.emit({
      rowData: row,
      activePageNumber: this.pageObject.pageNumber,
      pageSize: this.pageObject.pageSize,
    });
  }
}
