import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/models/message';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messageBody: Message = new Message();
  public user_id: string = this.storageService.getItem('user_id');
  public team_id: string = this.storageService.getItem('team_id');
  public selectedUser: string;
  public allMessages: Message;

  constructor(
    private apiService: ApiService,
    private storageService: LocalStorageService,
    private socket: Socket
  ) { }

  public getMessage(): any {
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
      this.messageBody.sender = Number(this.user_id);
      this.messageBody.receiver_id = this.selectedUser;
      this.messageBody.team_id = this.team_id;
      resolve(this.messageBody)
    })
  }

}
