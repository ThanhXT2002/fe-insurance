import { Component, effect, inject, signal } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { OurTeamData, SectionCommon } from '../../core/interfaces/section-common.interface';
import { OurTeamService } from '../../core/services/api/our-team.service';

@Component({
  selector: 'app-our-team-section',
  imports: [SectionIntro],
  templateUrl: './our-team-section.html',
  styleUrl: './our-team-section.scss'
})
export class OurTeamSection {

  private ourTeamService = inject(OurTeamService);
  readonly ourTeamData = signal<SectionCommon<OurTeamData> | null>(null);

  // Tab key đang được chọn
  readonly selectedTabKey = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.ourTeamService.getOurTeamData().subscribe((data: SectionCommon<OurTeamData>) => {
        this.ourTeamData.set(data);
        // Khi có data, set tab đầu tiên làm active
        if (data?.data?.length) {
          this.selectedTabKey.set(data.data[0].key);
        }
      })
    })
  }

}
