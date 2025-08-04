import { Component } from '@angular/core';
import { SectionLabel } from "../section-label/section-label";
import { CommonModule } from '@angular/common';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";

@Component({
  selector: 'app-service-section',
  imports: [SectionLabel, CommonModule, IconBoxWrapper],
  templateUrl: './service-section.html',
  styleUrl: './service-section.scss'
})
export class ServiceSection {

}
