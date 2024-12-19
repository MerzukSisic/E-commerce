import {Component} from '@angular/core';
import {MatBadge} from '@angular/material/badge';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatBadge,
    MatIcon,
    MatButton,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
