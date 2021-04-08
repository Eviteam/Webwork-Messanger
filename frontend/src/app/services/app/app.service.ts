import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../localStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private storageService: LocalStorageService
  ) { }

  public setCurrenUser() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.queryParams
      .subscribe(param => {
        if (param.user_id) {
          this.apiService.post(`/api/current_user/${param.user_id}`)
            .subscribe(
              data => {
                this.storageService.setItem('team_id', param.team_id);
                this.storageService.setItem('user_id', param.user_id)
                this.storageService.setItem('selectedUser', param.user_id)
                const team_id = this.storageService.getItem('team_id')
                const user_id = this.storageService.getItem('user_id')
                const selectedUser = this.storageService.getItem('selectedUser')
                const userData = {team_id, user_id, selectedUser}
                resolve(userData)
              },
              err => reject(err)
            )
        }
      })
    })
  }
}
