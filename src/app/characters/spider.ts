import {Hero} from './hero';
import {Character} from './character';

export class Spider extends Character {

  private readonly SPEED = 120;
  private direction = 1;
  private dying = false;

  constructor(scene: Phaser.Scene, x: number, y: number, frame?: string | integer) {
    super(scene, x, y, 'spider', frame);
    this.initSprite();
  }


  private initSprite() {
    this.setVelocityX(this.direction * this.SPEED);
  }

  protected initAnims(key: string) {
    this.scene.anims.create({
      key: 'crawl',
      frames: this.scene.anims.generateFrameNumbers(key, {frames: [0, 1, 2]}),
      frameRate: 8,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'die',
      frames: this.scene.anims.generateFrameNumbers(key, {frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3]}),
      frameRate: 12,
      repeat: -1
    });
    this.anims.play('crawl', true);
  }

  hitBounds() {
    if (this.body && (this.body.blocked.left || this.body.blocked.right)) {
      this.changeDirection();
    }
  }

  changeDirection() {
    if (this.body) {
      this.direction = -this.direction;
      this.setVelocityX(this.direction * this.SPEED);
    }
  }

  die(hero: Hero, onSpiderDie: () => void, onHeroDie: () => void) {
    if (!this.dying) {
      if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        this.dying = true;
        this.scene.anims.play('die', this);
        this.setVelocityX(0);
        onSpiderDie();
        setTimeout(() => {
          this.destroy(true);

        }, 500);
      } else {
        onHeroDie();
      }
    }
  }
}
