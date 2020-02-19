import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Phaser from 'phaser';
import {Main} from '../scenes/main';
import {Title} from '../scenes/title';

/**************************************/
/************ SCENES ******************/
/**************************************/
const SCENE_TITLE = 'title';
const SCENE_MAIN = 'main';

@Component({
  selector: 'beo-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends Phaser.Game implements OnInit {

  constructor() {
    super({
      type: Phaser.AUTO,
      height: 600,
      width: 960,
      scene: [
        new Title(SCENE_TITLE, (difficulty) => {
          this.scene.start(SCENE_MAIN, {difficulty});
          this.scene.stop(SCENE_TITLE);
        }),
        new Main(SCENE_MAIN, () => {
          this.scene.stop(SCENE_MAIN);
          this.scene.start(SCENE_TITLE);
        })
      ],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 1200}
        }
      }
    });
  }

  ngOnInit() {
  }

}
