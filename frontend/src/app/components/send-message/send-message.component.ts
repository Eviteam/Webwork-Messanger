import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
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
  public filePaths: Array<string | ArrayBuffer> = [];
  public uploadedFilePaths: Array<string | ArrayBuffer> = [];
  public formData: FormGroup

  constructor(
    private messageService: MessageService,
    private quillInitializeService: QuillInitializeService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      files: this.fb.array([])
    })
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  /**
   * Message typing function
   * @param event 
   * @returns void
   */
  public onKeyDown(event?: any) {
    if (event) {
      if (event.keyCode === 13) {
        if (!event.shiftKey && !event.altKey && !event.ctrlKey) {
          if (this.filePaths.length) {
            this.messageBody.filePath = this.filePaths
            this.messageBody.message = this.message;
            this.sendMessage(this.messageBody)
          } else {
            if (this.message && this.message.length) {
              this.messageBody.message = this.message;
              this.sendMessage(this.messageBody)
            }
          }
        }
      }
    } else {
      if (this.filePaths.length) {
        this.messageBody.filePath = this.filePaths;
        this.messageBody.message = this.message;
        this.sendMessage(this.messageBody)
      } else {
        if (this.message && this.message.length) {
          this.messageBody.message = this.message;
          this.sendMessage(this.messageBody)
        }
      }
    }
  }

  /**
   * Message sending function
   * @param messageBody 
   * @returns void
   */
  public sendMessage(messageBody: Message): void {
    messageBody.message = this.message;
    this.messageService.saveMessage(messageBody)
      .pipe(finalize(() => {
        this.filePaths = [];
        this.message = '';
        messageBody.filePath = []
      }))
      .subscribe((message: Message) => {
        this.messageService.sendMessage(message['data']);
      })
  }

  /**
   * File uploading function
   * @param fileList 
   * @returns void
   */
  public uploadFile(fileList: FileList) {
    if (fileList && fileList[0]) {
      this.messageService.uploadFile(fileList[0])
        .subscribe(data => this.uploadedFilePaths.push(data))
      Object.values(fileList).filter(item => {
        if (typeof (item) !== 'number') {
          const reader = new FileReader();
          reader.readAsDataURL(item);
          reader.onload = () => {
            this.formData.get('files').value.push(item);
            const safeSrc: SafeResourceUrl = this.sanitizer.bypassSecurityTrustHtml(reader.result.toString())
            this.filePaths.push(safeSrc['changingThisBreaksApplicationSecurity']);
          };
        }
      })
    }
  }

  /**
   * Deletes uploaded file
   * @param index 
   * @returns void
   */
  public deleteMessage(index: number) {
    this.filePaths.splice(index, 1);
    this.messageService.deleteUploadedFile(this.uploadedFilePaths[index]['fileData'].filename)
      .subscribe(data => this.uploadedFilePaths.splice(index, 1))
  }

  // convenience getter for easy access to form fields
  public get formValue() { return this.formData.controls; }

}
