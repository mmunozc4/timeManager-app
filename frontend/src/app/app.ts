import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    Header,
    Sidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isLoggedIn = signal(false);
  sidebarOpen = signal(false);

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn.set(loggedIn);
      if (!loggedIn) this.sidebarOpen.set(false);
    });

    this.api.health().subscribe((res) => {
      if (res?.status === 'ok') {
        console.log('BACK CONECTADO');
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
