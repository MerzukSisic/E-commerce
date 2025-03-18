import {Component, inject} from '@angular/core';
import {MatBadge} from '@angular/material/badge';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {BusyService} from '../../core/services/busy.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {CartService} from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import {IsAdminDirective} from "../../shared/directives/is-admin.directive";
import {NgIf} from '@angular/common';
import {filter} from 'rxjs';


@Component({
  selector: 'app-header',
  imports: [
    MatBadge,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    IsAdminDirective,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService=inject(AccountService);
  private router=inject(Router);
  isHomePage = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHomePage = event.url === '/';
    });
  }

  logout(){
    this.accountService.logout().subscribe({
      next: ()=>{
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    })
  }
}
