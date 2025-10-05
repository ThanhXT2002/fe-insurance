import { Component } from '@angular/core';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-info-extra-phone',
  imports: [IconBoxWrapper],
  templateUrl: './info-extra-phone.html',
  styleUrl: './info-extra-phone.scss'
})
export class InfoExtraPhone {

    numberPhone = environment.numberPhone;

    callPhone(){
      window.location.href = `tel:${environment.numberPhone}`;
    }

}
