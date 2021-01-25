import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss']
})
export class SidebarHeaderComponent implements OnInit {

  public hideInfo: boolean = false;
  public singleUser: User;

  constructor(
    private userService: UserService,
    private storageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
    .subscribe(param => {
      if (param.user_id) {
        this.userService.getSingleUser(param.user_id)
          .subscribe((data: User) => {
            this.singleUser = data
          })
      } else {
        const user_id = this.storageService.getItem('user_id');
        this.userService.getSingleUser(user_id)
          .subscribe((data: User) => {
            this.singleUser = data
          })
      }
    })
  }

  public hideOrShowContent() {
    this.hideInfo = !this.hideInfo
  }

}
