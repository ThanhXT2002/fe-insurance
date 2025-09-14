import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { UserProfileSafe } from './auth.types';
import { environment } from '../../../../environments/environment';
import { updateProfile } from '@/core/interfaces/user.interface';
import { ApiResponse } from '@/core/interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl + '/auth';

getProfile(): Observable<UserProfileSafe | null> {
  return this.http
    .get<{ data: UserProfileSafe }>(`${this.base}/profile`)
    .pipe(
      timeout(5000), // server-side or client-side: fail after 5s
      map(res => (res as any)?.data || null),
      catchError(() => of(null))
    );
}

  updateProfile(data: updateProfile): Observable<ApiResponse<UserProfileSafe>> {
    return this.http.put<ApiResponse<UserProfileSafe>>(
      `${this.base}/profile`,
      data,
    );
  }

  updateAvatar(file: File): Observable<ApiResponse<UserProfileSafe>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<
        ApiResponse<{ user: UserProfileSafe; uploadInfo?: any }>
      >(`${this.base}/avatar`, formData)
      .pipe(
        map((res) => {
          // Backend returns data.user and data.uploadInfo — normalize to ApiResponse<UserProfileSafe>
          const user = (res.data as any)?.user as UserProfileSafe | undefined;
          return {
            ...res,
            data: user as any,
          } as ApiResponse<UserProfileSafe>;
        }),
      );
  }
}
