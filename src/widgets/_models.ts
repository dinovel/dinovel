export interface MenuItem {
  icon?: string;
  label: string;
  event: string;
}

export type TabItem = {
  name: string;
  id: string;
  closeable?: boolean;
}

export type Tabs = TabItem[];
