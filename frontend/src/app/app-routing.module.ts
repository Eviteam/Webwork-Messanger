import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main.component';
import { LoaderComponent } from './views/loader/loader.component';

const routes: Routes = [
  {
    path: '',
    component: LoaderComponent
  },
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
