import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Project import

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
@Component({
  selector: 'app-home',
  imports: [CommonModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
// public props
navCollapsed!: boolean;
navCollapsedMob!: boolean;

// public method
navMobClick() {
  if (this.navCollapsedMob && !document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
    this.navCollapsedMob = !this.navCollapsedMob;
    setTimeout(() => {
      this.navCollapsedMob = !this.navCollapsedMob;
    }, 100);
  } else {
    this.navCollapsedMob = !this.navCollapsedMob;
  }
  if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('navbar-collapsed')) {
    document.querySelector('app-navigation.pc-sidebar')?.classList.remove('navbar-collapsed');
  }
}

handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    this.closeMenu();
  }
}

closeMenu() {
  if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
    document.querySelector('app-navigation.pc-sidebar')?.classList.remove('mob-open');
  }
}
}
