import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { TermData } from '../../interfaces/term.interface';



const PRIVACY_POLICY_KEY = makeStateKey<TermData>(
  'privacy-policy-data',
);

@Injectable({
  providedIn: 'root',
})
export class PrivacyPolicyService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getPrivacyPolicyData(): Observable<TermData> {
    const saved = this.transferState.get<TermData>(
      PRIVACY_POLICY_KEY,
      null as any,
    );
    if (saved) {
      return of(saved);
    }
    return this.http
      .get<TermData>('assets/json/privacy-policy.json')
      .pipe(tap((data) => this.transferState.set(PRIVACY_POLICY_KEY, data)));
  }
}
