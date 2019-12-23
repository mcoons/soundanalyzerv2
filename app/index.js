////////////////////////////////////

window.onload = function () {

    var showWheel1 = true;
    var showWheel3 = true;
    var showFloor = true;
    var showBars = true;

    var title = document.getElementById("title");

    // 2D canvas variables
    var canvas2D = document.getElementById("canvas2D");
    canvas2D.style.width = canvas2D.width;
    canvas2D.style.height = canvas2D.height;
    var ctx2D = canvas2D.getContext("2d");
    ctx2D.globalAlpha = .5;
    var WIDTH = canvas2D.width;
    var HEIGHT = canvas2D.height;

    // audio variables
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);

    var frAnalyser = audioCtx.createAnalyser();
    frAnalyser.fftSize = 512;
    frAnalyser.smoothingTimeConstant = 0.9;
    var frBufferLength = frAnalyser.frequencyBinCount;
    var frDataLength = frBufferLength - 64;
    var frDataArray = new Uint8Array(frBufferLength);
    var barWidth = (WIDTH / frDataLength) - 3;

    var tdAnalyser = audioCtx.createAnalyser();
    tdAnalyser.fftSize = 512;
    tdAnalyser.smoothingTimeConstant = 0.9;
    var tdBufferLength = tdAnalyser.frequencyBinCount;
    var tdDataLength = tdBufferLength - 64;
    var tdDataArray = new Uint8Array(tdBufferLength);
    var tdHistory = [];
    let arraySize = 256;
    tdHistory = Array(arraySize).fill(0);

    audioSrc.connect(frAnalyser);
    frAnalyser.connect(tdAnalyser);
    tdAnalyser.connect(audioCtx.destination);

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

            frAnalyser.getByteFrequencyData(frDataArray);
            tdAnalyser.getByteTimeDomainData(tdDataArray);
            let highest = 0;
            tdDataArray.forEach( d => {
                if (d > highest) highest = d;
            });

            tdHistory.push(highest);
            if (tdHistory.length > arraySize) tdHistory.shift();
            // console.log(tdHistory.length);

            fix_dpi();

            if (showBars){
            WIDTH = canvas2D.width;
            HEIGHT = canvas2D.height;

            barWidth = (WIDTH / frDataLength) - 3;

            ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

            let textColor;

            for (var i = 0; i < frBufferLength - 20; i++) {
                barHeight = frDataArray[i] * 1 + 3;

                var r = barHeight + (.22 * (i / frDataLength));
                var g = 250 * (i / frDataLength);
                var b = 250;

                if (i == 20) textColor = "rgb(" + r + "," + g + "," + b + ")";

                ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
                ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 3;
            }
            title.style.color = textColor;
        }



        }

        render2DFrame();
    };

    // 3D canvas variables
    var scene;
    var masterTransform;
    var wheel3Master;
    var wheel1Master;
    var floorMaster;
    var wheel1Objects = [];
    var wheel2Objects = [];
    var wheel3Objects = [];
    var floorObjects = [];

    var palette = [];
    var paletteRed = [];
    var paletteGreen = [];
    var paletteBlue = [];

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);

    var createScene = function () {
        // console.log("Creating Scene");
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        let camera = new BABYLON.ArcRotateCamera("camera1", 3 * Math.PI / 2, Math.PI / 3, 220, new BABYLON.Vector3(0, 0, 64), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas3D
        camera.attachControl(canvas3D, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.6;

        var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(50, 50, 10), scene);
        pointLight1.intensity = 0.5;

        var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -25, 0), scene);
        pointLight2.intensity = 0.3;

        var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-50, -50, -10), scene);
        pointLight3.intensity = .5;

        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        if (showWheel1) createWheel1();
        // createWheel2();
        if (showWheel3) createWheel3();
        if (showFloor) createFloor();

        return scene;
    }

    // call the createScene function
    scene = createScene();
    buildPalettes();
    // buildPaletteRed();
    // buildPaletteGreen();
    // buildPaletteBlue();

    // run the render loop
    engine.runRenderLoop(function () {
        if (showWheel1) updateWheel1();
        // updateWheel2();
        if (showWheel3) updateWheel3();
        if (showFloor) updateFloor();

        // masterTransform.rotation.x += .0051;
        // masterTransform.rotation.y -= .0051;
        // masterTransform.rotation.z -= .0051;

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
        wheel1Master.parent = masterTransform;
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

    function updateWheel1() {
        wheel1Master.rotation.y += .005;
        wheel1Objects.forEach((object, index) => {
            // object.scaling.y = (soundData.frBuffer[index] + 140) * .2;
            let y = frDataArray[index] * .15 + .25;
            object.scaling.y = y;
            object.position.y = y / 2;
            object.material = palette[Math.round(map(frDataArray[index] || 0, 0, 255, 0, 1529))].mat;
        });

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

    function updateWheel2() {
        let radius = 12;

        wheel2Objects.forEach((object, index) => {
            // object.scaling.y = (soundData.frBuffer[index] + 140) * .2;
            let y = frDataArray[index + 25] * .35 + .25;
            object.scaling.x = y;
            let theta = Math.PI / 18 * index;
            //   object.position.y = y / 2 ;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);
            //   object.position.y = -30;
            object.material = palette[Math.round(map(frDataArray[index] || 0, 0, 255, 765, 0))].mat;
        });
    }

    function createWheel3() {
        wheel3Master = new BABYLON.TransformNode("root");
        wheel3Master.position = new BABYLON.Vector3(0, -15, 0);
        wheel3Master.parent = masterTransform;

        let width = 1;
        let depth = 1.5;
        let height = 1;
        let radius = 40;
        // let count = 0;

        let itemsDesired = 320;

        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 32);
        // 0 - 20 Index

        let dataIndex = 0;
        let direction = -1;

        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / (itemsDesired / 4)) {

            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: dataIndex / 16 + .1
            }, scene);
            thing.parent = wheel3Master; //apply to Box

            // thing.material = palette[128].mat;
            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            // thing.position.y = -50;
            thing.rotation.y = -theta;
            wheel3Objects.push(thing);

            // count++;

            // console.log(dataIndex);
            dataIndex += direction;
        }
        // wheel3Master.rotation.x = Math.PI / 2;
        // console.log("count:", count)
    }

    function updateWheel3() {
        let radius = 40;

        let dataIndex = 3;
        let direction = -1;

        // let count = 0;
        // let y;

        let itemsDesired = 320;

        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 16);

        wheel3Master.rotation.y -= .005;

        wheel3Objects.forEach((object, index) => {

            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let y = frDataArray[dataIndex + 25] * .3 + .01;
            object.scaling.x = y;
            object.scaling.y = .5 + dataIndex / 8;
            let theta = Math.PI / (itemsDesired / 4) * index;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);
            object.material = palette[Math.round(map((y * 1) % 255 || 0, 0, 255, 128, 1529))].mat;
            // object.material = paletteRed[Math.round(map((y * 1.5) % 255 || 0, 0, 255, 255, 128))].mat;

            //   count++;
            dataIndex += direction;

        });
    }

    function createFloor() {
        floorMaster = new BABYLON.TransformNode("root");
        floorMaster.position = new BABYLON.Vector3(0, -40, 0);
        floorMaster.parent = masterTransform;

        let width = 10;
        let depth = 10;
        let spacing = 2;
        for (let z = -5; z < 5; z++) {
            for (let x = -5; x < 5; x++) {
                let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                    width: width,
                    depth: depth,
                    height: 1
                }, scene);
                thing.position = new BABYLON.Vector3(x * (width+spacing) + (width+spacing)/2, -40, z * (depth+spacing) + (depth+spacing)/2);                

                floorObjects.push(thing);

            }           
        }
    }

    function updateFloor() {

        let dataIndex = 0;

        floorObjects.forEach(o => {
            let y = frDataArray[dataIndex]/80+.1;
            o.scaling.y = y;
            o.position.y = -40 + y/2;
            o.material = palette[Math.round(map((frDataArray[dataIndex] * 2) % 255 || 0, 0, 255, 128, 1529))].mat;

            dataIndex++;
        })
    }

    ///////////////////////////////////////////////////
    //   UTILITIES
    ////////////////////////////////////////////////////

    function addToPalette(r, g, b, palette) {

        var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1);

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = color;
        // mat.specularColor = new BABYLON.Color3(r / 255 * 1.1, g / 255 * 1.1, b / 255 * 1.1);
        mat.specularColor = new BABYLON.Color3(.25, .25, .25);
        mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);


        palette.push({
            r,
            g,
            b,
            color,
            mat
        });
    }

    // Builds a palette array[1529] of palette objects
    function buildPalettes() {
        let r = 255,
            g = 0,
            b = 0;

        for (g = 0; g <= 255; g++) {
            addToPalette(r, g, b, palette);
            addToPalette(g, 0, 0, paletteRed);
            addToPalette(0, g, 0, paletteGreen);

        }
        g--;

        for (r = 254; r >= 0; r--) {
            addToPalette(r, g, b, palette);
        }
        r++;

        for (b = 1; b <= 255; b++) {
            addToPalette(r, g, b, palette);
        }
        b--;

        for (g = 254; g >= 0; g--) {
            addToPalette(r, g, b, palette);
        }
        g++;

        for (r = 1; r <= 255; r++) {
            addToPalette(r, g, b, palette);
        }
        r--;

        for (b = 254; b > 0; b--) {
            addToPalette(r, g, b, palette);
        }
        b++;

        // console.log(palette);
    }

    // function buildPaletteRed() {
    //     let r = 255,
    //         g = 0,
    //         b = 0;


    //     for (r = 0; r <= 255; r++) {
    //         addToPalette(r, 0, 0, paletteRed);
    //     }


    //     // console.log(palette);
    // }

    // function buildPaletteGreen() {
    //     let r = 255,
    //         g = 0,
    //         b = 0;


    //     for (g = 0; g <= 255; g++) {
    //         addToPalette(0, g, 0, paletteGreen);
    //     }

    //     // console.log(palette);
    // }

    // function buildPaletteBlue() {
    //     let r = 255,
    //         g = 0,
    //         b = 0;


    //     for (b = 0; b <= 255; b++) {
    //         addToPalette(0, 0, b, paletteBlue);
    //     }

    //     // console.log(palette);
    // }

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