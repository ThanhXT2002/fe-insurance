import { Component, Input } from '@angular/core';
import { SectionLabel } from "../section-label/section-label";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-intro',
  imports: [SectionLabel, CommonModule],
  templateUrl: './section-intro.html',
  styleUrl: './section-intro.scss'
})
export class SectionIntro {

  @Input() title:string = '';
  @Input() firstText:string = '';
  @Input() highlightText:string = '';
  @Input() lastText:string = '';
  @Input() description:string = '';
  @Input() introClass:string = '';
  @Input() textClass:string = '';
  @Input() descriptionClass:string = 'text-justify';
}
