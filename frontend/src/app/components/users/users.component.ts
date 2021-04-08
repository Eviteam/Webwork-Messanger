import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public hideUsers: boolean = false;
  public user_id: string = this.storageService.getItem('user_id');
  public team_id: string = this.storageService.getItem('team_id');
  public users: User[];
  public userIsSelected: boolean = false;
  public selectedUser: string = this.storageService.getItem('selectedUser')
    ? this.storageService.getItem('selectedUser')
    : null;
  public userMessages: any;
  public unreadMessageCount: any;
  public messageIsRead: boolean = false;

  constructor(
    private userService: UserService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.team_id = this.storageService.getItem('team_id');
    this.user_id = this.storageService.getItem('user_id');
    this.getUnseenMessages(this.team_id, this.user_id);
    if (!this.storageService.getItem('selectedUser')) {
      this.activatedRoute.queryParams
        .subscribe(param => {
          if (param.user_id) {
            this.userService.getAllUsers(param.user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.selectUser(param.user_id)
              })
          } else {
            const user_id = this.storageService.getItem('user_id');
            this.userService.getAllUsers(user_id)
            .subscribe((data: Team) => {
              this.users = data.team.users;
              this.selectUser(user_id)
            })
          }
        })      
    } else {
      const user_id = this.storageService.getItem('user_id');
      this.userService.getAllUsers(user_id)
        .subscribe((data: Team) => {
          this.users = data.team.users
        })
      this.selectUser(this.selectedUser);
      this.router.navigateByUrl(`/main/${this.selectedUser}`)
    }
    this.messageService.newMessage
      .subscribe(newMessage => {
        if (newMessage) {
          this.messageIsRead = false;
          this.getUnseenMessages(newMessage?.team_id, newMessage?.receiver_id)
        }
      })
  }

  public hideOrShowContent(): void {
    this.hideUsers = !this.hideUsers
  }

  public selectUser(user_id: string): void {
    this.userIsSelected = true;
    this.selectedUser = user_id;
    this.storageService.setItem('selectedUser', this.selectedUser);
    this.team_id = this.storageService.getItem('team_id');
    this.messageService.setMessageIsRead(this.team_id, this.user_id, this.selectedUser)
      .subscribe(data => {
        if (data.message === 'success') {
          this.messageIsRead = true
        }
      })
    this.router.navigateByUrl(`/main/${this.selectedUser}`)
  }

  public getUnseenMessages(team_id: string, user_id: string): void {
    const current_team = this.storageService.getItem('team_id')
    this.messageService.getUnseenMessages(team_id, user_id)
      .subscribe(data => {
        if (team_id == current_team) {
          this.userMessages = Object.keys(data);
          this.unreadMessageCount = data;
        }
      })
  }

}
