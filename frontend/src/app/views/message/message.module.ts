import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ChatHistoryComponent } from '../../components/chat-history/chat-history.component';
import { SendMessageComponent } from '../../components/send-message/send-message.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: MessageComponent
  }
];

const BASE_URL = environment.BASE_URL

const config: SocketIoConfig = { url: BASE_URL, options: {} };

@NgModule({
  declarations: [
    MessageComponent,
    HeaderComponent,
    ChatHistoryComponent,
    SendMessageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    SocketIoModule.forRoot(config),
    FormsModule
  ],
  exports: [RouterModule]
})
export class MessageModule { }
