import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, AfterViewInit {

  @ViewChild("ckEditorToolbar", {static: false}) public ckEditorToolbar: any

  /*CKEditor properties */
  public editor = ClassicEditorBuild;
  public ckEditorConfigs: Object = {
    toolbar: [ 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload' ]
  };

  public message: string = '';
  public messageBody: Message = new Message();

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  ngAfterViewInit() {
    console.log(this.ckEditorToolbar.getCommand);
    this.ckEditorToolbar.ready.subscribe((event) => {
      console.log(event)
    })
  }

  public sendMessage(event?: any): void {
    if (this.message.length) {
      if (event) {
        if (event.keyCode == 13 && this.message.length > 0) {
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

  public onEditorChange(event: any): void {
    console.log(this.editor)
    console.log(event.event.source, "event")
  }

}
