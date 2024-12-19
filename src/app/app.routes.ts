import { Routes } from '@angular/router';
import {CounterComponent} from './components/counter/counter.component';
import {FireworksComponent} from './components/fireworks/fireworks.component';

export const routes: Routes = [
  { path: '', component: CounterComponent },
  { path: 'fireworks', component: FireworksComponent },
];
