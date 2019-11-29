const SKIN = 'Ehrling42sl.layout';
const SKIN_IMG = 'Ehrling42sl.gif';

var Module = {
    'print': function(text) { console.log('stdout: ' + text); },
    'printErr': function(text) { console.log('stderr: ' + text); }
};

function assign(obj, key, val) {
    if (typeof key === 'string') {
        return assignImpl(obj, key.split('.'), 0, val);
    } else {
        return assignImpl(obj, key, 0, val);
    }
}

function assignImpl(obj, keys, keyI, val) {
    if (keys.length <= keyI) {
        return val;
    }

    const key = keys[keyI];
    let newObj;
    if (!obj && typeof obj !== 'object') {
        newObj = {};
    } else {
        newObj = Object.assign({}, obj);
    }

    newObj[key] = assignImpl(newObj[key], keys, keyI+1, val);

    return newObj;
}

class Screen {
    constructor() {
        this.el = redom.el('canvas', {width: 131, height: 16});
        this.ctx = this.el.getContext('2d');
    }

    update(data) {
        if (!data.data) {
            return;
        }
        let imageData = this.ctx.getImageData(0, 0, 131, 16);
        imageData.data.set(data.data);
        this.ctx.putImageData(imageData, 0, 0);
    }
}

class Free42Shell {
    constructor() {
        this.screen = new Screen();
        this.el = this.screen;
        this.data = {
            screen: {}
        };
    }

    setScreenPtr(screenPtr) {
        this.update(assign(this.data, 'screenPtr', screenPtr));
    }

    updateScreen() {
        const screenPtr = this.data.screenPtr;
        const screenData = Module.HEAPU8.slice(screenPtr, screenPtr + 131 * 16 * 4);
        this.update(assign(this.data, 'screen.data', screenData));
    }

    update(data) {
        this.data = data;
        this.screen.update(this.data.screen);
    }

}

const free42Shell = new Free42Shell();

function shellInit(sPtr) {
    console.log('JS Shell Init');
    free42Shell.setScreenPtr(sPtr);
}

function updateScreen() {
    free42Shell.updateScreen();
}

function parseRect(rect) {
    const [x, y, width, height] = rect.split(',');
    return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        width: parseInt(width, 10),
        height: parseInt(height, 10)
    };
}

function parsePoint(rect) {
    const [x, y] = rect.split(',');
    return {
        x: parseInt(x, 10),
        y: parseInt(y, 10)
    };
}

async function loadSkin() {
    const result = {};
    try {
        const response = await fetch(SKIN);
        const text = await response.text();
        console.log(text);

        const lines = text
              .split('\n')
              .map(l => l.trim().replace(/\s*/, ' ').split(' '));
        for (const line of lines) {
            if (line.length == 2 && line[0] == 'Skin:') {
                result.skin = parseRect(line[1]);
            }
        }
    } catch (e) {
        console.log('Could not load skin', e);
    }
}

redom.mount(document.body, free42Shell);
