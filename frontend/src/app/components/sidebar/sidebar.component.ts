import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public bottomMsg = false;
  public topMsg = false;
  public newMessageEvent: any;
  public scrollingElement: any;

  constructor(private sideBarService: SidebarService) { }

  ngOnInit(): void { }
  public newMessageInfo(event: any) : void {
    this.newMessageEvent = event;
    if (event.eventHeight > event.topHeight && event.eventHeight > event.windowHeight) {
      this.bottomMsg = true
    } else if (event.eventHeight > event.topHeight && event.eventHeight < event.windowHeight) {
      this.bottomMsg = false
    }

    if (event.eventHeight < event.topHeight && event.eventHeight > event.windowHeight) {
      this.topMsg = true;
    } else if (event.eventHeight < event.topHeight && event.eventHeight < event.windowHeight){
      this.topMsg = false;
    }

  }

  public onScroll(event: any): void {
    this.sideBarService.getScrolEvent(event);
  }

  public scrollTo(): void {
    this.scrollingElement.nativeElement.scrollIntoView();
  }

  newEventInfo(event) {
    this.scrollingElement = event;
  }

}
