import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
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

  public hideUsers = false;
  public user_id: string;
  public team_id: string;
  public users: User[];
  public userIsSelected: boolean = false;
  public selectedUser: string = this.storageService.getItem('selectedUser')
    ? this.storageService.getItem('selectedUser')
    : null;
  public userMessages: any;
  public unreadMessageCount: any;
  public messageIsRead = false;
  public WEBWORK_BASE_URL = environment.WEBWORK_BASE_URL;
  public isHovered: boolean = false;
  public isTopHovered: boolean = false;
  public isChanged: boolean = false;
  public searchName = '';
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
                this.storageService.setItem('team_id', data.team.team_id);
                this.selectUser(param.user_id)
              })
          } else {
            this.userService.getAllUsers(this.user_id)
              .subscribe((data: Team) => {
                this.users = data.team.users;
                this.storageService.setItem('team_id', data.team.team_id);
                this.selectUser(this.user_id);
              });
          }
        })
    } else {
      this.userService.getAllUsers(this.user_id)
        .subscribe((data: Team) => {
          this.users = data.team.users;
          this.storageService.setItem('team_id', data.team.team_id);
          const userIds = data.team.users.map(user => user.id);
          if (!userIds.includes(+selectedUser)) {
            this.selectUser(this.user_id);
          }
        });
      this.selectUser(selectedUser);
    }
    const userData = {
      user_id: this.storageService.getItem('user_id'),
      team_id: this.storageService.getItem('team_id'),
    };
    this.messageService.registerUser(userData);

    //subscribe to socket events
    this.messageService.subscribeToSocketEvents()
      .subscribe((data: Message) => {
        this.newMessageSocketEvent(data);
      });

  }

  public newMessageSocketEvent(message: Message): void {

    const currentUserId = this.storageService.getItem('user_id');
    const selectedUserId = this.storageService.getItem('selectedUser'); //@todo fix name
    const teamId = this.storageService.getItem('team_id');

    if (message?.team_id != teamId) {
      return;
    }

    //got new message - needs to show notifications and things to attract attention
    //if its not the selected user
    if (message.sender_id != +selectedUserId) {
      this.userService.setMessageIsRead(false);
      if (currentUserId == message.receiver_id) {
        this.getUnseenMessages(message?.team_id, message?.receiver_id);
      }
    }


    //if now in that chat window, ask chat component to show that message
    if ((message.sender_id == +currentUserId && message.receiver_id == selectedUserId)
      || (message.sender_id == +selectedUserId && message.receiver_id == currentUserId)) {
      this.messageService.setNewMessage(message);
    }
  }

  ngAfterViewInit(): void {
    this.subscription = this.newMessageEvent.changes
      .pipe(take(1))
      .subscribe(change => {
        // this.setToTopUnseenMessages();
      })
  }

  public setToTopUnseenMessages(): void {
    this.newMessageEvent['_results'].map(item => {
      const new_users = this.users;
      const single_user = this.users.splice(item.nativeElement.id, 1)
      new_users.unshift(single_user[0]);
    });
  }

  public hideOrShowContent(): void {
    this.hideUsers = !this.hideUsers;
  }

  public selectUser(user_id: string, index?: number, select?: boolean): void {
    if (select) {
      this.messageService.setNewMessage(null);
      const current_team = this.storageService.getItem('team_id');
      const current_user = this.storageService.getItem('user_id');
      this.getUnseenMessages(current_team, current_user)
    }
    this.userIsSelected = true;
    this.selectedUser = user_id;
    this.storageService.setItem('selectedUser', this.selectedUser);
    this.team_id = this.storageService.getItem('team_id');
    this.messageService.editor.subscribe(editor => {
      if (editor) {
        editor.focus();
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
      this.isTopHovered = false;
    }
    this.router.navigateByUrl(`/main/${this.selectedUser}`)
  }

  public getUnseenMessages(team_id: string | number, user_id: string): void {
    const current_team = this.storageService.getItem('team_id');
    this.messageService.getUnseenMessages(team_id, user_id)
      .subscribe(data => {
        if (team_id == current_team) {
          this.userMessages = Object.keys(data);
          this.unreadMessageCount = data;
          delete data.team_id;
          const count = Object.values(data).reduce((a: number, b: number) => a + b, 0);
          this.messageService.emitMsgCounts(+count);
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
    const element = document.getElementById(index.toString());
    if (element.scrollWidth > element.clientWidth) {
      !index ? this.isTopHovered = isHovered : this.isHovered = isHovered;
    }
  }

}
