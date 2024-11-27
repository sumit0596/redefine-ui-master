export interface ILoader {
  isActive: boolean;
  data: any;
  type?: Loader_Type;
}

export type Loader_Type = 'API' | 'AD_LOGIN';
