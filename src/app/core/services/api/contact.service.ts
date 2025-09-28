import { ApiResponse } from '@/core/interfaces/api-response.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ContactDTO{
    name: string;
    phone: string;
    email: string;
    message: string;
}

export interface ContactRecord {
    id: number;
    name?: string;
    email?: string;
    message: string;
    ip?: string;
    userAgent?: string;
    createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  sendContact(data: ContactDTO): Observable<ApiResponse<ContactRecord>> {
    return this.http.post<ApiResponse<ContactRecord>>(`${this.apiUrl}/contact`, data);
  }

}
