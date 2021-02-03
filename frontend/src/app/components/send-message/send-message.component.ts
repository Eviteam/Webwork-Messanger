import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { debounceTime } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, AfterViewInit {

  @ViewChild("ckEditorToolbar", { static: false }) public ckEditorToolbar: any

  /*CKEditor properties */
  public editor = ClassicEditorBuild;
  public ckEditorConfigs: CKEditor5.Config = {
    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload'],
    ignoreEmptyParagraph: false,
    fillEmptyBlocks: false,
    autoParagraph: true
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
  ngAfterViewInit() {
    this.ckEditorToolbar.change
      .pipe(debounceTime(5000))
      .subscribe((event) => {
        console.log(event)
      })
  }

  public sendMessage(event?: any) {
    // this.ckEditorToolbar.change
    //   .pipe(debounceTime(5000))
    //   .subscribe((e) => {
        // if (event.code === "Enter") {
        //   console.log(event);
        //   return false
        // }
      // })
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

}
