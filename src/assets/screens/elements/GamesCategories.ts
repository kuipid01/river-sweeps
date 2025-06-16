import * as PIXI from "pixi.js";
import { EE } from "../../../App";

export const games = [
    // You must provide app and scrollContainer when calling component()
    {
        name: "ALL",
        image: "/images/frenzy/games/all.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new AllGames(app, scrollContainer),
        customSize: {
            width: 200,
            height: 70,
        },
    },
    {
        name: "Amatic",
        image: "/images/frenzy/games/matic.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 200,
            height: 70,
        },
    },
    {
        name: "Netent",
        image: "/images/frenzy/games/netent.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 200,
            height: 70,
        },
    },
    {
        name: "fISHING",
        image: "/images/frenzy/games/FISH.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 200,
            height: 70,
        },
    },
    {
        name: "EGT",
        image: "/images/frenzy/games/egt.svg",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 70,
            height: 70,
        },
    },
    {
        name: "TABLE GAMES",
        image: "/images/frenzy/games/table-games.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 180,
            height: 100,
        },
    },
    {
        name: "WAZDAN GAMES",
        image: "/images/frenzy/games/wazdan.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
        customSize: {
            width: 250,
            height: 100,
        },
    },
    //   { name: 'Table', image: 'assets/table.png', component: () => new TableGame() },
    //   { name: 'NetEnt', image: 'assets/netent.png', component: () => new NetEntGame() },
    // ...add more
];

class FishingGame extends PIXI.Container {
    private backgroundGraphics: PIXI.Graphics;

    constructor(app: PIXI.Application, scrollContainer: PIXI.Container) {
        super();

        this.backgroundGraphics = new PIXI.Graphics();
        this.addChild(this.backgroundGraphics);

        this.drawBackground(app.screen.width, app.screen.height);

        const label = new PIXI.Text("🎣 Fishing Game", {
            fill: "#ffffff",
            fontSize: 40,
            fontFamily: "Arial",
        });
        label.x = 100;
        label.y = 100;
        this.addChild(label);

        const back = new PIXI.Text("<< Back", {
            fill: "#ffcc00",
            fontSize: 24,
            fontFamily: "Arial",
        });
        back.interactive = true;
        back.buttonMode = true;
        back.x = 100;
        back.y = 200;
        back.on("pointerdown", () => {
            EE.removeListener("RESIZE", this.onResize);
            app.stage.removeChild(this);
            this.destroy({ children: true, texture: true, baseTexture: true });
            scrollContainer.visible = true;
        });
        this.addChild(back);

        // Bind and listen to resize
        this.onResize = this.onResize.bind(this);
        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    private drawBackground(width: number, height: number) {
        if (!this.backgroundGraphics) return;
        this.backgroundGraphics.clear();
        this.backgroundGraphics.beginFill(0x003344);
        this.backgroundGraphics.drawRect(0, 0, width, height);
        this.backgroundGraphics.endFill();
    }

    onResize(_data: any) {
        const screenWidth = _data.w / _data.scale;
        const screenHeight = _data.h / _data.scale;
        this.drawBackground(screenWidth, screenHeight);
    }
}

export class AllGames extends PIXI.Container {
    private backgroundGraphics: PIXI.Graphics;
    
    constructor(app: PIXI.Application, scrollContainer: PIXI.Container) {
        super();
        this.backgroundGraphics = new PIXI.Graphics();
        this.addChild(this.backgroundGraphics);
          const bgY = 200;
        this.drawBackground(app.screen.width, app.screen.height- bgY);
        const screenWidth = app.screen.width;
        const screenHeight = app.screen.height;
      
        const backgroundHeight = screenHeight - bgY;

        console.log("Screen:", screenWidth, screenHeight);

        // Main background
        const bg = new PIXI.Graphics();
        bg.beginFill(0xd20103);
        bg.drawRect(0, 0, screenWidth, backgroundHeight);
        bg.endFill();
        bg.y = bgY;
        bg.x = 0;
        this.addChild(bg);

        // Debug Red Overlay (optional)
        // const redBox = new PIXI.Graphics();
        // redBox.beginFill(0xff0000, 0.3);
        // redBox.drawRect(0, 0, screenWidth, screenHeight);
        // redBox.endFill();
        // app.stage.addChild(redBox);

        // Back label
        const backLabel = new PIXI.Text("<< All Games", {
            fill: "#FFFFF",
            fontSize: 28,
            fontFamily: "Arial",
            fontWeight: "bold",
            dropShadow: true,
            dropShadowColor: "#000",
            dropShadowDistance: 2,
        });
        backLabel.interactive = true;
        backLabel.buttonMode = true;
        // backLabel.x = 30;
        // backLabel.y = bgY + 20;
        backLabel.x = 100;
        backLabel.y = 100;

        backLabel.on("pointerdown", () => {
            EE.removeListener("RESIZE", this.onResize);
            app.stage.removeChild(this);
            this.destroy({ children: true, texture: true, baseTexture: true });
            scrollContainer.visible = true;
        });

        this.addChild(backLabel);

        // Categories section
        const contentArea = new PIXI.Container();
        contentArea.y = bgY + 80;
        this.addChild(contentArea);

        const categories = [
            "Action",
            "Slots",
            "Fishing",
            "Table Games",
            "Arcade",
        ];
        let currentX = 30;
        const spacing = 60;

        categories.forEach((name) => {
            const cat = new PIXI.Text(name, {
                fontSize: 26,
                fill: "#ffffff",
                fontFamily: "Arial",
                fontWeight: "600",
            });
            cat.x = currentX;
            cat.y = 0;
            currentX += cat.width + spacing;
            contentArea.addChild(cat);
        });

        // Bind and listen to resize
        this.onResize = this.onResize.bind(this);
        EE.addListener("RESIZE", this.onResize);
        EE.emit("FORCE_RESIZE");
    }

    private drawBackground(width: number, height: number) {
        if (!this.backgroundGraphics) return;
        this.backgroundGraphics.clear();
        this.backgroundGraphics.beginFill(0x003344);
        this.backgroundGraphics.drawRect(0, 0, width, height);
        this.backgroundGraphics.endFill();
    }

    onResize(_data: any) {
        const screenWidth = _data.w / _data.scale;
        const screenHeight = _data.h / _data.scale;
        this.drawBackground(screenWidth, screenHeight);
    }
}
