import * as PIXI from "pixi.js";
import { EE } from "../../../App";
// import { Settings } from "./HubRight";
// import { HubCategory, CategoryConfig } from "./HubCategory"; // Adjust import path
import { games } from "./GamesCategories";

export class HubTop extends PIXI.Sprite {
    private cont: PIXI.Container;
    private categoriesContainer: PIXI.Container;
    private backgroundGraphics: PIXI.Graphics;
    // private currentGameContainer: PIXI.Container | null = null;
    private scrollContainer: PIXI.Container;
    private bar: PIXI.Graphics;
    private app: PIXI.Application;
    private onGameSelected: (component: PIXI.Container) => void;
    constructor(
        app: PIXI.Application,
        onGameSelected: (component: PIXI.Container) => void
    ) {
        super();
        this.app = app;
        this.onGameSelected = onGameSelected;
        this.cont = this.addChild(new PIXI.Container());

        this.backgroundGraphics = new PIXI.Graphics();
        this.bar = new PIXI.Graphics();
        this.categoriesContainer = new PIXI.Container();
        this.scrollContainer = new PIXI.Container();

        this.cont.addChild(this.backgroundGraphics);
        this.cont.addChild(this.bar);
        this.cont.addChild(this.categoriesContainer);

        this.categoriesContainer.addChild(this.scrollContainer);

        this.addCategories();

        this.onResize = this.onResize.bind(this);
        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    // private loadGameComponent(
    //     scrollContainer: PIXI.Container,
    //     componentFactory: (
    //         app: PIXI.Application,
    //         scrollContainer: PIXI.Container
    //     ) => PIXI.Container,
    //     app: PIXI.Application
    // ) {
    //     if (this.currentGameContainer) {
    //         app.stage.removeChild(this.currentGameContainer);
    //         this.currentGameContainer.destroy({ children: true });
    //     }

    //     scrollContainer.visible = false;

    //     this.currentGameContainer = componentFactory(app, scrollContainer);
    //     app.stage.addChild(this.currentGameContainer);
    // }

    private addCategories(): void {
        const itemSpacing = 260;
        const itemWidth = 250;

        games.forEach((game, index) => {
            const sprite = PIXI.Sprite.from(game.image);
            sprite.interactive = true;
            sprite.buttonMode = true;

            sprite.x =
                game.name === "EGT"
                    ? index  * itemSpacing + 90
                    : index * itemSpacing;
            sprite.y = 10;
            sprite.width = game.name === "EGT" ? 100 : itemWidth;
            sprite.height = game.name === "EGT" ? 100 : 120;

            // sprite.on("pointerdown", () => {
            //     this.loadGameComponent(
            //         this.scrollContainer,
            //         game.component,
            //         this.app
            //     );
            // });

            sprite.on("pointerdown", () => {
                const component = game.component(
                    this.app,
                    this.scrollContainer
                );
                this.onGameSelected(component);
            });

            this.scrollContainer.addChild(sprite);
        });
    }

    onResize(_data: any) {
        const screenWidth = _data.w / _data.scale;
        const barHeight = 150;

        // --- Background Bar ---
        this.backgroundGraphics.clear();
        this.backgroundGraphics.beginFill(0x060922);
        this.backgroundGraphics.drawRoundedRect(
            0,
            0,
            screenWidth,
            barHeight,
            20
        );
        this.backgroundGraphics.endFill();

        // --- Neon Border ---
        this.bar.clear();
        this.bar.lineStyle(4, 0xff00ff, 1);
        this.bar.drawRoundedRect(0, 0, screenWidth, barHeight, 20);

        // --- Categories Centering or Scroll Logic ---
        const itemSpacing = 260;
        const totalWidth = games.length * itemSpacing;

        if (totalWidth < screenWidth) {
            this.scrollContainer.x = (screenWidth - totalWidth) / 2;
        } else {
            this.scrollContainer.x = 20; // default left padding
        }

        this.categoriesContainer.y = 10;
    }
}

// class TopBack extends PIXI.Sprite {
//     user: PIXI.Sprite = new PIXI.Sprite();
//     settings: PIXI.Sprite = new PIXI.Sprite();
//     upperPannel: PIXI.Sprite = new PIXI.Sprite();
//     grandJackpotText: PIXI.Sprite = new PIXI.Sprite();
//     jackpotPrice: PIXI.Sprite = new PIXI.Sprite();

//     constructor() {
//         super();
//         const styletext = new PIXI.TextStyle({
//             fontFamily: "BeVietnamPro",
//             fontSize: "52px",
//             fill: ["#FFF997", "#CB9F00", "#FFF997"],
//             dropShadow: true,
//             dropShadowBlur: 2,
//             dropShadowColor: "#000000",
//             dropShadowDistance: 4,
//             align: "center",
//             fontWeight: "700",
//         });

//         this.upperPannel = this.addChild(
//             new PIXI.Sprite(PIXI.Texture.from("images/frenzy/upper_panel.png"))
//         );

//         this.grandJackpotText = this.addChild(
//             new PIXI.Sprite(
//                 PIXI.Texture.from("images/frenzy/grand_jackpot.png")
//             )
//         );
//         this.jackpotPrice = this.addChild(
//             new PIXI.Sprite(
//                 PIXI.Texture.from("images/frenzy/jackpot_value.png")
//             )
//         );

//         const jackpotValue = this.jackpotPrice.addChild(
//             new PIXI.Text("1196.93", styletext)
//         );
//         jackpotValue.x = 370 - jackpotValue.width / 2;
//         jackpotValue.y = 40;

//         this.user = this.addChild(new UserBlock());
//         this.user.y = 20;
//         this.user.x = 30;
//         this.user.scale.set(0.8);

//         this.settings = this.addChild(new Settings());
//         this.settings.y = 30;
//         this.settings.scale.set(0.7);

//         this.onResize = this.onResize.bind(this);
//         EE.addListener("RESIZE", this.onResize);
//         EE.emit("FORCE_RESIZE");
//     }

//     onResize(_data: any) {
//         this.grandJackpotText.x = _data.w / _data.scale / 2 - 220;
//         this.grandJackpotText.y = 20;
//         this.grandJackpotText.scale = { x: 0.7, y: 0.7 };

//         this.jackpotPrice.x = _data.w / _data.scale / 2 - 300;
//         this.jackpotPrice.y = 70;
//         this.jackpotPrice.scale = { x: 0.8, y: 0.8 };

//         this.upperPannel.width = _data.w / _data.scale;
//         this.upperPannel.height = 170;
//         this.upperPannel.y = -10;

//         this.settings.x = _data.w / _data.scale - 400;
//     }
// }

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

// class UserBlock extends PIXI.Sprite {
//     user: PIXI.Sprite;
//     newsButton: PIXI.Sprite = new PIXI.Sprite();

//     constructor() {
//         super();
//         const styletext = new PIXI.TextStyle({
//             fontFamily: "BeVietnamPro",
//             fontSize: "29px",
//             fill: ["#000000", "#000000"],
//             dropShadow: true,
//             dropShadowBlur: 1,
//             dropShadowColor: "#ffff54",
//             dropShadowDistance: 3,
//             align: "center",
//             fontWeight: "700",
//         });

//         const styletext2 = new PIXI.TextStyle({
//             fontFamily: "Bronzier",
//             fontSize: "28px",
//             fill: ["#ffff54", "#ffff54"],
//             align: "center",
//             fontWeight: "700",
//         });

//         this.user = this.addChild(
//             new PIXI.Sprite(PIXI.Texture.from("images/frenzy/user_profile.png"))
//         );

//         this.newsButton = this.addChild(
//             new PIXI.Sprite(
//                 PIXI.Texture.from("images/frenzy/news/news_btn.png")
//             )
//         );

//         this.newsButton.interactive = true;
//         this.newsButton.buttonMode = true;

//         this.newsButton.on("pointerdown", () => {
//             EE.emit("SHOW_NEWS");
//         });

//         const userName = this.user.addChild(
//             new PIXI.Text("USER123", styletext)
//         );
//         userName.x = 350 - userName.width / 2;
//         userName.y = 25;

//         const coinValue = this.user.addChild(
//             new PIXI.Text("1265.55", styletext2)
//         );
//         coinValue.x = 350 - coinValue.width / 2;
//         coinValue.y = 68;

//         this.user.interactive = true;
//         this.user.buttonMode = true;

//         this.user.on("pointerdown", () => {
//             EE.emit("SHOW_INFO");
//         });

//         this.user.height = 194;

//         this.onResize = this.onResize.bind(this);
//         EE.addListener("RESIZE", this.onResize);
//         EE.emit("FORCE_RESIZE");
//     }

//     onResize(_data: any) {
//         this.newsButton.x = 520;
//         this.newsButton.y = 23;
//         this.newsButton.scale.set(0.9);
//     }
// }
