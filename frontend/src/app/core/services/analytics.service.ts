import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private API = 'http://localhost:4000/api/analytics';

  constructor(private http: HttpClient) {}

  getKPIs(filters: any = {}): Observable<any> {
    return this.http.get(`${this.API}/kpis`, { params: filters });
  }

  getSignups(filters: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/signups`, { params: filters });
  }

  getEvents(filters: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/events`, { params: filters });
  }

  getPurchases(params: any = {}) {
    return this.http.get<any[]>(`${this.API}/purchases`, { params });
  }

  getBreakdown(type: string, params?: any) {
    return this.http.get<any[]>(`${this.API}/breakdown/${type}`, {
      params,
    });
  }

  getAgeGroups(params: any) {
    return this.http.get<any[]>(`${this.API}/breakdown/age-group`, {
      params,
    });
  }
}
