import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Message, WebWorkMessage } from 'src/app/models/message';
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
  public allMessages: Message[] = [];
  private message = new BehaviorSubject<any>(null);
  public newMessage = this.message.asObservable();
  private setEditor = new BehaviorSubject<any>(null);
  public editor = this.setEditor.asObservable();
  public params = {
    page: 1,
    limit: 10
  };

  constructor(
    private apiService: ApiService,
    private storageService: LocalStorageService,
    private socket: Socket
  ) { }

  public registerUser(userData: any) {
    this.socket.emit('register', userData);
  }

  public subscribeToSocketEvents(): any {
    return this.socket.fromEvent('privateChat')
      .pipe(map((data: any) => data));
  }

  public sendMessage(message: Message) {
    this.socket.emit("chatMessage", message);
  }

  public removeSocket(userData: any) {
    this.socket.emit('removeUser', userData);
  }

  public reconnectSocket(user_id: string | number, selectedUser: number | string) {
    const usersChannel = [user_id, selectedUser];
    usersChannel.sort();
  }

  public saveMessage(message: Message): Observable<Message> {
    return this.apiService.post(`/api/chat/send-message`, message)
  }

  public getMessageHistory(msgBody: Message, params: any): Observable<Message> {
    return this.apiService.get(`/api/chat/${msgBody.team_id}/${msgBody.sender}/${msgBody.receiver_id}?page=${params.page}&limit=${params.limit}`)
  }

  public setMessageProps(): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.selectedUser = this.storageService.getItem('selectedUser');
      this.messageBody.sender = +this.storageService.getItem('user_id');
      this.messageBody.receiver_id = this.selectedUser;
      this.messageBody.team_id = this.storageService.getItem('team_id');
      resolve(this.messageBody);
    });
  }

  public emitMsgCounts(count: number): void {
    this.socket.emit('msgCount', count);
  }

  public uploadFile(file: any): Observable<any> {
    return this.apiService.postFile(`/api/chat/uploadFile`, file);
  }

  public deleteUploadedFile(fileName: string): Observable<any> {
    return this.apiService.delete(`/api/chat/uploadedFile/${fileName}`);
  }

  public getUnseenMessages(team_id: string | number, user_id: string): Observable<any> {
    return this.apiService.get(`/api/chat/unseen/messages/${team_id}/${user_id}`);
  }

  public setMessageIsRead(team_id: string, user_id: string, sender_id: string): Observable<any> {
    return this.apiService.put(`/api/chat/messages/seen/${team_id}/${user_id}/${sender_id}`);
  }

  public setNewMessage(newMessage: any): void {
    this.message.next(newMessage);
  }

  public sendNotification(message: WebWorkMessage): Observable<any> {
    return this.apiService.postToWebWork('/chat-api/new-message', message)
  }

  public setFocus(editor: any) {
    this.setEditor.next(editor);
  }

}
