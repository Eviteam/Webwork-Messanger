import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

// ChatHistoryComponent is the message history component
@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContent') private chatContent: ElementRef;
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;

  public currentUser: string = this.storageService.getItem('user_id');
  public selectedUser: string = this.storageService.getItem('selectedUser');
  public current_time: string;
  public newMessage: Message;
  public newMessageAdded: boolean = false;
  public unSeenMessages: Message[];
  public loader: boolean = false;

  constructor(
    public messageService: MessageService, // property messageService is public because it is using in chat-history.component.html
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getUrlParameter().then(param => {
      this.messageService.getMessage(param)
        .subscribe((data: Message): void => {
          this.selectedUser = this.storageService.getItem('selectedUser');
          const team_id = this.storageService.getItem('team_id')
          if ((data.sender_id.toString() == this.selectedUser && data.room == this.storageService.getItem('user_id')
              || data.sender_id.toString() == this.storageService.getItem('user_id') && data.room == this.selectedUser)
              && data.team_id == team_id) {
            this.newMessage = data;
            if (this.newMessage.sender_id == +this.selectedUser) {
              this.newMessage.isSeen = true;
              this.messageService.setMessageIsRead(team_id, this.storageService.getItem('user_id'), data.sender_id.toString())
                .subscribe(data => data)
            }
            this.current_time = moment().format();
            this.newMessage.createdAt = this.current_time;
            this.messageService.allMessages.push(this.newMessage);
            this.newMessageAdded = true;
            this.scrollToBottom();
          } else {
            this.messageService.getNewMessage(data)
          }
        })
    });
  }

  ngAfterViewChecked(): void {
    if (this.newMessageAdded) {
      this.scrollToBottom();
      this.newMessageAdded = false;
    }
  }

  /** 
   * Listen to socket for get all messages
   * @param messageBody 
   * @returns void
   */
  public getAllMessage(messageBody: Message, params: any): void {
    this.messageService.getMessageHistory(messageBody, params)
      .subscribe((data: any): void => {
        if (!this.messageService.allMessages.length) {
          this.newMessageAdded = true
        }
        this.messageService.allMessages = data.concat(this.messageService.allMessages);
      })
  }

  /**
   * Gets parameter from URL for get selected user's all message data
   * @returns user_id
   */
  public getUrlParameter(): Promise<number> {
    return new Promise((res, rej) => {
      this.activatedRoute.params
        .subscribe(param => {
          this.storageService.setItem('selectedUser', param.id);
          this.messageService.setMessageProps().then(data => this.getAllMessage(data, this.messageService.params))
          res(param.id)
        },
          err => rej(err))
    })
  }

  /**
   * Scrolls to bottom in message content
   * @returns void
   */
  public scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch (err) { }
  }

  public onScroll() {
    this.messageService.setMessageProps()
      .then(props => {
        this.loader = true;
        this.messageService.params.page = this.messageService.params.page + 1;
        this.getAllMessage(props, this.messageService.params)
      })
      .finally(() => this.loader = false)
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();
  }

}
