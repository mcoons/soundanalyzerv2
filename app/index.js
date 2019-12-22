////////////////////////////////////

window.onload = function () {

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var canvas2D = document.getElementById("canvas2D");
    canvas2D.style.width = canvas2D.width;
    canvas2D.style.height = canvas2D.height;

    var ctx2D = canvas2D.getContext("2d");
    ctx2D.globalAlpha = .5;

    var title = document.getElementById("title");

    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.9;

    analyser.connect(audioCtx.destination);
    audioSrc.connect(analyser);
    var bufferLength = analyser.frequencyBinCount;
    var dataLength = bufferLength - 64;
    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas2D.width;
    var HEIGHT = canvas2D.height;

    var barWidth = (WIDTH / dataLength) - 3;

    var scene;
    var wheel1Objects = [];
    var wheel2Objects = [];

    var palette = [];

    $('.new_Btn').bind("click", function () {
        $('#thefile').click();
    });

    file.onchange = function () {
        var files = this.files;

        title.innerHTML = files[0].name;

        audio.src = URL.createObjectURL(files[0]);
        audio.load();

        var barHeight;
        var x = 0;

        var dpi = window.devicePixelRatio;

        function fix_dpi() {
            //create a style object that returns width and height
            let style = {
                height() {
                    return +getComputedStyle(canvas2D).getPropertyValue('height').slice(0, -2);
                },
                width() {
                    return +getComputedStyle(canvas2D).getPropertyValue('width').slice(0, -2);
                }
            }
            //set the correct attributes for a crystal clear image!
            canvas2D.setAttribute('width', style.width() * dpi);
            canvas2D.setAttribute('height', style.height() * dpi);
        }

        function render2DFrame() {
            requestAnimationFrame(render2DFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            fix_dpi();

            WIDTH = canvas2D.width;
            HEIGHT = canvas2D.height;

            barWidth = (WIDTH / dataLength) - 3;

            ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

            let textColor;

            for (var i = 0; i < bufferLength - 20; i++) {
                barHeight = dataArray[i] * 1 + 3;

                var r = barHeight + (.22 * (i / dataLength));
                var g = 250 * (i / dataLength);
                var b = 250;

                if (i == 20) textColor = "rgb(" + r + "," + g + "," + b + ")";

                ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
                ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 3;
            }
            title.style.color = textColor;

        }

        render2DFrame();
    };

    var canvas3D = document.getElementById('canvas3D');

    var engine = new BABYLON.Engine(canvas3D, true);

    var createScene = function () {
        console.log("Creating Scene");
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        // scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        let camera = new BABYLON.ArcRotateCamera("camera1", 3 * Math.PI / 2, Math.PI / 3, 220, new BABYLON.Vector3(0, 0, 64), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas3D
        camera.attachControl(canvas3D, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        // var spotlight1 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -30, 10), Math.PI / 3, 200, scene);





        createWheel1();
        createWheel2();


        return scene;
    }

    // call the createScene function
    scene = createScene();
    buildPalette();

    // run the render loop
    engine.runRenderLoop(function () {

        wheel1Master.rotation.y += .005;
        wheel2Master.rotation.y -= .005;
        wheel1Objects.forEach((object, index) => {
            // object.scaling.y = (soundData.frBuffer[index] + 140) * .2;
            let y = dataArray[index] * .15 + .25;
            object.scaling.y = y;
            object.position.y = y / 2;
            object.material = palette[Math.round(map(dataArray[index] || 0, 0, 255, 0, 1529))].mat;
        });

        updateWheel2();
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
    });

    function createWheel1() {
        //create a Center of Transformation
        wheel1Master = new BABYLON.TransformNode("root");
        wheel1Master.position = new BABYLON.Vector3(0, 0, 0);
        let width = 6;
        let depth = 6;
        let radius = 40;
        for (let theta = 0; theta < 2 * Math.PI - Math.PI / 36; theta += Math.PI / 15) {

            // let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
            //     width: width,
            //     depth: depth
            // }, scene);

            let thing = BABYLON.MeshBuilder.CreateCylinder("cylinder1", {
                height: 1,
                diameterTop: 8.45,
                diameterBottom: 8.45,
                tessellation: 100,
                subdivisons: 1
            }, scene, true);

            thing.parent = wheel1Master; //apply to Box
            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            thing.rotation.y = -theta;

            wheel1Objects.push(thing);
        }
    }

    function createWheel2() {
        wheel2Master = new BABYLON.TransformNode("root");
        wheel2Master.position = new BABYLON.Vector3(0, -10, 0);
        let width = 1;
        let depth = 1;
        let height = 1;
        let radius = 10;
        for (let theta = 0; theta < 2 * Math.PI - Math.PI / 19; theta += Math.PI / 18) {

            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: height
            }, scene);
            thing.parent = wheel2Master; //apply to Box

            // thing.material = palette[128].mat;
            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            // thing.position.y = -50;
            thing.rotation.y = -theta;
            wheel2Objects.push(thing);

        }
        // wheel2Master.rotation.x = Math.PI / 2;
    }

    function updateWheel2(){
        let radius = 12;
    
        wheel2Objects.forEach((object, index) => {
          // object.scaling.y = (soundData.frBuffer[index] + 140) * .2;
          let y = dataArray[index+25]*.35+.25;
          object.scaling.x = y;
          let theta = Math.PI/18 * index;
        //   object.position.y = y / 2 ;
          object.position.x = (radius+y/2)*Math.cos(theta);
          object.position.z = (radius+y/2)*Math.sin(theta);
        //   object.position.y = -30;
          object.material = palette[Math.round(map(dataArray[index] || 0, 0, 255, 765, 0))].mat;
        });
      }
    
    // Builds a palette array[1529] of palette objects
    function buildPalette() {
        let r = 255,
            g = 0,
            b = 0;

        for (g = 0; g <= 255; g++) {
            addToPalette(r, g, b, );
        }
        g--;

        for (r = 254; r >= 0; r--) {
            addToPalette(r, g, b, );
        }
        r++;

        for (b = 1; b <= 255; b++) {
            addToPalette(r, g, b, );
        }
        b--;

        for (g = 254; g >= 0; g--) {
            addToPalette(r, g, b, );
        }
        g++;

        for (r = 1; r <= 255; r++) {
            addToPalette(r, g, b, );
        }
        r--;

        for (b = 254; b > 0; b--) {
            addToPalette(r, g, b, );
        }
        b++;

        function addToPalette(r, g, b) {

            var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1);

            let mat = new BABYLON.StandardMaterial("mat", scene);
            mat.diffuseColor = color;
            mat.specularColor = new BABYLON.Color3(r / 255 * .4, g / 255 * .4, b / 255 * .4);
            mat.ambientColor = new BABYLON.Color3(r / 255 * .4, g / 255 * .4, b / 255 * .4);


            palette.push({
                r,
                g,
                b,
                color,
                mat
            });
        }

        // console.log(palette);
    }

    // Function to map a value from one range to another
    function map(x, oMin, oMax, nMin, nMax) {
        // check range

        if (oMin === oMax) {
            console.log("Warning: Zero input range");
            return null;
        }

        if (nMin === nMax) {
            console.log("Warning: Zero output range");
            return null;
        }

        // check reversed input range
        let reverseInput = false;
        let oldMin = Math.min(oMin, oMax);
        let oldMax = Math.max(oMin, oMax);

        if (oldMin != oMin) reverseInput = true;

        // check reversed output range
        let reverseOutput = false;
        let newMin = Math.min(nMin, nMax);
        let newMax = Math.max(nMin, nMax);

        if (newMin != nMin) reverseOutput = true;

        // calculate new range
        let portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);

        if (reverseInput) portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

        let result = portion + newMin;

        if (reverseOutput) result = newMax - portion;

        return result;
    }

};