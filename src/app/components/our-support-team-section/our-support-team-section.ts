import { Component, inject } from '@angular/core';
import { SectionIntro } from "../section-intro/section-intro";
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { CompanyInfoService } from '@/core/services/company-info.service';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-our-support-team-section',
  imports: [SectionIntro, IconBoxWrapper],
  templateUrl: './our-support-team-section.html',
  styleUrl: './our-support-team-section.scss'
})
export class OurSupportTeamSection {

    infoService = inject(CompanyInfoService)


  teamMembers: TeamMember[] = [
    { id: 1, name: 'Nguyễn Văn A', avatar: 'assets/images/team/support-team-img-1.webp' },
    { id: 2, name: 'Trần Thị B', avatar: 'assets/images/team/support-team-img-2.webp' },
    { id: 3, name: 'Lê Văn C', avatar: 'assets/images/team/support-team-img-3.webp' },
    { id: 4, name: 'Phạm Thị D', avatar: 'assets/images/team/support-team-img-4.webp' },
    { id: 5, name: 'Hoàng Văn E', avatar: 'assets/images/team/support-team-img-5.webp' },
    { id: 6, name: 'Vũ Thị F', avatar: 'assets/images/team/support-team-img-6.webp' },
    { id: 7, name: 'Đặng Văn G', avatar: 'assets/images/team/support-team-img-7.webp' },
    { id: 8, name: 'Bùi Thị H', avatar: 'assets/images/team/support-team-img-8.webp' }
  ];


  emailSupport = this.infoService.companyInfo().emailSupport;
  numberPhone = this.infoService.companyInfo().numberPhone;

}
