import { Component, computed, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { PrivacyPolicyService } from '../../core/services/api/privacy-policy.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải chính sách bảo mật..."
      downloadButtonText="Tải xuống chính sách"
      downloadFileName="privacy-policy.pdf"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicy {
  private privacyPolicyService = inject(PrivacyPolicyService);

  readonly dataSource = computed(() => this.privacyPolicyService.getPrivacyPolicyData());
}
