import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    CommonModule
  ],
  templateUrl: './public-header.html',
  styleUrl: './public-header.scss'
})
export class PublicHeader { 
    currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
}