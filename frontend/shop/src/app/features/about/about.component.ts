import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

// ✅ Extend Leaflet interface to recognize Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  private map!: L.Map;
  private userMarker!: L.Marker;
  private routingControl: any;
  private storeLocation: L.LatLngExpression = [44.8125, 20.4612]; // Store location

  router = inject(Router);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map = L.map('map', {
        center: this.storeLocation,
        zoom: 14
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker(this.storeLocation, { icon: this.getStoreIcon() })
        .addTo(this.map)
        .bindPopup('<b>Game Shop</b><br>Find the best games here!')
        .openPopup();

      this.getUserLocation();
    }, 500);
  }

  private getUserIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png', // ✅ Ikona korisnika
      iconSize: [30, 30], // ✅ Veličina ikonice
      iconAnchor: [15, 30], // ✅ Centrirana pozicija
      popupAnchor: [0, -30] // ✅ Popup će biti iznad markera
    });
  }
  
  private getStoreIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3468/3468379.png', // ✅ Ikona prodavnice
      iconSize: [40, 40], // ✅ Veličina ikonice
      iconAnchor: [20, 40], // ✅ Centrirana pozicija
      popupAnchor: [0, -40] // ✅ Popup će biti iznad markera
    });
  }
  
  
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (this.userMarker) {
            this.userMarker.setLatLng([lat, lng]);
          } else {
            this.userMarker = L.marker([lat, lng], { icon: this.getUserIcon() })
              .addTo(this.map)
              .bindPopup('You are here!')
              .openPopup();
          }

          this.map.setView([lat, lng], 14, { animate: true });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported in this browser.');
    }
  }

  showRoute(userLocation: L.LatLngExpression, storeLocation: L.LatLngExpression): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    this.routingControl = (L.Routing as any).control({
      waypoints: [L.latLng(userLocation), L.latLng(storeLocation)],
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
      },
      altLineOptions: {
        styles: [{ color: 'red', opacity: 0.7, weight: 5 }]
      },
      createMarker: () => null,
      routerOptions: {
        routeWhileDragging: true
      }
    }).addTo(this.map);

    this.routingControl.on('routesfound', (e: any) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      const duration = Math.round(route.summary.totalTime / 60);

      const streets = new Set<string>();
      route.instructions.forEach((instruction: any) => {
        if (instruction.road) {
          streets.add(instruction.road);
        }
      });

      (document.getElementById('distance') as HTMLElement).innerText = `${distance} km`;
      (document.getElementById('duration') as HTMLElement).innerText = `${duration} min`;
      (document.getElementById('streets') as HTMLElement).innerText = [...streets].join(', ') || 'No data';

      const bounds = L.latLngBounds(route.waypoints.map((wp: any) => wp.latLng));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    });

    setTimeout(() => {
      const controlContainer = document.querySelector('.leaflet-routing-container');
      if (controlContainer) {
        controlContainer.remove();
      }
    }, 500);
  }

  showRouteToStore(): void {
    if (!this.userMarker) {
      alert('Find your location first!');
      return;
    }

    this.showRoute(this.userMarker.getLatLng(), this.storeLocation);
  }

  cancelRoute(): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }

    (document.getElementById('distance') as HTMLElement).innerText = '---';
    (document.getElementById('duration') as HTMLElement).innerText = '---';
    (document.getElementById('streets') as HTMLElement).innerText = '---';
  }

  focusOnStore(): void {
    this.map.setView(this.storeLocation, 14);
  }
}
