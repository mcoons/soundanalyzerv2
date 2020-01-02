

    function createRipple() {
        let xOffset = 95 * 4;
        let zOffset = 95 * 4;
        var paths = [];
        var sideO = BABYLON.Mesh.BACKSIDE;

        for (let r = 0; r < 256; r++) {
            let path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

                let x = .8 * r * Math.cos(theta) + xOffset;
                let z = .8 * r * Math.sin(theta) + zOffset;
                let y = -40 * 2;

                path.push(new BABYLON.Vector3(x, y, z));
            }
            paths.push(path);

        }

        ripple = BABYLON.Mesh.CreateRibbon("ripple", paths, false, false, 0, scene, true, sideO);

        ripple.material = paletteGray[140].mat;
        ripple.scaling.x = .25;
        ripple.scaling.z = .25;
        ripple.scaling.y = .5;
    }

    function updateRipple() {

        let xOffset = 95 * 4;
        let zOffset = 95 * 4;
        var paths = [];

        for (let r = 0; r < 255; r++) {
            var path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

                let x = .8 * r * Math.cos(theta) + xOffset;
                let z = .8 * r * Math.sin(theta) + zOffset;
                let y = frDataArrayNormalized[r] / 18 - 40 * 2; // + 20.1;
                ripple.material = paletteGray[Math.round(map(frDataArrayNormalized[(0)], 0, 255, 100, 200))].mat;
                // ripple.material = defaultGridMaterial;

                path.push(new BABYLON.Vector3(x, y, z));
            }

            paths.push(path);
        };

        ripple = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: paths,
            instance: ripple,
            sideOrientation: 1
        });

    }

    function createStar2() {
        var paths = [];
        var sideO = BABYLON.Mesh.BACKSIDE;

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 32;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 32) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = 3 * r * Math.cos(theta) * dataIndex;
                let z = 3 * r * Math.sin(theta) * dataIndex;
                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));
                dataIndex += direction;
            }
            paths.push(path);
        }

        star2 = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);
        star2.parent = starMaster;

        star2.material = paletteGray[140].mat;

    }

    function updateStar2() {
        var paths = [];
        var myColors = [];

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 32;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 32) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = frDataArrayNormalized[dataIndex * r] * r * Math.cos(theta) / 100;
                let z = frDataArrayNormalized[dataIndex * r] * r * Math.sin(theta) / 100;

                myColors.push(paletteGlow[Math.round(map((frDataArrayNormalized[(dataIndex * 2)] * 2) % 255, 0, 255, 0, 1529))].color);
                myColors.push(paletteGlow[Math.round(map((frDataArrayNormalized[(dataIndex * 2)] * 2) % 255, 0, 255, 0, 1529))].color);

                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));

                dataIndex += direction;
            }
            paths.push(path);
        }

        star2 = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: paths,
            instance: star2
        });

    }

    function createStar4() {
        var paths = [];
        var sideO = BABYLON.Mesh.BACKSIDE;

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 128;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = 3 * r * Math.cos(theta) * dataIndex;
                let z = 3 * r * Math.sin(theta) * dataIndex;
                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));
                dataIndex += direction;

            }
            paths.push(path);
        }
        star4 = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);
        star4.parent = starMaster;

        star4.material = paletteGray[140].mat;

    }

    function updateStar4() {
        var paths = [];
        var myColors = [];

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 128;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        let r = 1;

        let path = [];

        // inner points ofstar
        for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let x = frDataArrayNormalized[dataIndex * r] * r * 8.5 * Math.cos(theta) / 100;
            let z = frDataArrayNormalized[dataIndex * r] * r * 8.5 * Math.sin(theta) / 100;
            let y = -.01;

            path.push(new BABYLON.Vector3(x, y, z));
            dataIndex += direction;
        }
        paths.push(path);

        r = 3;

        path = [];

        // outer points of star
        for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let x = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.cos(theta) / 100;
            let z = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.sin(theta) / 100;
            let y = -.01;

            path.push(new BABYLON.Vector3(x, y, z));
            dataIndex += direction;
        }
        paths.push(path);

        star4 = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: paths,
            instance: star4,
            myColors: myColors,
            sideOrientation: 1
        });

    }