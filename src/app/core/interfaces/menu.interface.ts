export interface AppMenuItem {
  id: number;
  label: string;
  icon: string;
  link: string;
  isBlank: boolean;
  note: string;
  children?: AppMenuItem[];
}

export interface MenuItemPublich {
  key: string;
  label: string;
  icon: string | null;
  expanded: boolean;
  data: DataMenu;
  children?: MenuItemPublich[];
}

export interface DataMenu {
  id: number;
  icon: string | null;
  url: string | null;
  routerLink: string | null;
  command: string | null;
  isBlank: boolean;
  active: boolean;
  order: number;
}

// Response từ API public menu
export interface PublicMenuResponse {
  id: number;
  key: string;
  name: string;
  description: string;
  active: boolean;
  position: string;
  menus: MenuItemPublich[];
}

// Cache entry cho menu store
export interface MenuCacheEntry {
  data: PublicMenuResponse;
  timestamp: number;
  expiry: number; // timestamp khi cache hết hạn
}
