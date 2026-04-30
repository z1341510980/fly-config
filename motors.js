import { i as i18n$1, s as set, g as get } from './localization.js';
import { d as MSP, e as MSPCodes, m as mspHelper, G as GUI, l as reinitializeConnection, T as TABS, E as EscProtocols, p as updateTabList, t as tracking } from './js/main.js';
import { F as FC, o as getMixerImageSrc, d as API_VERSION_1_44, A as API_VERSION_1_42, p as mixerList, h as bit_check, m as isInt } from './common.js';
import { g as gui_log } from './gui_log.js';
import { $ } from './jquery.js';
import { s as semver } from './semver.js';
import './d3-transition.js';
import './d3-zoom.js';
import { l as linear } from './d3-scale.js';
import { e as extent } from './d3-array.js';
import { a as axisBottom, b as axisLeft } from './d3-axis.js';
import { l as line } from './d3-shape.js';
import { d as select } from './d3-selection.js';
import './i18next.js';
import './@babel.js';
import './i18next-xhr-backend.js';
import './window_watchers.js';
import './js/jquery.js';
import './@korzio.js';
import './jquery-ui.js';
import './jquery-textcomplete.js';
import './jquery-touchswipe.js';
import './select2.js';
import './multiple-select.js';
import './jbox.js';
import './vue.js';
import './@panter.js';
import './vue-runtime-helpers.js';
import './switchery-latest.js';
import './inflection.js';
import './short-unique-id.js';
import './lodash.debounce.js';
import './crypto-es.js';
import './three.js';
import './lru-cache.js';
import './yallist.js';
import './d3-dispatch.js';
import './d3-timer.js';
import './d3-interpolate.js';
import './d3-color.js';
import './d3-ease.js';
import './d3-format.js';
import './d3-path.js';

class MotorOutputReorderConfig
{
    constructor (screenSize)
    {
        this.FrameColor = 'rgb(186, 186, 186)';
        this.PropEdgeColor = 'rgb(255, 187, 0)';
        this.PropColor = 'rgb(186, 186, 186, 0.4)';
        this.PropEdgeLineWidth = 3;
        this.MotorNumberTextFont = `${screenSize * 0.1}px 'Open Sans', 'Segoe UI', Tahoma, sans-serif`;
        this.MotorNumberTextColor = 'rgb(0, 0, 0)';
        this.MotorMouseHoverColor = 'rgba(255, 187, 0, 0.4)';
        this.MotorSpinningColor = 'rgba(255, 0, 0, 0.4)';
        this.MotorReadyColor = 'rgba(0,128,0,0.4)';

        this.ArrowColor = 'rgb(182,67,67)';
        this.DirectionArrowPoints = [
            {x: -0.03 * screenSize, y:  0.11 * screenSize},
            {x: -0.03 * screenSize, y: -0.01 * screenSize},
            {x: -0.07 * screenSize, y: -0.01 * screenSize},
            {x:  0.0  * screenSize, y: -0.13 * screenSize},
            {x:  0.07 * screenSize, y: -0.01 * screenSize},
            {x:  0.03 * screenSize, y: -0.01 * screenSize},
            {x:  0.03 * screenSize, y:  0.11 * screenSize},
        ];

        //===========================================
        let frameRadius = 0.28 * screenSize;
        this["Quad X"] =
        {
            PropRadius: 0.2 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:  frameRadius,  y:  frameRadius},
                {x:  frameRadius,  y: -frameRadius},
                {x: -frameRadius,  y:  frameRadius},
                {x: -frameRadius,  y: -frameRadius},
            ],
        };

        //===========================================
        frameRadius = 0.28 * screenSize;
        this["Quad X 1234"] =
        {
            PropRadius: 0.2 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x: -frameRadius,  y: -frameRadius},
                {x:  frameRadius,  y: -frameRadius},
                {x:  frameRadius,  y:  frameRadius},
                {x: -frameRadius,  y:  frameRadius},
            ],
        };

        //===========================================
        frameRadius = 0.32 * screenSize;
        this["Quad +"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:            0,  y:  frameRadius},
                {x:  frameRadius,  y:  0          },
                {x: -frameRadius,  y:  0          },
                {x:            0,  y: -frameRadius},
            ],
        };

        //===========================================
        frameRadius = 0.30 * screenSize;
        this["Tricopter"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:            0,  y:  frameRadius},
                {x:  frameRadius,  y: -frameRadius},
                {x: -frameRadius,  y: -frameRadius},
            ],
        };

        //===========================================
        frameRadius = 0.35 * screenSize;
        this["Hex +"] =
        {
            PropRadius: 0.14 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors: [],
        };
        let dAngle = Math.PI / 3;
        let angle = 0;

        angle = dAngle * 1;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        angle = dAngle * 2;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        angle = -dAngle * 1;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        angle = -dAngle * 2;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        angle = dAngle * 3;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        angle = dAngle * 0;
        this["Hex +"].Motors.push({x: Math.sin(angle) * frameRadius, y: Math.cos(angle) * frameRadius});

        //===========================================
        frameRadius = 0.35 * screenSize;
        this["Hex X"] =
        {
            PropRadius: 0.14 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors: [],
        };
        dAngle = Math.PI / 3;

        angle = dAngle * 1;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = -dAngle * 1;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 2;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = -dAngle * 2;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 0;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 3;
        this["Hex X"].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        //===========================================
        this._addOcto("Octo Flat +", -Math.PI / 2.0, screenSize);
        this._addOcto("Octo Flat X", -Math.PI / 2.0 + Math.PI / 8.0, screenSize);
        this._addOctoX8(screenSize);
        this._addBicopter(screenSize);
        this._addVTailQuad(screenSize);
        this._addATailQuad(screenSize);
        this._addY4(screenSize);
        this._addY6(screenSize);
    }

    _addY6(screenSize)
    {
        const frameRadius = 0.30 * screenSize;
        this["Y6"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:            0,  y:  frameRadius * 0.7, top: true},
                {x:  frameRadius * 0.7,  y: -frameRadius * 0.7, top: true},
                {x: -frameRadius * 0.7,  y: -frameRadius * 0.7, top: true},
                {x:            0,  y:  frameRadius * 1.1, bottom: true},
                {x:  frameRadius * 1.1,  y: -frameRadius * 1.1, bottom: true},
                {x: -frameRadius * 1.1,  y: -frameRadius * 1.1, bottom: true},
            ],
        };
    }

    _addY4(screenSize)
    {
        const frameRadius = 0.30 * screenSize;
        this["Y4"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:            0,  y:  frameRadius * 0.7, top: true},
                {x:  frameRadius,  y: -frameRadius},
                {x:            0,  y:  frameRadius * 1.1, bottom: true},
                {x: -frameRadius,  y: -frameRadius},
            ],
        };
    }

    _addVTailQuad(screenSize)
    {
        const frameRadius = 0.30 * screenSize;
        this["V-tail Quad"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:  frameRadius * 0.7,  y:  frameRadius * 0.7},
                {x:  frameRadius,  y: -frameRadius},
                {x: -frameRadius * 0.7,  y:  frameRadius * 0.7},
                {x: -frameRadius,  y: -frameRadius},
            ],
        };
    }

    _addATailQuad(screenSize)
    {
        const frameRadius = 0.30 * screenSize;
        this["A-tail Quad"] =
        {
            PropRadius: 0.15 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x: -frameRadius * 0.7,  y:  frameRadius * 0.7},
                {x:  frameRadius,  y: -frameRadius},
                {x:  frameRadius * 0.7,  y:  frameRadius * 0.7},
                {x: -frameRadius,  y: -frameRadius},
            ],
        };
    }

    _addBicopter(screenSize)
    {
        const frameRadius = 0.35 * screenSize;
        this["Bicopter"] =
        {
            PropRadius: 0.2 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x: -frameRadius,  y: 0},
                {x:  frameRadius,  y: 0},
            ],
        };
    }

    _addOctoX8(screenSize)
    {
        const frameRadius = 0.20 * screenSize;
        const frameRadius2 = 0.28 * screenSize;
        this["Octo X8"] =
        {
            PropRadius: 0.12 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors:
            [
                {x:  frameRadius,  y:  frameRadius, top: true},
                {x:  frameRadius,  y: -frameRadius, top: true},
                {x: -frameRadius,  y:  frameRadius, top: true},
                {x: -frameRadius,  y: -frameRadius, top: true},
                {x:  frameRadius2,  y:  frameRadius2, bottom: true},
                {x:  frameRadius2,  y: -frameRadius2, bottom: true},
                {x: -frameRadius2,  y:  frameRadius2, bottom: true},
                {x: -frameRadius2,  y: -frameRadius2, bottom: true},
            ],
        };
    }

    _addOcto(frameName, rotateAngle, screenSize)
    {
        const frameRadius = 0.35 * screenSize;
        this[frameName] =
        {
            PropRadius: 0.10 * screenSize,
            ArmWidth: 0.1 * screenSize,
            Motors: [],
        };
        const dAngle = Math.PI / 4;

        let angle = -dAngle * 2 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 0 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 2 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 4 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = -dAngle * 1 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 1 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = dAngle * 3 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});

        angle = -dAngle * 3 + rotateAngle;
        this[frameName].Motors.push({x: Math.cos(angle) * frameRadius, y: Math.sin(angle) * frameRadius});
    }
}

class MotorOutputReorderCanvas
{
    constructor(canvas, droneConfiguration, motorClickCallback, spinMotorCallback)
    {
        this._spinMotorCallback = spinMotorCallback;
        this._canvas = canvas;
        this._motorClickCallback = motorClickCallback;
        this._width = this._canvas.width();
        this._height = this._canvas.height();
        this._screenSize = Math.min(this._width, this._height);

        this._config = new MotorOutputReorderConfig(this._screenSize);

        // no component resize allowing yet
        this._canvas.prop({
            width: this._width,
            height: this._height,
        });

        this._droneConfiguration = droneConfiguration;

        this._ctx = this._canvas[0].getContext("2d");
        this._ctx.translate(this._width / 2, this._height / 2);

        this._canvas.mousemove((event) =>
        {
            this._onMouseMove(event);
        });
        this._canvas.mouseleave(() =>
        {
            this._onMouseLeave();
        });
        this._canvas.mousedown(() =>
        {
            this._onMouseDown();
        });
        this._canvas.mouseup(() =>
        {
            this._onMouseUp(event);
        });
        this._canvas.click(() =>
        {
            this._onMouseClick();
        });

        this.startOver();
    }

    pause()
    {
        this._keepDrawing = false;
    }

    startOver()
    {
        this.readyMotors = []; //motors that already being selected for remapping by user
        this.remappingReady = false;
        this._motorIndexToSpinOnMouseDown = -1;
        this._keepDrawing = true;
        this._mouse = {x : 0, y: 0};
        window.requestAnimationFrame(() =>
        {
            this._drawOnce();
        });
    }

    _drawOnce()
    {
        this._ctx.clearRect(-this._width / 2,  -this._height / 2, this._width, this._height);

        this._drawBottomMotors();
        this._drawFrame();
        this._drawDirectionArrow();
        this._markMotors();
        this._drawTopMotors();

        if (this._keepDrawing) {
            window.requestAnimationFrame(() =>
            {
                this._drawOnce();
            });
        }
    }

    _onMouseDown()
    {
        if (this.remappingReady) {
            this._motorIndexToSpinOnMouseDown = this._getMouseHoverMotorIndex();

            if (this._spinMotorCallback) {
                this._spinMotorCallback(this._motorIndexToSpinOnMouseDown);
            }
        }
    }

    _onMouseUp()
    {
        if (-1 !== this._motorIndexToSpinOnMouseDown) {
            this._motorIndexToSpinOnMouseDown = -1;

            if (this._spinMotorCallback) {
                this._spinMotorCallback(this._motorIndexToSpinOnMouseDown);
            }
        }
    }

    _onMouseClick()
    {
        const motorIndex = this._getMouseHoverMotorIndex();

        if (this._motorClickCallback && -1 !== motorIndex && !this.readyMotors.includes(motorIndex)) {
            this._motorClickCallback(motorIndex);
        }
    }

    _onMouseMove(event)
    {
        const boundingRect = this._canvas[0].getBoundingClientRect();
        this._mouse.x = event.clientX - boundingRect.left - this._width / 2;
        this._mouse.y = event.clientY - boundingRect.top - this._height / 2;
    }

