import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
// import { MessageComponent } from './message/message.component';
import { ChannelsComponent } from './channels/channels.component';
import { UsersComponent } from './users/users.component';
// import { ChatHistoryComponent } from './chat-history/chat-history.component';
// import { HeaderComponent } from './header/header.component';
// import { SendMessageComponent } from './send-message/send-message.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

const BASE_URL = environment.BASE_URL

const config: SocketIoConfig = { url: BASE_URL, options: {} };


@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    // MessageComponent,
    ChannelsComponent,
    UsersComponent,
    // HeaderComponent,
    // ChatHistoryComponent,
    // SendMessageComponent,
    SidebarHeaderComponent
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
export class MainModule { }
