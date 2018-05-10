import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { RegisterComponent } from './register/register.component';
import { PlayerListComponent } from './player-list/player-list.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  },
  {
    path: 'register/:id',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
