import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SessionUser } from '../../services/auth.service';
import { MENU_ITEMS, MenuItem } from '../menu-items';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  session: SessionUser | null = null;
  public navItems: MenuItem[] = [];

  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.session = this.auth.getSession();
    this.filterNavItems();
  }

filterNavItems(): void {
  const userRole = this.session?.role;
  this.navItems = MENU_ITEMS.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    if (userRole) {
      return item.roles.includes(userRole);
    }
    return false;
  });
}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
