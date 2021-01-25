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

  public setCurrenUser(): void {
    this.activatedRoute.queryParams
      .subscribe(param => {
        if (param.user_id) {
          this.apiService.post(`/api/current_user/${param.user_id}`)
            .subscribe(data => {
              this.storageService.setItem('team_id', data.team.team_id);
              this.storageService.setItem('user_id', data.user_id)
            })
        }
      })
  }
}
