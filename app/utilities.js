///////////////////////////////////////////////////
//   UTILITIES
////////////////////////////////////////////////////

// build full scectrum ROYGBIV palettes [0..1529]
// build single color palettes [0..255]
function buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, paletteMetallic, scene) {
    let r = 255,
        g = 0,
        b = 0;

    for (g = 0; g <= 255; g++) {

        // add to full scectrum ROYGBIV palettes [0..1529] - in all loops below
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);

        // add to single color palettes [0..255] - in this loop only
        addToPalette(g, 0, 0, paletteRed, 1, false, scene);
        addToPalette(0, g, 0, paletteGreen, 1, false, scene);
        addToPalette(0, 0, g, paletteBlue, 1, false, scene);
        addToPalette(g, g, g, paletteGray, 1, false, scene);
    }
    g--;

    for (r = 254; r >= 0; r--) {
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);
    }
    r++;

    for (b = 1; b <= 255; b++) {
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);
    }
    b--;

    for (g = 254; g >= 0; g--) {
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);
    }
    g++;

    for (r = 1; r <= 255; r++) {
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);
    }
    r--;

    for (b = 254; b > 0; b--) {
        addToPalette(r, g, b, palette, 1, false, scene);
        addToGlowPalette(r, g, b, paletteGlow, scene);
        addToMetallicPalette(r, g, b, paletteMetallic, 1, false, scene);
    }
    b++;
}

// add a palette object to a given palette
function addToPalette(r, g, b, palette, saturation = .6, wireframe = false, scene) {

    let mat = new BABYLON.StandardMaterial("material(" + r + "," + g + "," + b + ")", scene);

    r = r * saturation;
    g = g * saturation;
    b = b * saturation;

    var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1, false);

    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r / 255 * .1, g / 255 * .1, b / 255 * .1);
    // mat.specularColor = new BABYLON.Color3(.25, .25, .25);
    mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);
    mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;
    mat.wireframe = wireframe;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function addToMetallicPalette(r, g, b, palette, saturation = .6, wireframe = false, scene) {

    r = r * saturation;
    g = g * saturation;
    b = b * saturation;

    var color = new BABYLON.Color4(r / 255, g / 255, b / 255, 1, false);

    // let mat = new BABYLON.StandardMaterial("mat", scene);
    let mat = new BABYLON.PBRMetallicRoughnessMaterial("mat", scene);

    // mat.diffuseColor = color;
    // mat.specularColor = new BABYLON.Color3(r / 255 * .1, g / 255 * .1, b / 255 * .1);
    // // mat.specularColor = new BABYLON.Color3(.25, .25, .25);
    // mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);
    // mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    // mat.backFaceCulling = false;
    // mat.wireframe = wireframe;

    mat.metallic = 1.0;
    mat.roughness = 1.0;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function addToGlowPalette(r, g, b, palette, scene) {

    let dimmer = .8;

    var color = new BABYLON.Color4(r / 255 * dimmer, g / 255 * dimmer, b / 255 * dimmer, 1, false);

    let mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r / 255 * .1, g / 255 * .1, b / 255 * .1);
    // mat.specularColor = new BABYLON.Color3(.25, .25, .25);
    mat.ambientColor = new BABYLON.Color3(r / 255 * .25, g / 255 * .25, b / 255 * .25);
    mat.emissiveColor = new BABYLON.Color3(r / 255 * .85, g / 255 * .85, b / 255 * .85);
    mat.backFaceCulling = true;

    palette.push({
        r,
        g,
        b,
        color,
        mat
    });
}

function getBiasedGlowMaterial(colorBias, scene) {

    let dimmer = 1.0;
    let r = Math.random() * colorBias.r;
    let g = Math.random() * colorBias.g;
    let b = Math.random() * colorBias.b;
    let color = new BABYLON.Color4(r * dimmer, g * dimmer, b * dimmer, 1, false);

    let mat = new BABYLON.StandardMaterial("matbiasedGlow", scene);
    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
    mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
    mat.emissiveColor = new BABYLON.Color3(r, g, b);
    mat.backFaceCulling = true;
    mat.alpha = .5;

    return mat;
}


// map a value from one range to another
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

// log text to the console overlay DIV
function logToScreen(htmlToRender) {
    document.getElementById("consoleElement").innerHTML = htmlToRender;
}

export {
    // addToGlowPalette,
    // addToPalette,
    buildPalettes,
    getBiasedGlowMaterial,
    map,
    logToScreen
};