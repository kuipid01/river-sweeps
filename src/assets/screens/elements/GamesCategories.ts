import * as PIXI from "pixi.js";

export const games = [
    // You must provide app and scrollContainer when calling component()
    {
        name: "ALL",
        image: "/images/frenzy/games/all.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new AllGames(app, scrollContainer),
    },
    {
        name: "Amatic",
        image: "/images/frenzy/games/matic.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
    },
    {
        name: "Netent",
        image: "/images/frenzy/games/netent.png",
        component: (app: PIXI.Application, scrollContainer: PIXI.Container) =>
            new FishingGame(app, scrollContainer),
    },
    //   { name: 'Table', image: 'assets/table.png', component: () => new TableGame() },
    //   { name: 'NetEnt', image: 'assets/netent.png', component: () => new NetEntGame() },
    // ...add more
];

class FishingGame extends PIXI.Container {
    constructor(app: PIXI.Application, scrollContainer: PIXI.Container) {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x003344);
        bg.drawRect(0, 0, app.screen.width, app.screen.height);
        bg.endFill();
        this.addChild(bg);

        const label = new PIXI.Text("🎣 Fishing Game", {
            fill: "#ffffff",
            fontSize: 40,
        });
        label.x = 100;
        label.y = 100;
        this.addChild(label);

        const back = new PIXI.Text("<< Back", {
            fill: "#ffcc00",
            fontSize: 24,
        });
        back.interactive = true;
        back.buttonMode = true;
        back.x = 100;
        back.y = 200;
        back.on("pointerdown", () => {
            app.stage.removeChild(this);
            this.destroy({ children: true });
            scrollContainer.visible = true;
        });
        this.addChild(back);
    }
}

class AllGames extends PIXI.Container {
    constructor(app: PIXI.Application, scrollContainer: PIXI.Container) {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x003344);
        bg.drawRect(0, 0, app.screen.width, app.screen.height);
        bg.endFill();
        this.addChild(bg);

        const label = new PIXI.Text("<<All Ganes ", {
            fill: "#ffcc00",
            fontSize: 24,
        });
        label.interactive = true;
        label.buttonMode = true;
        label.x = 100;
        label.y = 100;

        label.on("pointerdown", () => {
            app.stage.removeChild(this);
            this.destroy({ children: true });
            scrollContainer.visible = true;
        });
        this.addChild(label);
    }
}



