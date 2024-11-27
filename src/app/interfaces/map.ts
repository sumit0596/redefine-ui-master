export interface MarkerConfig {
  position: google.maps.LatLngLiteral;
  id?: string | number;
  type?: string | number;
  label?: string;
  title?: string;
  count?: string | number;
  content?: string;
  data?: any;
  svg?: string;
  style?: MarkerStyle;
  active?: boolean;
}

export interface MarkerStyle {
  color?: string;
  height?: string | number;
  width?: string | number;
  fontSize?: number;
}
