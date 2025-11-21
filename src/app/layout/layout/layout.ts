import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatAnchor } from "@angular/material/button";


@Component({
  selector: 'app-layout',
  standalone: true,
 imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatAnchor
],
    templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

    constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
