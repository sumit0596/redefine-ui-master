export interface ITableConfig {
  id: string;
  tablename: string;
  columns: any[];
  rows: any[];
  tools: any[];
  totalRowsCount: number;
  pageCnt: number;
  isPaginationRequired: boolean;
  showActions: boolean;
}
export interface IPageTableFilter {
  PageNo: number;
  PerPage: number | string;
  Search: string | undefined;
  SortBy: string | undefined;
  SortOrder: OrderType;
  Status: string | undefined;
  Portal: number | undefined;
}
export interface IPage {
  MenuId: number;
  Title: string;
  Route: string;
  Html: string | undefined;
  Css: string | undefined;
  Status: string;
  CreatedOn: string;
  UpdatedOn: string;
  AddedBy: string;
}
export interface IPageDetails {
  Title: string;
  Portal: number;
  Route: string;
  ParentId: number;
  Html: string | undefined;
  Css: string | undefined;
  Status: number;
  Icon?: string;
}
export interface IMenu {
  MenuId: number;
  Title: string;
  Route: string;
  Position: number;
  ParentId: number;
}
export type OrderType = 'Asc' | 'Desc';
