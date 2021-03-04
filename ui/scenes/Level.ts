
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	create() {
		
		// text_1
		const text_1 = this.add.text(400, 400, "", {});
		text_1.setOrigin(0.5, 0);
		text_1.text = "Challo Basti!";
		text_1.setStyle({"fontSize":"24px","fontStyle":"bold"});
		
		// image
		this.add.image(582, 96, "__DEFAULT");
		
		// dino_1
		this.add.image(200, 316, "dino");
		
		// image_1
		this.add.image(436, 245, "__DEFAULT");
		
		// mars
		const mars = this.add.image(711, 357, "mars");
		mars.scaleX = 0.1;
		mars.scaleY = 0.1;
		
		// text
		const text = this.add.text(188, 54, "", {});
		text.text = "Phaser Pew Pew\n";
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export const GameLevel = Level;