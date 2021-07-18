import Constants from "../Constants";
import Utilities from "../Utilities";
import MainGame from "./MainGame";

export default class MainMenu extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainMenu";

	private bgmAudio;

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");

		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(Constants.BackgroundHex);

		this.add.text(this.cameras.main.centerX, 130, "Color\nClicky", {
			fontFamily: "PIXEL_SQUARE",
			align: "center"
		}).setOrigin(.5).setFontSize(66);
		var playBtn = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 50, "play");
		playBtn.setScale(.25);
		playBtn.setInteractive();
		playBtn.on("pointerdown", () => {
			this.scene.start(MainGame.Name);

			if (!this.bgmAudio) {
				this.bgmAudio = this.sound.add("bgm", {
					volume: .2,
					loop: true
				}).play();
			}
		});
	}
}
