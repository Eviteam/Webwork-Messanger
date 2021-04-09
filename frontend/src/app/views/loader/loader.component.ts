import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app/app.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appService.setCurrenUser()
      .then((data: any) =>  {
        this.router.navigateByUrl(`/main/${data.selectedUser}`)
      })
      .catch(err => console.log(err, "err"))
  }

}
