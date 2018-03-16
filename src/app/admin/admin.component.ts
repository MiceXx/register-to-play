import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  rForm: FormGroup;

  title: string;
  date: Date;
  location: string;
  description: string;

  events: any;
  eventDoc: AngularFirestoreDocument<Event>;
  event: Observable<Event>;

  players: any;

  constructor(private fb: FormBuilder, private afs: AngularFirestore) {
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'date': [null, Validators.required],
      'location': [null, Validators.required],
      'description': [null, Validators.required],
    });
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

    this.players = this.getAllPlayers();
  }

  addEvent(form) {
    const title = form.title;
    let date = form.date;
    const location = form.location;
    const description = form.description;

    if (!(date instanceof Date)) {
      const currentdate = new Date();
      date = currentdate.getDate();
    }

    this.afs.collection('events').add({
      'title': title,
      'date': date,
      'location': location,
      'descrtiption': description
    });

    this.rForm.reset();
  }

  getEvent(eventId) {
    this.eventDoc = this.afs.doc('events/' + eventId);
    this.event = this.eventDoc.valueChanges();
  }

  deleteEvent(eventId) {
    this.afs.doc('events/' + eventId).delete();
  }

  getPlayer(playerId) { // old
    return this.afs.doc('players/' + playerId).valueChanges();
  }

  getAllPlayers() { // old
    return this.afs.collection('players').valueChanges();
  }

  deletePlayer(playerId) { // old
    this.afs.doc('players/' + playerId).delete();
  }

  getDealers() { // old
    return this.afs.collection('players', ref => ref.where('dealer', '==', 'true'));
  }
}
