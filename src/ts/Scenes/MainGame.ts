import { Utils } from "phaser";
import Constants from "../Constants";
import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";

	private index: number;
	private score: number;
	private maxScore: number;
	private isGameOver: boolean;
	private colorRandom: Array<number> = [0xFF0000, 0xFFFF00, 0x0000FF, 0x00FF00];

	private scoreText: Phaser.GameObjects.Text;
	private maxScoreText: Phaser.GameObjects.Text;
	private timerImage: Phaser.GameObjects.Image;
	private boxTarget: Phaser.GameObjects.Image;
	private boxCollection: Phaser.GameObjects.Container;

	private boxShakeTween: Phaser.Tweens.Tween;

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");

		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

		const screenCenterX = this.cameras.main.centerX;
		const screenCenterY = this.cameras.main.centerY;

		this.isGameOver = false;

		this.timerImage = this.add.sprite(screenCenterX, 135, 'box').setOrigin(.5).setScale(5, .2);

		this.score = 0;
		this.scoreText = this.add.text(screenCenterX, 45, "Score " + this.score, { fontFamily: "PIXEL_SQUARE" }).setOrigin(.5);
		this.scoreText.setFontSize(24);
		this.maxScore = parseInt(localStorage.getItem('score')) || 0;
		this.maxScoreText = this.add.text(screenCenterX, 85, "High Score " + this.maxScore, { fontFamily: "PIXEL_SQUARE" }).setOrigin(.5);
		this.maxScoreText.setFontSize(15);

		this.index = 0;

		this.boxTarget = this.add.sprite(screenCenterX, 210, 'box');

		this.boxCollection = this.add.container(screenCenterX, screenCenterY + 80);

		var size = 1.5;

		var btn1 = this.add.sprite(0, 0, 'box').setOrigin(.5).setScale(size).setTint(this.colorRandom[0]);
		var btn2 = this.add.sprite(0, 0, 'box').setOrigin(.5).setScale(size).setTint(this.colorRandom[1]);
		var btn3 = this.add.sprite(0, 0, 'box').setOrigin(.5).setScale(size).setTint(this.colorRandom[2]);
		var btn4 = this.add.sprite(0, 0, 'box').setOrigin(.5).setScale(size).setTint(this.colorRandom[3]);

		this.boxCollection.add(this.add.sprite(0, 0, 'box').setOrigin(.5).setScale(size * 2.2));
		this.boxCollection.add(btn1);
		this.boxCollection.add(btn2);
		this.boxCollection.add(btn3);
		this.boxCollection.add(btn4);

		btn1.setPosition(-50, -50).setInteractive().on('pointerdown', () => this.boxClick(0));
		btn2.setPosition(-50, 50).setInteractive().on('pointerdown', () => this.boxClick(1));
		btn3.setPosition(50, -50).setInteractive().on('pointerdown', () => this.boxClick(2));
		btn4.setPosition(50, 50).setInteractive().on('pointerdown', () => this.boxClick(3));

		this.randomTargetColor();

		this.boxShakeTween = this.tweens.add({
			targets: this.boxCollection,
			x: {
				from: screenCenterX - 1,
				to: screenCenterX + 1
			},
			ease: 'Linear',
			repeat: 2,
			duration: 120,
			paused: true,
		});

		this.game.events.on(Phaser.Core.Events.BLUR, this.pause, this);
		this.game.events.on(Phaser.Core.Events.FOCUS, this.resume, this);
		this.game.events.on(Phaser.Core.Events.HIDDEN, this.pause, this);
		this.game.events.on(Phaser.Core.Events.VISIBLE, this.resume, this);
		this.events.on('shutdown', this.destroy, this);
	}

	public update(): void {
		if (this.isGameOver) return;
		var scaleX = Phaser.Math.Clamp(this.timerImage.scaleX - .001, 0, 100);
		this.timerImage.setScale(scaleX, this.timerImage.scaleY);
		if (this.timerImage.scaleX <= 0) {
			this.gameOver();
		}
	}

	public pause(): void {
		Utilities.Log("pause!");

		this.isGameOver = true;
	}
	public resume(): void {
		Utilities.Log("resume!");

		this.isGameOver = false;
	}
	public destroy(): void {
		Utilities.Log("destroy!");

		this.game.events.removeAllListeners();
		this.events.removeListener('shutdown', this.destroy, this);
	}

	gameOver() {
		this.isGameOver = true;
		if (this.score > this.maxScore) {
			localStorage.setItem('score', this.score.toString());
		}
		this.scene.start(MainMenu.Name);
	}

	boxClick(number: number) {
		if (number == this.index) {
			console.log("correct");

			this.sound.add('points').play();
			this.score++;
			this.scoreText.setText("Score " + this.score);
		}
		else {
			this.sound.add('hurt').play();
			var scaleX = Phaser.Math.Clamp(this.timerImage.scaleX - .5, 0, 100);
			this.timerImage.setScale(scaleX, this.timerImage.scaleY);

			this.boxShakeTween.play();
		}

		this.randomTargetColor();
	}
	randomTargetColor() {
		this.index = Phaser.Math.Between(0, this.colorRandom.length - 1);
		this.boxTarget.setTint(this.colorRandom[this.index]);
		this.boxCollection.angle += 90;
	}
}
