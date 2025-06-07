import React from "react";
import * as PIXI from "pixi.js";
import {
    Application,
    Container,
    Sprite,
    Text,
    TextStyle,
    Graphics,
} from "pixi.js";
import { EE } from "../App";
import { PAGE_SIZE_DEFAULT } from "../common/Config";

/**
 * Utility function to load assets using PIXI's Loader.
 * @param {Array} assetList - Array of assets to load, each with a `name` and `url`.
 * @returns {Promise} - Resolves with loaded resources or rejects with an error.
 */
function loadAssets(assetList) {
    return new Promise((resolve, reject) => {
        const loader = new PIXI.Loader();
        // Add all assets to the loader
        assetList.forEach((asset) => {
            loader.add(asset.name, asset.url);
        });
        // Resolve when all assets are loaded
        loader.load((loader, resources) => {
            resolve(resources);
        });
        // Reject if there's an error during loading
        loader.onError.add((err) => {
            reject(err);
        });
    });
}
const assets = [
    { name: "background", url: "/images/frenzy/login/bg2.png" },
];

export class PixiPinLogin extends React.Component {
    constructor(props) {
        super(props);

        // Create a reference for the PIXI container in the DOM
        this.pixiRef = React.createRef();

        // Initialize PIXI application and stage
        this.app = null; // PIXI Application instance
        this.stage = null; // Root container for PIXI elements

        // Component state
        this.state = {
            rememberMe: false, // Checkbox for "Remember Me"
            layoutName: "default", // Layout name (unused in this example)
            inputNode: "password", // Indicates PIN input mode
            pinValue: "", // Stores the current PIN value
        };
    }

    /**
     * Lifecycle method: Called after the component is mounted.
     * Initializes the PIXI application, sets up event listeners, and renders the UI.
     */
    componentDidMount() {
        // Initialize the PIXI application
        this.app = new Application({
            width: PAGE_SIZE_DEFAULT.width, // Default width from config
            height: PAGE_SIZE_DEFAULT.height, // Default height from config

            backgroundAlpha: 0, // Transparent background
            resolution: window.devicePixelRatio || 1, // Use device pixel ratio
            autoDensity: true, // Automatically adjust for high-DPI screens
        });

        // Append the PIXI canvas to the DOM
        this.pixiRef.current.appendChild(this.app.view);

        // Create the root container for PIXI elements
        this.stage = new Container();
        this.app.stage.addChild(this.stage);
        // Load the assets
        loadAssets(assets)
            .then((resources) => {
                // Create a sprite for the background image
                const bgSprite = new PIXI.Sprite(resources.background.texture);

                // Set the position and scale of the background sprite
                bgSprite.x = 0;
                bgSprite.y = 0;
                bgSprite.width = this.app.renderer.width;
                bgSprite.height = this.app.renderer.height;

                // Add the background sprite to the stage
                this.stage.addChild(bgSprite);

                // Render the UI on top of the background
                this.renderUI();
            })
            .catch((error) => {
                console.error("Failed to load assets:", error);
            });


        // Add a resize listener to handle screen resizing
        EE.addListener("RESIZE", this.onResize);

        // Trigger a forced resize event to ensure proper scaling
        EE.emit("FORCE_RESIZE");
    }

    /**
     * Lifecycle method: Called before the component is unmounted.
     * Cleans up the PIXI application and removes event listeners.
     */
    componentWillUnmount() {
        // Destroy the PIXI application and free resources
        this.app.destroy(true, true);

        // Remove the resize event listener
        EE.removeListener("RESIZE", this.onResize);
    }

    /**
     * Handles screen resizing by scaling the stage proportionally.
     * @param {Object} data - Contains the new width (`data.w`) and height (`data.h`).
     */
    onResize = (data) => {
        const scale = Math.min(
            data.h / PAGE_SIZE_DEFAULT.height, // Scale based on height
            data.w / PAGE_SIZE_DEFAULT.width // Scale based on width
        );
        this.stage.scale.set(scale + 0.01); // Apply scaling to the stage
    };

