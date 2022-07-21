export interface InitServerOptions {
  title: string;
  inject: URL[];
  style: string | UserStyle;
}

export interface UserStyle {
  path: string;
  useDinovel: boolean;
}
