import { Component, inject } from '@angular/core';
import { BreadcrumbImg } from '@/components/breadcrumb-img/breadcrumb-img';
import { ContactForm } from '@/components/contact-form/contact-form';
import { SectionIntro } from '@/components/section-intro/section-intro';
import { environment } from 'src/environments/environment';
import { CompanyInfoService } from '@/core/services/company-info.service';
import { SEOService } from '@/core/services/seo.service';

@Component({
  selector: 'app-contact-us',
  imports: [BreadcrumbImg, ContactForm, SectionIntro],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
})
export class ContactUs {
  infoService = inject(CompanyInfoService);
  private readonly seo = inject(SEOService);

  title = 'Liên hệ với chúng tôi';
  emailSupport = this.infoService.companyInfo().emailSupport;
  numberPhone = this.infoService.companyInfo().numberPhone;
  address = this.infoService.companyInfo().address;

  ngOnInit(): void {
    try {
      this.seo.setSEO(undefined, 'contact');
    } catch (e) {
      // don't break page if SEO service unavailable
    }
  }
}