    _onMouseLeave()
    {
        this._mouse.x = Number.MIN_SAFE_INTEGER;
        this._mouse.y = Number.MIN_SAFE_INTEGER;

        if (-1 !== this._motorIndexToSpinOnMouseDown) {
            this._motorIndexToSpinOnMouseDown = -1;

            if (this._spinMotorCallback) {
                this._spinMotorCallback(this._motorIndexToSpinOnMouseDown);
            }
        }
    }

    _markMotors()
    {
        const motors = this._config[this._droneConfiguration].Motors;
        const mouseHoverMotorIndex = this._getMouseHoverMotorIndex();

        if (-1 === this._motorIndexToSpinOnMouseDown) {
            for (let i = 0; i < this.readyMotors.length; i++) {
                const motorIndex = this.readyMotors[i];
                this._ctx.beginPath();
                this._ctx.arc(motors[motorIndex].x, motors[motorIndex].y, this._config[this._droneConfiguration].PropRadius, 0, 2 * Math.PI);
                this._ctx.closePath();
                this._ctx.fillStyle = this._config.MotorReadyColor;
                this._ctx.fill();
            }

            if (-1 !== mouseHoverMotorIndex && !this.readyMotors.includes(mouseHoverMotorIndex)) {
                this._ctx.beginPath();
                this._ctx.arc(motors[mouseHoverMotorIndex].x, motors[mouseHoverMotorIndex].y, this._config[this._droneConfiguration].PropRadius, 0, 2 * Math.PI);
                this._ctx.closePath();
                this._ctx.fillStyle = this._config.MotorMouseHoverColor;
                this._ctx.fill();
            }
        } else {
            const spinningMotor = this._motorIndexToSpinOnMouseDown;

            for (let i = 0; i < motors.length; i++) {
                this._ctx.fillStyle = this._config.MotorReadyColor;
                if (spinningMotor === i) {
                    this._ctx.fillStyle = this._config.MotorSpinningColor;
                } else if (mouseHoverMotorIndex === i) {
                    this._ctx.fillStyle = this._config.MotorMouseHoverColor;
                }

                this._ctx.beginPath();
                this._ctx.arc(motors[i].x, motors[i].y, this._config[this._droneConfiguration].PropRadius, 0, 2 * Math.PI);
                this._ctx.closePath();
                this._ctx.fill();
            }
        }
    }

    _getMouseHoverMotorIndex()
    {
        const x = this._mouse.x;
        const y = this._mouse.y;

        let result = -1;
        let currentDist = Number.MAX_SAFE_INTEGER;
        let resultTopMotors = -1;
        const motors = this._config[this._droneConfiguration].Motors;

        for (let i = 0; i < motors.length; i++) {
            const dist = Math.sqrt((x - motors[i].x) * (x - motors[i].x) + (y - motors[i].y) * (y - motors[i].y));

            if (dist < this._config[this._droneConfiguration].PropRadius && dist < currentDist) {
                currentDist = dist;
                result = i;

                if ('top' in motors[i]) {
                    resultTopMotors = i;
                }
            }
        }

        if (resultTopMotors > -1) { // priority for top motors
            result = resultTopMotors;
        }

        return result;
    }

    _drawTopMotors()
    {
        this._drawMotors(false);
    }

    _drawBottomMotors()
    {
        this._drawMotors(true);
        this._clipTopMotors();
    }

    _clipTopMotors()
    {
        const motors = this._config[this._droneConfiguration].Motors;

        for (let i = 0; i < motors.length; i++) {
            if ('top' in motors[i]) {
                this._clipSingleMotor(i);
            }
        }
    }

    _drawMotors(drawBottom)
    {
        this._ctx.lineWidth = this._config.PropEdgeLineWidth;
        this._ctx.strokeStyle = this._config.PropEdgeColor;
        const motors = this._config[this._droneConfiguration].Motors;
        this._ctx.fillStyle = this._config.PropColor;

        for (let i = 0; i < motors.length; i++) {
            const drawCurrentMotor = 'bottom' in motors[i] === drawBottom;

            if (drawCurrentMotor) {
                this._drawSingleMotor(i);
            }
        }
    }

    _clipSingleMotor(motorIndex)
    {
        this._ctx.save();
        const motor = this._config[this._droneConfiguration].Motors[motorIndex];
        this._ctx.beginPath();
        const propRadius = this._config[this._droneConfiguration].PropRadius;
        this._arcSingleMotor(motorIndex);
        this._ctx.clip();
        this._ctx.clearRect(motor.x - propRadius, motor.y - propRadius, propRadius * 2, propRadius * 2);
        this._ctx.closePath();
        this._ctx.restore();
    }

    _drawSingleMotor(motorIndex)
    {
        this._ctx.beginPath();
        this._arcSingleMotor(motorIndex);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    _arcSingleMotor(motorIndex)
    {
        const motor = this._config[this._droneConfiguration].Motors[motorIndex];
        this._ctx.arc(motor.x, motor.y, this._config[this._droneConfiguration].PropRadius, 0, 2 * Math.PI);
    }

    _drawDirectionArrow()
    {
        this._ctx.beginPath();
        this._ctx.moveTo(this._config.DirectionArrowPoints[0].x, this._config.DirectionArrowPoints[0].y);

        for (let i = 1; i < this._config.DirectionArrowPoints.length; i++) {
            this._ctx.lineTo(this._config.DirectionArrowPoints[i].x, this._config.DirectionArrowPoints[i].y);
        }

        this._ctx.closePath();
        this._ctx.fillStyle = this._config.ArrowColor;
        this._ctx.fill();
    }

    _drawFrame()
    {
        this._ctx.beginPath();
        this._ctx.lineWidth = this._config[this._droneConfiguration].ArmWidth;
        this._ctx.lineCap = "round";
        this._ctx.strokeStyle = this._config.FrameColor;
        const motors = this._config[this._droneConfiguration].Motors;

        switch(this._droneConfiguration) {
            case "Quad X":
            case "Quad +":
            case "Octo X8":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                break;
            case "Quad X 1234":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(motors[3].x, motors[3].y);
                this._ctx.lineTo(motors[1].x, motors[1].y);
                break;
            case "Tricopter":
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[0].x, motors[2].y);
                break;
            case "Hex +":
            case "Hex X":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(motors[4].x, motors[4].y);
                this._ctx.lineTo(motors[5].x, motors[5].y);
                break;
            case "Octo Flat +":
            case "Octo Flat X":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                this._ctx.moveTo(motors[4].x, motors[4].y);
                this._ctx.lineTo(motors[6].x, motors[6].y);
                this._ctx.moveTo(motors[5].x, motors[5].y);
                this._ctx.lineTo(motors[7].x, motors[7].y);
                break;
            case "Bicopter":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[1].x, motors[1].y);
                break;
            case "V-tail Quad":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(0, motors[0].y * 1.3);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(0, motors[0].y * 1.3);
                this._ctx.lineTo(0, motors[1].y);
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                break;
            case "A-tail Quad":
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(0, motors[0].y * 0.7);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(0, motors[0].y * 0.7);
                this._ctx.lineTo(0, motors[1].y);
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                break;
            case "Y4":
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[3].x, motors[3].y);
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[0].x, motors[3].y);
                break;
            case "Y6":
                this._ctx.moveTo(motors[1].x, motors[1].y);
                this._ctx.lineTo(motors[2].x, motors[2].y);
                this._ctx.moveTo(motors[0].x, motors[0].y);
                this._ctx.lineTo(motors[0].x, motors[1].y);
                break;
            }

        this._ctx.stroke();
    }
}

class MotorOutputReorderComponent
{
    constructor(contentDiv, onLoadedCallback, droneConfiguration, motorStopValue, motorSpinValue)
    {
        this._contentDiv = contentDiv;
        this._onLoadedCallback = onLoadedCallback;
        this._droneConfiguration = droneConfiguration;
        this._motorStopValue = motorStopValue;
        this._motorSpinValue = motorSpinValue;
        this._config = new MotorOutputReorderConfig(100);

        this._currentJerkingTimeout = -1;
        this._currentJerkingMotor = -1;

        this._currentSpinningMotor = -1;

        this._contentDiv.load("./components/MotorOutputReordering/Body.html", () =>
        {
            this._setupdialog();
        });
    }

    _readDom()
    {
        this._domAgreeSafetyCheckBox = $('#motorsEnableTestMode-dialogMotorOutputReorder');
        this._domStartButton = $('#dialogMotorOutputReorderAgreeButton');
        this._domStartOverButton = $('#motorsRemapDialogStartOver');
        this._domSaveButton = $('#motorsRemapDialogSave');
        this._domMainContentBlock = $('#dialogMotorOutputReorderMainContent');
        this._domWarningContentBlock = $('#dialogMotorOutputReorderWarning');
        this._domActionHintBlock = $('#motorOutputReorderActionHint');
        this._domCanvas = $('#motorOutputReorderCanvas');
    }

    _setupdialog()
    {
        i18n$1.localizePage();
        this._readDom();

        this._resetGui();

        this._domAgreeSafetyCheckBox.change(() =>
        {
            const enabled = this._domAgreeSafetyCheckBox.is(':checked');
            this._domStartButton.toggle(enabled);
        });

        this._domStartButton.click(() =>
        {
            this._onStartButtonClicked();
        });
        this._domStartOverButton.click(() =>
        {
            this._startOver();
        });
        this._domSaveButton.click(() =>
        {
            this._save();
        });

        this._onLoadedCallback();
    }

    close()
    {
        this._stopAnyMotorJerking();
        this._stopMotor();
        this._stopUserInteraction();
        this._resetGui();
    }

    _resetGui()
    {
        this._domMainContentBlock.hide();
        this._domWarningContentBlock.show();
        this._domStartButton.hide();

        this._domAgreeSafetyCheckBox.prop('checked', false);
        this._domAgreeSafetyCheckBox.change();
        this._showSaveStartOverButtons(false);
    }

    _save()
    {
        function save_to_eeprom()
        {
            MSP.send_message(MSPCodes.MSP_EEPROM_WRITE, false, false, reboot);
        }

        function reboot()
        {
            gui_log(i18n$1.getMessage('configurationEepromSaved'));
            GUI.tab_switch_cleanup(() => MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitializeConnection(TABS.motors)));
        }

        FC.MOTOR_OUTPUT_ORDER = Array.from(this._newMotorOutputReorder);

        MSP.send_message(MSPCodes.MSP2_SET_MOTOR_OUTPUT_REORDERING, mspHelper.crunch(MSPCodes.MSP2_SET_MOTOR_OUTPUT_REORDERING));

        save_to_eeprom();
    }

    _calculateNewMotorOutputReorder()
    {
        this._newMotorOutputReorder = [];

        for (let i = 0; i < this.motorOutputReorderCanvas.readyMotors.length; i++) {
            this._newMotorOutputReorder.push(this._remapMotorIndex(i));
        }
    }

    _remapMotorIndex(motorIndex)
    {
        return FC.MOTOR_OUTPUT_ORDER[this.motorOutputReorderCanvas.readyMotors.indexOf(motorIndex)];
    }

    _startOver()
    {
        this._showSaveStartOverButtons(false);
        this._startUserInteraction();
    }

    _showSaveStartOverButtons(show)
    {
        if (show) {
            this._domStartOverButton.show();
            this._domSaveButton.show();
        } else {
            this._domStartOverButton.hide();
            this._domSaveButton.hide();
        }
    }

    _onStartButtonClicked()
    {
        this._domActionHintBlock.text(i18n$1.getMessage("motorOutputReorderDialogSelectSpinningMotor"));
        this._domWarningContentBlock.hide();
        this._domMainContentBlock.show();
        this._startUserInteraction();
    }

    _stopUserInteraction()
    {
        if (this.motorOutputReorderCanvas) {
            this.motorOutputReorderCanvas.pause();
        }
    }

    _startUserInteraction()
    {
        if (this.motorOutputReorderCanvas) {
            this.motorOutputReorderCanvas.startOver();
        } else {
            this.motorOutputReorderCanvas = new MotorOutputReorderCanvas(this._domCanvas,
                this._droneConfiguration,
                (motorIndex) =>
                { // motor click callback
                    this._onMotorClick(motorIndex);
                },
                (motorIndex) =>
                { // motor spin callback
                    let indexToSpin = -1;

                    if (-1 !== motorIndex) {
                        indexToSpin = this.motorOutputReorderCanvas.readyMotors.indexOf(motorIndex);
                    }

                    this._spinMotor(indexToSpin);
                },
            );
        }

        this._startMotorJerking(0);
    }

    _stopAnyMotorJerking()
    {
        if (-1 !== this._currentJerkingTimeout) {
            clearTimeout(this._currentJerkingTimeout);
            this._currentJerkingTimeout = -1;
            this._spinMotor(-1);
        }

        this._currentJerkingMotor = -1;
    }

    _startMotorJerking(motorIndex)
    {
        this._stopAnyMotorJerking();
        this._currentJerkingMotor = motorIndex;
        this._motorStartTimeout(motorIndex);
    }

    _motorStartTimeout(motorIndex)
    {
        this._spinMotor(motorIndex);
        this._currentJerkingTimeout = setTimeout(() =>
        {
            this._motorStopTimeout(motorIndex);
        }, 250);
    }

    _motorStopTimeout(motorIndex)
    {
        this._spinMotor(-1);
        this._currentJerkingTimeout = setTimeout(() =>
        {
            this._motorStartTimeout(motorIndex);
        }, 500);
    }


    _spinMotor(motorIndex)
    {
        this._currentSpinningMotor = motorIndex;
        const buffer = [];

        for (let  i = 0; i < this._config[this._droneConfiguration].Motors.length; i++) {
            if (i === motorIndex) {
                buffer.push16(this._motorSpinValue);
            } else {
                buffer.push16(this._motorStopValue);
            }
        }

        MSP.send_message(MSPCodes.MSP_SET_MOTOR, buffer);
    }

    _stopMotor()
    {
        if (-1 !== this._currentSpinningMotor) {
            this._spinMotor(-1);
        }
    }

    _onMotorClick(motorIndex)
    {
        this.motorOutputReorderCanvas.readyMotors.push(motorIndex);
        this._currentJerkingMotor ++;

        if (this._currentJerkingMotor < this._config[this._droneConfiguration].Motors.length) {
            this._startMotorJerking(this._currentJerkingMotor);
        } else {
            this._stopAnyMotorJerking();
            this._domActionHintBlock.text(i18n$1.getMessage("motorOutputReorderDialogRemapIsDone"));
            this._calculateNewMotorOutputReorder();
            this.motorOutputReorderCanvas.remappingReady = true;
            this._showSaveStartOverButtons(true);
        }
    }
}

