import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ChatHistoryComponent } from '../../components/chat-history/chat-history.component';
import { SendMessageComponent } from '../../components/send-message/send-message.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { QuillModule } from 'ngx-quill'
import { QuillInitializeService } from 'src/app/services/quill-Initialize/quill-initialize.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const modules = {
  keyboard: {
    bindings: {
        tab: false,
        handleEnter: {
            key: 13,
            handler: function() {
                // Do nothing
            }
        }
    }
  },
  autoLink: true,
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    // [{ 'align': [] }],

    // ['clean'],                                         // remove formatting button

    ['link']                         // link and image, video
  ]
};

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
    SendMessageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CKEditorModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    QuillModule.forRoot({
      modules,
      placeholder: 'Type your message',
    }),
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports: [RouterModule],
  providers: [QuillInitializeService]
})
export class MessageModule { }
