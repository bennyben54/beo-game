import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Phaser from 'phaser';
import {Level} from './types/level';
import {Hero} from './hero';
import {Spider} from './spider';
import GameObject = Phaser.GameObjects.GameObject;

@Component({
  selector: 'beo-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends Phaser.Scene implements OnInit {

  private readonly GRAVITY = 1200;
  private readonly LEVEL_COUNT = 2;
  phaserGame: Phaser.Game;
  private platforms: Phaser.GameObjects.Group;
  private enemyWalls: Phaser.GameObjects.Group;
  private coins: Phaser.GameObjects.Group;
  private spiders: Phaser.GameObjects.Group;
  private spidersObj: Map<GameObject, Spider> = new Map<GameObject, Spider>();
  private bgDecoration: Phaser.GameObjects.Group;
  private hero: Hero;

  // private level = 1;
  private level = 0;
  private hasKey: boolean;
  private initialCoinsNumber: number;
  private coinPickupCount: number;
  private key: Phaser.Physics.Arcade.Sprite;
  private door: Phaser.Physics.Arcade.Sprite;
  private keyIcon: Phaser.GameObjects.Sprite;
  private coinFont: Phaser.GameObjects.BitmapText;

  constructor() {
    super({key: 'main'});
  }


  ngOnInit() {
    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      height: 600,
      width: 960,
      scene: [this],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: this.GRAVITY}
        }
      }
    });
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.loadLevel();
    this.createHud();
  }

  preload() {
    this.load.json('level:0', 'assets/data/level00.json');
    this.load.json('level:1', 'assets/data/level01.json');

    this.load.bitmapFont('font:atari-smooth', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');

    this.load.image('background', 'assets/images/background.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('grass:8x1', 'assets/images/grass_8x1.png');
    this.load.image('grass:6x1', 'assets/images/grass_6x1.png');
    this.load.image('grass:4x1', 'assets/images/grass_4x1.png');
    this.load.image('grass:2x1', 'assets/images/grass_2x1.png');
    this.load.image('grass:1x1', 'assets/images/grass_1x1.png');
    this.load.image('invisible-wall', 'assets/images/invisible_wall.png');
    this.load.image('icon:coin', 'assets/images/coin_icon.png');
    this.load.image('key', 'assets/images/key.png');

    this.load.audio('sfx:jump', 'assets/audio/jump.wav');
    this.load.audio('sfx:coin', 'assets/audio/coin.wav');
    this.load.audio('sfx:stomp', 'assets/audio/stomp.wav');
    this.load.audio('sfx:key', 'assets/audio/key.wav');
    this.load.audio('sfx:door', 'assets/audio/door.wav');

    this.load.spritesheet('hero', 'assets/images/hero.png', {frameWidth: 36, frameHeight: 42});
    this.load.spritesheet('coin', 'assets/images/coin_animated.png', {frameWidth: 22, frameHeight: 22});
    this.load.spritesheet('spider', 'assets/images/spider.png', {frameWidth: 42, frameHeight: 32});
    this.load.spritesheet('door', 'assets/images/door.png', {frameWidth: 42, frameHeight: 66});
    this.load.spritesheet('icon:key', 'assets/images/key_icon.png', {frameWidth: 34, frameHeight: 30});
  }

  initialize(data: Level) {
    this.hasKey = false;
    this.initialCoinsNumber = data && data.coins ? data.coins.length : 0;
    this.coinPickupCount = 0;

  }

  update() {
    this.handleInputs();
    this.spidersHitBounds();
    this.updateHud();
  }

  private updateHud() {
    this.coinFont.text = `${this.coinPickupCount}/${this.initialCoinsNumber}`;
    this.keyIcon.setFrame(this.hasKey ? 1 : 0);
  }

  private finishLevel() {
    if (this.isLevelComplete()) {
      if (this.level < this.LEVEL_COUNT - 1) {
        this.level++;
      } else {
        this.level = 0;
      }
      this.sound.play('sfx:door');
      this.scene.restart();
    }
  }

  private isLevelComplete() {
    return this.hasKey && (this.initialCoinsNumber === this.coinPickupCount);
  }

  private spidersHitBounds() {
    for (const spider of this.spidersObj.values()) {
      spider.hitBounds();
    }
  }

  private handleInputs() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.hero.move(-1);
    } else if (cursors.right.isDown) {
      this.hero.move(1);
    } else {
      this.hero.move(0);
    }

    if (cursors.up.isDown) {
      if (this.hero.jump()) {
        this.sound.play('sfx:jump');
      }
    }
  }

  private createHud() {
    this.keyIcon = this.add.sprite(2, 21, 'icon:key', 0);
    this.keyIcon.setOrigin(0);
    const coinIcon = this.add.image(this.keyIcon.x + this.keyIcon.width + 7, 19, 'icon:coin');
    coinIcon.setOrigin(0);
    this.coinFont = this.add.bitmapText(
      coinIcon.x + coinIcon.width + 5,
      24,
      'font:atari-smooth',
      `0/${this.initialCoinsNumber}`)
      .setFontSize(24);
    this.coinFont.setOrigin(0);
  }

  private loadLevel() {
    const data: Level = this.cache.json.get(`level:${this.level}`);
    this.initialize(data);
    this.platforms = this.add.group();
    this.enemyWalls = this.add.group();
    this.spiders = this.add.group();
    this.coins = this.add.group();
    this.bgDecoration = this.add.group();
    this.spawnPlatforms(data);
    this.spawnDoor(data);
    this.spawnCoins(data);
    this.spawnCharacters(data);
    this.spawnKey(data);
    this.handleCollisions();
  }

  private handleCollisions() {
    this.physics.add.collider(this.hero.sprite, this.platforms);
    this.physics.add.overlap(this.hero.sprite, this.coins, (hero, coin) => this.onHeroVsCoin(hero, coin), null, this);
    this.physics.add.collider(this.spiders, this.platforms);
    this.physics.add.collider(this.spiders, this.enemyWalls, (spider, wall) => this.onSpiderVsEnemyWall(spider, wall));
    this.physics.add.overlap(this.hero.sprite, this.spiders, (hero, spider) => this.onHeroVsEnemy(hero, spider), null, this);
    this.physics.add.overlap(this.hero.sprite, this.key, (hero, key) => this.onHeroVsKey(hero, key), null, this);
    this.physics.add.overlap(this.hero.sprite, this.door, (hero, door) => this.onHeroVsDoor(hero, door), null, this);
  }

  private spawnPlatforms(data: Level) {
    data.platforms.forEach(platform => {
      const sprite = this.platforms.create(platform.x, platform.y, platform.image);
      sprite.setOrigin(0);
      this.initPhysics(sprite);
      this.spawnEnemyWall(platform.x, platform.y, 'left');
      this.spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    });
  }

  private initPhysics(sprite: Phaser.Physics.Arcade.Sprite) {
    this.physics.world.enable(sprite);
    (sprite.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    sprite.body.immovable = true;
  }

  private spawnEnemyWall(x: number, y: number, side: string) {
    const sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.setOrigin(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.initPhysics(sprite);
  }

  private spawnCoins(data: Level) {
    data.coins.forEach(coin => {
      const sprite = this.coins.create(coin.x, coin.y, 'coin');
      this.initPhysics(sprite);
      this.anims.create({
        key: 'rotate',
        frames: this.anims.generateFrameNumbers('coin', {frames: [0, 1, 2]}),
        frameRate: 6,
        repeat: -1,
        repeatDelay: 0
      });
      this.anims.play('rotate', sprite);
    });
  }

  private spawnCharacters(data: Level) {
    // spawn hero
    const heroKey = 'hero';
    this.hero = new Hero(this.physics.add.sprite(data.hero.x, data.hero.y, heroKey), this, heroKey);

    // spawn spiders
    const spiderKey = 'spider';

    data.spiders.map(spider => new Spider(this.physics.add.sprite(spider.x, spider.y, spiderKey), this, spiderKey))
      .forEach(x => this.spidersObj.set(x.sprite, x));
    for (const value of this.spidersObj.values()) {
      this.spiders.add(value.sprite, true);
    }
  }

  private spawnKey(data: Level) {
    this.key = this.bgDecoration.create(data.key.x, data.key.y, 'key');
    this.initPhysics(this.key);

    // add a small 'up & down' animation via a tween
    this.key.y -= 3;

    this.tweens.add({
      targets: this.key,
      scale: 1.1,
      ease: 'Linear',
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  private spawnDoor(data: Level) {
    this.door = this.bgDecoration.create(data.door.x, data.door.y, 'door');
    this.door.setOrigin(0, 1);
    this.initPhysics(this.door);
  }

  private onHeroVsCoin(hero: Phaser.GameObjects.GameObject, coin: Phaser.GameObjects.GameObject) {
    coin.destroy(true);
    this.sound.play('sfx:coin');
    this.coinPickupCount++;
  }

  private onSpiderVsEnemyWall(spider: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) {
    this.spidersObj.get(spider).changeDirection();
  }

  private onHeroVsEnemy(hero: Phaser.GameObjects.GameObject, spider: Phaser.GameObjects.GameObject) {
    this.spidersObj.get(spider).die(this.hero,
      () => {
        this.hero.bounce();
      },
      () => {
        this.sound.play('sfx:stomp');
        this.scene.restart();
      });
  }

  private onHeroVsKey(hero: Phaser.GameObjects.GameObject, key: Phaser.GameObjects.GameObject) {
    key.destroy(true);
    this.hasKey = true;
    this.sound.play('sfx:key');
  }

  private onHeroVsDoor(hero: Phaser.GameObjects.GameObject, door: Phaser.GameObjects.GameObject) {
    this.finishLevel();
  }


}
