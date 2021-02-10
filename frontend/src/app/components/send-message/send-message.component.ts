import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message/message.service';
import { QuillInitializeService } from 'src/app/services/quill-Initialize/quill-initialize.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  public message: string = '';
  public messageBody: Message = new Message();

  constructor(
    private messageService: MessageService,
    private quillInitializeService: QuillInitializeService
  ) { }

  ngOnInit(): void {
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  /**
   * Message sending function
   * @param event 
   * @returns void
   */
  public sendMessage(event?: any) {
    if (this.message && this.message.length) {
      if (event) {
        if (event.keyCode === 13) {
          if (!event.shiftKey && !event.altKey && !event.ctrlKey) {
            this.messageBody.message = this.message;
            this.messageService.saveMessage(this.messageBody)
              .subscribe((message: Message) => {
                this.message = '';
                this.messageService.sendMessage(message['data']);
              })
          }
        }
      } else {
        this.messageBody.message = this.message;
        this.messageService.saveMessage(this.messageBody)
          .subscribe((message: Message) => {
            this.message = '';
            this.messageService.sendMessage(message['data']);
          })
      }
    }
  }

}
