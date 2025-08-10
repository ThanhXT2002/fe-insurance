import { Injectable, inject, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IntroCommon, OurApproachData } from '../../interfaces/intro-common.interface';

const OUR_APPROACH_KEY = makeStateKey<IntroCommon<OurApproachData>>('our-approach-data');

@Injectable({
  providedIn: 'root'
})
export class OurApproachService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getOurApproachData(): Observable<IntroCommon<OurApproachData>> {
    const saved = this.transferState.get<IntroCommon<OurApproachData>>(OUR_APPROACH_KEY, null as any);
    if (saved) {
      return of(saved);
    }
    return this.http.get<IntroCommon<OurApproachData>>('assets/json/our-approach.json').pipe(
      tap(data => this.transferState.set(OUR_APPROACH_KEY, data))
    );
  }
}
