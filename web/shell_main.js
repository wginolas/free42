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

    newObj[key] = assignImpl(newObj[key], keys, keyI + 1, val);

    return newObj;
}

function get(obj, key, defaultValue) {
    if (typeof key === 'string') {
        key = key.split('.');
    }

    for (const k of key) {
        if (obj == null) {
            return defaultValue;
        }
        obj = obj[k];
    }

    if (obj == null) {
        return defaultValue;
    }
    return obj;
}

class Key {
    constructor() {
        this.el = redom.el('div', {
            style: {
                position: 'absolute',
                'background-image': 'url("Ehrling42sl.gif")'
            }
        });
    }

    update(data) {
        redom.setAttr(this.el, {
            style: {
                left: data.pos.x,
                top: data.pos.y,
                width: data.pos.width,
                height: data.pos.height,
                'background-position': `left -${data.img.x}px top -${data.img.y}px`
            }
        });
    }
}

class Annunciators {
    constructor() {
        this.el = redom.list('div', Key);
    }

    update(data) {
        if (!data.annunciators || !data.skin) {
            return;
        }

        this.el.update(
            data.annunciators
                .map((a, i) => a ? data.skin.annunciators[i + 1] : null)
                .filter(a => a)
        );

    }
}

class Housing {
    constructor() {
        this.el = this.housing = redom.el('div',
            this.key = redom.place(Key),
            this.annunciators = new Annunciators());

        this.housing.onmousedown = evt => {
            const rect = this.housing.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const y = evt.clientY - rect.top;
            const key = this.data.skin.keys.find(k => k.pos.x <= x
                && k.pos.y <= y
                && k.pos.x + k.pos.width >= x
                && k.pos.y + k.pos.height >= y);

            if (!key) {
                return;
            }

            this.data.onKeyDown(key.key);
        };

        this.housing.onmouseup = () => {
            this.data.onKeyUp();
        };
    }

    update(data) {
        this.data = data;
        if (!data || !data.skin) {
            return;
        }
        redom.setAttr(this.housing, {
            style: {
                width: data.skin.skin.width + 'px',
                height: data.skin.skin.height + 'px',
                'background-image': 'url("Ehrling42sl.gif")'
            }
        });

        if (this.data.pressedKey) {
            const key = this.data.skin.keys.find(k => k.key === this.data.pressedKey);
            this.key.update(true, { pos: key.pressedPos, img: key.pressedImg });
        } else {
            this.key.update(false);
        }

        this.annunciators.update(data);
    }
}

class Screen {
    constructor() {
        this.orig = redom.el('canvas', { width: 131, height: 16 });
        this.el = redom.el('canvas');
        this.origCtx = this.orig.getContext('2d');
        this.scaledCtx = this.el.getContext('2d');
        this.data = {};
    }

    update(data) {
        if (!data || !data.data || !data.skin) {
            return;
        }

        const width = data.skin.display.scaleX * 131;
        const height = data.skin.display.scaleY * 16;

        if (this.data.skin !== data.skin) {
            redom.setAttr(this.el, {
                style: {
                    left: data.skin.display.x + 'px',
                    top: data.skin.display.y + 'px',
                    position: 'absolute'
                },
                width: width,
                height: height
            });

            this.scaledCtx.width = width;
            this.scaledCtx.height = height;
            this.scaledCtx.resetTransform();
            this.scaledCtx.scale(data.skin.display.scaleX, data.skin.display.scaleY);
        }

        if (this.data.data !== data.data) {
            let imageData = this.origCtx.getImageData(0, 0, 131, 16);
            imageData.data.set(data.data);
            this.origCtx.putImageData(imageData, 0, 0);
            this.scaledCtx.imageSmoothingEnabled = false;
            this.scaledCtx.drawImage(this.orig, 0, 0);
        }

        this.data = data;
    }
}

