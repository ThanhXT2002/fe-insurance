import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss'
})
export class Logo {

  @Input() imgSrc: string = 'assets/images/logo-insurance.webp';
  @Input() isShowName: boolean = false;
  @Input() width: string = 'w-9 md:w-10'; // Tailwind width classes

}