class EscDshotCommandQueue
{
    constructor (intervalMs)
    {
        this._intervalId = null;
        this._interval = intervalMs;
        this._queue = [];
        this._purging = false;
    }

    pushCommand(command, buffer)
    {
        this._queue.push([command, buffer]);
    }

    pushPause(milliseconds)
    {
        const counter = Math.ceil(milliseconds / this._interval);

        for (let i = 0; i < counter; i++) {
            this.pushCommand(null, null);
        }
    }

    start()
    {
        if (null === this._intervalId) {
            this._intervalId = setInterval(
                () => { this._checkQueue(); },
                this._interval);
        }
    }

    stop()
    {
        if(null !== this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    stopWhenEmpty()
    {
        this._purging = true;
    }

    clear()
    {
        this._queue = [];
    }

    _checkQueue()
    {
        if (0 !== this._queue.length) {
            const command = this._queue.shift();

            if (null !== command[0]) {
                MSP.send_message(command[0], command[1]);
            }
        } else if (this._purging) {
            this._purging = false;
            this.stop();
        }
    }
}

class DshotCommand
{
    static get ALL_MOTORS() { return 255; }
}

DshotCommand.dshotCommands_e = {
    DSHOT_CMD_MOTOR_STOP: 0,
    DSHOT_CMD_BEACON1: 1,
    DSHOT_CMD_BEACON2: 2,
    DSHOT_CMD_BEACON3: 3,
    DSHOT_CMD_BEACON4: 4,
    DSHOT_CMD_BEACON5: 5,
    DSHOT_CMD_ESC_INFO: 6, // V2 includes settings
    DSHOT_CMD_SPIN_DIRECTION_1: 7,
    DSHOT_CMD_SPIN_DIRECTION_2: 8,
    DSHOT_CMD_3D_MODE_OFF: 9,
    DSHOT_CMD_3D_MODE_ON: 10,
    DSHOT_CMD_SETTINGS_REQUEST: 11, // Currently not implemented
    DSHOT_CMD_SAVE_SETTINGS: 12,
    DSHOT_CMD_SPIN_DIRECTION_NORMAL: 20,
    DSHOT_CMD_SPIN_DIRECTION_REVERSED: 21,
    DSHOT_CMD_LED0_ON: 22, // BLHeli32 only
    DSHOT_CMD_LED1_ON: 23, // BLHeli32 only
    DSHOT_CMD_LED2_ON: 24, // BLHeli32 only
    DSHOT_CMD_LED3_ON: 25, // BLHeli32 only
    DSHOT_CMD_LED0_OFF: 26, // BLHeli32 only
    DSHOT_CMD_LED1_OFF: 27, // BLHeli32 only
    DSHOT_CMD_LED2_OFF: 28, // BLHeli32 only
    DSHOT_CMD_LED3_OFF: 29, // BLHeli32 only
    DSHOT_CMD_AUDIO_STREAM_MODE_ON_OFF: 30, // KISS audio Stream mode on/Off
    DSHOT_CMD_SILENT_MODE_ON_OFF: 31, // KISS silent Mode on/Off
    DSHOT_CMD_MAX: 47,
};

DshotCommand.dshotCommandType_e = {
    DSHOT_CMD_TYPE_INLINE: 0,    // dshot commands sent inline with motor signal (motors must be enabled)
    DSHOT_CMD_TYPE_BLOCKING: 1,  // dshot commands sent in blocking method (motors must be disabled)
};

class EscDshotDirectionMotorDriver
{
    constructor(motorConfig, motorDriverQueueIntervalMs, motorDriverStopMotorsPauseMs)
    {
        this._numberOfMotors = motorConfig.numberOfMotors;
        this._motorStopValue = motorConfig.motorStopValue;
        this._motorSpinValue = motorConfig.motorSpinValue;
        this._motorDriverStopMotorsPauseMs = motorDriverStopMotorsPauseMs;

        this._state = [];

        for (let  i = 0; i < this._numberOfMotors; i++)
        {
            this._state.push(this._motorStopValue);
        }

        this._stateStack = [];

        this._EscDshotCommandQueue = new EscDshotCommandQueue(motorDriverQueueIntervalMs);
    }

    activate()
    {
        this._EscDshotCommandQueue.start();
    }

    deactivate()
    {
        this._EscDshotCommandQueue.stopWhenEmpty();
    }

    stopMotor(motorIndex)
    {
        this._spinMotor(motorIndex, this._motorStopValue);
    }


    spinMotor(motorIndex)
    {
        this._spinMotor(motorIndex, this._motorSpinValue);
    }

    spinAllMotors()
    {
        this._spinAllMotors(this._motorSpinValue);
    }

    stopAllMotors()
    {
        this._spinAllMotors(this._motorStopValue);
    }

    stopAllMotorsNow()
    {
        this._EscDshotCommandQueue.clear();
        this._spinAllMotors(this._motorStopValue);
    }

    setEscSpinDirection(motorIndex, direction)
    {
        let needStopMotor = false;

        if (DshotCommand.ALL_MOTORS === motorIndex) {
            needStopMotor = this._isAnythingSpinning();
        } else {
            needStopMotor = this._isMotorSpinning(motorIndex);
        }

        if (needStopMotor) {
            this._pushState();
            this._spinMotor(motorIndex, this._motorStopValue);
            this._EscDshotCommandQueue.pushPause(this._motorDriverStopMotorsPauseMs);
            this._sendEscSpinDirection(motorIndex, direction);
            this._popState();
            this._sendState();
        } else {
            this._sendEscSpinDirection(motorIndex, direction);
        }
    }

    _pushState()
    {
        const state = [...this._state];
        this._stateStack.push(state);
    }

    _popState()
    {
        const state = this._stateStack.pop();
        this._state = [...state];
    }

    _isAnythingSpinning()
    {
        let result = false;

        for (let  i = 0; i < this._numberOfMotors; i++) {
            if (this._motorStopValue !== this._state[i]) {
                result = true;
                break;
            }
        }

        return result;
    }

    _isMotorSpinning(motorIndex)
    {
        return (this._motorStopValue !== this._state[motorIndex]);
    }

    _sendEscSpinDirection(motorIndex, direction)
    {
        const buffer = [];
        buffer.push8(DshotCommand.dshotCommandType_e.DSHOT_CMD_TYPE_BLOCKING);
        buffer.push8(motorIndex);
        buffer.push8(2); // two commands
        buffer.push8(direction);
        buffer.push8(DshotCommand.dshotCommands_e.DSHOT_CMD_SAVE_SETTINGS);
        this._EscDshotCommandQueue.pushCommand(MSPCodes.MSP2_SEND_DSHOT_COMMAND, buffer);

        let logString = "";
        if (motorIndex === DshotCommand.ALL_MOTORS) {
            logString += i18n.getMessage('motorsText');
        } else {
            const  motorNumber = motorIndex+1;
            logString += i18n.getMessage(`motorNumber${motorNumber}`);
        }
        logString += ': ';
        if (direction === DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_1) {
            logString += i18n.getMessage('escDshotDirectionDialog-CommandNormal');
        } else {
            logString += i18n.getMessage('escDshotDirectionDialog-CommandReverse');
        }
        gui_log(logString);
    }

    _spinMotor(motorIndex, value)
    {
        if (DshotCommand.ALL_MOTORS === motorIndex) {
            this._spinAllMotors(value);
        } else {
            this._state[motorIndex] = value;
            this._sendState();
        }
    }

    _spinAllMotors(value)
    {
        for (let  i = 0; i < this._numberOfMotors; i++) {
            this._state[i] = value;
        }

        this._sendState();
    }

    _sendState()
    {
        const buffer = [];

        for (let  i = 0; i < this._numberOfMotors; i++) {
            buffer.push16(this._state[i]);
        }

        this._EscDshotCommandQueue.pushCommand(MSPCodes.MSP_SET_MOTOR, buffer);
    }

}

class EscDshotDirectionComponent
{
    constructor(contentDiv, onLoadedCallback, motorConfig)
    {
        this._buttonTimeoutMs = 400;
        const motorDriverQueueIntervalMs = 100;
        const motorDriverStopMotorsPauseMs = 400;

        this._motorDriver = new EscDshotDirectionMotorDriver(motorConfig,
            motorDriverQueueIntervalMs, motorDriverStopMotorsPauseMs);
        this._escProtocolIsDshot = motorConfig.escProtocolIsDshot;
        this._numberOfMotors = motorConfig.numberOfMotors;
        this._contentDiv = contentDiv;
        this._onLoadedCallback = onLoadedCallback;
        this._currentSpinningMotor = -1;
        this._selectedMotor = -1;
        this._motorIsSpinning = false;
        this._allMotorsAreSpinning = false;
        this._spinDirectionToggleIsActive = true;
        this._activationButtonTimeoutId = null;

        this._contentDiv.load("./components/EscDshotDirection/Body.html", () =>
        {
            this._initializeDialog();
        });
    }

    static get PUSHED_BUTTON_CLASS() { return "pushed"; }
    static get HIGHLIGHTED_BUTTON_CLASS() { return "highlighted"; }
    static get RED_TEXT_CLASS() { return "red-text"; }

    static get _BUTTON_PUSH_DOWN_EVENT_TYPE()
    {
        if (GUI.isCordova()) {
            return "touchstart";
        } else {
            return "mousedown";
        }
    }

    static get _BUTTON_RELEASE_EVENT_TYPE()
    {
        if (GUI.isCordova()) {
            return "touchend";
        } else {
            return "mouseup mouseout";
        }
    }

    _readDom()
    {
        this._domAgreeSafetyCheckBox = $("#escDshotDirectionDialog-safetyCheckbox");
        this._domStartButton = $("#escDshotDirectionDialog-Start");
        this._domStartWizardButton = $("#escDshotDirectionDialog-StartWizard");
        this._domMainContentBlock = $("#escDshotDirectionDialog-MainContent");
        this._domWarningContentBlock = $("#escDshotDirectionDialog-Warning");
        this._domMixerImg = $("#escDshotDirectionDialog-MixerPreviewImg");
        this._domMotorButtonsBlock = $("#escDshotDirectionDialog-SelectMotorButtonsWrapper");
        this._domSpinDirectionWrapper = $("#escDshotDirectionDialog-CommandsWrapper");
        this._domActionHint = $("#escDshotDirectionDialog-ActionHint");
        this._domSpinNormalButton = $("#escDshotDirectionDialog-RotationNormal");
        this._domSpinReverseButton = $("#escDshotDirectionDialog-RotationReverse");
        this._domSecondHint = $("#escDshotDirectionDialog-SecondHint");
        this._domSecondActionDiv = $("#escDshotDirectionDialog-SecondActionBlock");
        this._domConfigErrors = $("#escDshotDirectionDialog-ConfigErrors");
        this._domWrongProtocolMessage = $("#escDshotDirectionDialog-WrongProtocol");
        this._domWrongMixerMessage = $("#escDshotDirectionDialog-WrongMixer");
        this._domWrongFirmwareMessage = $("#escDshotDirectionDialog-WrongFirmware");
        this._domWizardBlock = $("#escDshotDirectionDialog-WizardDialog");
        this._domNormalDialogBlock = $("#escDshotDirectionDialog-NormalDialog");
        this._domSpinningWizard = $("#escDshotDirectionDialog-SpinningWizard");
        this._domSpinWizardButton = $("#escDshotDirectionDialog-SpinWizard");
        this._domStopWizardButton = $("#escDshotDirectionDialog-StopWizard");
        this._domWizardMotorButtonsBlock = $("#escDshotDirectionDialog-WizardMotorButtons");
        this._domStartWizardBlock = $("#escDshotDirectionDialog-StartWizardBlock");
        this._domStartNormalBlock = $("#escDshotDirectionDialog-StartNormalBlock");

        this._topHintText = i18n$1.getMessage("escDshotDirectionDialog-SelectMotor");
        this._releaseToStopText = i18n$1.getMessage("escDshotDirectionDialog-ReleaseToStop");
        this._releaseButtonToStopText = i18n$1.getMessage("escDshotDirectionDialog-ReleaseButtonToStop");
        this._normalText = i18n$1.getMessage("escDshotDirectionDialog-CommandNormal");
        this._reverseText = i18n$1.getMessage("escDshotDirectionDialog-CommandReverse");
        this._secondHintText = i18n$1.getMessage("escDshotDirectionDialog-SetDirectionHint");
    }

    _initializeDialog()
    {
        this._readDom();
        this._createMotorButtons();
        this._createWizardMotorButtons();
        this._domSecondActionDiv.toggle(false);
        i18n$1.localizePage();

        this._resetGui();

        this._domAgreeSafetyCheckBox.on("change", () => {
            const enabled = this._domAgreeSafetyCheckBox.is(':checked');
            this._domStartNormalBlock.toggle(enabled);
            this._domStartWizardBlock.toggle(enabled);
        });

        this._domStartButton.on("click", () => {
            this._onStartButtonClicked();
        });

        this._domStartWizardButton.on("click", () => {
            this._onStartWizardButtonClicked();
        });

        this._domSpinWizardButton.on("click", () => {
            this._onSpinWizardButtonClicked();
        });

        this._domStopWizardButton.on("click", () => {
            this._onStopWizardButtonClicked();
        });

        const imgSrc = getMixerImageSrc(FC.MIXER_CONFIG.mixer, FC.MIXER_CONFIG.reverseMotorDir, FC.CONFIG.apiVersion);
        this._domMixerImg.attr('src', imgSrc);

        this._onLoadedCallback();
    }

    _activateNormalReverseButtons(timeoutMs)
    {
        this._activationButtonTimeoutId = setTimeout(() => {
            this._subscribeDirectionSpinButton(this._domSpinNormalButton,
                DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_1, this._normalText);
            this._subscribeDirectionSpinButton(this._domSpinReverseButton,
                DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_2, this._reverseText);
        }, timeoutMs);
    }

    _deactivateNormalReverseButtons()
    {
        if (null !== this._activationButtonTimeoutId) {
            clearTimeout(this._activationButtonTimeoutId);
        }

        this._domSpinNormalButton.off();
        this._domSpinReverseButton.off();
    }

    _subscribeDirectionSpinButton(button, direction, buttonText)
    {
        button.on(EscDshotDirectionComponent._BUTTON_PUSH_DOWN_EVENT_TYPE, () => {
            this._sendCurrentEscSpinDirection(direction);
            this._motorIsSpinning = true;
            button.text(this._releaseToStopText);
            button.addClass(EscDshotDirectionComponent.HIGHLIGHTED_BUTTON_CLASS);
            this._motorDriver.spinMotor(this._selectedMotor);
            this._domSecondHint.html(this._releaseButtonToStopText);
            this._domSecondHint.addClass(EscDshotDirectionComponent.RED_TEXT_CLASS);
        });

        button.on(EscDshotDirectionComponent._BUTTON_RELEASE_EVENT_TYPE, () => {
            if (this._motorIsSpinning) {
                button.text(buttonText);
                this._motorIsSpinning = false;
                button.removeClass(EscDshotDirectionComponent.HIGHLIGHTED_BUTTON_CLASS);
                this._motorDriver.stopAllMotors();
                this._domSecondHint.text(this._secondHintText);
                this._domSecondHint.removeClass(EscDshotDirectionComponent.RED_TEXT_CLASS);

                this._deactivateNormalReverseButtons();
                this._activateNormalReverseButtons(this._buttonTimeoutMs);
            }
        });
    }

    _sendCurrentEscSpinDirection(direction)
    {
        this._motorDriver.setEscSpinDirection(this._selectedMotor, direction);
    }

    _createMotorButtons()
    {
        this._motorButtons = {};

        for (let i = 0; i < this._numberOfMotors; i++) {
            this._addMotorButton(i + 1, i);
        }

        this._addMotorButton("All", DshotCommand.ALL_MOTORS);
    }

    _addMotorButton(buttonText, motorIndex)
    {
        const button = $(`<a href="#" class="regular-button ${EscDshotDirectionComponent.PUSHED_BUTTON_CLASS}"></a>`).text(buttonText);
        this._domMotorButtonsBlock.append(button);
        this._motorButtons[motorIndex] = button;

        button.on(EscDshotDirectionComponent._BUTTON_PUSH_DOWN_EVENT_TYPE, () => {
            this._domSecondActionDiv.toggle(true);
            this._motorIsSpinning = true;
            this._domActionHint.html(this._releaseButtonToStopText);
            this._domActionHint.addClass(EscDshotDirectionComponent.RED_TEXT_CLASS);
            this._changeSelectedMotor(motorIndex);
            button.addClass(EscDshotDirectionComponent.HIGHLIGHTED_BUTTON_CLASS);
            this._motorDriver.spinMotor(this._selectedMotor);
        });

        button.on(EscDshotDirectionComponent._BUTTON_RELEASE_EVENT_TYPE, () => {
            if (this._motorIsSpinning) {
                this._domActionHint.html(this._topHintText);
                this._domActionHint.removeClass(EscDshotDirectionComponent.RED_TEXT_CLASS);
                this._motorIsSpinning = false;
                button.removeClass(EscDshotDirectionComponent.HIGHLIGHTED_BUTTON_CLASS);
                this._motorDriver.stopAllMotors();

                this._deactivateNormalReverseButtons();
                this._activateNormalReverseButtons(this._buttonTimeoutMs);
            }
        });
    }

    _createWizardMotorButtons()
    {
        this._wizardMotorButtons = {};

        for (let i = 0; i < this._numberOfMotors; i++) {
            this._addWizardMotorButton(i + 1, i);
        }
    }

    _activateWizardMotorButtons(timeoutMs)
    {
        this._activationButtonTimeoutId = setTimeout(() => {
            for (let i = 0; i < this._numberOfMotors; i++) {
                this._activateWizardMotorButton(i);
            }
        }, timeoutMs);
    }

    _deactivateWizardMotorButtons()
    {
        if (null !== this._activationButtonTimeoutId)
        {
            clearTimeout(this._activationButtonTimeoutId);
        }

        for (let i = 0; i < this._numberOfMotors; i++) {
            const button =  this._wizardMotorButtons[i];
            button.off();
        }
    }

    _addWizardMotorButton(buttonText, motorIndex)
    {
        const button = $(`<a href="#" class="regular-button"></a>`).text(buttonText);
        this._domWizardMotorButtonsBlock.append(button);
        this._wizardMotorButtons[motorIndex] = button;
    }

    _activateWizardMotorButton(motorIndex)
    {
        const button =  this._wizardMotorButtons[motorIndex];

        button.on("click", () => {
            this._wizardMotorButtonClick(button, motorIndex);
        });
    }

    _wizardMotorButtonClick(button, motorIndex)
    {
        this._deactivateWizardMotorButtons();
        const currentlyDown = button.hasClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);

        if (currentlyDown) {
            button.removeClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);
            this._motorDriver.setEscSpinDirection(motorIndex, DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_1);
        } else {
            this._motorDriver.setEscSpinDirection(motorIndex, DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_2);
            button.addClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);
        }

