import { Component } from '@angular/core';
import { Team } from './models/team';
import { AppService } from './services/app/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public teamData: Team;

  constructor(private appService: AppService) {
    this.appService.setCurrenUser()
  }
}
