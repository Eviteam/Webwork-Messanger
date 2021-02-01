import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  @ViewChild("ckEditorToolbar", {static: false}) public ckEditorToolbar: any

  /*CKEditor properties */
  public editor = ClassicEditorBuild;
  public ckEditorConfigs: CKEditor5.Config = {
    toolbar: [ 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload' ],
    ignoreEmptyParagraph: true,
    fillEmptyBlocks : false
  };

  public message: string = '';
  public messageBody: Message = new Message();

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  // TODO
  // ngAfterViewInit() {
  //   this.ckEditorToolbar.ready.subscribe((event) => {
  //     console.log(event.data.name)
  //   })
  // }

  public sendMessage(event?: any) {
    if (this.message.length) {
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

  // TODO
  // public onEditorChange(event: any): void {

  // }

}