        this._activateWizardMotorButtons(this._buttonTimeoutMs);
    }

    _changeSelectedMotor(newIndex)
    {
        if (this._selectedMotor >= 0) {
            this._motorButtons[this._selectedMotor].addClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);
        }

        this._selectedMotor = newIndex;

        if (this._selectedMotor > -1) {
            this._motorButtons[this._selectedMotor].removeClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);
        }
    }

    close()
    {
        this._motorDriver.stopAllMotorsNow();
        this._motorDriver.deactivate();
        this._resetGui();
    }

    _resetGui()
    {
        this._toggleMainContent(false);
        this._domStartNormalBlock.hide();
        this._domStartWizardBlock.hide();

        this._domAgreeSafetyCheckBox.prop('checked', false);
        this._domAgreeSafetyCheckBox.trigger('change');
        this._domSecondActionDiv.toggle(false);
        this._changeSelectedMotor(-1);

        this._checkForConfigurationErrors();
    }

    _checkForConfigurationErrors()
    {
        let anyError = false;

        this._domWrongProtocolMessage.hide();
        this._domWrongMixerMessage.hide();
        this._domWrongFirmwareMessage.hide();

        if (!this._escProtocolIsDshot) {
            anyError = true;
            this._domWrongProtocolMessage.show();
        }

        if (this._numberOfMotors <= 0) {
            anyError = true;
            this._domWrongMixerMessage.show();
        }

        if (!semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
            // if BF4.2 or older - show the error message
            anyError = true;
            this._domWrongFirmwareMessage.show();
        }

        if (anyError) {
            this._domMainContentBlock.hide();
            this._domWarningContentBlock.hide();
            this._domStartNormalBlock.hide();
            this._domStartWizardBlock.hide();
            this._domConfigErrors.show();
        } else {
            this._domConfigErrors.hide();
        }
    }


    _onStartButtonClicked()
    {
        this._toggleMainContent(true);
        this._domWizardBlock.toggle(false);
        this._domNormalDialogBlock.toggle(true);
        this._motorDriver.activate();
    }

    _onStartWizardButtonClicked()
    {
        this._domSpinningWizard.toggle(false);
        this._domSpinWizardButton.toggle(true);
        this._toggleMainContent(true);
        this._domWizardBlock.toggle(true);
        this._domNormalDialogBlock.toggle(false);
        this._motorDriver.activate();
    }

    _onSpinWizardButtonClicked()
    {
        for (let i = 0; i < this._numberOfMotors; i++) {
            this._wizardMotorButtons[i].removeClass(EscDshotDirectionComponent.PUSHED_BUTTON_CLASS);
        }

        this._motorDriver.setEscSpinDirection(DshotCommand.ALL_MOTORS, DshotCommand.dshotCommands_e.DSHOT_CMD_SPIN_DIRECTION_1);

        this._domSpinWizardButton.toggle(false);
        this._domSpinningWizard.toggle(true);
        this._motorDriver.spinAllMotors();

        this._activateWizardMotorButtons(0);
    }

    _onStopWizardButtonClicked()
    {
        this._domSpinWizardButton.toggle(true);
        this._domSpinningWizard.toggle(false);
        this._motorDriver.stopAllMotorsNow();
        this._deactivateWizardMotorButtons();
    }

    _toggleMainContent(value)
    {
        this._domWarningContentBlock.toggle(!value);
        this._domMainContentBlock.toggle(value);
        this._domConfigErrors.toggle(false);
    }

}

