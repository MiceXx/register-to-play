import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  rForm: FormGroup;

  constructor(private fb: FormBuilder, private afs: AngularFirestore) {
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'date': [null, Validators.required],
      'location': [null, Validators.required],
      'description': [null, Validators.required],
      'maxplayers': [null, Validators.compose([Validators.pattern(/^[0-9]+$/), Validators.min(0)])],
    });
  }

  ngOnInit() {
  }

  addEvent(form) {
    const title = form.title;
    let date = form.date;
    const location = form.location;
    const description = form.description;
    const maxplayers = form.maxplayers || 25;

    if (!(date instanceof Date)) {
      const currentdate = new Date();
      date = currentdate.getDate();
    }

    this.afs.collection('events').add({
      'title': title,
      'date': date,
      'location': location,
      'descrtiption': description,
      'maxplayers': maxplayers,
      'count': 0,
    });

    this.rForm.reset();
  }

}
