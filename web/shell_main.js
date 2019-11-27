const SKIN = 'Ehrling42sl.layout';
const SKIN_IMG = 'Ehrling42sl.gif';

var Module = {
    'print': function(text) { console.log('stdout: ' + text); },
    'printErr': function(text) { console.log('stderr: ' + text); }
};

let ctx;
let screenPtr;
function shellInit(sPtr) {
    console.log('JS Shell Init');
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    screenPtr = sPtr;
}

function updateScreen() {
    let data = Module.HEAPU8.slice(screenPtr, screenPtr + 131 * 16 * 4);
    let imageData = ctx.getImageData(0, 0, 131, 16);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
}

async function loadSkin() {
    try {
        const response = await fetch(SKIN);
        const text = await response.text();
        console.log(text);
    } catch (e) {
        console.log('Could not load skin', e);
    }
}

loadSkin();
