import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Player } from '../player';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {

  rForm: FormGroup;
  post: any;

  name: string = '';
  cplNumber: string = '';
  email: string = '';
  comments: string = '';
  dealer: boolean = false;

  playersCol: AngularFirestoreCollection<Player>;
  players: any;
  playerDoc: AngularFirestoreDocument<Player>;
  player: Observable<Player>;

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

      this.playersCol = this.afs.collection('players');

      this.route.params.subscribe(res => this.eventId = res.id);
    }

  ngOnInit() {
    console.log(this.eventId);
    this.afs.doc('events/' + this.eventId).ref.get().then((doc) => {
    if (doc.exists) {
        this.eventTitle = doc.data().title;
      } else {
        this.eventTitle = 'Something went wrong. Please go back to the main page and try';
      }
    });
  }

  addPost(post) {
    this.name = post.name;
    this.cplNumber = post.cplNumber;
    this.email = post.email;
    this.comments = post.comments;
    this.dealer = post.dealer || false;
    this.addPlayer(this.name, this.email, this.cplNumber, this.dealer);
  }


  addPlayer(name, email, cplnumber, dealer) {
    this.afs.collection('players').doc(cplnumber).set({
      'name': name,
      'email': email,
      'cplnumber': cplnumber,
      'dealer': dealer,
    });
  }

}
