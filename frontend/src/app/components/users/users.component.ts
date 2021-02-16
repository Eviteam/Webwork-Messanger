import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
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
  public users: User[];
  public userIsSelected: boolean = false;
  public selectedUser: string = this.storageService.getItem('selectedUser')
    ? this.storageService.getItem('selectedUser')
    : null;
  public newMessagesCount: number = null; 
  public newMsg: Message

  constructor(
    private userService: UserService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (!this.storageService.getItem('selectedUser')) {
      this.activatedRoute.queryParams
        .subscribe(param => {
          if (param.user_id) {
            this.userService.getAllUsers(param.user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.selectUser(param.user_id);
                this.checkNewMessages()
              })
          } else {
            const user_id = this.storageService.getItem('selectedUser');
            this.userService.getAllUsers(user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.selectUser(user_id);
                this.checkNewMessages()
              })
          }
        })      
    } else {
      this.userService.getAllUsers(this.selectedUser)
        .subscribe((data: Team) => {
          this.users = data.team.users;
          this.checkNewMessages()
        })
      this.selectUser(this.selectedUser);
      this.router.navigateByUrl(`/main/${this.selectedUser}`)
    }
  }

  public hideOrShowContent() {
    this.hideUsers = !this.hideUsers
  }

  public selectUser(user_id: string) {
    this.userIsSelected = true;
    this.selectedUser = user_id;
    if (this.newMsg && this.newMsg.sender[0].id == user_id) {
      this.newMsg.isSeen = true;
      this.newMessagesCount = 0;
      this.messageService.setMessageSeen(this.newMsg)
        .subscribe(data => {
          console.log(data, "45585554")
        })
    }
    this.storageService.setItem('selectedUser', this.selectedUser);
    this.router.navigateByUrl(`/main/${this.selectedUser}`)
  }

  public checkNewMessages() {
    this.messageService.hasNewMessage.subscribe(newMsg => {
      if (newMsg) {
        this.newMsg = newMsg;
        this.newMessagesCount++;
      } else {
        
      }
    })
  }

}
