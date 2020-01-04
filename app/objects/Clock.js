export class Clock {
    constructor(scene){
        this.scene = scene;

        this.currentTime = new Date();

        this.textWriterColons = null;
        this.textWriterHours = null;
        this.textWriterMinutes = null;
        this.textWriterSeconds = null;
        this.textHours = null;
        this.textMinutes = null;
        this.textSeconds = null;
        
        this.scale = 1.25;
        this.positionZ = -240;
        this.thickness = 3;

        this.create();

        setInterval(() => {
            this.update();
        }, 1000);
    }

    create(){
        var Writer = BABYLON.MeshWriter(this.scene, {scale:this.scale});

        // if (this.textWriterColons) {
        //     this.textWriterColons.dispose();
        // }

        this.textWriterColons  = new Writer( 
                        ":    :",
                        {
                            "anchor": "center",
                            "letter-height": 50,
                            "letter-thickness": this.thickness,
                            "color": "#1C3870",
                            "position": {
                                "z": this.positionZ
                            }
                        }
                    );
    }

    update(){
        this.currentTime = new Date();
        
        let h = (this.currentTime.getHours()<10?'0':'') + this.currentTime.getHours();
        let m = (this.currentTime.getMinutes()<10?'0':'') + this.currentTime.getMinutes();
        let s = (this.currentTime.getSeconds()<10?'0':'') + this.currentTime.getSeconds();
        
        let text = h + ':' + m + ":" + s;
        
        // only redraw if the text has changed
        if (this.textHours  != h){
            this.textHours = h;
            
            console.log("redrawing Hours");
            
            if (this.textWriterHours) {
                this.textWriterHours.dispose();
            }
            
            var Writer = BABYLON.MeshWriter(this.scene, {scale:this.scale});
            this.textWriterHours  = new Writer( 
                            this.textHours,
                            {
                                "anchor": "center",
                                "letter-height": 50,
                                "letter-thickness": this.thickness,
                                "color": "#1C3870",
                                "position": {
                                    "x": -70,
                                    "z": this.positionZ
                                }
                            }
                        );
        }

        // only redraw if the text has changed
        if (this.textMinutes  != m){
            this.textMinutes = m;
            
            console.log("redrawing Minutes");
            
            if (this.textWriterMinutes) {
                this.textWriterMinutes.dispose();
            }

            var Writer = BABYLON.MeshWriter(this.scene, {scale:this.scale});
            this.textWriterMinutes  = new Writer( 
                            this.textMinutes,
                            {
                                "anchor": "center",
                                "letter-height": 50,
                                "letter-thickness": this.thickness,
                                "color": "#1C3870",
                                "position": {
                                    "z": this.positionZ
                                }
                            }
                        );
        }
        
        // only redraw if the text has changed
        if (this.textSeconds  != s){
            this.textSeconds = s;
            
            console.log("redrawing Seconds");
            
            if (this.textWriterSeconds) {
                this.textWriterSeconds.dispose();
            }
            
            var Writer = BABYLON.MeshWriter(this.scene, {scale:this.scale});
            this.textWriterSeconds  = new Writer( 
                            this.textSeconds,
                            {
                                "anchor": "center",
                                "letter-height": 50,
                                "letter-thickness": this.thickness,
                                "color": "#1C3870",
                                "position": {
                                    "x": 70,
                                    "z": this.positionZ
                                }
                            }
                        );
        }

    }

}