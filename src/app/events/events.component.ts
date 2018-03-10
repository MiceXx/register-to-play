import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Event, EventId } from '../event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {

  eventsCol: AngularFirestoreCollection<Event>;
  events: any;
  eventDoc: AngularFirestoreDocument<Event>;
  event: Observable<Event>;

  date = new Date();

  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {

    this.eventsCol = this.afs.collection('events', ref => ref.orderBy('date', 'asc'));

    this.events = this.eventsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Event;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });

  }

  getMap = function(event) {
    return 'https://maps.google.com/?q=' + event.data.location;
  };

  getEvent(eventId) {
    this.eventDoc = this.afs.doc('events/' + eventId);
    this.event = this.eventDoc.valueChanges();
    console.log(eventId);
  }

}
