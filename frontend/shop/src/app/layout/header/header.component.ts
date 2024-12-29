import {Component, inject} from '@angular/core';
import {MatBadge} from '@angular/material/badge';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {BusyService} from '../../core/services/busy.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {CartService} from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [
    MatBadge,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatProgressBar
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartService = inject(CartService);
}
