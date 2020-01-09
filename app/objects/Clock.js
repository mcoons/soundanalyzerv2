export class Clock {

    constructor(scene) {
        this.scene = scene;

        this.textWriterColons = null;
        this.textWriterHours = null;
        this.textWriterMinutes = null;
        this.textWriterSeconds = null;
        this.textHours = null;
        this.textMinutes = null;
        this.textSeconds = null;

        this.scale = 1.25;
        this.positionZ = -240;
        this.positionY = -0.01;;
        this.thickness = 3;

        this.create();

        this.clockTimer = setInterval(() => {
            this.update();
        }, 1000);
    }

    create() {
        var Writer = BABYLON.MeshWriter(this.scene, {
            scale: this.scale
        });

        this.textWriterColons = new Writer(
            ":    :", {
                "anchor": "center",
                "letter-height": 50,
                "letter-thickness": this.thickness,
                "color": "#1C3870",
                "position": {
                    "y": this.positionY,
                    "z": this.positionZ
                }
            }
        );
    }

    update() {
        let currentTime = new Date();

        let h = currentTime.getHours();
        h = (h < 10 ? '0' : '') + h;
        let m = currentTime.getMinutes();
        m = (m < 10 ? '0' : '') + m;
        let s = currentTime.getSeconds();
        s = (s < 10 ? '0' : '') + s;

        // only redraw if the text has changed
        if (this.textHours != h) {
            this.textHours = h;

            if (this.textWriterHours) {
                this.textWriterHours.dispose();
            }

            var Writer = BABYLON.MeshWriter(this.scene, {
                scale: this.scale
            });

            this.textWriterHours = new Writer(
                this.textHours, {
                    "anchor": "center",
                    "letter-height": 50,
                    "letter-thickness": this.thickness,
                    "color": "#1C3870",
                    "position": {
                        "x": -70,
                        "y": this.positionY,
                        "z": this.positionZ
                    }
                }
            );
        }

        // only redraw if the text has changed
        if (this.textMinutes != m) {
            this.textMinutes = m;

            if (this.textWriterMinutes) {
                this.textWriterMinutes.dispose();
            }

            var Writer = BABYLON.MeshWriter(this.scene, {
                scale: this.scale
            });

            this.textWriterMinutes = new Writer(
                this.textMinutes, {
                    "anchor": "center",
                    "letter-height": 50,
                    "letter-thickness": this.thickness,
                    "color": "#1C3870",
                    "position": {
                        "y": this.positionY,
                        "z": this.positionZ
                    }
                }
            );
        }

        // only redraw if the text has changed
        if (this.textSeconds != s) {
            this.textSeconds = s;

            if (this.textWriterSeconds) {
                this.textWriterSeconds.dispose();
            }

            var Writer = BABYLON.MeshWriter(this.scene, {
                scale: this.scale
            });

            this.textWriterSeconds = new Writer(
                this.textSeconds, {
                    "anchor": "center",
                    "letter-height": 50,
                    "letter-thickness": this.thickness,
                    "color": "#1C3870",
                    "position": {
                        "x": 70,
                        "y": this.positionY,
                        "z": this.positionZ
                    }
                }
            );
        }

    }

    remove() {
        this.textWriterHours.dispose();
        this.textWriterMinutes.dispose();
        this.textWriterSeconds.dispose();
        this.textWriterColons.dispose();

        clearInterval(this.clockTimer);
    }

}