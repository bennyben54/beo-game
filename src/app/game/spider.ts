import Sprite = Phaser.Physics.Arcade.Sprite;
import {Hero} from './hero';


export class Spider {

  private spriteRef: Sprite;
  private sceneRef: Phaser.Scene;
  private readonly SPEED = 120;
  private direction = 1;
  private dying = false;

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
    this.spriteRef.setVelocityX(this.direction * this.SPEED);
  }

  private initAnims(key: string) {
    this.sceneRef.anims.create({
      key: 'crawl',
      frames: this.sceneRef.anims.generateFrameNumbers(key, {frames: [0, 1, 2]}),
      frameRate: 8,
      repeat: -1
    });
    this.sceneRef.anims.create({
      key: 'die',
      frames: this.sceneRef.anims.generateFrameNumbers(key, {frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3]}),
      frameRate: 12,
      repeat: -1
    });
    this.spriteRef.anims.play('crawl', true);
  }

  hitBounds() {
    if (this.spriteRef && this.spriteRef.body && (this.spriteRef.body.blocked.left || this.spriteRef.body.blocked.right)) {
      this.changeDirection();
    }
  }

  changeDirection() {
    if (this.spriteRef && this.spriteRef.body) {
      this.direction = -this.direction;
      this.spriteRef.setVelocityX(this.direction * this.SPEED);
    }
  }

  die(hero: Hero, onSpiderDie: () => void, onHeroDie: () => void) {
    if (!this.dying) {
      if (hero.sprite.body.velocity.y > 0) { // kill enemies when hero is falling
        this.dying = true;
        this.sceneRef.anims.play('die', this.spriteRef);
        this.spriteRef.setVelocityX(0);
        onSpiderDie();
        setTimeout(() => {
          this.spriteRef.destroy(true);

        }, 500);
      } else {
        onHeroDie();
      }
    }
  }
}
