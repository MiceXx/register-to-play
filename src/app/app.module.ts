import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { environment } from './../environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { EventsComponent } from './events/events.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { PlayerListComponent } from './player-list/player-list.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    AdminComponent,
    EventsComponent,
    CreateEventComponent,
    PlayerListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
