import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { TermData } from '../../interfaces/term.interface';

const INDEMNIFY_KEY = makeStateKey<TermData>('indemnify-data');

@Injectable({
  providedIn: 'root',
})
export class IndemnifyService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getIndemnifyData(): Observable<TermData> {
    const saved = this.transferState.get<TermData>(
      INDEMNIFY_KEY,
      null as any,
    );
    if (saved) {
      return of(saved);
    }
    return this.http
      .get<TermData>('assets/json/indemnify.json')
      .pipe(tap((data) => this.transferState.set(INDEMNIFY_KEY, data)));
  }
}
