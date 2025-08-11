import { Component } from '@angular/core';
import { ProductList } from "../product-list/product-list";

@Component({
  selector: 'app-all-products-section',
  imports: [ProductList],
  templateUrl: './all-products-section.html',
  styleUrl: './all-products-section.scss'
})
export class AllProductsSection {

}
