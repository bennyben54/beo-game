import Phaser from 'phaser';

export abstract class BeoScene  extends Phaser.Scene {

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  abstract init(data: object);
  abstract preload();
  abstract create();
  abstract update();
}
