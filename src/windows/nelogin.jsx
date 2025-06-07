import React from "react";
import * as PIXI from "pixi.js";
import { Application, Container } from "pixi.js";
import { EE } from "../App";
import { PAGE_SIZE_DEFAULT } from "../common/Config";

function loadAssets(assetList) {
    return new Promise((resolve, reject) => {
        const loader = new PIXI.Loader();
        assetList.forEach((asset) => {
            loader.add(asset.name, asset.url);
        });
        loader.load((loader, resources) => {
            resolve(resources);
        });
        loader.onError.add((err) => {
            reject(err);
        });
    });
}

const assets = [{ name: "background", url: "/images/frenzy/login/bg2.png" }];

export class PixiPinLogin extends React.Component {
    constructor(props) {
        super(props);
        this.pixiRef = React.createRef();
        this.app = null;
        this.stage = null;
          this.bgSprite = null; // <-- store background sprite
        this.resources = null;
      
        this.state = {
            rememberMe: false,
            layoutName: "default",
            inputNode: "password",
            pinValue: "",
        };
    }

    componentDidMount() {
        this.app = new Application({
            width: PAGE_SIZE_DEFAULT.width,
            height: PAGE_SIZE_DEFAULT.height,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        this.pixiRef.current.appendChild(this.app.view);
        this.stage = new Container();
        this.app.stage.addChild(this.stage);

     

          loadAssets(assets)
            .then((resources) => {
                this.resources = resources;
                // Create background sprite ONCE and add to app.stage (behind this.stage)
                if (
                    resources.background &&
                    resources.background.texture
                ) {
                    this.bgSprite = new PIXI.Sprite(resources.background.texture);
                    this.bgSprite.x = 0;
                    this.bgSprite.y = 0;
                    this.bgSprite.width = this.app.renderer.width;
                    this.bgSprite.height = this.app.renderer.height;
                    this.app.stage.addChildAt(this.bgSprite, 0);
                }
                this.renderUI();
            })
            .catch((error) => {
                console.error("Failed to load assets:", error);
                this.resources = null;
                // fallback: solid color
                this.bgSprite = new PIXI.Graphics();
                this.bgSprite.beginFill(0x000000);
                this.bgSprite.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height);
                this.bgSprite.endFill();
                this.app.stage.addChildAt(this.bgSprite, 0);
                this.renderUI();
            });

        EE.addListener("RESIZE", this.onResize);
        window.addEventListener("resize", this.handleWindowResize);
        this.handleWindowResize();
    }

    componentWillUnmount() {
        this.app.destroy(true, true);
        EE.removeListener("RESIZE", this.onResize);
        window.removeEventListener("resize", this.handleWindowResize);
    }

    handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        EE.emit("RESIZE", { w: width, h: height });
    };

