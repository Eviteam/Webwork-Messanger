import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messageBody: Message = new Message();
  public user_id: string = this.storageService.getItem('user_id');
  public team_id: string = this.storageService.getItem('team_id');
  public selectedUser: string;
  public allMessages: Message[];
  private message = new BehaviorSubject<any>(null);
  public newMessage = this.message.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: LocalStorageService,
    private socket: Socket
  ) { }

  public getMessage(user_id: string | number): any {
    // this.socket.emit('join', user_id)
    return this.socket
        .fromEvent("chatMessage")
        .pipe(map((data) => data));
  }

  public sendMessage(message: Message) {
    this.socket.emit("chatMessage", message);
  }

  public saveMessage(message: Message): Observable<Message> {
    return this.apiService.post(`/api/chat/send-message`, message)
  }

  public getMessageHistory(msgBody: Message): Observable<Message> {
    return this.apiService.get(`/api/chat/${msgBody.team_id}/${msgBody.sender}/${msgBody.receiver_id}`)
  }

  public setMessageProps(): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.selectedUser = this.storageService.getItem('selectedUser');
      this.messageBody.sender = +this.storageService.getItem('user_id');
      this.messageBody.receiver_id = this.selectedUser;
      this.messageBody.team_id = this.storageService.getItem('team_id');
      resolve(this.messageBody)
    })
  }

  public uploadFile(file: any): Observable<any> {
    return this.apiService.postFile(`/api/chat/uploadFile`, file)
  }

  public deleteUploadedFile(fileName: string): Observable<any> {
    return this.apiService.delete(`/api/chat/uploadedFile/${fileName}`)
  }

  public getUnseenMessages(team_id: string, user_id: string): Observable<any> {
    return this.apiService.get(`/api/chat/unseen/messages/${team_id}/${user_id}`)
  }

  public setMessageIsRead(team_id: string, user_id: string, sender_id: string): Observable<any> {
    return this.apiService.post(`/api/chat/messages/seen/${team_id}/${user_id}/${sender_id}`)
  }

  public getNewMessage(newMessage: any): void {
    this.message.next(newMessage); 
  }

}
