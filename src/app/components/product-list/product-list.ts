import { Component } from '@angular/core';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";

@Component({
  selector: 'app-product-list',
  imports: [IconBoxWrapper],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  @Input()
}
