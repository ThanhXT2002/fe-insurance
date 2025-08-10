import { Component, effect, inject, signal } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { OurApproachService } from '../../core/services/api/our-approach.service';
import { IntroCommon, OurApproachData } from '../../core/interfaces/intro-common.interface';
import { CheckItem } from "../check-item/check-item";

@Component({
  selector: 'app-our-approach-section',
  imports: [SectionIntro, CheckItem],
  templateUrl: './our-approach-section.html',
  styleUrl: './our-approach-section.scss',
})
export class OurApproachSection {
  private ourApproachService = inject(OurApproachService);
  readonly ourApproachData = signal<IntroCommon<OurApproachData> | null>(null);

  // Tab key đang được chọn
  readonly selectedTabKey = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.ourApproachService.getOurApproachData().subscribe((data: IntroCommon<OurApproachData>) => {
        this.ourApproachData.set(data);
        // Khi có data, set tab đầu tiên làm active
        if (data?.data?.length) {
          this.selectedTabKey.set(data.data[0].key);
        }
        console.log('Our Approach data:', data);
      })
    })
  }


  selectTab(key: string) {
    this.selectedTabKey.set(key);
  }

  get selectedTabData(): OurApproachData | undefined {
    const data = this.ourApproachData()?.data;
    const key = this.selectedTabKey();
    return data?.find(item => item.key === key);
  }

}
