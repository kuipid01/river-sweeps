import * as PIXI from "pixi.js";
import { EE } from "../../../App";
import { Settings } from "./HubRight";
import { HubCategory, CategoryConfig } from "./HubCategory"; // Adjust import path

export class HubTop extends PIXI.Sprite {
    cont: PIXI.Container;
    categoriesContainer: PIXI.Container;
    private backgroundGraphics: PIXI.Graphics; // Changed to Graphics for color background

    constructor() {
        super();

        this.cont = this.addChild(new PIXI.Container());

        // --- Add Background Color ---
        // Create a new Graphics object for the background color.
        this.backgroundGraphics = new PIXI.Graphics();
        this.cont.addChildAt(this.backgroundGraphics, 0); // Add it as the first child
        // --- End Background Color ---

        this.categoriesContainer = this.cont.addChild(new PIXI.Container());
        this.addCategories();

        this.onResize = this.onResize.bind(this);

        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    private addCategories(): void {
        const categories: string[] = [
            "ALL GAMES",
            "AMATIC",
            "FISHING",
            "TABLE GAMES",
            "NETENT",
            "EGT",
            "MAZD",
        ];

        let currentX = 0;
        const spacing = 50; // Adjust as needed

        categories.forEach((category, index) => {
            const config: CategoryConfig = { name: category, index };
            const categoryTile = new HubCategory(config);

            categoryTile.x = currentX;
            this.categoriesContainer.addChild(categoryTile);

            currentX += categoryTile.width + spacing;
        });
    }

    onResize(_data: any) {
        // --- Resize Background Color ---
        // Clear previous drawing, set fill color, and redraw the rectangle
        this.backgroundGraphics.clear();
        this.backgroundGraphics.beginFill(0x333333); // Example: Dark gray color (hexadecimal)
        // You can change 0x333333 to any hexadecimal color code (e.g., 0xFF0000 for red)
        this.backgroundGraphics.drawRect(
            0,
            0,
            _data.w / _data.scale,
            _data.h / _data.scale
        );
        this.backgroundGraphics.endFill();
        // --- End Resize Background Color ---

        // Update categories container position and scale
        // Center the categories container horizontally
        this.categoriesContainer.x =
            _data.w / _data.scale / 2 - this.categoriesContainer.width / 2;
        this.categoriesContainer.y = 10; // Position below upper panel (adjust as needed)

        // Existing resize logic
        // If TopBack is re-integrated, ensure its onResize is called here.
        // this.back.onResize(_data); // Delegate to TopBack for its resize logic
    }
}

class TopBack extends PIXI.Sprite {
    user: PIXI.Sprite = new PIXI.Sprite();
    settings: PIXI.Sprite = new PIXI.Sprite();
    upperPannel: PIXI.Sprite = new PIXI.Sprite();
    grandJackpotText: PIXI.Sprite = new PIXI.Sprite();
    jackpotPrice: PIXI.Sprite = new PIXI.Sprite();

