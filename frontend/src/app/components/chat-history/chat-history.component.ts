import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

// ChatHistoryComponent is the message history component
@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContent') private chatContent: ElementRef;
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;

  public currentUser: string;
  public selectedUser: string = this.storageService.getItem('selectedUser');
  public current_time: string;
  public newMessage: Message;
  public newMessageAdded: boolean = false;
  public unSeenMessages: Message[];
  public loader: boolean = false;
  public groupArrays: {
    date: string;
    messages: any;
  }[];
  public todayDate: string = moment().format("dddd, MMMM Do");
  public WEBWORK_BASE_URL = environment.WEBWORK_BASE_URL;
  public isSame: boolean;
  public isIcon: boolean;
  private subscribtion: Subscription;

  constructor(
    public messageService: MessageService, // property messageService is public because it is using in chat-history.component.html
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService,
    public sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(param => {
        this.storageService.setItem('selectedUser', param.id);
        this.messageService.setMessageProps()
          .then(data => this.getAllMessage(data, this.messageService.params))
          .then(() => {
            this.currentUser = this.storageService.getItem('user_id');
            const team_id = this.storageService.getItem('team_id');
            this.subscribtion = this.messageService.newMessage
              .subscribe(message => {
                if (message) {
                  this.newMessage = message;
                  this.newMessage.isSeen = true;
                    this.messageService.setMessageIsRead(team_id, this.storageService.getItem('user_id'), message.sender_id.toString())
                      .subscribe(data => data)

                  this.current_time = moment().format();
                  this.newMessage.createdAt = this.current_time;
                  this.messageService.allMessages.push(this.newMessage);
                  this.seperateMessagesByDate(this.messageService.allMessages);
                  this.newMessageAdded = true;
                  this.scrollToBottom();
                  this.messageService.setNewMessage(null)
                }
              })
          }).then(() => {
            this.router.events.subscribe(event => {
              if (event instanceof NavigationEnd) {
                this.subscribtion.unsubscribe()
              }
            })
          })
      })
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
        if (this.messageService.allMessages && !this.messageService.allMessages.length) {
          this.newMessageAdded = true
        }
        this.messageService.allMessages = data.concat(this.messageService.allMessages);
        this.seperateMessagesByDate(this.messageService.allMessages)
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
          this.messageService.setMessageProps()
            .then(data => this.getAllMessage(data, this.messageService.params))
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

  /**
   * Gets scroll event
   * @returns void
   */
  public onScroll(): void {
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

  /**
   * Seperates messages by date
   * @param allMessages 
   * @returns messages body by seperated date
   */
  public seperateMessagesByDate(allMessages: Message[]): any {
    const groups = allMessages.reduce((groups: any, message: Message) => {
      const date = moment(message.createdAt).format("dddd, MMMM Do");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    this.groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        messages: groups[date]
      };
    });
    if (this.groupArrays && this.groupArrays[0]) {
      this.convertImageSize(this.groupArrays[0].messages);
    }
  }

  /**
   * Converts image sizes
   * @param messages 
   * @returns void
   */
  public convertImageSize(messages: any): void {
    messages.map((item: { filePath: string[] }) => {
      if (item.filePath && item.filePath.length) {
        const reader = new FileReader();
        const blobFile = this.b64toBlob(item.filePath[0])
        const img = new Image;
        reader.readAsDataURL(blobFile);
        reader.onload = () => {
          img.src = reader.result.toString();
        }
        img.onload = () => {
          // if (img.width < 300 && img.height < 300) {
          //   return this.isIcon = true
          // }
          if (img.width > img.height) {
            this.isSame = false
          } else {
            this.isSame = true;
          }
        }
      }
    })
  }

  /**
   * Converting base64 to Blob
   * @param dataURI 
   * @returns Blob
   */
  public b64toBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  /**
   * Compares two dates
   * @param firstDate 
   * @param secondDate 
   * @returns true | false
   */
  public compareDates(firstDate: any, secondDate: any): Boolean {
    if (moment(firstDate).format('MMM d, y, h:mm a') === moment(secondDate).format('MMM d, y, h:mm a')) {
      return true
    } else {
      return false
    }
  }

}
