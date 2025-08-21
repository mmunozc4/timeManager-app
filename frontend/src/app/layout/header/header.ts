import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  constructor(private auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