    /**
     * Renders the UI elements, including the logo, PIN input, and buttons.
     */
    renderUI = () => {
        // Create containers for different sections
        const headerContainer = new PIXI.Container();
        const pinDisplayContainer = new PIXI.Container();
        const keypadContainer = new PIXI.Container();
        const rememberPinContainer = new PIXI.Container();

        // Add containers to the stage
        this.stage.addChild(headerContainer);
        this.stage.addChild(pinDisplayContainer);
        this.stage.addChild(keypadContainer);
        this.stage.addChild(rememberPinContainer);

        // Render each section
        this.renderHeader(headerContainer);
        this.renderPinDisplay(pinDisplayContainer);
        this.renderKeypad(keypadContainer);
        this.renderRememberPin(rememberPinContainer);
        // Calculate the total width of the keypad
        const buttonWidth = 200;
        const buttonSpacing = 30;
        const keypadColumns = 3; // Number of columns in the keypad
        const totalKeypadWidth =
            (buttonWidth + buttonSpacing) * (keypadColumns - 1) + buttonWidth;

        // Center the keypad horizontally
        // keypadContainer.x = this.app.renderer.width / 2 - totalKeypadWidth / 1.5;
        keypadContainer.x =
            this.app.renderer.width / 2 - totalKeypadWidth / 1.5;

        // Position the keypad below the PIN indicators
        keypadContainer.y = 100; // Fixed vertical position below the PIN indicators
    };

