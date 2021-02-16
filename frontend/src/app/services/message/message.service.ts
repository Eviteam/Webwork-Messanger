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

  private newMessage = new BehaviorSubject<Message>(null);
  public hasNewMessage = this.newMessage.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: LocalStorageService,
    private socket: Socket
  ) { }

  public getMessage(user_id: number | string): any {
    return this.socket
        .fromEvent(`${user_id}`)
        .pipe(map((data) => data));
  }

  public sendMessage(message: Message): void {
    this.socket.emit(`chatMessage`, message);
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
      this.messageBody.sender = Number(this.user_id);
      this.messageBody.receiver_id = this.selectedUser;
      this.messageBody.team_id = this.team_id;
      resolve(this.messageBody)
    })
  }

  public getNewMessage(newMessage: Message): void {
    this.newMessage.next(newMessage); 
  }

  public setMessageSeen(msgBody: Message): Observable<string> {
    return this.apiService.post(`/api/chat/isSeen/${msgBody.team_id}/${msgBody.sender[0].id}/${msgBody.receiver_id}`)
  }

}
