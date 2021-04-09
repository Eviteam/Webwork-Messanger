import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoaderComponent
  }
];


@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
exports: [RouterModule]
})
export class LoaderModule { }
