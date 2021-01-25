import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/main',
  //   pathMatch: 'full'
  // },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./views/message/message.module').then(m => m.MessageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
