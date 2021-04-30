import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
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

  @ViewChild('userPart', {static: true}) public userPart: ElementRef;
  @ViewChild('newMessageEvent', {static: false}) public newMessageEvent: ElementRef;
  @Output() public newMessageInfo = new EventEmitter<any>();
  @Output() public newEventInfo = new EventEmitter<any>();
  @Output() public eventPosition = new EventEmitter<number>();

  constructor(
    private userService: UserService,
    private storageService: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private sideBarService: SidebarService
  ) { }

  ngOnInit(): void {
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
          this.messageIsRead = false;
          this.getUnseenMessages(newMessage?.team_id, newMessage?.receiver_id)
        }
      })
    // this.sideBarService.getEvent
    //   .subscribe(data => {
    //     if (data) {
    //       const msgInfo = {
    //         topHeight: null,
    //         bottomHeight: null,
    //         windowHeight: null,
    //         eventHeight: null
    //       };
    //       msgInfo.topHeight = this.userPart.nativeElement.getBoundingClientRect().top;
    //       msgInfo.bottomHeight = this.userPart.nativeElement.getBoundingClientRect().bottom;
    //       msgInfo.windowHeight = window.innerHeight;
    //       msgInfo.eventHeight = this.newMessageEvent.nativeElement.getBoundingClientRect().top;
    //       this.newMessageInfo.emit(msgInfo);
    //     }
    //   })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.userPart && this.newMessageEvent) {
        const msgInfo = {
          topHeight: null,
          bottomHeight: null,
          windowHeight: null,
          eventHeight: null
        };
        console.log(this.userPart.nativeElement.getBoundingClientRect().top, "top")
        console.log(this.userPart.nativeElement.getBoundingClientRect().bottom, "bottom")
        console.log(this.newMessageEvent.nativeElement.getBoundingClientRect().top, "event from top")
        console.log(window.innerHeight, "height");
        msgInfo.topHeight = this.userPart.nativeElement.getBoundingClientRect().top;
        msgInfo.bottomHeight = this.userPart.nativeElement.getBoundingClientRect().bottom;
        msgInfo.windowHeight = window.innerHeight;
        msgInfo.eventHeight = this.newMessageEvent.nativeElement.getBoundingClientRect().top;
        this.newEventInfo.emit(this.newMessageEvent)
        this.newMessageInfo.emit(msgInfo)
      }
    }, 2500);
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
        if (data.n > 0) {
          this.messageIsRead = true
        }
      })
      this.messageService.allMessages = [];
      this.messageService.params.page = 1;
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
            this.messageIsRead = false;
          }
        }
      })
  }

}
