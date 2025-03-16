import { Component, OnInit } from '@angular/core';
import { NgStyle, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    NgForOf,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images = [
    'https://i.imgur.com/OzqPnfj.jpeg',
    'https://i.imgur.com/3i5AfVd.jpeg',
    'https://hips.hearstapps.com/hmg-prod/images/gh-index-gamingconsoles-052-print-preview-1659705142.jpg?crop=1.00xw:0.753xh;0,0.0831xh&resize=1200:*',
    'https://i.imgur.com/ORjlf0d.jpeg',
  ];

  currentIndex = 0;

  categories = [
    { name: 'PC', icon: 'computer' },
    { name: 'PlayStation', icon: 'sports_esports' },
    { name: 'Xbox', icon: 'videogame_asset' },
    { name: 'Nintendo', icon: 'gamepad' },
    { name: 'Mobile', icon: 'smartphone' }
  ];

  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000); // Menja sliku svakih 5 sekundi
  }

  getBackgroundStyle() {
    return {
      'background-image': `url("${this.images[this.currentIndex]}")`,

      'background-position': 'center',
      'transition': 'background-image 1s ease-in-out'
    };
  }
}