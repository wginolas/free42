var Module = {
    'print': function(text) { console.log('stdout: ' + text); },
    'printErr': function(text) { console.log('stderr: ' + text); }
};

let ctx;
let imageData;
function shellInit(screenPtr) {
    console.log('JS Shell Init');
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    const view = new Uint8ClampedArray(Module.HEAPU8, screenPtr, 131 * 16 * 4);
    imageData = new ImageData(view, 131, 16);
}

function updateScreen() {
    ctx.putImageData(imageData, 0, 0);
}
