import { Component, OnInit } from '@angular/core';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  /*CKEditor properties */
  public editor = ClassicEditorBuild;
  public ckEditorConfigs: Object = {
    toolbar: [ 'bold', 'italic', 'link', 'bulletedList', 'numberedList' ]
  };

  public message: string = '';
  public messageBody: Message = new Message();

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  public sendMessage(event: any): void {
    if (event.keyCode == 13 && this.message.length > 0) {
      if (!event.shiftKey && !event.altKey && !event.ctrlKey) {
        this.messageBody.message = this.message;
        console.log(this.messageBody, 'messageBody')
        this.messageService.saveMessage(this.messageBody)
          .subscribe((message: Message) => {
            this.message = '';
            this.messageService.sendMessage(message['data']);
            this.messageService.getMessage()
              .subscribe(msg => console.log(this.messageService.allMessages, "1"))
            console.log(message, "121121")
          })
      }
    }
  }

}
