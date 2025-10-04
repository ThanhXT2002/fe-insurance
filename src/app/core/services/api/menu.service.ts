import { Injectable, inject, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AppMenuItem,
  MenuItemPublich,
  PublicMenuResponse,
} from '../../interfaces/menu.interface';
import { ApiResponse } from '@/core/interfaces/api-response.interface';
import { environment } from 'src/environments/environment';

const MENU_KEY = makeStateKey<AppMenuItem[]>('menu-data');

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private apiUrl = environment.apiUrl; // Thay đổi thành URL thực tế của bạn

  getMenu(): Observable<AppMenuItem[]> {
    const saved = this.transferState.get<AppMenuItem[]>(MENU_KEY, null as any);
    if (saved) {
      return of(saved);
    }
    return this.http
      .get<AppMenuItem[]>('assets/json/menu.json')
      .pipe(tap((data) => this.transferState.set(MENU_KEY, data)));
  }

  // sendContact(data: ContactDTO): Observable<ApiResponse<ContactRecord>> {
  //   return this.http.post<ApiResponse<ContactRecord>>(`${this.apiUrl}/contact`, data);
  // }

  /**
   * Lấy public menu theo category key
   * @param categoryKey - Key của menu category (vd: menu-product, menu-header)
   * @returns Observable<ApiResponse<PublicMenuResponse>>
   */
  getPublicMenu(
    categoryKey: string,
  ): Observable<ApiResponse<PublicMenuResponse>> {
    return this.http.get<ApiResponse<PublicMenuResponse>>(
      `${this.apiUrl}/menus/public/${categoryKey}`,
    );
  }

  /**
   * Lấy multiple menu categories cùng lúc
   * @param categoryKeys - Array các category keys
   * @returns Observable<ApiResponse<PublicMenuResponse>[]>
   */
  getMultiplePublicMenus(
    categoryKeys: string[],
  ): Observable<ApiResponse<PublicMenuResponse>[]> {
    const requests = categoryKeys.map((key) => this.getPublicMenu(key));
    return forkJoin(requests);
  }
}
