import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Player } from '../player';
import { Event, EventId } from '../event';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  title: string;
  date: Date;
  location: string;
  description: string;

  eventsCol: AngularFirestoreCollection<Event>;
  events: any;
  eventDoc: AngularFirestoreDocument<Event>;
  event: Observable<Event>;

  playersCol: AngularFirestoreCollection<Player>;
  players: any;
  playerDoc: AngularFirestoreDocument<Player>;
  player: Observable<Player>;

  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.playersCol = this.afs.collection('players');

    this.eventsCol = this.afs.collection('events');
    this.events = this.eventsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Event;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });

    this.players = this.getAllPlayers();
  }

  addEvent() {
    this.afs.collection('events').add({
      'title': this.title,
      'date': this.date,
      'location': this.location,
      'descrtiption': this.description
    });
  }

  getEvent(eventId) {
    this.eventDoc = this.afs.doc('events/' + eventId);
    this.event = this.eventDoc.valueChanges();
  }

  deleteEvent(eventId) {
    this.afs.doc('events/' + eventId).delete();
  }

  getPlayer(playerId) {
    this.playerDoc = this.afs.doc('players/' + playerId);
    return this.playerDoc.valueChanges();
  }

  getAllPlayers() {
    this.playersCol = this.afs.collection('players');
    return this.playersCol.valueChanges();
  }

  deletePlayer(playerId) {
    this.afs.doc('players/' + playerId).delete();
  }

  getDealers() {
    return this.afs.collection('players', ref => ref.where('dealer', '==', 'true'));
  }
}
