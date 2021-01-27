import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit {

  public currentUser: string = this.storageService.getItem('user_id');
  public current_time: string;
  public newMessage: Message;
  public today_date: string = moment().calendar();
  public current_date: string = moment().format('MM/DD/YYYY');

  constructor(
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getUrlParameter();
    this.messageService.getMessage()
      .subscribe(data => {
        this.newMessage = data;
        this.current_time = moment().format();
        this.newMessage.createdAt = this.current_time;
        this.messageService.allMessages.push(this.newMessage);
        this.checkMessageDate(this.messageService.allMessages)
      })
  }

  public getAllMessage(messageBody: Message): void {
    this.messageService.getMessageHistory(messageBody)
      .subscribe((data: any) => {
        this.messageService.allMessages = data;
        this.checkMessageDate(this.messageService.allMessages)
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

  public checkMessageDate(allMessages: Message[]) {
    allMessages.map(message => {
      if (moment(message.createdAt).format('MM/DD/YYYY') === this.current_date) {
        message.isToday = true
      }
    })
  }

}
