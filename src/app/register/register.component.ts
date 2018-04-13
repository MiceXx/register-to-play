import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';

import { Player } from '../player';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {

  rForm: FormGroup;
  eventExists: boolean = true;

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
    private route: ActivatedRoute) {
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

    this.addPlayer(this.name, this.email, this.cplNumber, this.dealer);
    this.registerPlayer(this.name, this.email, this.cplNumber, this.dealer);

  }

  addPlayer(name, email, cplNumber, dealer) {
    try {
      this.afs.collection('players').doc(cplNumber).set({
        'name': name,
        'email': email,
        'cplnumber': cplNumber,
        'dealer': dealer,
      });
      this.rSuccess = true;
    } catch (error) {
      console.error(error);
    }
  }

  registerPlayer(name, email, cplNumber, dealer) {
    const event = this.afs.collection('events').doc(this.eventId);
    event.ref.get().then(function(doc) {
      const playerCount =  doc.data().count;
      if (playerCount) {
          event.update({
            'count': playerCount + 1
          });
      } else {
        event.update({
          'count': 1
        });
      }
    }).catch(function(error) {
      console.log('Error getting document:', error);
    });
    event.collection('players').doc(email).set({
      'name': name,
      'email': email,
      'cplnumber': cplNumber,
      'dealer': dealer,
    });
  }

}
