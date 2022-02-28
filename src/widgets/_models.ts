export interface MenuItem {
  icon?: string;
  label: string;
  event: string;
}

export type TabItem = {
  name: string;
  id: string;
}

export type Tabs = TabItem[];
