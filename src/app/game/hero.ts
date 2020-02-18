import Sprite = Phaser.Physics.Arcade.Sprite;
import {GameComponent} from './game.component';


export class Hero {

  private spriteRef: Sprite;
  private sceneRef: Phaser.Scene;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, scene: Phaser.Scene, key: string) {
    this.spriteRef = sprite;
    this.sceneRef = scene;
    this.initSprite();
    this.initAnims(key);
  }

  get sprite(): Sprite {
    return this.spriteRef;
  }

  private initSprite() {
    this.spriteRef.setCollideWorldBounds(true);
  }

  private initAnims(key: string) {
    this.sceneRef.anims.create({
      key: 'stop',
      frames: [{key, frame: 0}],
      frameRate: 20
    });
    this.sceneRef.anims.create({
      key: 'jump',
      frames: [{key, frame: 5}],
      frameRate: 20
    });
    this.sceneRef.anims.create({
      key: 'fall',
      frames: [{key, frame: 6}],
      frameRate: 20
    });
    this.sceneRef.anims.create({
      key: 'run-left',
      frames: this.sceneRef.anims.generateFrameNumbers(key, {start: 1, end: 2}),
      frameRate: 8,
      repeat: -1
    });
    this.sceneRef.anims.create({
      key: 'run-right',
      frames: this.sceneRef.anims.generateFrameNumbers(key, {start: 3, end: 4}),
      frameRate: 8,
      repeat: -1
    });
  }

  move(direction: -1 | 0 | 1) {
    const SPEED = 200;
    this.spriteRef.setVelocityX(direction * SPEED);

    if (direction !== 0) {
      this.sprite.anims.play(`run-${direction === 1 ? 'right' : 'left'}`, true);
    } else {
      this.sprite.anims.play('stop', true);
    }
  }

  jump(): boolean {
    const JUMP_SPEED = 600;
    const canJump = this.spriteRef.body.touching.down;

    if (canJump) {
      this.spriteRef.setVelocityY(-JUMP_SPEED);
    }

    return canJump;
  }

  bounce() {
    const BOUNCE_SPEED = 200;
    this.spriteRef.setVelocityY(-BOUNCE_SPEED);
  }

}
