import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {

  readonly companyInfo = signal({ ...environment });

}
