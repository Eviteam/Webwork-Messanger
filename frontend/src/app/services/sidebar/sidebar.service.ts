import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TeamData } from 'src/app/models/team';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private scrollEvent = new BehaviorSubject<any>(null);
  public getEvent = this.scrollEvent.asObservable();

  constructor(private apiService: ApiService) { }

  public getTeamData(user_id: string, team_id: string): Observable<TeamData> {
    return this.apiService.get(`/api/team/${user_id}/${team_id}`)
  }

  public getScrolEvent(event: any): void {
    this.scrollEvent.next(event);
  }
}
