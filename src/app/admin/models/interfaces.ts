export interface IUnit {
  Attributes: string[];
  BrokerIncentives: string;
  GrossRental: string;
  Incentives: string[];
  PropertyName: string;
  PropertyUnitId: number;
  PropertyId: number;
  SectorName: string;
  UnitSize: string;
  UnitName: string;
  Url: string;
}
export interface IPdfDoc {
  content: [];
  images: any;
  pageSize: any;
  pageOrientation: any;
  pageMargins: any[];
  header: any;
  footer: any;
}
export interface IUnitFilter {
  PageNo: number | null | undefined;
  PerPage: any | null | undefined;
  Search: string | null | undefined;
  SectorId: any;
  ProvinceId: any;
  SortBy: SortOrder;
  SortOrder: string | null | undefined;
  Type: number | null | undefined;
  CityId: any;
  SuburbId: any;
  Attributes: any;
  Incentives: any;
  SizeStart: number | null | undefined;
  SizeEnd: number | null | undefined;
  BrokerIncentivesStart: number | null | undefined;
  BrokerIncentivesEnd: number | null | undefined;
  GrossRentalStart: number | null | undefined;
  GrossRentalEnd: number | null | undefined;
  HoldingCompanyId: any;
  EsgFeatures: any;
  Map:number;
  Space2Spec : number | null | undefined;
  PropertyId?:number[]| null|undefined;
}
export type SortOrder = 'Asc' | 'Desc';

export interface Filter {
  PageNo: number | null | undefined;
  PerPage: number | null | undefined;
  Search: string | null | undefined;
  StartDate : string | null;
  EndDate : string | null
}