    renderHeader = (container) => {
        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 80,
            fill: [0x00ffff, 0x0000ff], // Gradient from cyan to blue
            stroke: 0xffffff, // White stroke
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: 0x0000ff,
            dropShadowBlur: 10,
            dropShadowDistance: 5,
        });

        const headerText = new PIXI.Text("Enter your pin", style);
        headerText.anchor.set(0.5); // Center the text
        headerText.x = this.app.renderer.width / 2 - 80;
        headerText.y = 100;
        container.addChild(headerText);
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

        rows.forEach((row, rowIndex) => {
            row.forEach((digit, colIndex) => {
                const btn = new PIXI.Graphics();
                const gradientTexture = this.generateGradientTexture(
                    buttonWidth,
                    buttonHeight,
                    [0x0000ff, 0xff00ff], // Blue to pink gradient
                    [1, 1]
                );
                btn.beginTextureFill({ texture: gradientTexture });
                btn.drawRoundedRect(
                    0,
                    0,
                    buttonWidth,
                    buttonHeight,
                    buttonHeight / 2
                ); // Rounded rectangle as an oval
                btn.endFill();

                // Position the button
                btn.x = colIndex * (buttonWidth + buttonSpacing) + 50;
                btn.y = rowIndex * (buttonHeight + buttonSpacing) + 200;
                btn.interactive = true;
                btn.buttonMode = true;
                btn.on("pointerdown", () => this.handlePinInput(digit));
                container.addChild(btn);

                // // Add glow effect
                // const glowBtn = btn.clone();
                // glowBtn.alpha = 0.8;
                // const blurFilter = new PIXI.filters.BlurFilter();
                // blurFilter.blur = 10;
                // glowBtn.filters = [blurFilter];
                // container.addChild(glowBtn);

                // Add text to the button
                const txt = new PIXI.Text(digit, {
                    fontFamily: "Arial",
                    fontSize: 30,
                    fill: 0xffffff, // White text
                    align: "center",
                });
                txt.anchor.set(0.5);
                txt.x = btn.x + buttonWidth / 2;
                txt.y = btn.y + buttonHeight / 2;
                container.addChild(txt);
            });
        });

        // Special styling for "C" and "OK" buttons
        const cButton = container.children[10]; // "C" button
        const okButton = container.children[12]; // "OK" button

        // Style "C" button (pink)
        const cGradientTexture = this.generateGradientTexture(
            buttonWidth,
            buttonHeight,
            [0xff00ff, 0xff00ff], // Pink gradient
            [1, 1]
        );
        cButton.beginTextureFill({ texture: cGradientTexture });
        cButton.endFill();

        // Style "OK" button (green)
        const okGradientTexture = this.generateGradientTexture(
            buttonWidth,
            buttonHeight,
            [0x00ff00, 0x00ff00], // Green gradient
            [1, 1]
        );
        okButton.beginTextureFill({ texture: okGradientTexture });
        okButton.endFill();
    };
    renderPinDisplay = (container) => {
        const pinText = new PIXI.Text(this.state.pinValue, {
            fontFamily: "Arial",
            fontSize: 50,
            fill: 0xffffff,
            align: "center",
        });
        pinText.anchor.set(0.5);
        pinText.x = this.app.renderer.width / 2;
        pinText.y = 150;
        const buttonWidth = 200;
        const buttonSpacing = 30;
        const keypadColumns = 3; // Number of columns in the keypad
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
        oval.x = this.app.renderer.width / 2 - totalKeypadWidth / 1.7;
        oval.y = 170;

        // const glowOval = oval.clone();
        // glowOval.alpha = 0.8;
        // const blurFilter = new PIXI.filters.BlurFilter();
        // blurFilter.blur = 10;
        // glowOval.filters = [blurFilter];

        // container.addChild(glowOval);
        container.addChild(oval);
        container.addChild(pinText);
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
    renderRememberPin = (container) => {
        // Checkbox with gradient border and filled background
        const checkbox = new PIXI.Graphics();
        checkbox.beginFill(0x0000ff); // Initial fill color for the checkbox (blue)
        checkbox.lineStyle(4, 0xffffff, 1); // Gradient border
        checkbox.drawRoundedRect(0, 0, 40, 40, 5); // Rounded rectangle
        checkbox.endFill();

        checkbox.x = this.app.renderer.width / 2 - 380;
        checkbox.y = 850;

        // Add interactivity to the checkbox
        checkbox.interactive = true;
        checkbox.buttonMode = true;

        // Function to toggle the checkbox state
        let isChecked = false; // Track whether the checkbox is checked
        checkbox.on("pointerdown", () => {
            isChecked = !isChecked; // Toggle the checked state

            if (isChecked) {
                // Show the checkmark when checked
                checkbox.clear(); // Clear the current graphics
                checkbox.beginFill(0x00ff00); // Change fill color to green when checked
                checkbox.lineStyle(4, 0xffffff, 1); // Gradient border
                checkbox.drawRoundedRect(0, 0, 40, 40, 5); // Redraw the rounded rectangle
                checkbox.endFill();

                // Draw the checkmark
                const checkmark = new PIXI.Graphics();
                checkmark.lineStyle(4, 0xffffff, 1); // Gradient line
                checkmark.moveTo(10, 20);
                checkmark.lineTo(25, 35);
                checkmark.lineTo(35, 25);

                checkmark.x = checkbox.x + 5; // Center the checkmark within the checkbox
                checkmark.y = checkbox.y + 5;
                container.addChild(checkmark);

                // Store the checkmark so it can be removed if unchecked
                checkbox.checkmark = checkmark;
            } else {
                // Remove the checkmark when unchecked
                if (checkbox.checkmark) {
                    container.removeChild(checkbox.checkmark);
                    delete checkbox.checkmark;
                }

                // Reset the checkbox to its initial state
                checkbox.clear(); // Clear the current graphics
                checkbox.beginFill(0x0000ff); // Reset fill color to blue
                checkbox.lineStyle(4, 0xffffff, 1); // Gradient border
                checkbox.drawRoundedRect(0, 0, 40, 40, 5); // Redraw the rounded rectangle
                checkbox.endFill();
            }
        });

        container.addChild(checkbox);

        // Text for "Remember my pin"
        const rememberText = new PIXI.Text("Remember my pin", {
            fontFamily: "Arial",
            fontSize: 50,
            fontStyle: "normal",
            fill: 0xffffff,
            align: "left",
        });

        rememberText.x = this.app.renderer.width / 2 - 330; // Adjust position relative to the checkbox
        rememberText.y = 840;
        container.addChild(rememberText);
    };
    handlePinInput = (digit) => {
        if (digit === "C") {
            this.setState({ pinValue: "" }, this.refreshPinDisplay);
        } else if (digit === "OK") {
            console.log("PIN submitted:", this.state.pinValue);
        } else {
            this.setState(
                (prev) => ({ pinValue: prev.pinValue + digit }),
                this.refreshPinDisplay
            );
        }
    };
    /**
     * Creates the PIN input UI with glowing ovals and a keypad.
     */

    refreshPinDisplay = () => {
        this.stage.removeChildren();
        this.renderUI();
    };
    /**
     * Handles backspace functionality to remove the last digit from the PIN.
     */
    handlePinBackspace = () => {
        if (this.state.pinValue.length > 0) {
            this.setState(
                (prev) => ({
                    pinValue: prev.pinValue.slice(0, -1), // Remove the last digit
                }),
                this.refreshPinDisplay // Refresh the display to reflect the change
            );
        }
    };

    /**
     * Handles the login action when the login button is clicked or the PIN is complete.
     */
    onLoginClick = () => {
        console.log("Login with PIN:", this.state.pinValue); // Log the PIN value
        EE.emit("GO_GAME"); // Emit an event to navigate to the game screen
    };

    /**
     * Renders the React component.
     * @returns {JSX.Element} - A div element to hold the PIXI canvas.
     */
    render() {
        return (
            <div ref={this.pixiRef} style={{ width: "100%", height: "100%" }} />
        );
    }
}
