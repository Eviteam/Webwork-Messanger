import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readMessage = new BehaviorSubject<any>(null);
  public isSeen = this.readMessage.asObservable();

  constructor(private apiService: ApiService) { }

  public getAllUsers(user_id: string): Observable<Team> {
    return this.apiService.get(`/api/users/${user_id}`);
  }

  public getSingleUser(user_id: string): Observable<User> {
    return this.apiService.get(`/api/users/single_user/${user_id}`);
  }

  public setMessageIsRead(message: boolean): void {
    this.readMessage.next(message);
  }
}
