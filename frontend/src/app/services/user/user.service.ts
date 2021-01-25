import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  public getAllUsers(user_id: string): Observable<Team> {
    return this.apiService.get(`/api/users/${user_id}`)
  }

  public getSingleUser(user_id: string): Observable<User> {
    return this.apiService.get(`/api/users/single_user/${user_id}`)
  }
}