const motors = {
    previousDshotBidir: null,
    previousFilterDynQ: null,
    previousFilterDynCount: null,
    analyticsChanges: {},
    configHasChanged: false,
    configChanges: {},
    feature3DEnabled: false,
    sensor: "gyro",
    sensorGyroRate: 20,
    sensorGyroScale: 2000,
    sensorAccelRate: 20,
    sensorAccelScale: 2,
    sensorSelectValues: {
        "gyroScale": {
            "1" : 1,
            "2" : 2,
            "3" : 3,
            "4" : 4,
            "5" : 5,
            "10" : 10,
            "25" : 25,
            "50" : 50,
            "100" : 100,
            "200" : 200,
            "300" : 300,
            "400" : 400,
            "500" : 500,
            "1000" : 1000,
            "2000" : 2000,
        },
        "accelScale": {
            "0.05" : 0.05,
            "0.1" : 0.1,
            "0.2" : 0.2,
            "0.3" : 0.3,
            "0.4" : 0.4,
            "0.5" : 0.5,
            "1" : 1,
            "2" : 2,
        },
    },
    // These are translated into proper Dshot values on the flight controller
    DSHOT_PROTOCOL_MIN_VALUE: 0,
    DSHOT_DISARMED_VALUE: 1000,
    DSHOT_MAX_VALUE: 2000,
    DSHOT_3D_NEUTRAL: 1500,
};

