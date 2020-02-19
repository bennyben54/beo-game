import Phaser from 'phaser';
import {BeoScene} from './beo-scene';

export const TITLE = 'LES AVENTURES\nDE SARAH A.';

/**************************************/
/************ LEVELS ******************/
/**************************************/
export const LEVEL_0 = 'Super facile';
export const LEVEL_1 = 'Facile';
export const LEVEL_2 = 'Moyen';
export const LEVEL_3 = 'Difficile';

export class Title extends BeoScene {
  private difficultiesGroup: Phaser.GameObjects.Group;

  private difficultiesNames: string[] = [LEVEL_0, LEVEL_1, LEVEL_2, LEVEL_3];
  private selectedDifficulty;
  private selector: Phaser.GameObjects.Sprite;
  private onDifficultySelected: (difficulty: string) => void;

  constructor(key: string,
              onDifficultySelected: (difficulty: string) => void
                = (difficulty: string) => console.warn(`onDifficultySelected(${difficulty})`)) {
    super(key);
    this.onDifficultySelected = onDifficultySelected;
  }

  init(data: object) {
  }

  preload() {
    this.load.bitmapFont('font:atari-smooth', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');

    this.load.image('background', 'assets/images/background.png');

    this.load.audio('sfx:coin', 'assets/audio/coin.wav');
    this.load.audio('sfx:key', 'assets/audio/key.wav');

    this.load.spritesheet('hero', 'assets/images/hero.png', {frameWidth: 36, frameHeight: 42});
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.loadTitle();
    this.loadOptions();
    this.initControls();
  }

  update() {
  }

  private loadTitle() {
    this.add.bitmapText(
      100,
      100,
      'font:atari-smooth',
      TITLE)
      .setFontSize(60)
      .setCenterAlign();
  }

  private loadOptions() {
    this.selectedDifficulty = this.difficultiesNames[0];

    this.difficultiesGroup = this.add.group();

    this.difficultiesGroup.setOrigin(0);

    this.difficultiesNames.forEach(
      (value, index, array) =>
        this.difficultiesGroup.add(
          this.add.bitmapText(
            (+this.game.config.width / 2) - 200,
            300 + (60 * index),
            'font:atari-smooth',
            value
          ).setFontSize(32)
        )
    );
    this.selector = this.add.sprite(this.getSelected().x - 20, 0, 'hero');
    this.relocateSelector();
  }

  private getSelected(): Phaser.GameObjects.BitmapText {
    return this.difficultiesGroup.children.entries.find(
      value => (value as Phaser.GameObjects.BitmapText).text === this.selectedDifficulty
    ) as Phaser.GameObjects.BitmapText;
  }

  private relocateSelector() {
    this.selector.setY(this.getSelected().y + 10);
  }

  private getNextDifficulty(direction: 'up' | 'down'): string {
    let index;
    switch (direction) {
      case 'up':
        index = this.difficultiesNames.findIndex(value => value === this.selectedDifficulty);
        if (index === 0) {
          return this.difficultiesNames[this.difficultiesNames.length - 1];
        }
        return this.difficultiesNames[index - 1];
      case 'down':
        index = this.difficultiesNames.findIndex(value => value === this.selectedDifficulty);
        if (index === this.difficultiesNames.length - 1) {
          return this.difficultiesNames[0];
        }
        return this.difficultiesNames[index + 1];
    }
  }

  private initControls() {
    this.input.keyboard.on('keydown-UP', () => {
      this.selectedDifficulty = this.getNextDifficulty('up');
      this.relocateSelector();
      this.sound.play('sfx:coin');
    });
    this.input.keyboard.on('keydown-DOWN', () => {
      this.selectedDifficulty = this.getNextDifficulty('down');
      this.relocateSelector();
      this.sound.play('sfx:coin');
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      this.sound.play('sfx:key');
      this.onDifficultySelected(this.selectedDifficulty);
    });
  }
}
