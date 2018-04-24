import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { Player } from '../player';

import {enableProdMode} from '@angular/core';

enableProdMode();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {

  rForm: FormGroup;
  eventExists: boolean = true;
  alreadyRegistered: boolean = false;

  name: string = '';
  cplNumber: string = '';
  email: string = '';
  comments: string = '';
  dealer: boolean = false;
  rSuccess: boolean = false;

  eventId: string;
  eventTitle: string;

  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private http: Http) {
      this.rForm = fb.group({
        'name': [null, Validators.required],
        'cplNumber': [null, Validators.compose([
          Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
        'email': [null, Validators.compose([Validators.required, Validators.email])],
        'comments': [null, Validators.maxLength(200)],
        'dealer': null,
        'terms': [null, Validators.requiredTrue],
      });

      this.route.params.subscribe(res => this.eventId = res.id);
    }

  ngOnInit() {
    this.afs.doc('events/' + this.eventId).ref.get().then((doc) => {
    if (doc.exists) {
        this.eventTitle = doc.data().title;
      } else {
        this.eventExists = false;
      }
    });
  }

  setPlayer(form) {
    this.name = form.name;
    this.email = form.email;
    this.cplNumber = form.cplNumber;
    this.dealer = form.dealer || false;
    this.comments = form.comments;

    try {
      this.registerPlayer(this.name, this.email, this.cplNumber, this.dealer);
    } catch (error) {
      console.error(error);
    }

  }

  registerPlayer(name: string, email: string, cplNumber: string, dealer: boolean) {
    const event = this.afs.collection('events').doc(this.eventId);
    const playersCol = this.afs.collection('players');
    let playerCount;

    event.ref.get().then((doc) => {
      playerCount =  doc.data().count || 0;
      const maxPlayers = doc.data().maxplayers || 25;
      if (playerCount >= maxPlayers) {
        this.eventExists = false;
      }
    });

    event.collection('players').doc(email).ref.get().then((playerDoc) => {
      if (playerDoc.exists) {
        this.alreadyRegistered = true;
      } else {
        event.collection('players').doc(email).set({ // add to event collection
          'name': name,
          'email': email,
          'cplnumber': cplNumber,
          'dealer': dealer,
        });
        playersCol.doc(email).set({ // add to master player collection
          'name': name,
          'email': email,
          'cplnumber': cplNumber,
          'dealer': dealer,
        });

        event.update({ // update player count
          'count': playerCount + 1
        });
        this.rSuccess = true;
      }
    });
  }

  sendEmail() {
    const url = 'http://localhost:3001/newplayer';
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const options = new RequestOptions({headers: headers});

    const body = {
      to: 'accmxx@gmail.com',
      name: 'Michael',
      event_name: 'test-email event'
    };

    return this.http.post(url, body, options)
                    .map((res: Response) =>  res.json())
                    .subscribe(
                      res => {
                        console.log(res);
                      },
                      err => {
                        console.log(err);
                      }
                    );
  }

}
