export interface AppMenuItem {
  id: number;
  label: string;
  icon: string;
  link: string;
  isBlank: boolean;
  note: string;
  children?: AppMenuItem[];
}
