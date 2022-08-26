import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc } from '@firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private firestore: Firestore) { }

  ngOnInit(): void {

  }


newGame() {
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    addDoc(coll, { game: game.toJson() })
    .then((game) => {
      this.router.navigateByUrl('/game/' + game.id);
    })
  }
}
