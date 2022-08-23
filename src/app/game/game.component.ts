import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { setDoc } from '@firebase/firestore';
import { doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: any;
  currentCard: string = '';
  game$: Observable<any>;
  games: any;

  constructor(private route: ActivatedRoute, private firestore: Firestore,
    public dialog: MatDialog) {
    const coll = collection(firestore, 'games');
    this.game$ = collectionData(coll);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);

    this.game$.subscribe(async (games) => {
        this.games = games;
        await this.getGame(params['id']);
        console.log(this.games);
      });
    });
  }


  async getGame(params: any) {
    const coll = collection(this.firestore, 'games');
    const docRef = doc(coll, params);
    const docSnap = await getDoc(docRef);

    this.game = docSnap.data();
    console.log('game', this.game);
  }


  newGame() {
    this.game = new Game();
    //const coll = collection(this.firestore, 'games');
    //setDoc(doc(coll), {game: this.game.toJson()});
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.game.players.push(name);
      }
    });
  }
}
