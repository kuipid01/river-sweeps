import * as PIXI from 'pixi.js';

// Interface for category configuration
export interface CategoryConfig {
    name: string;
    index: number;
}

// HubCategory class
export class HubCategory extends PIXI.Container {
    constructor(config: CategoryConfig) {
        super();

        // Add the category background
        // Replace 'https://via.placeholder.com/150x100' with your actual background image path
        const bg = new PIXI.Sprite(PIXI.Texture.from('images/frenzy/category_bg.png'));
        bg.width = 150; // Adjust as per your actual background image dimensions
        bg.height = 100; // Adjust as per your actual background image dimensions
        this.addChild(bg);

        // Define the text style based on the image provided:
        // - Font: Bold, sans-serif (using BeVietnamPro if available, otherwise Arial Black/Impact)
        // - Fill: White with a subtle golden gradient
        // - Stroke: Dark outline for definition
        // - Drop Shadow: A strong golden glow
        const categoryTextStyle = new PIXI.TextStyle({
            fontFamily: 'BeVietnamPro, Arial Black, sans-serif', // Prefer 'BeVietnamPro' if loaded, fallback to Arial Black
            fontSize: 30, // Adjusted for better visibility and proportion
            fill: ['#FFFFFF', '#FFD700'], // White to Gold gradient for the main text color
            stroke: '#000000', // Black stroke for a strong outline
            strokeThickness: 4, // Thickness of the stroke
            dropShadow: true,
            dropShadowColor: '#FFD700', // Gold color for the glow
            dropShadowBlur: 10, // Increased blur for a softer, more prominent glow
            dropShadowDistance: 0, // 0 distance makes it a glow around the text
            align: 'center',
            fontWeight: '700', // Bold
        });

        // Add the category title
        const title = new PIXI.Text(config.name, categoryTextStyle);
        // Center the text horizontally and vertically within the background
        title.x = bg.width / 2;
        title.y = bg.height / 2; // Vertically center the text
        title.anchor.set(0.5); // Set anchor to the center of the text for perfect centering
        this.addChild(title);

        // Add the category icon
        // Replace 'https://via.placeholder.com/50x50' with your actual icon image path
        const icon = new PIXI.Sprite(PIXI.Texture.from('images/frenzy/category_icon.png'));
        // Position the icon relative to the background/container. Adjust these values
        // based on where you want the icon to appear (e.g., above or below the text, or within the background image itself).
        icon.x = bg.width / 2 - icon.width / 2; // Center horizontally under the text
        icon.y = bg.height - icon.height - 10; // Position near the bottom of the background
        this.addChild(icon);

        // Set position based on index for horizontal layout
        // This is positioning each category tile within the categoriesContainer of HubTop
        // You might want HubTop to handle the precise layout of these tiles if it's centering them.
        this.x = config.index * (bg.width + 10); // Adjust '10' for desired spacing between tiles
        this.y = 20; // This seems to be an offset within its parent container.

        // Add interactive effects
        this.interactive = true;
        this.buttonMode = true; // Changes cursor to pointer on hover

        this.on('pointerover', () => this.scale.set(1.1));
        this.on('pointerout', () => this.scale.set(1));
        this.on('pointerdown', () => {
            console.log(`Category "${config.name}" clicked!`);
            // You can emit an event here, e.g., EE.emit("CATEGORY_CLICKED", config.name);
        });
    }
}