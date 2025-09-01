import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SessionUser } from '../../services/auth.service';
import { MENU_ITEMS, MenuItem } from '../menu-items';
import { Header } from "../header/header";

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule
],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  session: SessionUser | null = null;
  public navItems: MenuItem[] = [];
  isMobile = false;

  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.session = this.auth.getSession();
    this.filterNavItems();

    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
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

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
