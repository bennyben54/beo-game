import {Character} from './character';

export class Hero extends Character {

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
  }

  protected initAnims(texture: string) {
    this.scene.anims.create({
      key: 'stop',
      frames: [{key: texture, frame: 0}],
      frameRate: 20
    });
    this.scene.anims.create({
      key: 'jump',
      frames: [{key: texture, frame: 5}],
      frameRate: 20
    });
    this.scene.anims.create({
      key: 'fall',
      frames: [{key: texture, frame: 6}],
      frameRate: 20
    });
    this.scene.anims.create({
      key: 'run-left',
      frames: this.scene.anims.generateFrameNumbers(texture, {start: 1, end: 2}),
      frameRate: 8,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'run-right',
      frames: this.scene.anims.generateFrameNumbers(texture, {start: 3, end: 4}),
      frameRate: 8,
      repeat: -1
    });
  }

  move(direction: -1 | 0 | 1) {
    const SPEED = 200;
    this.setVelocityX(direction * SPEED);

    if (direction !== 0) {
      this.anims.play(`run-${direction === 1 ? 'right' : 'left'}`, true);
    } else {
      this.anims.play('stop', true);
    }
  }

  jump(): boolean {
    const JUMP_SPEED = 600;
    const canJump = this.body.touching.down;

    if (canJump) {
      this.setVelocityY(-JUMP_SPEED);
    }

    return canJump;
  }

  bounce() {
    const BOUNCE_SPEED = 200;
    this.setVelocityY(-BOUNCE_SPEED);
  }

}
