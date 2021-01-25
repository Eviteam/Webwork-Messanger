import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit {

  public currentUser: string = this.storageService.getItem('user_id')

  constructor(
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getUrlParameter()
  }

  public getAllMessage(messageBody: Message): void {
    this.messageService.getMessageHistory(messageBody)
      .subscribe((data: Message) => {
        this.messageService.allMessages = data;
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

}
