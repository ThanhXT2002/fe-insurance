import { Injectable, inject, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SectionCommon, OurApproachData } from '../../interfaces/section-common.interface';

const OUR_APPROACH_KEY = makeStateKey<SectionCommon<OurApproachData>>('our-approach-data');

@Injectable({
  providedIn: 'root'
})
export class OurApproachService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getOurApproachData(): Observable<SectionCommon<OurApproachData>> {
    const saved = this.transferState.get<SectionCommon<OurApproachData>>(OUR_APPROACH_KEY, null as any);
    if (saved) {
      return of(saved);
    }
    return this.http.get<SectionCommon<OurApproachData>>('assets/json/our-approach.json').pipe(
      tap(data => this.transferState.set(OUR_APPROACH_KEY, data))
    );
  }
}
