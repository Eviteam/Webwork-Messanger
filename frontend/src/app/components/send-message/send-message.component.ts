import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class SendMessageComponent implements OnInit, OnDestroy {

  public message: string = '';
  public messageBody: Message = new Message();
  public filePaths: Array<string | ArrayBuffer> = [];
  public uploadedFilePaths: Array<string | ArrayBuffer> = [];
  public formData: FormGroup;
  public uploadedFileType: SafeResourceUrl;
  public selectedUser: string;
  public currentUser: string;
  public tooltipFromLeft: boolean = false;
  public loader: boolean = false;
  private subscription: Subscription;
  @ViewChild('editor', {static: false}) public editor: ElementRef

  constructor(
    private messageService: MessageService,
    private quillInitializeService: QuillInitializeService,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer, // property sanitizer is public because it is using in send-message.component.html
    private storageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      files: this.fb.array([])
    })
    this.messageService.setMessageProps().then(data => this.messageBody = data);
  }

  public setFocus(editor: any) {
    this.messageService.setFocus(editor);
    editor.focus();
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
          this.loader = true
          if (this.filePaths.length) {
            this.messageBody.filePath = this.filePaths
            this.messageBody.message = this.message;
            this.sendMessage(this.messageBody)
          } else {
            if (this.message && this.message.length) {
              this.messageBody.message = this.message;
              if (this.message.replace(/<(.|\n)*?>/g, '').length) {
                this.sendMessage(this.messageBody)
              }
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
          if (this.message.replace(/<(.|\n)*?>/g, '').length) {
            this.sendMessage(this.messageBody)
          }
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
    this.message = '';
    this.messageService.saveMessage(messageBody)
      .pipe(
        finalize(() => {
          this.filePaths = [];
          this.message = '';
          messageBody.filePath = [];
          this.formValue.files.setValue([]);
          this.loader = false;
        }))
      .subscribe((message: Message) => {
        this.subscription = this.activatedRoute.params
          .subscribe((param => {
            message['data'].room = param.id;
            message['data'].sender_id = this.storageService.getItem('user_id');
            if (message['data'].sender_id != message['data'].room) {
              this.sendMessageNotification(message['data'])
            }
          }))
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
      .subscribe(data => {
        this.uploadedFilePaths.splice(index, 1);
        if (!this.uploadedFilePaths.length) {
          this.formValue.files.setValue([]);
        }
      })
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
    messageForWebwork.message = message.message;
    if (message.filePath && message.filePath.length) {
      const base64File = message.filePath.toString()
      const base64ContentArray = base64File.split(",");
      const mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
      mimeType.includes('image') ? messageForWebwork.attachment = 'image' : messageForWebwork.attachment = 'file'
    }
    messageForWebwork.fullName = `${message.sender[0].firstname} ${message.sender[0].lastname}`;
    this.messageService.getUnseenMessages(0, message.receiver_id)
      .toPromise()
      .then(messageCount => messageForWebwork.messageCount = messageCount.messageCount)
      .then(() => {
        if (messageForWebwork.messageCount) {
          this.messageService.sendNotification(messageForWebwork)
            .subscribe(data => data)
        }
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // convenience getter for easy access to form fields
  public get formValue() { return this.formData.controls; }

}
