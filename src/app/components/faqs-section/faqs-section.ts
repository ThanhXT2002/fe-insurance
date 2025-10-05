import { Component } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { AccordionModule } from 'primeng/accordion';
import { FAQSItems } from "../faqs-items/faqs-items";



@Component({
  selector: 'app-faqs-section',
  imports: [SectionIntro, AccordionModule, FAQSItems],
  templateUrl: './faqs-section.html',
  styleUrl: './faqs-section.scss'
})
export class FaqsSection {


}