    constructor() {
        super();
        const styletext = new PIXI.TextStyle({
            fontFamily: "BeVietnamPro",
            fontSize: "52px",
            fill: ["#FFF997", "#CB9F00", "#FFF997"],
            dropShadow: true,
            dropShadowBlur: 2,
            dropShadowColor: "#000000",
            dropShadowDistance: 4,
            align: "center",
            fontWeight: "700",
        });

        this.upperPannel = this.addChild(
            new PIXI.Sprite(PIXI.Texture.from("images/frenzy/upper_panel.png"))
        );

        this.grandJackpotText = this.addChild(
            new PIXI.Sprite(
                PIXI.Texture.from("images/frenzy/grand_jackpot.png")
            )
        );
        this.jackpotPrice = this.addChild(
            new PIXI.Sprite(
                PIXI.Texture.from("images/frenzy/jackpot_value.png")
            )
        );

        const jackpotValue = this.jackpotPrice.addChild(
            new PIXI.Text("1196.93", styletext)
        );
        jackpotValue.x = 370 - jackpotValue.width / 2;
        jackpotValue.y = 40;

        this.user = this.addChild(new UserBlock());
        this.user.y = 20;
        this.user.x = 30;
        this.user.scale.set(0.8);

        this.settings = this.addChild(new Settings());
        this.settings.y = 30;
        this.settings.scale.set(0.7);

        this.onResize = this.onResize.bind(this);
        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    onResize(_data: any) {
        this.grandJackpotText.x = _data.w / _data.scale / 2 - 220;
        this.grandJackpotText.y = 20;
        this.grandJackpotText.scale = { x: 0.7, y: 0.7 };

        this.jackpotPrice.x = _data.w / _data.scale / 2 - 300;
        this.jackpotPrice.y = 70;
        this.jackpotPrice.scale = { x: 0.8, y: 0.8 };

        this.upperPannel.width = _data.w / _data.scale;
        this.upperPannel.height = 170;
        this.upperPannel.y = -10;

        this.settings.x = _data.w / _data.scale - 400;
    }
}

export class Frame extends PIXI.Sprite {
    cont: PIXI.Sprite;
    animate: PIXI.AnimatedSprite;
    constructor() {
        super();
        this.cont = this.addChild(new PIXI.Sprite());
        this.play = this.play.bind(this);

        const json0 =
            PIXI.Loader.shared.resources["images/anim/frame_up.json"]
                ?.spritesheet;
        const array0: any[] = [];
        if (json0) {
            Object.keys(json0.textures)
                .sort()
                .forEach((key) => {
                    array0.push(json0.textures[key]);
                });
        }

        this.animate = new PIXI.AnimatedSprite(array0);
        this.animate.animationSpeed = 0.5;
        this.animate.loop = true;
        this.cont.addChild(this.animate);
        this.animate.gotoAndPlay(1);
    }

    play() {
        this.animate.gotoAndPlay(1);
    }
}

class UserBlock extends PIXI.Sprite {
    user: PIXI.Sprite;
    newsButton: PIXI.Sprite = new PIXI.Sprite();

    constructor() {
        super();
        const styletext = new PIXI.TextStyle({
            fontFamily: "BeVietnamPro",
            fontSize: "29px",
            fill: ["#000000", "#000000"],
            dropShadow: true,
            dropShadowBlur: 1,
            dropShadowColor: "#ffff54",
            dropShadowDistance: 3,
            align: "center",
            fontWeight: "700",
        });

        const styletext2 = new PIXI.TextStyle({
            fontFamily: "Bronzier",
            fontSize: "28px",
            fill: ["#ffff54", "#ffff54"],
            align: "center",
            fontWeight: "700",
        });

        this.user = this.addChild(
            new PIXI.Sprite(PIXI.Texture.from("images/frenzy/user_profile.png"))
        );

        this.newsButton = this.addChild(
            new PIXI.Sprite(
                PIXI.Texture.from("images/frenzy/news/news_btn.png")
            )
        );

        this.newsButton.interactive = true;
        this.newsButton.buttonMode = true;

        this.newsButton.on("pointerdown", () => {
            EE.emit("SHOW_NEWS");
        });

        const userName = this.user.addChild(
            new PIXI.Text("USER123", styletext)
        );
        userName.x = 350 - userName.width / 2;
        userName.y = 25;

        const coinValue = this.user.addChild(
            new PIXI.Text("1265.55", styletext2)
        );
        coinValue.x = 350 - coinValue.width / 2;
        coinValue.y = 68;

        this.user.interactive = true;
        this.user.buttonMode = true;

        this.user.on("pointerdown", () => {
            EE.emit("SHOW_INFO");
        });

        this.user.height = 194;

        this.onResize = this.onResize.bind(this);
        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    onResize(_data: any) {
        this.newsButton.x = 520;
        this.newsButton.y = 23;
        this.newsButton.scale.set(0.9);
    }
}
