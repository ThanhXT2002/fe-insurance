import { Injectable, inject, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppMenuItem } from '../../interfaces/menu.interface';

const MENU_KEY = makeStateKey<AppMenuItem[]>('menu-data');

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getMenu(): Observable<AppMenuItem[]> {
    const saved = this.transferState.get<AppMenuItem[]>(MENU_KEY, null as any);
    if (saved) {
      return of(saved);
    }
    return this.http.get<AppMenuItem[]>('assets/json/menu.json').pipe(
      tap(data => this.transferState.set(MENU_KEY, data))
    );
  }
}
