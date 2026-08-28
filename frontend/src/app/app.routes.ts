import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SpeedNumbersComponent } from './features/speed-numbers/speed-numbers.component';
import { SpeedCardsComponent } from './features/speed-cards/speed-cards.component';
import { WordsTrainerComponent } from './features/words-trainer/words-trainer.component';
import { PaoManagerComponent } from './features/pao-manager/pao-manager.component';
import { StatsComponent } from './features/stats/stats.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'numbers', component: SpeedNumbersComponent },
  { path: 'cards', component: SpeedCardsComponent },
  { path: 'words', component: WordsTrainerComponent },
  { path: 'pao', component: PaoManagerComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: 'dashboard' },
];
