
import React, { useState, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Application, Container, Sprite, Text, TextStyle, Graphics } from "pixi.js";
import { EE } from "../App";
import { PAGE_SIZE_DEFAULT } from "../common/Config";

const loadAssets = (assetList) => {
    return new Promise((resolve, reject) => {
        const loader = new PIXI.Loader();
        assetList.forEach((asset) => {
            console.log(`Loading asset: ${asset.name} from ${asset.url}`);
            loader.add(asset.name, asset.url);
        });
        loader.onProgress.add((loader) => {
            console.log(`Loading progress: ${loader.progress}%`);
        });
        loader.load((loader, resources) => {
            console.log("Assets loaded:", Object.keys(resources));
            resolve(resources);
        });
        loader.onError.add((err, loader, resource) => {
            console.error(`Error loading asset ${resource?.name}:`, err);
            reject(err);
        });
    });
};

const assets = [{ name: "background", url: "/images/frenzy/login/bg2.png" }];

const PixiPinLoginFnc = () => {
    const pixiRef = useRef(null);
    const appRef = useRef(null);
    const stageRef = useRef(null);
    const bgSpriteRef = useRef(null);
    const resourcesRef = useRef(null);

    const [state, setState] = useState({
        rememberMe: false,
        layoutName: "default",
        inputNode: "password",
        pinValue: "",
    });

    const generateGradientTexture = (width, height, colors, alphas) => {
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

    const renderHeader = (container) => {
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

    const renderPinDisplay = (container) => {
        const buttonWidth = 200;
        const buttonSpacing = 30;
        const keypadColumns = 3;
        const totalKeypadWidth =
            (buttonWidth + buttonSpacing) * (keypadColumns - 1) + buttonWidth;
        const ovalWidth = totalKeypadWidth;
        const ovalHeight = 90;

        const oval = new PIXI.Graphics();
        const gradientTexture = generateGradientTexture(
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

        const pinText = new PIXI.Text(state.pinValue, {
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

    const renderKeypad = (container) => {
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
                const gradientTexture = generateGradientTexture(
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
                btn.on("pointerdown", () => handlePinInput(digit));
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

        const cGradientTexture = generateGradientTexture(
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

        const okGradientTexture = generateGradientTexture(
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

    const renderRememberPin = (container) => {
        const checkbox = new PIXI.Graphics();
        checkbox.beginFill(0x0000ff);
        checkbox.lineStyle(4, 0xffffff, 1);
        checkbox.drawRoundedRect(0, 0, 40, 40, 5);
        checkbox.endFill();
        checkbox.x = 0;
        checkbox.y = 0;
        checkbox.interactive = true;
        checkbox.buttonMode = true;

        let isChecked = state.rememberMe;
        checkbox.on("pointerdown", () => {
            isChecked = !isChecked;
            setState((prev) => ({ ...prev, rememberMe: isChecked }));
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

    const renderUI = () => {
        if (stageRef.current) {
            stageRef.current.removeChildren();
            const headerContainer = new PIXI.Container();
            const pinDisplayContainer = new PIXI.Container();
            const keypadContainer = new PIXI.Container();
            const rememberPinContainer = new PIXI.Container();

            stageRef.current.addChild(headerContainer);
            stageRef.current.addChild(pinDisplayContainer);
            stageRef.current.addChild(keypadContainer);
            stageRef.current.addChild(rememberPinContainer);

            renderHeader(headerContainer);
            renderPinDisplay(pinDisplayContainer);
            renderKeypad(keypadContainer);
            renderRememberPin(rememberPinContainer);

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

            headerContainer.x = (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
            headerContainer.y = PAGE_SIZE_DEFAULT.height * 0.1;

            rememberPinContainer.x =
                (PAGE_SIZE_DEFAULT.width - totalKeypadWidth) / 2;
            rememberPinContainer.y = PAGE_SIZE_DEFAULT.height * 0.87;
        }
    };

    const handlePinInput = (digit) => {
        if (digit === "C") {
            setState((prev) => ({ ...prev, pinValue: "" }));
            refreshPinDisplay();
        } else if (digit === "OK") {
            console.log("PIN submitted:", state.pinValue);
            EE.emit("GO_GAME");
        } else {
            setState((prev) => ({
                ...prev,
                pinValue:
                    prev.pinValue.length >= 10
                        ? prev.pinValue
                        : prev.pinValue + digit,
            }));
            refreshPinDisplay();
        }
    };

    const refreshPinDisplay = () => {
        renderUI();
    };

    const handlePinBackspace = () => {
        if (state.pinValue.length > 0) {
            setState((prev) => ({
                ...prev,
                pinValue: prev.pinValue.slice(0, -1),
            }));
            refreshPinDisplay();
        }
    };

    const onLoginClick = () => {
        console.log("Login with PIN:", state.pinValue);
        EE.emit("GO_GAME");
    };

    const handleWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        EE.emit("RESIZE", { w: width, h: height });
    };

    const onResize = (data) => {
        if (appRef.current) {
            appRef.current.renderer.resize(data.w, data.h);
            if (bgSpriteRef.current) {
                bgSpriteRef.current.width = data.w;
                bgSpriteRef.current.height = data.h;
            }
            if (stageRef.current) {
                const scale = Math.min(
                    data.h / PAGE_SIZE_DEFAULT.height,
                    data.w / PAGE_SIZE_DEFAULT.width
                );
                stageRef.current.scale.set(scale);
                stageRef.current.x = (data.w - PAGE_SIZE_DEFAULT.width * scale) / 2;
                stageRef.current.y = (data.h - PAGE_SIZE_DEFAULT.height * scale) / 2;
                renderUI();
            }
        }
    };

    useEffect(() => {
        appRef.current = new Application({
            width: PAGE_SIZE_DEFAULT.width,
            height: PAGE_SIZE_DEFAULT.height,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        pixiRef.current.appendChild(appRef.current.view);
        stageRef.current = new Container();
        appRef.current.stage.addChild(stageRef.current);

        loadAssets(assets)
            .then((resources) => {
                resourcesRef.current = resources;
                if (resources.background && resources.background.texture) {
                    bgSpriteRef.current = new Sprite(resources.background.texture);
                    bgSpriteRef.current.x = 0;
                    bgSpriteRef.current.y = 0;
                    bgSpriteRef.current.width = appRef.current.renderer.width;
                    bgSpriteRef.current.height = appRef.current.renderer.height;
                    appRef.current.stage.addChildAt(bgSpriteRef.current, 0);
                } else {
                    console.error("Background texture not found in resources");
                    bgSpriteRef.current = new PIXI.Graphics();
                    bgSpriteRef.current.beginFill(0x000000);
                    bgSpriteRef.current.drawRect(
                        0,
                        0,
                        PAGE_SIZE_DEFAULT.width,
                        PAGE_SIZE_DEFAULT.height
                    );
                    bgSpriteRef.current.endFill();
                    appRef.current.stage.addChildAt(bgSpriteRef.current, 0);
                }
                renderUI();
            })
            .catch((error) => {
                console.error("Failed to load assets:", error);
                resourcesRef.current = null;
                bgSpriteRef.current = new PIXI.Graphics();
                bgSpriteRef.current.beginFill(0x000000);
                bgSpriteRef.current.drawRect(
                    0,
                    0,
                    PAGE_SIZE_DEFAULT.width,
                    PAGE_SIZE_DEFAULT.height
                );
                bgSpriteRef.current.endFill();
                appRef.current.stage.addChildAt(bgSpriteRef.current, 0);
                renderUI();
            });

        EE.addListener("RESIZE", onResize);
        window.addEventListener("resize", handleWindowResize);
        handleWindowResize();

        return () => {
            appRef.current.destroy(true, true);
            EE.removeListener("RESIZE", onResize);
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return <div ref={pixiRef} style={{ width: "100%", height: "100%" }} />;
};

export default PixiPinLoginFnc;
