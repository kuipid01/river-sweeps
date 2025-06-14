import * as PIXI from "pixi.js";
import { HubDown } from "./elements/HubDown";
import {HubTop} from "./elements/HubTop";
import {HubCategory} from "./elements/HubCategory";

export class Hub extends PIXI.Sprite{
	cont:PIXI.Sprite = new PIXI.Sprite();
	down:PIXI.Sprite = new PIXI.Sprite();

	constructor() {
		super();
		//
		this.cont = this.addChild(new PIXI.Sprite());
		const hubTop = new HubTop();
		this.cont.addChild(hubTop);
		// Add category tiles to HubTop (adjust if categories belong elsewhere)
		// const categories = ["ALL GAMES", "AMATIC", "FISHING", "TABLE GAMES", "NETENT", "EGT", "MAZD"];
		// categories.forEach((category, index) => {
		// 	const categoryTile = new HubCategory({ name: category, index });
		// 	hubTop.addChild(categoryTile); // Add categories to HubTop
		// });
		this.down = this.cont.addChild(new HubDown());
		//set watermark
		//setWatermark(true);
	}

}