motors.initialize = async function (callback) {
    const self = this;

    self.armed = false;
    self.escProtocolIsDshot = false;
    self.configHasChanged = false;
    self.configChanges = {};

    // Update filtering defaults based on API version
    const FILTER_DEFAULT = FC.getFilterDefaults();

    GUI.active_tab = 'motors';

    await MSP.promise(MSPCodes.MSP_PID_ADVANCED);
    await MSP.promise(MSPCodes.MSP_FEATURE_CONFIG);
    await MSP.promise(MSPCodes.MSP_MIXER_CONFIG);
    if (FC.MOTOR_CONFIG.use_dshot_telemetry || FC.MOTOR_CONFIG.use_esc_sensor) {
        await MSP.promise(MSPCodes.MSP_MOTOR_TELEMETRY);
    }
    await MSP.promise(MSPCodes.MSP_MOTOR_CONFIG);
    await MSP.promise(MSPCodes.MSP_MOTOR_3D_CONFIG);
    await MSP.promise(MSPCodes.MSP2_MOTOR_OUTPUT_REORDERING);
    await MSP.promise(MSPCodes.MSP_ADVANCED_CONFIG);
    if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
        await MSP.promise(MSPCodes.MSP_FILTER_CONFIG);
    }
    await MSP.promise(MSPCodes.MSP_ARMING_CONFIG);

    load_html();

    function load_html() {
        $('#content').load("./tabs/motors.html", process_html);
    }

    function update_arm_status() {
        self.armed = bit_check(FC.CONFIG.mode, 0);
    }

    function initSensorData() {
        for (let i = 0; i < 3; i++) {
            FC.SENSOR_DATA.accelerometer[i] = 0;
            FC.SENSOR_DATA.gyroscope[i] = 0;
        }
    }

    function initDataArray(length) {
        const data = Array.from({length: length});
        for (let i = 0; i < length; i++) {
            data[i] = [];
            data[i].min = -1;
            data[i].max = 1;
        }
        return data;
    }

    function addSampleToData(data, sampleNumber, sensorData) {
        for (let i = 0; i < data.length; i++) {
            const dataPoint = sensorData[i];
            data[i].push([sampleNumber, dataPoint]);
            if (dataPoint < data[i].min) {
                data[i].min = dataPoint;
            }
            if (dataPoint > data[i].max) {
                data[i].max = dataPoint;
            }
        }
        while (data[0].length > 300) {
            for (const item of data) {
                item.shift();
            }
        }
        return sampleNumber + 1;
    }

    const margin = {top: 20, right: 30, bottom: 10, left: 20};
    function updateGraphHelperSize(helpers) {
        helpers.width = helpers.targetElement.width() - margin.left - margin.right;
        helpers.height = helpers.targetElement.height() - margin.top - margin.bottom;

        helpers.widthScale.range([0, helpers.width]);
        helpers.heightScale.range([helpers.height, 0]);

        helpers.xGrid.tickSize(-helpers.height, 0, 0);
        helpers.yGrid.tickSize(-helpers.width, 0, 0);
    }

    function initGraphHelpers(selector, sampleNumber, heightDomain) {
        const helpers = {selector: selector, targetElement: $(selector), dynamicHeightDomain: !heightDomain};

        helpers.widthScale = linear()
            .clamp(true)
            .domain([(sampleNumber - 299), sampleNumber]);

        helpers.heightScale = linear()
            .clamp(true)
            .domain(heightDomain || [1, -1]);

        helpers.xGrid = axisBottom();
        helpers.yGrid = axisLeft();

        updateGraphHelperSize(helpers);

        helpers.xGrid
            .scale(helpers.widthScale)
            .tickSize(-helpers.height)
            .tickValues(helpers.widthScale.ticks(5).concat(helpers.widthScale.domain()))
            .tickFormat("");

        helpers.yGrid
            .scale(helpers.heightScale)
            .tickSize(-helpers.width)
            .tickValues(helpers.heightScale.ticks(5).concat(helpers.heightScale.domain()))
            .tickFormat("");
        helpers.xAxis = axisBottom()
            .scale(helpers.widthScale)
            .ticks(5)
            .tickFormat(function (d) {return d;});

        helpers.yAxis = axisLeft()
            .scale(helpers.heightScale)
            .ticks(5)
            .tickFormat(function (d) {return d;});

        helpers.line = line()
            .x(function (d) { return helpers.widthScale(d[0]); })
            .y(function (d) { return helpers.heightScale(d[1]); });

        return helpers;
    }

    function drawGraph(graphHelpers, data, sampleNumber) {

        const svg = select(graphHelpers.selector);

        if (graphHelpers.dynamicHeightDomain) {
            const limits = [];
            $.each(data, function (idx, datum) {
                limits.push(datum.min);
                limits.push(datum.max);
            });
            graphHelpers.heightScale.domain(extent(limits));
        }
        graphHelpers.widthScale.domain([(sampleNumber - 299), sampleNumber]);

        svg.select(".x.grid").call(graphHelpers.xGrid);
        svg.select(".y.grid").call(graphHelpers.yGrid);
        svg.select(".x.axis").call(graphHelpers.xAxis);
        svg.select(".y.axis").call(graphHelpers.yAxis);

        const group = svg.select("g.data");
        const lines = group.selectAll("path").data(data, function (d, i) {
            return i;
        });

        lines.enter().append("path").attr("class", "line");
        lines.attr('d', graphHelpers.line);
    }

    function replace_mixer_preview(imgSrc) {
        $.get(imgSrc, function(data) {
            const svg = $(data).find('svg');
            $('.mixerPreview').html(svg);
        }, 'xml');
    }

    function update_model(mixer) {
        const imgSrc = getMixerImageSrc(mixer, FC.MIXER_CONFIG.reverseMotorDir);

        replace_mixer_preview(imgSrc);

        const motorOutputReorderConfig = new MotorOutputReorderConfig(100);
        const domMotorOutputReorderDialogOpen = $('#motorOutputReorderDialogOpen');

        const isMotorReorderingAvailable = (mixerList[mixer - 1].name in motorOutputReorderConfig)
            && (FC.MOTOR_OUTPUT_ORDER) && (FC.MOTOR_OUTPUT_ORDER.length > 0);
        domMotorOutputReorderDialogOpen.toggle(isMotorReorderingAvailable);

        self.escProtocolIsDshot = EscProtocols.IsProtocolDshot(FC.CONFIG.apiVersion, FC.PID_ADVANCED_CONFIG.fast_pwm_protocol);
    }

    function process_html() {
        // translate to user-selected language
        i18n$1.localizePage();

        update_arm_status();

        self.feature3DEnabled = FC.FEATURE_CONFIG.features.isEnabled('3D');
        const motorsEnableTestModeElement = $('#motorsEnableTestMode');
        self.analyticsChanges = {};

        motorsEnableTestModeElement.prop('checked', self.armed);

        if (semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_42) || !(FC.MOTOR_CONFIG.use_dshot_telemetry || FC.MOTOR_CONFIG.use_esc_sensor)) {
            $(".motor_testing .telemetry").hide();
        }

        function setContentButtons(motorsTesting=false) {
            $('.btn .tool').toggleClass("disabled", self.configHasChanged || motorsTesting);
            $('.btn .save').toggleClass("disabled", !self.configHasChanged);
            $('.btn .stop').toggleClass("disabled", !motorsTesting);
        }

        const defaultConfiguration = {
            mixer:              FC.MIXER_CONFIG.mixer,
            reverseMotorSwitch: FC.MIXER_CONFIG.reverseMotorDir,
            escprotocol:        FC.PID_ADVANCED_CONFIG.fast_pwm_protocol + 1,
            feature4:           FC.FEATURE_CONFIG.features.isEnabled('MOTOR_STOP'),
            feature12:          FC.FEATURE_CONFIG.features.isEnabled('3D'),
            feature27:          FC.FEATURE_CONFIG.features.isEnabled('ESC_SENSOR'),
            dshotBidir:         FC.MOTOR_CONFIG.use_dshot_telemetry,
            motorPoles:         FC.MOTOR_CONFIG.motor_poles,
            digitalIdlePercent: FC.PID_ADVANCED_CONFIG.digitalIdlePercent,
            idleMinRpm:         FC.ADVANCED_TUNING.idleMinRpm,
            _3ddeadbandlow:     FC.MOTOR_3D_CONFIG.deadband3d_low,
            _3ddeadbandhigh:    FC.MOTOR_3D_CONFIG.deadband3d_high,
            _3dneutral:         FC.MOTOR_3D_CONFIG.neutral,
            unsyncedPWMSwitch:  FC.PID_ADVANCED_CONFIG.use_unsyncedPwm,
            unsyncedpwmfreq:    FC.PID_ADVANCED_CONFIG.motor_pwm_rate,
            minthrottle:        FC.MOTOR_CONFIG.minthrottle,
            maxthrottle:        FC.MOTOR_CONFIG.maxthrottle,
            mincommand:         FC.MOTOR_CONFIG.mincommand,
        };

        setContentButtons();

        // Stop motor testing on configuration changes
        function disableHandler(e) {
            if (e.target !== e.currentTarget) {
                const item = e.target.id === '' ? e.target.name : e.target.id;
                let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

                switch (e.target.type) {
                    case "checkbox":
                        if (item === "reverseMotorSwitch") {
                            value = value === false ? 0 : 1;
                        }
                        break;
                    case "number":
                        value = isInt(value) ? parseInt(value) : parseFloat(value);
                        break;
                    case "select-one":
                        value = parseInt(value);
                        break;
                    default:
                        console.log(`Undefined case ${e.target.type} encountered, please check code`);
                }

                self.configChanges[item] = value;

                if (item in defaultConfiguration) {
                    if (value !== defaultConfiguration[item]) {
                        self.configHasChanged = true;
                    } else {
                        delete self.configChanges[item];
                        if (Object.keys(self.configChanges).length === 0) {
                            console.log('All configuration changes reverted');
                            self.configHasChanged = false;
                          }
                    }
                } else {
                    console.log(`Unknown item ${item} found with type ${e.target.type}, please add to the defaultConfiguration object.`);
                    self.configHasChanged = true;
                }

                // disables Motor Testing if settings are being changed (must save and reboot or undo changes).
                motorsEnableTestModeElement.trigger("change");
                setContentButtons();
            }
            e.stopPropagation();
        }

        // Add EventListener for configuration changes
        document.querySelectorAll('.configuration').forEach(elem => elem.addEventListener('change', disableHandler));

        /*
        *  MIXER
        */

        const mixerListElement = $('select.mixerList');
        for (let selectIndex = 0; selectIndex < mixerList.length; selectIndex++) {
            mixerList.forEach(function (mixerEntry, mixerIndex) {
                if (mixerEntry.pos === selectIndex) {
                    mixerListElement.append(`<option value="${(mixerIndex + 1)}">${mixerEntry.name.toUpperCase()}</option>`);
                }
            });
        }

        mixerListElement.sortSelect();

        function refreshMixerPreview() {
            const imgSrc = getMixerImageSrc(FC.MIXER_CONFIG.mixer, FC.MIXER_CONFIG.reverseMotorDir);
            replace_mixer_preview(imgSrc);
        }

        const reverseMotorSwitchElement = $('#reverseMotorSwitch');

        reverseMotorSwitchElement.change(function() {
            FC.MIXER_CONFIG.reverseMotorDir = $(this).prop('checked') ? 1 : 0;
            refreshMixerPreview();
        });

        reverseMotorSwitchElement.prop('checked', FC.MIXER_CONFIG.reverseMotorDir !== 0).change();

        mixerListElement.change(function () {
            const mixerValue = parseInt($(this).val());

            let newValue;
            if (mixerValue !== FC.MIXER_CONFIG.mixer) {
                newValue = $(this).find('option:selected').text();
            }
            self.analyticsChanges['Mixer'] = newValue;

            FC.MIXER_CONFIG.mixer = mixerValue;
            refreshMixerPreview();
        });

        // select current mixer configuration
        mixerListElement.val(FC.MIXER_CONFIG.mixer).change();

        function validateMixerOutputs() {
            MSP.promise(MSPCodes.MSP_MOTOR).then(() => {
                const mixer = FC.MIXER_CONFIG.mixer;
                const motorCount = mixerList[mixer - 1].motors;
                // initialize for models with zero motors
                self.numberOfValidOutputs = motorCount;

                for (let i = 0; i < FC.MOTOR_DATA.length; i++) {
                    if (FC.MOTOR_DATA[i] === 0) {
                        self.numberOfValidOutputs = i;
                        if (motorCount > self.numberOfValidOutputs && motorCount > 0) {
                            const msg = i18n$1.getMessage('motorsDialogMixerReset', {
                                mixerName: mixerList[mixer - 1].name,
                                mixerMotors: motorCount,
                                outputs: self.numberOfValidOutputs,
                            });
                            showDialogMixerReset(msg);
                        }
                        return;
                    }
                }
            });
        }

        update_model(FC.MIXER_CONFIG.mixer);

        // Reference: src/main/drivers/motor.h for motorPwmProtocolTypes_e;
        const ESC_PROTOCOL_UNDEFINED = 9;
        if (FC.PID_ADVANCED_CONFIG.fast_pwm_protocol !== ESC_PROTOCOL_UNDEFINED) {
            validateMixerOutputs();
        }

        // Always start with default/empty sensor data array, clean slate all
        initSensorData();

        // Setup variables
        let samplesGyro = 0;
        const gyroData = initDataArray(3);
        let gyroHelpers = initGraphHelpers('#graph', samplesGyro, [-2, 2]);
        let gyroMaxRead = [0, 0, 0];

        let samplesAccel = 0;
        const accelData = initDataArray(3);
        let accelHelpers = initGraphHelpers('#graph', samplesAccel, [-2, 2]);
        let accelMaxRead = [0, 0, 0];
        const accelOffset = [0, 0, 0];
        let accelOffsetEstablished = false;

        // cached elements
        const motorVoltage = $('.motors-bat-voltage');
        const motorMahDrawingElement = $('.motors-bat-mah-drawing');
        const motorMahDrawnElement = $('.motors-bat-mah-drawn');

        const rawDataTextElements = {
            x: [],
            y: [],
            z: [],
            rms: [],
        };

        $('.plot_control .x, .plot_control .y, .plot_control .z, .plot_control .rms').each(function () {
            const el = $(this);
            if (el.hasClass('x')) {
                rawDataTextElements.x.push(el);
            } else if (el.hasClass('y')) {
                rawDataTextElements.y.push(el);
            } else if (el.hasClass('z')) {
                rawDataTextElements.z.push(el);
            } else if (el.hasClass('rms')) {
                rawDataTextElements.rms.push(el);
            }
        });

        function loadScaleSelector(selectorValues, selectedValue) {
            $('.tab-motors select[name="scale"]').find('option').remove();

            $.each(selectorValues, function(key, val) {
                $('.tab-motors select[name="scale"]').append(new Option(key, val));
            });

            $('.tab-motors select[name="scale"]').val(selectedValue);
        }

        function selectRefresh(refreshValue){
            $('.tab-motors select[name="rate"]').val(refreshValue);
        }

        $('.tab-motors .sensor select').change(function(){
            TABS.motors.sensor = $('.tab-motors select[name="sensor_choice"]').val();
            set({'motors_tab_sensor_settings': {'sensor': TABS.motors.sensor}});

            switch(TABS.motors.sensor){
            case "gyro":
                loadScaleSelector(TABS.motors.sensorSelectValues.gyroScale,
                        TABS.motors.sensorGyroScale);
                selectRefresh(TABS.motors.sensorGyroRate);
                break;
            case "accel":
                loadScaleSelector(TABS.motors.sensorSelectValues.accelScale,
                        TABS.motors.sensorAccelScale);
                selectRefresh(TABS.motors.sensorAccelRate);
                break;
            }

            $('.tab-motors .rate select:first').change();
        });

        $('.tab-motors .rate select, .tab-motors .scale select').change(function () {
            const rate = parseInt($('.tab-motors select[name="rate"]').val(), 10);
            const scale = parseFloat($('.tab-motors select[name="scale"]').val());

            GUI.interval_kill_all(['motor_and_status_pull','motors_power_data_pull_slow']);

            switch(TABS.motors.sensor) {
            case "gyro":
                set({'motors_tab_gyro_settings': {'rate': rate, 'scale': scale}});
                TABS.motors.sensorGyroRate = rate;
                TABS.motors.sensorGyroScale = scale;

                gyroHelpers = initGraphHelpers('#graph', samplesGyro, [-scale, scale]);

                GUI.interval_add('IMU_pull', function imu_data_pull() {
                    MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, update_gyro_graph);
                }, rate, true);
                break;
            case "accel":
                set({'motors_tab_accel_settings': {'rate': rate, 'scale': scale}});
                TABS.motors.sensorAccelRate = rate;
                TABS.motors.sensorAccelScale = scale;
                accelHelpers = initGraphHelpers('#graph', samplesAccel, [-scale, scale]);

                GUI.interval_add('IMU_pull', function imu_data_pull() {
                    MSP.send_message(MSPCodes.MSP_RAW_IMU, false, false, update_accel_graph);
                }, rate, true);
                break;
            }

            function update_accel_graph() {
                if (!accelOffsetEstablished) {
                    for (let i = 0; i < 3; i++) {
                        accelOffset[i] = FC.SENSOR_DATA.accelerometer[i] * -1;
                    }

                    accelOffsetEstablished = true;
                }

                const accelWithOffset = [
                    accelOffset[0] + FC.SENSOR_DATA.accelerometer[0],
                    accelOffset[1] + FC.SENSOR_DATA.accelerometer[1],
                    accelOffset[2] + FC.SENSOR_DATA.accelerometer[2],
                ];

                updateGraphHelperSize(accelHelpers);
                samplesAccel = addSampleToData(accelData, samplesAccel, accelWithOffset);
                drawGraph(accelHelpers, accelData, samplesAccel);
                for (let i = 0; i < 3; i++) {
                    if (Math.abs(accelWithOffset[i]) > Math.abs(accelMaxRead[i])) {
                        accelMaxRead[i] = accelWithOffset[i];
                    }
                }
                computeAndUpdate(accelWithOffset, accelData, accelMaxRead);

            }

            function update_gyro_graph() {
                const gyro = [
                    FC.SENSOR_DATA.gyroscope[0],
                    FC.SENSOR_DATA.gyroscope[1],
                    FC.SENSOR_DATA.gyroscope[2],
                ];

                updateGraphHelperSize(gyroHelpers);
                samplesGyro = addSampleToData(gyroData, samplesGyro, gyro);
                drawGraph(gyroHelpers, gyroData, samplesGyro);
                for (let i = 0; i < 3; i++) {
                    if (Math.abs(gyro[i]) > Math.abs(gyroMaxRead[i])) {
                        gyroMaxRead[i] = gyro[i];
                    }
                }
                computeAndUpdate(gyro, gyroData, gyroMaxRead);
            }

            function computeAndUpdate(sensor_data, data, max_read) {
                let sum = 0.0;
                for (let j = 0, jlength = data.length; j < jlength; j++) {
                    for (let k = 0, klength = data[j].length; k < klength; k++) {
                        sum += data[j][k][1]*data[j][k][1];
                    }
                }
                const rms = Math.sqrt(sum/(data[0].length+data[1].length+data[2].length));

                rawDataTextElements.x[0].text(`${sensor_data[0].toFixed(2)} ( ${max_read[0].toFixed(2)} )`);
                rawDataTextElements.y[0].text(`${sensor_data[1].toFixed(2)} ( ${max_read[1].toFixed(2)} )`);
                rawDataTextElements.z[0].text(`${sensor_data[2].toFixed(2)} ( ${max_read[2].toFixed(2)} )`);
                rawDataTextElements.rms[0].text(rms.toFixed(4));
            }
        });

        // set refresh speeds according to configuration saved in storage
        const result = get(['motors_tab_sensor_settings', 'motors_tab_gyro_settings', 'motors_tab_accel_settings']);
        if (result.motors_tab_sensor_settings) {
            $('.tab-motors select[name="sensor_choice"]').val(result.motors_tab_sensor_settings.sensor);
        }

        if (result.motors_tab_gyro_settings) {
            TABS.motors.sensorGyroRate = result.motors_tab_gyro_settings.rate;
            TABS.motors.sensorGyroScale = result.motors_tab_gyro_settings.scale;
        }

        if (result.motors_tab_accel_settings) {
            TABS.motors.sensorAccelRate = result.motors_tab_accel_settings.rate;
            TABS.motors.sensorAccelScale = result.motors_tab_accel_settings.scale;
        }
        $('.tab-motors .sensor select:first').change();

        // Amperage
        function power_data_pull() {
            if (FC.ANALOG.last_received_timestamp) {
                motorVoltage.text(i18n$1.getMessage('motorsVoltageValue', [FC.ANALOG.voltage]));
                motorMahDrawingElement.text(i18n$1.getMessage('motorsADrawingValue', [FC.ANALOG.amperage.toFixed(2)]));
                motorMahDrawnElement.text(i18n$1.getMessage('motorsmAhDrawnValue', [FC.ANALOG.mAhdrawn]));
            }
        }

        GUI.interval_add('motors_power_data_pull_slow', power_data_pull, 250, true); // 4 fps

        $('a.reset_max').click(function () {
            gyroMaxRead = [0, 0, 0];
            accelMaxRead = [0, 0, 0];
            accelOffsetEstablished = false;
        });

        let rangeMin;
        let rangeMax;
        let neutral3d;
        if (self.escProtocolIsDshot) {
            rangeMin = self.DSHOT_DISARMED_VALUE;
            rangeMax = self.DSHOT_MAX_VALUE;
            neutral3d = self.DSHOT_3D_NEUTRAL;
        } else {
            rangeMin = FC.MOTOR_CONFIG.mincommand;
            rangeMax = FC.MOTOR_CONFIG.maxthrottle;
            //Arbitrary sanity checks
            //Note: values may need to be revisited
            neutral3d = (FC.MOTOR_3D_CONFIG.neutral > 1575 || FC.MOTOR_3D_CONFIG.neutral < 1425) ? 1500 : FC.MOTOR_3D_CONFIG.neutral;
        }

        let zeroThrottleValue = rangeMin;

        if (self.feature3DEnabled) {
            zeroThrottleValue = neutral3d;
        }

        const motorsWrapper = $('.motors .bar-wrapper');

        for (let i = 0; i < 8; i++) {
            motorsWrapper.append(`\
                <div class="m-block motor-${i}">\
                <div class="meter-bar">\
                <div class="label"></div>\
                <div class="indicator">\
                <div class="label">\
                <div class="label"></div>\
                </div>\
                </div>\
                </div>\
                </div>\
            `);
        }

        $('div.sliders input').prop('min', rangeMin)
        .prop('max', rangeMax);
        $('div.values li:not(:last)').text(rangeMin);

        const featuresElement = $('.tab-motors .features');
        FC.FEATURE_CONFIG.features.generateElements(featuresElement);

        /*
        *   ESC protocol
        */

        const escProtocols = EscProtocols.GetAvailableProtocols(FC.CONFIG.apiVersion);
        const escProtocolElement = $('select.escprotocol');

        for (let j = 0; j < escProtocols.length; j++) {
            escProtocolElement.append(`<option value="${j + 1}">${escProtocols[j]}</option>`);
        }

        escProtocolElement.sortSelect("DISABLED");

        const unsyncedPWMSwitchElement = $("input[id='unsyncedPWMSwitch']");
        const divUnsyncedPWMFreq = $('div.unsyncedpwmfreq');

        unsyncedPWMSwitchElement.on("change", function () {
            if ($(this).is(':checked')) {
                divUnsyncedPWMFreq.show();
            } else {
                divUnsyncedPWMFreq.hide();
            }
        });

        const dshotBidirElement = $('input[id="dshotBidir"]');

        unsyncedPWMSwitchElement.prop('checked', FC.PID_ADVANCED_CONFIG.use_unsyncedPwm !== 0).trigger("change");
        $('input[name="unsyncedpwmfreq"]').val(FC.PID_ADVANCED_CONFIG.motor_pwm_rate);
        $('input[name="digitalIdlePercent"]').val(FC.PID_ADVANCED_CONFIG.digitalIdlePercent);
        $('input[name="idleMinRpm"]').val(FC.ADVANCED_TUNING.idleMinRpm);

        if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
            dshotBidirElement.prop('checked', FC.MOTOR_CONFIG.use_dshot_telemetry).trigger("change");

            self.previousDshotBidir = FC.MOTOR_CONFIG.use_dshot_telemetry;
            self.previousFilterDynQ = FC.FILTER_CONFIG.dyn_notch_q;
            self.previousFilterDynCount = FC.FILTER_CONFIG.dyn_notch_count;

            dshotBidirElement.on("change", function () {
                const value = dshotBidirElement.is(':checked');
                const newValue = (value !== FC.MOTOR_CONFIG.use_dshot_telemetry) ? 'On' : 'Off';
                self.analyticsChanges['BidirectionalDshot'] = newValue;
                FC.MOTOR_CONFIG.use_dshot_telemetry = value;

                if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_44)) {
                    const rpmFilterIsDisabled = FC.FILTER_CONFIG.gyro_rpm_notch_harmonics === 0;
                    FC.FILTER_CONFIG.dyn_notch_count = self.previousFilterDynCount;
                    FC.FILTER_CONFIG.dyn_notch_q = self.previousFilterDynQ;

                    const dialogDynFilterSettings = {
                        title: i18n$1.getMessage("dialogDynFiltersChangeTitle"),
                        text: i18n$1.getMessage("dialogDynFiltersChangeNote"),
                        buttonYesText: i18n$1.getMessage("presetsWarningDialogYesButton"),
                        buttonNoText: i18n$1.getMessage("presetsWarningDialogNoButton"),
                        buttonYesCallback: () => _dynFilterChange(),
                        buttonNoCallback: null,
                    };

                    const _dynFilterChange = function() {
                        if (FC.MOTOR_CONFIG.use_dshot_telemetry && !self.previousDshotBidir) {
                            FC.FILTER_CONFIG.dyn_notch_count = FILTER_DEFAULT.dyn_notch_count_rpm;
                            FC.FILTER_CONFIG.dyn_notch_q = FILTER_DEFAULT.dyn_notch_q_rpm;
                        } else if (!FC.MOTOR_CONFIG.use_dshot_telemetry && self.previousDshotBidir) {
                            FC.FILTER_CONFIG.dyn_notch_count = FILTER_DEFAULT.dyn_notch_count;
                            FC.FILTER_CONFIG.dyn_notch_q = FILTER_DEFAULT.dyn_notch_q;
                        }
                    };

                    if ((FC.MOTOR_CONFIG.use_dshot_telemetry !== self.previousDshotBidir) && !(rpmFilterIsDisabled)) {
                        GUI.showYesNoDialog(dialogDynFilterSettings);
                    } else {
                        FC.FILTER_CONFIG.dyn_notch_count = self.previousFilterDynCount;
                        FC.FILTER_CONFIG.dyn_notch_q = self.previousFilterDynQ;
                    }
                }
            });

            $('input[name="motorPoles"]').val(FC.MOTOR_CONFIG.motor_poles);
        }

        $('#escProtocolTooltip').toggle(semver.lt(FC.CONFIG.apiVersion, API_VERSION_1_42));
        $('#escProtocolTooltipNoDSHOT1200').toggle(semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42));

        function updateVisibility() {
            // Hide unused settings
            const protocolName = $('select.escprotocol option:selected').text();
            const protocolConfigured = protocolName !== 'DISABLED';
            let digitalProtocol = false;
            switch (protocolName) {
                case 'DSHOT150':
                case 'DSHOT300':
                case 'DSHOT600':
                case 'DSHOT1200':
                case 'PROSHOT1000':
                    digitalProtocol = true;

                    break;
            }

            const rpmFeaturesVisible = digitalProtocol && dshotBidirElement.is(':checked') || $("input[name='ESC_SENSOR']").is(':checked');

            $('div.minthrottle').toggle(protocolConfigured && !digitalProtocol);
            $('div.maxthrottle').toggle(protocolConfigured && !digitalProtocol);
            $('div.mincommand').toggle(protocolConfigured && !digitalProtocol);
            $('div.checkboxPwm').toggle(protocolConfigured && !digitalProtocol);
            divUnsyncedPWMFreq.toggle(protocolConfigured && !digitalProtocol);

            $('div.digitalIdlePercent').toggle(protocolConfigured && digitalProtocol);
            $('div.idleMinRpm').toggle(protocolConfigured && digitalProtocol && FC.MOTOR_CONFIG.use_dshot_telemetry);

            if (FC.ADVANCED_TUNING.idleMinRpm && FC.MOTOR_CONFIG.use_dshot_telemetry) {
                $('div.digitalIdlePercent').hide();
            }

            $('.escSensor').toggle(protocolConfigured && digitalProtocol);

            $('div.checkboxDshotBidir').toggle(protocolConfigured && semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42) && digitalProtocol);
            $('div.motorPoles').toggle(protocolConfigured && rpmFeaturesVisible && semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42));

            $('.escMotorStop').toggle(protocolConfigured);

            $('#escProtocolDisabled').toggle(!protocolConfigured);

            //trigger change unsyncedPWMSwitch to show/hide Motor PWM freq input
            unsyncedPWMSwitchElement.trigger("change");
        }

        escProtocolElement.val(FC.PID_ADVANCED_CONFIG.fast_pwm_protocol + 1);

        escProtocolElement.on("change", function () {
            const escProtocolValue = parseInt($(this).val()) - 1;

            let newValue = undefined;
            if (escProtocolValue !== FC.PID_ADVANCED_CONFIG.fast_pwm_protocol) {
                newValue = $(this).find('option:selected').text();
            }
            self.analyticsChanges['EscProtocol'] = newValue;

            updateVisibility();
        }).trigger("change");

        //trigger change dshotBidir and ESC_SENSOR to show/hide Motor Poles tab
        dshotBidirElement.change(updateVisibility).trigger("change");
        $("input[name='ESC_SENSOR']").on("change", updateVisibility).trigger("change");

        // fill throttle
        $('input[name="minthrottle"]').val(FC.MOTOR_CONFIG.minthrottle);
        $('input[name="maxthrottle"]').val(FC.MOTOR_CONFIG.maxthrottle);
        $('input[name="mincommand"]').val(FC.MOTOR_CONFIG.mincommand);

        //fill 3D
        $('.tab-motors ._3d').show();
        $('input[name="_3ddeadbandlow"]').val(FC.MOTOR_3D_CONFIG.deadband3d_low);
        $('input[name="_3ddeadbandhigh"]').val(FC.MOTOR_3D_CONFIG.deadband3d_high);
        $('input[name="_3dneutral"]').val(FC.MOTOR_3D_CONFIG.neutral);

        /*
        * UI hooks
        */

       function checkUpdate3dControls() {
            if (FC.FEATURE_CONFIG.features.isEnabled('3D')) {
                $('._3dSettings').show();
            } else {
                $('._3dSettings').hide();
            }
        }

        $('input.feature', featuresElement).on("change", function () {
            const element = $(this);

            FC.FEATURE_CONFIG.features.updateData(element);
            updateTabList(FC.FEATURE_CONFIG.features);

            switch (element.attr('name')) {
                case 'MOTOR_STOP':
                    break;

                case '3D':
                    checkUpdate3dControls();
                    break;
            }
        });

        $(featuresElement).filter('select').change(function () {
            const element = $(this);

            FC.FEATURE_CONFIG.features.updateData(element);
            updateTabList(FC.FEATURE_CONFIG.features);

        });

        checkUpdate3dControls();

        /*
        * MOTOR TESTING
        */

        function setSlidersDefault() {
            // change all values to default
            $('div.sliders input').val(zeroThrottleValue);
        }

        function setSlidersEnabled(isEnabled) {
            if (isEnabled && !self.armed) {
                $('div.sliders input').slice(0, self.numberOfValidOutputs).prop('disabled', false);

                // unlock master slider
                $('div.sliders input:last').prop('disabled', false);
            } else {
                setSlidersDefault();

                // disable sliders / min max
                $('div.sliders input').prop('disabled', true);
            }

            $('div.sliders input').trigger('input');
        }

        setSlidersDefault();

        const ignoreKeys = [
            'PageUp',
            'PageDown',
            'End',
            'Home',
            'ArrowUp',
            'ArrowDown',
            'AltLeft',
            'AltRight',
        ];

        motorsEnableTestModeElement.on('change', function () {
            let enabled = motorsEnableTestModeElement.is(':checked');
            // prevent or disable testing if configHasChanged flag is set.
            if (self.configHasChanged) {
                if (enabled) {
                    const message = i18n$1.getMessage('motorsDialogSettingsChanged');
                    showDialogSettingsChanged(message);
                    enabled = false;
                }
                // disable input
                motorsEnableTestModeElement.prop('checked', false);
            }

            function disableMotorTest(e) {
                if (motorsEnableTestModeElement.is(':checked')) {
                    if (!ignoreKeys.includes(e.code)) {
                        motorsEnableTestModeElement.prop('checked', false).trigger('change');
                        document.removeEventListener('keydown', evt => disableMotorTest(evt));
                    }
                }
            }

            if (enabled) {
                // Send enable extended dshot telemetry command
                const buffer = [];

                buffer.push8(DshotCommand.dshotCommandType_e.DSHOT_CMD_TYPE_BLOCKING);
                buffer.push8(255);  // Send to all escs
                buffer.push8(1);    // 1 command
                buffer.push8(13);   // Enable extended dshot telemetry

                MSP.send_message(MSPCodes.MSP2_SEND_DSHOT_COMMAND, buffer);

                document.addEventListener('keydown', e => disableMotorTest(e));
            }

            setContentButtons(enabled);
            setSlidersEnabled(enabled);

            $('div.sliders input').trigger('input');

            mspHelper.setArmingEnabled(enabled, enabled);
        });

        let bufferingSetMotor = [],
        buffer_delay = false;

        $('div.sliders input:not(.master)').on('input', function () {
            const index = $(this).index();
            let buffer = [];

            $('div.values li').eq(index).text($(this).val());

            for (let i = 0; i < self.numberOfValidOutputs; i++) {
                const val = parseInt($('div.sliders input').eq(i).val());
                buffer.push16(val);
            }

            bufferingSetMotor.push(buffer);

            if (!buffer_delay) {
                buffer_delay = setTimeout(function () {
                    buffer = bufferingSetMotor.pop();

                    MSP.send_message(MSPCodes.MSP_SET_MOTOR, buffer);

                    bufferingSetMotor = [];
                    buffer_delay = false;
                }, 10);
            }
        });

        $('div.sliders input:not(.master)').on('input wheel', function (e) {
            self.scrollSlider($(this), e);
        });

        $('div.sliders input.master').on('input', function () {
            const val = $(this).val();

            $('div.sliders input:not(:disabled, :last)').val(val);
            $('div.values li:not(:last)').slice(0, self.numberOfValidOutputs).text(val);
            $('div.sliders input:not(:last):first').trigger('input');
        });

        $('div.sliders input.master').on('input wheel', function (e) {
            self.scrollSlider($(this), e);
        });

        // check if motors are already spinning
        let motorsRunning = false;

        for (let i = 0; i < self.numberOfValidOutputs; i++) {
            if (!self.feature3DEnabled) {
                if (FC.MOTOR_DATA[i] > zeroThrottleValue) {
                    motorsRunning = true;
                }
            } else {
                if ((FC.MOTOR_DATA[i] < FC.MOTOR_3D_CONFIG.deadband3d_low) || (FC.MOTOR_DATA[i] > FC.MOTOR_3D_CONFIG.deadband3d_high)) {
                    motorsRunning = true;
                }
            }
        }

        if (motorsRunning) {
            motorsEnableTestModeElement.prop('checked', true).trigger('change');

            // motors are running adjust sliders to current values

            const sliders = $('div.sliders input:not(.master)');

            let masterValue = FC.MOTOR_DATA[0];
            for (let i = 0; i < FC.MOTOR_DATA.length; i++) {
                if (FC.MOTOR_DATA[i] > 0) {
                    sliders.eq(i).val(FC.MOTOR_DATA[i]);

                    if (masterValue !== FC.MOTOR_DATA[i]) {
                        masterValue = false;
                    }
                }
            }

            // only fire events when all values are set
            sliders.trigger('input');

            // slide master slider if condition is valid
            if (masterValue) {
                $('div.sliders input.master').val(masterValue)
                .trigger('input');
            }
        }

        // data pulling functions used inside interval timer

        function get_motor_data() {
            MSP.send_message(MSPCodes.MSP_MOTOR, false, false, get_motor_telemetry_data);
        }

        function get_motor_telemetry_data() {
            if (FC.MOTOR_CONFIG.use_dshot_telemetry || FC.MOTOR_CONFIG.use_esc_sensor) {
                MSP.send_message(MSPCodes.MSP_MOTOR_TELEMETRY, false, false, update_ui);
            } else {
                update_ui();
            }
        }

        function getMotorOutputs() {
            const motorData = [];
            const motorsTesting = motorsEnableTestModeElement.is(':checked');

            for (let i = 0; i < self.numberOfValidOutputs; i++) {
                motorData[i] = motorsTesting ? FC.MOTOR_DATA[i] : zeroThrottleValue;
            }

            return motorData;
        }

        const fullBlockScale = rangeMax - rangeMin;

        function update_ui() {
            const previousArmState = self.armed;
            const blockHeight = $('div.m-block:first').height();
            const motorValues = getMotorOutputs();
            const MAX_VALUE_SIZE = 6,
                AVG_RPM_ROUNDING = 100;
            let sumRpm = 0,
                isAllMotorValueEqual = motorValues.every((value, _index, arr) => value === arr[0]),
                hasTelemetryError = false;

            for (let i = 0; i < motorValues.length; i++) {
                const motorValue = motorValues[i];
                const barHeight = motorValue - rangeMin,
                marginTop = blockHeight - (barHeight * (blockHeight / fullBlockScale)).clamp(0, blockHeight),
                height = (barHeight * (blockHeight / fullBlockScale)).clamp(0, blockHeight),
                color = parseInt(barHeight * 0.009);

                $(`.motor-${i} .label`, motorsWrapper).text(motorValue);
                $(`.motor-${i} .indicator`, motorsWrapper).css({
                    'margin-top' : `${marginTop}px`,
                    'height' : `${height}px`,
                    'background-color' : `rgba(255,187,0,1.${color})`,
                });

                if (i < FC.MOTOR_CONFIG.motor_count && (FC.MOTOR_CONFIG.use_dshot_telemetry || FC.MOTOR_CONFIG.use_esc_sensor)) {

                    const MAX_INVALID_PERCENT = 100;

                    let rpmMotorValue = FC.MOTOR_TELEMETRY_DATA.rpm[i];

                    // Reduce the size of the value if too big
                    if (rpmMotorValue > 999999) {
                        rpmMotorValue = `${(rpmMotorValue / 1000000).toFixed(5 - (rpmMotorValue / 1000000).toFixed(0).toString().length)}M`;
                    }
                    if (isAllMotorValueEqual) {
                        sumRpm += Math.round(rpmMotorValue * AVG_RPM_ROUNDING) / AVG_RPM_ROUNDING;
                    }
                    rpmMotorValue = rpmMotorValue.toString().padStart(MAX_VALUE_SIZE);
                    let telemetryText = i18n$1.getMessage('motorsRPM', {motorsRpmValue: rpmMotorValue});

                    if (FC.MOTOR_CONFIG.use_dshot_telemetry) {

                        let invalidPercent = FC.MOTOR_TELEMETRY_DATA.invalidPercent[i];
                        hasTelemetryError = invalidPercent > MAX_INVALID_PERCENT;
                        let classError = hasTelemetryError ? "warning" : "";
                        invalidPercent = (invalidPercent / 100).toFixed(2).toString().padStart(MAX_VALUE_SIZE);

                        telemetryText += `<br><span class="${classError}">`;
                        telemetryText += i18n$1.getMessage('motorsRPMError', {motorsErrorValue: invalidPercent});
                        telemetryText += "</span>";
                    }

                    if (FC.MOTOR_CONFIG.use_dshot_telemetry || FC.MOTOR_CONFIG.use_esc_sensor) {

                        let escTemperature = FC.MOTOR_TELEMETRY_DATA.temperature[i];
                        escTemperature = escTemperature.toString().padStart(MAX_VALUE_SIZE);

                        telemetryText += "<br>";
                        telemetryText += i18n$1.getMessage('motorsESCTemperature', {motorsESCTempValue: escTemperature});
                    }

                    $(`.motor_testing .telemetry .motor-${i}`).html(telemetryText);
                }
            }

            if (FC.MOTOR_CONFIG.use_dshot_telemetry && !hasTelemetryError && isAllMotorValueEqual) {
                const avgRpm = (Math.round(sumRpm / motorValues.length * AVG_RPM_ROUNDING) / AVG_RPM_ROUNDING).toFixed(0),
                    avgRpmMotorValue = avgRpm.toString().padStart(MAX_VALUE_SIZE),
                    message = i18n$1.getMessage('motorsRPM', { motorsRpmValue: avgRpmMotorValue });
                $(`.motor_testing .telemetry .motor-master`).html(message);
            } else {
                $(`.motor_testing .telemetry .motor-master`).html("");
            }

            //keep the following here so at least we get a visual cue of our motor setup
            update_arm_status();

            if (previousArmState !== self.armed) {
                console.log('arm state change detected');

                motorsEnableTestModeElement.change();
            }
        }

        $('a.save').on('click', async function() {
            GUI.interval_kill_all(['motor_and_status_pull','motors_power_data_pull_slow']);

            // gather data that doesn't have automatic change event bound
            FC.MOTOR_CONFIG.minthrottle = parseInt($('input[name="minthrottle"]').val());
            FC.MOTOR_CONFIG.maxthrottle = parseInt($('input[name="maxthrottle"]').val());
            FC.MOTOR_CONFIG.mincommand = parseInt($('input[name="mincommand"]').val());

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                FC.MOTOR_CONFIG.motor_poles = parseInt($('input[name="motorPoles"]').val());
            }

            FC.MOTOR_3D_CONFIG.deadband3d_low = parseInt($('input[name="_3ddeadbandlow"]').val());
            FC.MOTOR_3D_CONFIG.deadband3d_high = parseInt($('input[name="_3ddeadbandhigh"]').val());
            FC.MOTOR_3D_CONFIG.neutral = parseInt($('input[name="_3dneutral"]').val());

            FC.PID_ADVANCED_CONFIG.fast_pwm_protocol = parseInt(escProtocolElement.val() - 1);
            FC.PID_ADVANCED_CONFIG.use_unsyncedPwm = unsyncedPWMSwitchElement.is(':checked') ? 1 : 0;
            FC.PID_ADVANCED_CONFIG.motor_pwm_rate = parseInt($('input[name="unsyncedpwmfreq"]').val());
            FC.PID_ADVANCED_CONFIG.digitalIdlePercent = parseFloat($('input[name="digitalIdlePercent"]').val());

            await MSP.promise(MSPCodes.MSP_SET_FEATURE_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_FEATURE_CONFIG));
            await MSP.promise(MSPCodes.MSP_SET_MIXER_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_MIXER_CONFIG));
            await MSP.promise(MSPCodes.MSP_SET_MOTOR_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_MOTOR_CONFIG));
            await MSP.promise(MSPCodes.MSP_SET_MOTOR_3D_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_MOTOR_3D_CONFIG));
            await MSP.promise(MSPCodes.MSP_SET_ADVANCED_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_ADVANCED_CONFIG));
            await MSP.promise(MSPCodes.MSP_SET_ARMING_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_ARMING_CONFIG));

            if (semver.gte(FC.CONFIG.apiVersion, API_VERSION_1_42)) {
                await MSP.promise(MSPCodes.MSP_SET_FILTER_CONFIG, mspHelper.crunch(MSPCodes.MSP_SET_FILTER_CONFIG));
            }

            tracking.sendSaveAndChangeEvents(tracking.EVENT_CATEGORIES.FLIGHT_CONTROLLER, self.analyticsChanges, 'motors');
            self.analyticsChanges = {};
            self.configHasChanged = false;

            mspHelper.writeConfiguration(true);
        });

        $('a.stop').on('click', () => motorsEnableTestModeElement.prop('checked', false).trigger('change'));

        // enable Status and Motor data pulling
        GUI.interval_add('motor_and_status_pull', get_motor_data, 50, true);

        setup_motor_output_reordering_dialog(SetupEscDshotDirectionDialogCallback, zeroThrottleValue);

        function SetupEscDshotDirectionDialogCallback() {
            SetupdescDshotDirectionDialog(content_ready, zeroThrottleValue);
        }

        function content_ready() {
            GUI.content_ready(callback);
        }

        content_ready();
    }

    function showDialogMixerReset(message) {
        const dialogMixerReset = $('#dialog-mixer-reset')[0];

        $('#dialog-mixer-reset-content').html(message);

        if (!dialogMixerReset.hasAttribute('open')) {
            dialogMixerReset.showModal();
            $('#dialog-mixer-reset-confirmbtn').click(function() {
                dialogMixerReset.close();
            });
        }
    }

    function showDialogSettingsChanged(message) {
        const dialogSettingsChanged = $('#dialog-settings-changed')[0];

        $('#dialog-settings-changed-content').html(message);

        if (!dialogSettingsChanged.hasAttribute('open')) {
            dialogSettingsChanged.showModal();
            $('#dialog-settings-reset-confirmbtn').click(function() {
                TABS.motors.refresh();
            });
            $('#dialog-settings-changed-confirmbtn').click(function() {
                dialogSettingsChanged.close();
            });
        }
    }

    function setup_motor_output_reordering_dialog(callbackFunction, zeroThrottleValue)
    {
        const domDialogMotorOutputReorder = $('#dialogMotorOutputReorder');
        const idleThrottleValue = zeroThrottleValue + 60;

        const motorOutputReorderComponent = new MotorOutputReorderComponent($('#dialogMotorOutputReorderContent'),
            callbackFunction, mixerList[FC.MIXER_CONFIG.mixer - 1].name,
            zeroThrottleValue, idleThrottleValue);

        $('#dialogMotorOutputReorder-closebtn').click(closeDialogMotorOutputReorder);

        function closeDialogMotorOutputReorder()
        {
            domDialogMotorOutputReorder[0].close();
            motorOutputReorderComponent.close();
            $(document).off("keydown", onDocumentKeyPress);
        }

        function onDocumentKeyPress(event)
        {
            if (27 === event.which) {
                closeDialogMotorOutputReorder();
            }
        }

        $('#motorOutputReorderDialogOpen').click(function()
        {
            $(document).on("keydown", onDocumentKeyPress);
            domDialogMotorOutputReorder[0].showModal();
        });
    }

    function SetupdescDshotDirectionDialog(callbackFunction, zeroThrottleValue)
    {
        const domEscDshotDirectionDialog = $('#escDshotDirectionDialog');

        const idleThrottleValue = zeroThrottleValue + 60;

        const motorConfig = {
            numberOfMotors: self.numberOfValidOutputs,
            motorStopValue: zeroThrottleValue,
            motorSpinValue: idleThrottleValue,
            escProtocolIsDshot: self.escProtocolIsDshot,
        };

        const escDshotDirectionComponent = new EscDshotDirectionComponent(
            $('#escDshotDirectionDialog-Content'), callbackFunction, motorConfig);

        $('#escDshotDirectionDialog-closebtn').on("click", closeEscDshotDirectionDialog);

        function closeEscDshotDirectionDialog()
        {
            domEscDshotDirectionDialog[0].close();
            escDshotDirectionComponent.close();
            $(document).off("keydown", onDocumentKeyPress);
        }

        function onDocumentKeyPress(event)
        {
            if (27 === event.which) {
                closeEscDshotDirectionDialog();
            }
        }

        $('#escDshotDirectionDialog-Open').click(function()
        {
            $(document).on("keydown", onDocumentKeyPress);
            domEscDshotDirectionDialog[0].showModal();
        });

        callbackFunction();
    }
};

motors.refresh = function (callback) {
    const self = this;

    GUI.tab_switch_cleanup(function() {
        self.initialize();

        if (callback) {
            callback();
        }
    });
};

motors.cleanup = function (callback) {
    if (callback) callback();
};

motors.scrollSlider = function(slider, e) {
    if (slider.prop('disabled')) {
        return;
    }

    if (!(e.originalEvent?.deltaY && e.originalEvent?.altKey)) {
        return;
    }

    e.preventDefault();

    const step = 25;
    const delta = e.originalEvent.deltaY > 0 ? -step : step;
    const val = parseInt(slider.val()) + delta;
    const roundedVal = Math.round(val / step) * step;
    slider.val(roundedVal);
    slider.trigger('input');
};

TABS.motors = motors;

export { motors };
//# sourceMappingURL=motors.js.map