   onResize = (data) => {
        this.app.renderer.resize(data.w, data.h);

        // Resize background to fill window
        if (this.bgSprite) {
            this.bgSprite.width = data.w;
            this.bgSprite.height = data.h;
        }

        // Scale and center UI stage as before
        const scale = Math.min(
            data.h / PAGE_SIZE_DEFAULT.height,
            data.w / PAGE_SIZE_DEFAULT.width
        );
        this.stage.scale.set(scale);
        this.stage.x = (data.w - PAGE_SIZE_DEFAULT.width * scale) / 2;
        this.stage.y = (data.h - PAGE_SIZE_DEFAULT.height * scale) / 2;

        this.renderUI();
    };
    renderUI = () => {
        this.stage.removeChildren();
    

        const headerContainer = new PIXI.Container();
        const pinDisplayContainer = new PIXI.Container();
        const keypadContainer = new PIXI.Container();
        const rememberPinContainer = new PIXI.Container();

        this.stage.addChild(headerContainer);
        this.stage.addChild(pinDisplayContainer);
        this.stage.addChild(keypadContainer);
        this.stage.addChild(rememberPinContainer);

        this.renderHeader(headerContainer);
        this.renderPinDisplay(pinDisplayContainer);
        this.renderKeypad(keypadContainer);
        this.renderRememberPin(rememberPinContainer);

        const buttonWidth = 200;
        const buttonSpacing = 30;
        const keypadColumns = 3;
        const totalKeypadWidth =
            (buttonWidth + buttonSpacing) * (keypadColumns - 1) + buttonWidth;

        keypadContainer.x = (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
        keypadContainer.y = PAGE_SIZE_DEFAULT.height * 0.4;

        pinDisplayContainer.x =
            (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
        pinDisplayContainer.y = PAGE_SIZE_DEFAULT.height * 0.25;

        // headerContainer.x = (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
        headerContainer.y = PAGE_SIZE_DEFAULT.height * 0.1;

        rememberPinContainer.x =
            (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
        rememberPinContainer.y = PAGE_SIZE_DEFAULT.height * 0.87;
    };

    renderHeader = (container) => {
        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 100,
            fill: [0x00ffff, 0x0000ff],
            stroke: 0xffffff,
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: 0x0000ff,
            dropShadowBlur: 10,
            dropShadowDistance: 5,
        });
        const headerText = new PIXI.Text("Enter your pin", style);
        headerText.anchor.set(0.5);
        headerText.x = PAGE_SIZE_DEFAULT.width / 2;
        headerText.y = 0;
        container.addChild(headerText);
    };

    renderPinDisplay = (container) => {
        const buttonWidth = 200;
        const buttonSpacing = 30;
        const keypadColumns = 3;
        const totalKeypadWidth =
            (buttonWidth + buttonSpacing) * (keypadColumns - 1) + buttonWidth;
        const ovalWidth = totalKeypadWidth;
        const ovalHeight = 90;

        const oval = new PIXI.Graphics();
        const gradientTexture = this.generateGradientTexture(
            ovalWidth,
            ovalHeight,
            [0x0000ff, 0xff00ff],
            [1, 1]
        );
        oval.beginTextureFill({ texture: gradientTexture });
        oval.drawRoundedRect(0, 0, ovalWidth, ovalHeight, ovalHeight / 2);
        oval.endFill();
        oval.x = 0;
        oval.y = 0;

        const pinText = new PIXI.Text(this.state.pinValue, {
            fontFamily: "Arial",
            fontSize: 50,
            fill: 0xffffff,
            align: "center",
        });
        pinText.anchor.set(0.5);
        pinText.x = ovalWidth / 2;
        pinText.y = ovalHeight / 2;

        container.addChild(oval);
        container.addChild(pinText);
    };

    renderKeypad = (container) => {
        const buttonWidth = 200;
        const buttonHeight = 100;
        const buttonSpacing = 30;
        const rows = [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["C", "0", "OK"],
        ];

        const buttons = {};

        rows.forEach((row, rowIndex) => {
            row.forEach((digit, colIndex) => {
                const btn = new PIXI.Graphics();
                const gradientTexture = this.generateGradientTexture(
                    buttonWidth,
                    buttonHeight,
                    [0x0000ff, 0xff00ff],
                    [1, 1]
                );
                btn.beginTextureFill({ texture: gradientTexture });
                btn.drawRoundedRect(
                    0,
                    0,
                    buttonWidth,
                    buttonHeight,
                    buttonHeight / 2
                );
                btn.endFill();
                btn.x = colIndex * (buttonWidth + buttonSpacing);
                btn.y = rowIndex * (buttonHeight + buttonSpacing);
                btn.interactive = true;
                btn.buttonMode = true;
                btn.on("pointerdown", () => this.handlePinInput(digit));
                container.addChild(btn);
                buttons[digit] = btn;

                const txt = new PIXI.Text(digit, {
                    fontFamily: "Arial",
                    fontSize: 35,
                    fill: 0xffffff,
                    align: "center",
                });
                txt.anchor.set(0.5);
                txt.x = btn.x + buttonWidth / 2;
                txt.y = btn.y + buttonHeight / 2;
                container.addChild(txt);
            });
        });

        const cButton = buttons["C"];
        const okButton = buttons["OK"];

        const cGradientTexture = this.generateGradientTexture(
            buttonWidth,
            buttonHeight,
            [0xff00ff, 0xff00ff],
            [1, 1]
        );
        cButton.clear();
        cButton.beginTextureFill({ texture: cGradientTexture });
        cButton.drawRoundedRect(
            0,
            0,
            buttonWidth,
            buttonHeight,
            buttonHeight / 2
        );
        cButton.endFill();

        const okGradientTexture = this.generateGradientTexture(
            buttonWidth,
            buttonHeight,
            [0x00ff00, 0x00ff00],
            [1, 1]
        );
        okButton.clear();
        okButton.beginTextureFill({ texture: okGradientTexture });
        okButton.drawRoundedRect(
            0,
            0,
            buttonWidth,
            buttonHeight,
            buttonHeight / 2
        );
        okButton.endFill();
    };

    renderRememberPin = (container) => {
        const checkbox = new PIXI.Graphics();
        checkbox.beginFill(0x0000ff);
        checkbox.lineStyle(4, 0xffffff, 1);
        checkbox.drawRoundedRect(0, 0, 40, 40, 5);
        checkbox.endFill();
        checkbox.x = 0;
        checkbox.y = 0;
        checkbox.interactive = true;
        checkbox.buttonMode = true;

        let isChecked = this.state.rememberMe;
        checkbox.on("pointerdown", () => {
            isChecked = !isChecked;
            this.setState({ rememberMe: isChecked });
            if (isChecked) {
                checkbox.clear();
                checkbox.beginFill(0x00ff00);
                checkbox.lineStyle(4, 0xffffff, 1);
                checkbox.drawRoundedRect(0, 0, 40, 40, 5);
                checkbox.endFill();
                const checkmark = new PIXI.Graphics();
                checkmark.lineStyle(4, 0xffffff, 1);
                checkmark.moveTo(10, 20);
                checkmark.lineTo(25, 35);
                checkmark.lineTo(35, 25);
                checkmark.x = checkbox.x + 5;
                checkmark.y = checkbox.y + 5;
                container.addChild(checkmark);
                checkbox.checkmark = checkmark;
            } else {
                if (checkbox.checkmark) {
                    container.removeChild(checkbox.checkmark);
                    delete checkbox.checkmark;
                }
                checkbox.clear();
                checkbox.beginFill(0x0000ff);
                checkbox.lineStyle(4, 0xffffff, 1);
                checkbox.drawRoundedRect(0, 0, 40, 40, 5);
                checkbox.endFill();
            }
        });

        container.addChild(checkbox);

        const rememberText = new PIXI.Text("Remember my pin", {
            fontFamily: "Arial",
            fontSize: 50,
            fill: 0xffffff,
            align: "left",
        });
        rememberText.x = 50;
        rememberText.y = -5;
        container.addChild(rememberText);
    };

    generateGradientTexture = (width, height, colors, alphas) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        colors.forEach((color, i) => {
            gradient.addColorStop(
                i / (colors.length - 1),
                PIXI.utils.hex2string(color)
            );
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        return PIXI.Texture.from(canvas);
    };

    handlePinInput = (digit) => {
        if (digit === "C") {
            this.setState({ pinValue: "" }, this.refreshPinDisplay);
        } else if (digit === "OK") {
            console.log("PIN submitted:", this.state.pinValue);
            EE.emit("GO_GAME");
        } else {
            this.setState(
                (prev) => ({
                    pinValue:
                        prev.pinValue.length >= 10
                            ? prev.pinValue
                            : prev.pinValue + digit,
                }),
                this.refreshPinDisplay
            );
        }
    };

    refreshPinDisplay = () => {
        this.renderUI();
    };

    handlePinBackspace = () => {
        if (this.state.pinValue.length > 0) {
            this.setState(
                (prev) => ({
                    pinValue: prev.pinValue.slice(0, -1),
                }),
                this.refreshPinDisplay
            );
        }
    };

    onLoginClick = () => {
        console.log("Login with PIN:", this.state.pinValue);
        EE.emit("GO_GAME");
    };

    render() {
        return (
            <div ref={this.pixiRef} style={{ width: "100%", height: "100%" }} />
        );
    }
}
