import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductList } from "../product-list/product-list";
import { SectionIntro } from "../section-intro/section-intro";

@Component({
  selector: 'app-service-section',
  imports: [ CommonModule, ProductList, SectionIntro],
  templateUrl: './service-section.html',
  styleUrl: './service-section.scss'
})
export class ServiceSection {

}
