import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventManagerComponent } from './event-manager/event-manager.component';
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
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'create-event',
        component: CreateEventComponent
      },
      {
        path: 'event-manager',
        component: EventManagerComponent
      },
      {
        path: 'player-list',
        component: PlayerListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
