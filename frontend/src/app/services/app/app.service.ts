import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../localStorage/local-storage.service';
import jwt from 'angular2-jwt-simple';

const WEBWORK_KEY = environment.WEBWORK_KEY;

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
      .subscribe(async (param) => {
        if (param.enc) {
          const userInfo = await this.decodeToken(param.enc)
          this.apiService.post(`/api/current_user/${userInfo.user_id}`)
            .subscribe(
              () => {
                this.storageService.setItem('team_id', userInfo.team_id);
                this.storageService.setItem('user_id', userInfo.user_id);
                if (!this.storageService.getItem('selectedUser')) {
                  this.storageService.setItem('selectedUser', userInfo.user_id);
                }
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

  public async decodeToken(token: string) {
    const decoded = jwt.decode(token, window.atob(WEBWORK_KEY))
    const userData = {
      user_id: decoded.sub.split("_")[0],
      team_id: decoded.sub.split("_")[1]
    };
    return  userData;
  }
}
