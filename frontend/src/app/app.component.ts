import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-root-layout">
      <app-navbar></app-navbar>
      <main class="main-viewport">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-root-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-viewport {
      flex: 1;
      position: relative;
      z-index: 1;
    }
  `],
})
export class AppComponent {}
