import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  public hideChannels: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public hideOrShowContent() {
    this.hideChannels = !this.hideChannels
  }

}
