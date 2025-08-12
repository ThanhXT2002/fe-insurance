import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || 'http://localhost:3000';

  /**
   * Test API để verify Firebase token với backend
   */
  verifyToken(): Observable<ApiResponse<UserProfile>> {
    return this.http.post<ApiResponse<UserProfile>>(`${this.baseUrl}/auth/verify`, {});
  }

  /**
   * Lấy thông tin profile user
   */
  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/auth/profile`);
  }

  /**
   * Cập nhật profile user
   */
  updateUserProfile(profile: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.baseUrl}/auth/profile`, profile);
  }

  /**
   * Test endpoint protected - cần authentication
   */
  getProtectedData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/protected/data`);
  }

  /**
   * Test endpoint public - không cần authentication
   */
  getPublicData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/public/data`);
  }
}
