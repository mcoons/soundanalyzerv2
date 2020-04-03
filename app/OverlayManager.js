import {
    logToScreen
} from './utilities.js';

export class OverlayManager {

    constructor(canvasID, options, eventBus, audioManager, sceneManager) {

        this.options = options;
        this.eventBus = eventBus;
        this.audioManager = audioManager;
        this.sceneManager = sceneManager;

        this.canvas2D = $(canvasID)[0];
        this.canvas2D.style.width = this.canvas2D.width;
        this.canvas2D.style.height = this.canvas2D.height;
        this.ctx2D = this.canvas2D.getContext("2d");
        this.ctx2D.globalAlpha = .5;

        var self = this;
        window.requestAnimationFrame(render2DFrame);

        function render2DFrame() {
            fix_dpi();

            if (self.options.showBars) {
                self.draw2DBars();
            }

            if (self.options.showWaveform) {
                self.drawWaveform(self.canvas2D, self.audioManager.tdDataArrayNormalized, self.canvas2D.width, 60);
            }

            if (self.options.showConsole) {
                self.renderConsoleOutput();
            }

            window.requestAnimationFrame(render2DFrame);
        }

        function fix_dpi() {
            //create a style object that returns width and height
            var dpi = window.devicePixelRatio;

            let style = {
                height() {
                    return +window.getComputedStyle(self.canvas2D).getPropertyValue('height').slice(0, -2);
                },
                width() {
                    return +window.getComputedStyle(self.canvas2D).getPropertyValue('width').slice(0, -2);
                }
            }
            //set the correct attributes for a crystal clear image!
            self.canvas2D.setAttribute('width', style.width() * dpi);
            self.canvas2D.setAttribute('height', style.height() * dpi);
        }

    }  // end constructor

    drawWaveform(canvas, drawData, width, height) {
        let ctx = canvas.getContext('2d');
        let drawHeight = height / 2;

        ctx.lineWidth = 5;
        ctx.moveTo(0, drawHeight);
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
            let minPixel = drawData[i] * .5;
            ctx.lineTo(i, minPixel);
        }

        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    renderConsoleOutput() {
        let outputString = "<br><br><br><br><br><br>"; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
        outputString += "&nbsp alpha: <br> &nbsp " + Math.round(this.sceneManager.scene.activeCamera.alpha * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp beta:  <br> &nbsp " + Math.round(this.sceneManager.scene.activeCamera.beta * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp radius:<br> &nbsp " + Math.round(this.sceneManager.scene.activeCamera.radius * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp site index:<br> &nbsp " + this.audioManager.siteIndex + "<br><br>";
        logToScreen(outputString);
    }

    draw2DBars() {
        let WIDTH = this.canvas2D.width;
        let HEIGHT = this.canvas2D.height;
        let barWidth = (WIDTH / (this.audioManager.fr512DataLength - 80));

        this.ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

        let x = 0;

        for (var i = 0; i < this.audioManager.fr512BufferLength - 80; i++) {
            let barHeight = this.audioManager.fr512DataArray[i] * 1 + 1;

            var r = barHeight;
            var g = 255 *  i / this.audioManager.fr512DataLength;
            var b = 255 -  128 * i / (this.audioManager.fr512DataLength - 80);

            this.ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
            this.ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

}