import { AppMenuItem } from './menu.interface';

export interface FooterContactInfo {
  address: {
    street: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
}

export interface FooterCompany {
  name: string;
  description: string;
  socialLinks: AppMenuItem[];
}

export interface FooterData {
  company: FooterCompany;
  quickLinks: AppMenuItem[];
  usefullLinks: AppMenuItem[];
  insuranceProducts: AppMenuItem[];
  contactInfo: FooterContactInfo;
  legalLinks: AppMenuItem[];
  copyright: string;
}
