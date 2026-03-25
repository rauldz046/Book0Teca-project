import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../responsive-sidebar.service';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent  {
  router = inject(Router)
  SidebarService = inject(SidebarService)
  url = this.router.url
  title: string = '';


  }   
