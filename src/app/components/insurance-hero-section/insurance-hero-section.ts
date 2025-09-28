import { Component, inject } from '@angular/core';
import { BtnCommon } from "../btn-common/btn-common";
import { SectionIntro } from "../section-intro/section-intro";
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-hero-section',
  imports: [BtnCommon, SectionIntro],
  templateUrl: './insurance-hero-section.html',
  styleUrl: './insurance-hero-section.scss'
})
export class InsuranceHeroSection {

  private router = inject(Router);

    redirectToContact(){
    this.router.navigate(['/contact']);
  }


}
