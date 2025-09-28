import { Component } from '@angular/core';
import { BreadcrumbImg } from "@/components/breadcrumb-img/breadcrumb-img";
import { ContactForm } from "@/components/contact-form/contact-form";
import { SectionIntro } from "@/components/section-intro/section-intro";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-us',
  imports: [BreadcrumbImg, ContactForm, SectionIntro],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss'
})
export class ContactUs {

  title = 'Liên hệ với chúng tôi';
  emailSupport = environment.emailSupport;
  numberPhone = environment.numberPhone;
  address = environment.address;

}
