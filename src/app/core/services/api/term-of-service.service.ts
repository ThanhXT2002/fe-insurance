import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { TermData } from '../../interfaces/term.interface';

const TERM_OF_SERVICE_KEY = makeStateKey<TermData>('term-of-service-data');

@Injectable({
  providedIn: 'root',
})
export class TermOfServiceService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getTermOfServiceData(): Observable<TermData> {
    const saved = this.transferState.get<TermData>(
      TERM_OF_SERVICE_KEY,
      null as any,
    );
    if (saved) {
      return of(saved);
    }
    return this.http
      .get<TermData>('assets/json/term-of-service.json')
      .pipe(tap((data) => this.transferState.set(TERM_OF_SERVICE_KEY, data)));
  }
}
