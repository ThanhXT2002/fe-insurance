import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppMenuItem } from '../interfaces/menu.interface';



@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) {}

  getMenu(): Observable<AppMenuItem[]> {
    return this.http.get<AppMenuItem[]>('assets/json/menu.json');
  }
}
