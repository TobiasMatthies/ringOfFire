import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: any;
  game$: Observable<any>;
  games: any;
  gameId: string = '';

  constructor(private route: ActivatedRoute, private firestore: Firestore,
    public dialog: MatDialog) {
    const coll = collection(firestore, 'games');
    this.game$ = collectionData(coll);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];

      this.game$.subscribe((games) => {
        this.games = games;
        this.getGame(params['id']);
        console.log('games', this.games);
      });
    });
  }


  updateGame() {
    updateDoc(doc(this.firestore, 'games', this.gameId), {
      game: this.game
    });
  }


  getGame(params: any) {
    onSnapshot(doc(this.firestore, "games", params), (doc) => {
      let data: any = doc.data();
      this.game = data['game'];
      console.log("Current data: ", doc.data());
      console.log(this.game);
    });
  }


  newGame() {
    this.game = new Game();
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();

      setTimeout(() => {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.updateGame();
      }, 1000);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }
}
