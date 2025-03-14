import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserDashboard} from '../../shared/models/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserDashboard() {
    return this.http.get<UserDashboard>(this.baseUrl + 'dashboard/user-dashboard');
  }
}
