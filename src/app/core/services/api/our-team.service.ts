import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { OurTeamData, SectionCommon } from '../../interfaces/section-common.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const OUR_TEAM_KEY = makeStateKey<SectionCommon<OurTeamData>>('our-team-data');

@Injectable({
  providedIn: 'root'
})
export class OurTeamService {

  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getOurTeamData(): Observable<SectionCommon<OurTeamData>> {
    const saved = this.transferState.get<SectionCommon<OurTeamData>>(OUR_TEAM_KEY, null as any);
    if (saved) {
      return of(saved);
    }
    return this.http.get<SectionCommon<OurTeamData>>('assets/json/our-team.json').pipe(
      tap(data => this.transferState.set(OUR_TEAM_KEY, data))
    );
  }

}
