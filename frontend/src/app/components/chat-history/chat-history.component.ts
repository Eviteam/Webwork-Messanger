import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import moment from 'moment';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContent') private chatContent: ElementRef;

  public currentUser: string = this.storageService.getItem('user_id');
  public current_time: string;
  public newMessage: Message;
  public newMessageAdded: boolean = false;

  constructor(
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getUrlParameter();
    this.messageService.getMessage()
      .subscribe((data: Message): void => {
        this.newMessage = data;
        this.current_time = moment().format();
        this.newMessage.createdAt = this.current_time;
        this.messageService.allMessages.push(this.newMessage);
        this.newMessageAdded = true;
        this.scrollToBottom();
      })
  }

  ngAfterViewChecked(): void {
    if (this.newMessageAdded) {
      this.scrollToBottom();
      this.newMessageAdded = false;
    }
  }

  public getAllMessage(messageBody: Message): void {
    this.messageService.getMessageHistory(messageBody)
      .subscribe((data: any): void => {
        this.messageService.allMessages = data;
        this.newMessageAdded = true;
      })
  }

  public getUrlParameter(): Promise<number> {
    return new Promise((res, rej) => {
      this.activatedRoute.params
        .subscribe(param => {
          this.storageService.setItem('selectedUser', param.id);
          this.messageService.setMessageProps().then(data => this.getAllMessage(data))
          res(param.id)
        })
    })
  }

  public scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

}
