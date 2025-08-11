import { Component, inject } from '@angular/core';
import { TermLayoutComponent } from "../../components/term-layout/term-layout.component";
import { TermOfServiceService } from '../../core/services/api/terms-of-service.service';

@Component({
  selector: 'app-terms-of-service',
  imports: [TermLayoutComponent],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.scss'
})
export class TermsOfService {

    private readonly termOfServiceService = inject(TermOfServiceService);

  readonly dataSource = this.termOfServiceService.getTermOfServiceData();

}
