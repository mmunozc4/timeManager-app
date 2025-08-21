import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Header } from "./layout/header/header";
import { Sidebar } from "./layout/sidebar/sidebar";
import { Footer } from "./layout/footer/footer";
import { AuthService } from './services/auth.service';
import { PublicHeader } from './layout/public-header/public-header';

@Component({
  selector: 'app-root',
  standalone: true, // Agrega esta línea si no la tienes
  imports: [
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    Header,
    Sidebar,
    Footer,
    PublicHeader
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  @ViewChild('drawer') drawer!: MatDrawer;
  health: any = null;
  appointments: any[] = [];
  isLoggedIn = signal(false);

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn.set(loggedIn);
      console.log('Login status changed to:', loggedIn);
    });

    this.api.health().subscribe(res => {
      this.health = res;
      if (this.health?.status === "ok") {
        console.log("BACK CONECTADO");
      }
    });
  }

  toggleSidebar() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
}