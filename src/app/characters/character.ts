import Sprite = Phaser.Physics.Arcade.Sprite;

export abstract class Character extends Sprite {

  protected constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
    super(scene, x, y, texture, frame);
    this.enablePhysics();
    this.initAnims(texture);
  }

  private enablePhysics() {
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);
  }

  protected abstract initAnims(texture: string);
}
