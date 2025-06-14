import * as PIXI from 'pixi.js';

export interface CategoryConfig {
    name: string;
    index: number;
}

// Category tile representing a game type
export class HubCategory extends PIXI.Container {
    constructor(config: CategoryConfig) {
        super();

        // Background image
        const bg = new PIXI.Sprite(PIXI.Texture.from('images/frenzy/category_bg.png'));
        bg.width = 150;
        bg.height = 100;
        this.addChild(bg);

        // Text style for the category label
        const categoryTextStyle = new PIXI.TextStyle({
            fontFamily: 'BeVietnamPro, Arial Black, sans-serif',
            fontSize: 30,
            fill: ['#FFFFFF', '#FFD700'],
            stroke: '#000000',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#FFD700',
            dropShadowBlur: 20,
            dropShadowDistance: 0,
            align: 'center',
            fontWeight: '700',
        });

        // Category name
        const title = new PIXI.Text(config.name, categoryTextStyle);
        title.anchor.set(0.5);
        title.x = bg.width / 2;
        title.y = bg.height / 2;
        this.addChild(title);

        // Icon below the text
        const icon = new PIXI.Sprite(PIXI.Texture.from('images/frenzy/category_icon.png'));
        icon.x = bg.width / 2 - icon.width / 2;
        icon.y = bg.height - icon.height - 10;
        this.addChild(icon);

        // Positioning (may be overridden by parent)
        this.x = config.index * (bg.width + 10);
        this.y = 20;

        // Interactivity
        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerover', () => this.scale.set(1.1));
        this.on('pointerout', () => this.scale.set(1));
        this.on('pointerdown', () => {
            console.log(`Category "${config.name}" clicked!`);
            // EE.emit("CATEGORY_CLICKED", config.name);
        });
    }
}
