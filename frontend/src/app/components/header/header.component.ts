import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userData: User;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
        .subscribe(param => this.getSingleUser(param.id))
  }

  public getSingleUser(user_id: string): void {
    this.userService.getSingleUser(user_id)
      .subscribe((singleUser: User) => this.userData = singleUser)
  }

}
