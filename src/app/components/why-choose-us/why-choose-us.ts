import { Component } from '@angular/core';
import { SectionLabel } from "../section-label/section-label";
import { SectionIntro } from "../section-intro/section-intro";
import { FeatureList } from "../feature-list/feature-list";
import { BtnCommon } from "../btn-common/btn-common";

@Component({
  selector: 'app-why-choose-us',
  imports: [SectionLabel, SectionIntro, FeatureList, BtnCommon],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.scss'
})
export class WhyChooseUs {

}
