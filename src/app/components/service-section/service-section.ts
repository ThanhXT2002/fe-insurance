import { Component } from '@angular/core';
import { SectionLabel } from "../section-label/section-label";
import { CommonModule } from '@angular/common';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { ProductList } from "../product-list/product-list";

@Component({
  selector: 'app-service-section',
  imports: [SectionLabel, CommonModule, ProductList],
  templateUrl: './service-section.html',
  styleUrl: './service-section.scss'
})
export class ServiceSection {

}
