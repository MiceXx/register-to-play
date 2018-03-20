import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Event, EventId } from '../event';

@Component({
  selector: 'app-event-manager',
  templateUrl: './event-manager.component.html',
  styleUrls: ['./event-manager.component.scss']
})
export class EventManagerComponent implements OnInit {

  events: any;
  eventDoc: AngularFirestoreDocument<Event>;
  event: Observable<Event>;

  eventId: string;
  eventPlayers: any;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.events = this.afs.collection('events').snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Event;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
  }

  getEvent(eventId) {
    this.eventDoc = this.afs.doc('events/' + eventId);
    this.event = this.eventDoc.valueChanges();
    this.eventId = eventId;
  }

  deleteEvent(eventId) {
    this.getEvent(eventId);
    this.afs.doc('events/' + eventId).delete();
  }

  getPlayersForEvent(eventId) {
    this.getEvent(eventId);
    this.eventPlayers = this.afs.collection('events').doc(eventId).collection('players').valueChanges();
  }

}
