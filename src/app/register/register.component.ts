import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

interface Player {
  name: string;
  email: string;
  cplnumber: string;
  dealer: boolean;
}

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

  constructor(private fb: FormBuilder,
    private afs: AngularFirestore,
    private route: ActivatedRoute,) {
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

      this.route.params.subscribe(res => console.log(res.id));
  }

  addPost(post) {
    this.name = post.name;
    this.cplNumber = post.cplNumber;
    this.email = post.email;
    this.comments = post.comments;
    this.dealer = post.dealer || false;
    this.addPlayer(this.name, this.email, this.cplNumber, this.dealer);
  }

  ngOnInit() {

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
