import { Component } from '@angular/core';
import { BreadcrumbImg } from "../../components/breadcrumb-img/breadcrumb-img";
import { InsuranceHeroSection } from "../../components/insurance-hero-section/insurance-hero-section";
import { FaqsSection } from "../../components/faqs-section/faqs-section";
import { AllProductsSection } from "../../components/all-products-section/all-products-section";

@Component({
  selector: 'app-products',
  imports: [BreadcrumbImg, InsuranceHeroSection, FaqsSection, AllProductsSection],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {

}