class Free42Shell {
    constructor() {
        this.el = redom.el('div', { style: { position: 'relative' } },
            this.housing = new Housing(),
            this.screen = new Screen());
        this.data = {};
        this.data = assign(this.data, 'housing.onKeyDown', key => this.onKeyDown(key));
        this.data = assign(this.data, 'housing.onKeyUp', () => this.onKeyUp());
        this.data = assign(this.data, 'housing.pressedKey', 0);

        this.loadSkin();
    }

    async loadSkin() {
        try {
            const skin = await loadSkin();
            console.log('Skin:', skin);
            let newData = assign(this.data, 'housing.skin', skin);
            newData = assign(newData, 'screen.skin', skin);
            this.update(newData);
            await calcLoaded;
            const off = skin.display.off;
            const on = skin.display.on;
            Module._set_colors(off.r, off.g, off.b, on.r, on.g, on.b);
        } catch (e) {
            console.log('Could not load skin', e);
        }
    }

    onKeyDown(key) {
        this.update(assign(this.data, 'housing.pressedKey', key));
        console.log(keyDown(key));
    }

    onKeyUp() {
        this.update(assign(this.data, 'housing.pressedKey', 0));
        console.log(keyUp());
    }

    setScreenPtr(screenPtr) {
        this.update(assign(this.data, 'screenPtr', screenPtr));
    }

    updateScreen() {
        const screenPtr = this.data.screenPtr;
        const screenData = Module.HEAPU8.slice(screenPtr, screenPtr + 131 * 16 * 4);
        this.update(assign(this.data, 'screen.data', screenData));
    }

    updateAnnunciators(annunciators) {
        const newAnnunciators = get(this.data, 'housing.annunciators', annunciators).slice();
        annunciators.forEach((a, i) => {
            if (a >= 0) {
                newAnnunciators[i] = a;
            }
        });
        this.update(assign(this.data, 'housing.annunciators', newAnnunciators));
    }

    update(data) {
        this.data = data;
        this.screen.update(this.data.screen);
        this.housing.update(this.data.housing);
    }

}
const calcLoaded = new Promise((resolve) => {
    window.onCalcLoaded = resolve;
});

const free42Shell = new Free42Shell();

function shellInit(sPtr) {
    console.log('JS Shell Init');
    free42Shell.setScreenPtr(sPtr);
    onCalcLoaded();
}

function updateScreen() {
    free42Shell.updateScreen();
}

function updateAnnunciators(annunciators) {
    free42Shell.updateAnnunciators(annunciators);
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

function parseColor(color) {
    return {
        r: parseInt(color.substring(0, 2), 16),
        g: parseInt(color.substring(2, 4), 16),
        b: parseInt(color.substring(4, 6), 16)
    };
}

async function loadSkin() {
    const result = { keys: [], annunciators: [] };

    const response = await fetch(SKIN);
    const text = await response.text();

    const lines = text
        .split('\n')
        .map(l => l.trim().replace(/\s+/g, ' ').split(' '));

    for (const line of lines) {
        if (line.length == 2 && line[0] == 'Skin:') {
            result.skin = parseRect(line[1]);
        } else if (line.length == 6 && line[0] == 'Display:') {
            result.display = parsePoint(line[1]);
            result.display.scaleX = parseInt(line[2], 10);
            result.display.scaleY = parseInt(line[3], 10);
            result.display.off = parseColor(line[4]);
            result.display.on = parseColor(line[5]);
        } else if (line.length == 5 && line[0] == 'Key:') {
            const key = {};
            key.key = parseInt(line[1], 10);
            key.pos = parseRect(line[2]);
            key.pressedPos = parseRect(line[3]);
            key.pressedImg = parsePoint(line[4]);
            result.keys.push(key);
        } else if (line.length == 4 && line[0] == 'Annunciator:') {
            const annunciator = {};
            const i = parseInt(line[1], 10);
            annunciator.pos = parseRect(line[2]);
            annunciator.img = parsePoint(line[3]);
            result.annunciators[i] = annunciator;
        }
    }
    return result;
}

function keyDown(key) {
    Module._key_down(key);
    return window.keyDownResult;
}

function keyUp() {
    return {
        callAgain: Module._key_up()
    };
}

redom.mount(document.body, free42Shell);
