import { Component, computed, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { IndemnifyService } from '../../core/services/api/indemnify.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TermData } from '../../core/interfaces/term.interface';

@Component({
  selector: 'app-indemnify',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải quy trình bồi thường..."
      downloadButtonText="Tải xuống hướng dẫn"
      downloadFileName="indemnify-guide.pdf"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndemnifyComponent {
  private indemnifyService = inject(IndemnifyService);

  readonly dataSource = computed(() => this.indemnifyService.getIndemnifyData());
}
