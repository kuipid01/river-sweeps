import * as PIXI from "pixi.js";
// import { HubDown } from "./elements/HubDown";
import { HubTop } from "./elements/HubTop";
// import { HubCategory } from "./elements/HubCategory";

export class Hub extends PIXI.Sprite {
    cont: PIXI.Sprite = new PIXI.Sprite();
    down: PIXI.Sprite = new PIXI.Sprite();
    app: PIXI.Application = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
    });
    private hubTop: HubTop;
    private currentGameComponent: PIXI.Container | null = null;
    constructor() {
        super();

        this.cont = this.addChild(new PIXI.Sprite());
        // You need to provide a PIXI.Application instance to HubTop's constructor
        this.hubTop = new HubTop(this.app, (component: PIXI.Container) => {
            this.setActiveGameComponent(component);
        });

        this.cont.addChild(this.hubTop);

        // this.down = new HubDown();
        // this.cont.addChild(this.down);
        // Add category tiles to HubTop (adjust if categories belong elsewhere)
        // const categories = ["ALL GAMES", "AMATIC", "FISHING", "TABLE GAMES", "NETENT", "EGT", "MAZD"];
        // categories.forEach((category, index) => {
        // 	const categoryTile = new HubCategory({ name: category, index });
        // 	hubTop.addChild(categoryTile); // Add categories to HubTop
        // });
        // this.down = this.cont.addChild(new HubDown());
        //set watermark
        //setWatermark(true);
    }

    private setActiveGameComponent(component: PIXI.Container) {
        if (this.currentGameComponent) {
            this.removeChild(this.currentGameComponent);
            this.currentGameComponent.destroy({ children: true });
        }

        this.currentGameComponent = component;
        this.addChild(this.currentGameComponent);
    }
}
