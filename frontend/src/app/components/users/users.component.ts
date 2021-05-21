import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  public hideUsers: boolean = false;
  public user_id: string;
  public team_id: string;
  public users: User[];
  public userIsSelected: boolean = false;
  public selectedUser: string = this.storageService.getItem('selectedUser')
    ? this.storageService.getItem('selectedUser')
    : null;
  public userMessages: any;
  public unreadMessageCount: any;
  public messageIsRead: boolean = false;
  public WEBWORK_BASE_URL = environment.WEBWORK_BASE_URL;
  public isHovered: boolean = false;
  public isTopHovered: boolean = false;
  public isChanged: boolean = false;
  private subscription: Subscription;

  @ViewChild('userPart', { static: false }) public userPart: ElementRef;
  @ViewChildren('newMessageEvent') public newMessageEvent: QueryList<'newMessageEvent'>;
  @Output() public newMessageInfo = new EventEmitter<any>();
  @Output() public newEventInfo = new EventEmitter<any>();
  @Output() public eventPosition = new EventEmitter<number>();

  constructor(
    private userService: UserService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userService.isSeen
      .subscribe(data => this.messageIsRead = data)
    this.team_id = this.storageService.getItem('team_id');
    this.user_id = this.storageService.getItem('user_id');
    const selectedUser = this.storageService.getItem('selectedUser');
    this.getUnseenMessages(this.team_id, this.user_id);
    if (!selectedUser) {
      this.activatedRoute.queryParams
        .subscribe(param => {
          if (param.user_id) {
            this.userService.getAllUsers(param.user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.storageService.setItem('team_id', data.team.team_id)
                this.selectUser(param.user_id)
              })
          } else {
            this.userService.getAllUsers(this.user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.storageService.setItem('team_id', data.team.team_id)
                this.selectUser(this.user_id)
              })
          }
        })
    } else {
      this.userService.getAllUsers(this.user_id)
        .subscribe((data: Team) => {
          this.users = data.team.users;
          this.storageService.setItem('team_id', data.team.team_id);
          const userIds = data.team.users.map(user => user.id);
          if (!userIds.includes(+selectedUser)) {
            this.selectUser(this.user_id)
          }
        })
      this.selectUser(selectedUser);
    }
    this.messageService.newMessage
      .subscribe(newMessage => {
        if (newMessage) {
          this.userService.setMessageIsRead(false);
          if (this.storageService.getItem('user_id') == newMessage.receiver_id) {
            this.getUnseenMessages(newMessage?.team_id, newMessage?.receiver_id)
          }
        }
      })
  }

  ngAfterViewInit(): void {
    this.subscription = this.newMessageEvent.changes
      .pipe(take(1))
      .subscribe(change => {
        this.setToTopUnseenMessages();
      })
  }

  public setToTopUnseenMessages(): void {
      this.newMessageEvent['_results'].map(item => {
        const new_users = this.users
        const single_user = this.users.splice(item.nativeElement.id, 1)
        new_users.unshift(single_user[0]);
    })
  }

  public hideOrShowContent(): void {
    this.hideUsers = !this.hideUsers
  }

  public selectUser(user_id: string, index?: number, select?: boolean): void {
    const currentUser = this.storageService.getItem('user_id');
    const selected = this.storageService.getItem('selectedUser');
    if (select) {
      this.messageService.removeSocket(currentUser, selected);
    }
    this.userIsSelected = true;
    this.selectedUser = user_id;
    this.storageService.setItem('selectedUser', this.selectedUser);
    this.team_id = this.storageService.getItem('team_id');
    this.messageService.editor.subscribe(editor => {
      if (editor) {
        editor.focus()
      }
    })
    this.messageService.setMessageIsRead(this.team_id, this.user_id, this.selectedUser)
      .subscribe(data => {
        if (this.userMessages && this.userMessages.includes(this.selectedUser.toString())) {
          this.userMessages.splice(this.userMessages.indexOf(this.selectedUser.toString()), 1);
        }
        if (data.n > 0) {
          this.userService.setMessageIsRead(true);
        }
      })
    this.messageService.allMessages = [];
    this.messageService.params.page = 1;
    if (!index) {
      this.isTopHovered = false
    }
    this.messageService.reconnectSocket(currentUser, this.selectedUser)
    this.router.navigateByUrl(`/main/${this.selectedUser}`)
  }

  public getUnseenMessages(team_id: string, user_id: string): void {
    const current_team = this.storageService.getItem('team_id')
    this.messageService.getUnseenMessages(team_id, user_id)
      .subscribe(data => {
        if (team_id == current_team) {
          this.userMessages = Object.keys(data);
          this.unreadMessageCount = data;
          if (this.unreadMessageCount) {
            this.userService.setMessageIsRead(false);
          }
        }
      })
  }

  /**
   * Hovers first user
   * @param index 
   * @param isTopHovered 
   * @returns void
   */
  public hoverUser(index: number, isHovered: boolean): void {
    const element = document.getElementById(index.toString())
    if (element.scrollWidth > element.clientWidth) {
      !index ? this.isTopHovered = isHovered : this.isHovered = isHovered;
    }
  }

}
