import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {finalize} from 'rxjs/operators';
import { Message, WebWorkMessage } from 'src/app/models/message';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { MessageService } from 'src/app/services/message/message.service';
import { QuillInitializeService } from 'src/app/services/quill-Initialize/quill-initialize.service';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, AfterViewInit, OnDestroy {

  public message = '';
  public messageBody: Message = new Message();
  public filePaths: Array<string | ArrayBuffer> = [];
  public uploadedFilePaths: Array<string | ArrayBuffer> = [];
  public formData: FormGroup;
  public uploadedFileType: SafeResourceUrl;
  public selectedUser: string;
  public currentUser: string;
  public tooltipFromLeft = false;
  public loader = false;
  private subscription: Subscription;
  @ViewChild('editor', { static: false }) public editor: any

  constructor(
    private messageService: MessageService,
    private quillInitializeService: QuillInitializeService,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer, // property sanitizer is public because it is using in send-message.component.html
    private storageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      files: this.fb.array([])
    });
    this.messageService.setMessageProps().then(data => this.messageBody = data);
    this.userService.isSeen
      .subscribe(data => this.message = '');
  }

  async ngAfterViewInit() {
    await this.removeUnnecessaryWhiteSpaces();
  }

  public async removeUnnecessaryWhiteSpaces(setNull?: boolean) {

    const quills = [];
    // @ts-ignore
    [...document.getElementsByClassName('quillEditor')].forEach((el, idx) => {
      // this.editor.selectionChangeHandler = (range, oldRange, source) => {
      //   console.log(range, oldRange, source, "3632184132")
      //   if (setNull) {
      //     oldRange = range;
      //     range = null;
      //   }
        if (this.editor.quillEditor) {
          const delta = this.editor.quillEditor.getContents();

          let leadingFixed = false;
          let newDelta = [];
          let tempDelta = [];
          let newLine = null;

          if (delta.ops.length === 2 && delta.ops[1].insert) {
            newLine = delta.ops[1];
          }
          if (delta.ops.length === 1) {
            // If there is only one entry, check if it's a string and trim leading and ending LF
            let { insert, attributes } = delta.ops[0];
            if (typeof (insert) === 'string') {
              insert = insert.replace(/^\n+|\n+$/g, '');
            }
            newDelta = [{ insert, attributes }];
          } else {
            // Else go through all the insert entries
            delta.ops.forEach(({ insert, attributes }, idx) => {
              // Create a boolean to indicate if we're at the last entry
              const isLast = idx === delta.ops.length - 1;

              // If the entry is a string (not image/asset)
              if (typeof (insert) === 'string') {
                // If we haven't fixed the leading
                if (!leadingFixed) {
                  // If the entry begins with LFs
                  if (/^\n+/.test(insert)) {
                    // Create a string with clean leading LFs
                    const cleanText = insert.replace(/^\n+/, '');
                    // If there is text after cleaning the LFs
                    if (cleanText.length > 0) {
                      // Add the text to the newDelta
                      newDelta.push({
                        insert: cleanText,
                        attributes,
                      });
                      console.log(newDelta, '9')
                      // Set leading flag to indicate we've fixed the leading
                      leadingFixed = true;
                    }
                    // Else if the entry does not start with LFs
                  } else {
                    // If the entry does not begin with LFs
                    // Add any pending entries that may exists in tempDelta to the newDelta
                    newDelta = newDelta.concat(tempDelta);
                    // Add the existing entry
                    newDelta.push({
                      insert,
                      attributes
                    });
                    // Clean the any pending entries
                    tempDelta = [];
                    // And set the leading flag to indicate we've fixed the leading
                    leadingFixed = true;
                  }
                  // Else if we have fixed the leading
                } else {
                  // If there an entry with ending LFs
                  if (/\n+$/.test(insert)) {
                    // Create a string with clean ending LFs
                    const cleanText = insert.replace(/\n+$/, '');

                    // If this is the last entry
                    if (isLast) {
                      // If there is text after cleaning the LFs
                      if (cleanText.length > 0) {
                        // Add any pending entries that may exists in tempDelta to the newDelta
                        newDelta = newDelta.concat(tempDelta);
                        // Add the cleaned entry
                        newDelta.push({
                          insert: cleanText,
                          attributes
                        });
                      }
                      // Else if this is not the last entry
                    } else {
                      // If there is text after cleaning the LFs
                      if (cleanText.length > 0) {
                        // Add any pending entries that may exists in tempDelta to the newDelta
                        newDelta = newDelta.concat(tempDelta);
                        // Add the existing entry
                        newDelta.push({
                          insert,
                          attributes
                        });
                        // Clean the any pending entries
                        tempDelta = [];
                        // Else if there is no text after cleaning the LFs
                      } else {
                        // Add the entry to the temp deltas so to use them later if its needed
                        tempDelta.push({ insert, attributes });
                      }
                    }
                    // Else if the entry does not end with LFs
                  } else {
                    // Add any pending entries that may exists in tempDelta to the newDelta
                    newDelta = newDelta.concat(tempDelta);
                    // Add the existing entry
                    newDelta.push({
                      insert,
                      attributes
                    });
                    // Clean the any pending entries
                    tempDelta = [];
                  }
                }
                // If the entry is not a string
              } else {
                // Then all leading text/line feeds have been cleared if there were any
                // so, it's safe to set the leading flag
                leadingFixed = true;
                // Add any pending entries that may exists in tempDelta to the newDelta
                newDelta = newDelta.concat(tempDelta);
                // Add the existing entry
                newDelta.push({
                  insert,
                  attributes
                });
                // Clean the any pending entries
                tempDelta = [];
              }
            });

          }
          newDelta.map(item => {
            if (item.index % 2 !== 0 && item.insert === '\n' && newDelta[newDelta.length - 1].insert !== '\n') {
              newDelta.push(item);
            }
          });
          if (newDelta.length === 1 && newLine) {
            newDelta.push(newLine);
          }
          this.editor.quillEditor.setContents(newDelta);
          this.message = this.editor.quillEditor.scrollingContainer.innerHTML;
        }
      // }
      //
        quills.push(this.editor);
    });
    return this.message;
    // [...this.editor['elementRef'].nativeElement as HTMLDivElement].forEach((el, idx) => {
    //   console.log(idx, el);
    // })
  }

  public setFocus(editor: any) {

    this.messageService.setFocus(editor);
    editor.focus();
  }

  onFocus(): string {
    if (this.message.includes('<br>')) {
      this.message = '';
    }
    return this.message;
  }

  public async onBlur() {
    await this.removeUnnecessaryWhiteSpaces(true);
  }

  /**
   * Message typing function
   * @param event
   * @returns void
   */
  public onKeyDown(event?: any) {
    if (!this.message?.length && event.code === 'Space') {
      return false;
    }
    (this.message && this.message.length <= 48) ? this.tooltipFromLeft = true : this.tooltipFromLeft = false;
    if (event) {
      if (event.keyCode === 13) {
        if (!event.shiftKey && !event.altKey && !event.ctrlKey) {
          this.loader = true;
          if (this.filePaths.length) {
            this.messageBody.filePath = this.filePaths;
            this.messageBody.message = this.message;
            this.sendMessage(this.messageBody);
          } else {
            if (this.message && this.message.length) {
              this.messageBody.message = this.message;
              if (this.message.replace(/<(.|\n)*?>/g, '').length) {
                this.sendMessage(this.messageBody);
              }
            }
          }
        }
      }
    } else {
      if (this.filePaths.length) {
        this.messageBody.filePath = this.filePaths;
        this.messageBody.message = this.message;
        this.sendMessage(this.messageBody);
      } else {
        if (this.message && this.message.length) {
          this.messageBody.message = this.message;
          if (this.message.replace(/<(.|\n)*?>/g, '').length) {
            this.sendMessage(this.messageBody);
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
  public sendMessage(messageBody: Message) {

    this.onBlur().then(() => {
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
              this.messageService.getUnseenMessages(message['data'].team_id, message['data'].receiver_id)
                .toPromise()
                .then(messageCount => {
                  const data = messageCount;
                  delete data.team_id;
                  const count = Object.values(data).reduce((a: number, b: number) => a + b, 0);
                  this.messageService.emitMsgCounts(+count);
                })
            }))
          this.messageService.sendMessage(message['data']);
        })
    });
  }

  /**
   * File uploading function
   * @param fileList
   * @returns void
   */
  public uploadFile(fileList: FileList) {
    if (fileList && fileList[0]) {
      this.messageService.uploadFile(fileList[0])
        .subscribe(data => this.uploadedFilePaths.push(data));
      Object.values(fileList).filter(item => {
        if (typeof (item) !== 'number') {
          const reader = new FileReader();
          reader.readAsDataURL(item);
          reader.onload = () => {
            this.uploadedFileType = item.type;
            this.formData.get('files').value.push(item);
            this.setSafeSvgFormat(reader.result);
          };
        }
      });
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
      });
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
      const base64File = message.filePath.toString();
      const base64ContentArray = base64File.split(',');
      const mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
      mimeType.includes('image') ? messageForWebwork.attachment = 'image' : messageForWebwork.attachment = 'file';
    }
    messageForWebwork.fullName = `${message.sender[0].firstname} ${message.sender[0].lastname}`;
    this.messageService.getUnseenMessages(0, message.receiver_id)
      .toPromise()
      .then(messageCount => messageForWebwork.messageCount = messageCount.messageCount)
      .then(() => {
        if (messageForWebwork.messageCount) {
          this.messageService.sendNotification(messageForWebwork)
            .subscribe(data => data);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // convenience getter for easy access to form fields
  public get formValue() { return this.formData.controls; }

}
