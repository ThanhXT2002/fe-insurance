import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { FooterData } from '../../interfaces/footer.interface';

const FOOTER_KEY = makeStateKey<FooterData>('footer-data');

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getFooterData(): Observable<FooterData> {
    const saved = this.transferState.get<FooterData>(FOOTER_KEY, null as any);
    if (saved) {
      // Nếu đã có data trong TransferState, trả về luôn
      return of(saved);
    }
    // Nếu chưa có, gọi API và lưu vào TransferState
    return this.http.get<FooterData>('assets/json/footer.json').pipe(
      tap(data => this.transferState.set(FOOTER_KEY, data))
    );
  }
}
