import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { Message, WebWorkMessage } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
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
  public formData: FormGroup;
  public uploadedFileType: SafeResourceUrl;
  public selectedUser: string;
  public currentUser: string;
  public tooltipFromLeft: boolean = false;

  constructor(
    private messageService: MessageService,
    private quillInitializeService: QuillInitializeService,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer, // property sanitizer is public because it is using in send-message.component.html
    private storageService: LocalStorageService
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
    (this.message && this.message.length <= 48) ? this.tooltipFromLeft = true : this.tooltipFromLeft = false
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
    this.currentUser = this.storageService.getItem('selectedUser');
    messageBody.message = this.message;
    this.messageService.saveMessage(messageBody)
      .pipe(finalize(() => {
        this.filePaths = [];
        this.message = '';
        messageBody.filePath = []
      }))
      .subscribe((message: Message) => {
        message['data'].room = this.storageService.getItem('selectedUser');
        message['data'].sender_id = this.storageService.getItem('user_id');
        this.messageService.sendMessage(message['data']);
        this.sendMessageNotification(message['data'])
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
            this.uploadedFileType = item.type;
            this.formData.get('files').value.push(item);
            this.setSafeSvgFormat(reader.result)
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

  /**
   * Setting svg format file to safely
   * @param file
   * @returns void
   */
  public setSafeSvgFormat(file: string | ArrayBuffer): void {
    this.uploadedFileType = this.sanitizer.bypassSecurityTrustUrl(file.toString());
    this.filePaths.push(this.uploadedFileType['changingThisBreaksApplicationSecurity']);
  }

  /**
   * Sends notification to webwork
   * @param message 
   * @returns void
   */
  public sendMessageNotification(message: Message): void {
    const messageForWebwork: WebWorkMessage = new WebWorkMessage;
    messageForWebwork.sender_id = message.sender_id;
    messageForWebwork.receiver_id = message.receiver_id;
    messageForWebwork.team_id = message.team_id;
    messageForWebwork.message = message.message.replace(/(<([^>]+)>)/g,'');
    messageForWebwork.fullName = `${message.sender[0].firstname} ${message.sender[0].lastname}`;
    this.messageService.getUnseenMessages(message.team_id.toString(), message.receiver_id)
      .toPromise()
      .then(messageCount => messageForWebwork.messageCount = messageCount)
      .then(() => {
        this.messageService.sendNotification(messageForWebwork)
          .subscribe(data => console.log(data, "45445"))
      })
  }

  // convenience getter for easy access to form fields
  public get formValue() { return this.formData.controls; }

}
