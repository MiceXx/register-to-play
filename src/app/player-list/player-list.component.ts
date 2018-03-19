import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Player } from '../player';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  players: any;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.players = this.getAllPlayers();
  }

  getAllPlayers() {
    return this.afs.collection('players').valueChanges();
  }

  getPlayer(playerId) { // old
    return this.afs.doc('players/' + playerId).valueChanges();
  }

  deletePlayer(playerId) { // old
    this.afs.doc('players/' + playerId).delete();
  }

  getDealers() { // old
    return this.afs.collection('players', ref => ref.where('dealer', '==', 'true'));
  }
}
