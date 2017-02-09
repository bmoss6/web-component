(function() {
    "use strict";
    const names = [];
    const logListeners = [];

    // redefine custom elements define
    const defineElement = window.customElements.define;
    window.customElements.define = function(name, cls) {
        names.push(name);
        defineElement.call(window.customElements, name, cls);
    };

    // define log event to capture input
    const log = console.log;
    console.log = function() {
        const args = Array.from(arguments).join('');
        logListeners.forEach(listener => listener(args));
        log.apply(console, arguments);
    };

    if (window.addEventListener) {
        window.addEventListener('load', ready, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', ready);
    }


    function captureLogs() {
        let data = '';
        const listener = function(output) {
            data += output;
        };
        logListeners.push(listener);
        return function() {
            const index = logListeners.indexOf(listener);
            if (index !== -1) logListeners.splice(index, 1);
            return data;
        }
    }

    function getButton(component) {
        const shadowRoot = document.querySelector('search-input').shadowRoot;
        if (!shadowRoot) throw Error('You must use the shadow DOM on your component.');
        return shadowRoot.querySelector('button');
    }

    function getInputField(component) {
        const shadowRoot = document.querySelector('search-input').shadowRoot;
        if (!shadowRoot) throw Error('You must use the shadow DOM on your component.');
        return shadowRoot.querySelector('input[type="text"]') || shadowRoot.querySelector('input');
    }

    function randomValue() {
        return '' + Math.random();
    }

    function readInputValue(component) {
        const input = getInputField(component);
        return input.value;
    }

    function runTests(component) {
        const score = {
            pass: 0,
            fail: 0
        };
        let value = '';

        console.log('Testing component: ', component);

        test(score, 'Component has a text input field', () => {
            const input = getInputField(component);
            if (!input) throw Error('Input field does not exist');
        });

        test(score, 'Component has a button', () => {
            const btn = getButton(component);
            if (!btn) throw Error('Button does not exist');
        });

        value = randomValue();
        test(score, 'Can set value via property', () => {
            component.value = value;
            if (readInputValue(component) !== value) throw Error('Not set to value: ' + value);
        });

        value = randomValue();
        test(score, 'HTML attribute set to value', () => {
            component.value = value;
            if (component.getAttribute('value') !== value) throw Error('Not set to value: ' + value);
        });

        value = randomValue();
        test(score, 'Can get value from property', () => {
            component.value = value;
            if (component.value !== value) throw Error('Could not get from value');
        });

        value = randomValue();
        test(score, 'Can get value from attribute', () => {
            component.value = value;
            if (component.getAttribute('value') !== value) throw Error('Could not get from value');
        });

        value = randomValue();
        test(score, 'Pressing enter while in input logs search term to console.log', () => {
            const input = getInputField();
            input.value = value;

            const unlisten = captureLogs();
            const kd = new KeyboardEvent('keydown', { key: 13, code: 13, charCode: 13, keyCode: 13, which: 13 });
            input.dispatchEvent(kd);
            const kp = new KeyboardEvent('keypress', { key: 13, code: 13, charCode: 13, keyCode: 13, which: 13 });
            input.dispatchEvent(kp);
            const ku = new KeyboardEvent('keyup', { key: 13, code: 13, charCode: 13, keyCode: 13, which: 13 });
            input.dispatchEvent(ku);

            const out = unlisten();
            if (out.indexOf(value) === -1) throw Error('Did not capture log output');
        });

        value = randomValue();
        test(score, 'Clicking button logs search term to console.log', () => {
            const input = getInputField();
            input.value = value;

            const unlisten = captureLogs();
            const event = new MouseEvent('click', {});
            getButton().dispatchEvent(event);

            const out = unlisten();
            if (out.indexOf(value) === -1) throw Error('Did not capture log output');
        });

        const percentage = score.pass / (score.pass + score.fail);
        console.info('=== FINAL RESULTS ===\nPassed: ' + score.pass + '\nFailed: ' + score.fail +
            '\nPercent: ' + Math.round(100 * percentage) + '%' +
            '\nScore: ' + Math.round(25 * percentage) + ' / 25');
    }

    function ready() {
        if (names.length === 0) {
            console.error('You did not define any custom elements.');
        } else if (names.length > 1) {
            console.warn('The automated test runner only works if you have only defined one custom element. ' +
                'You have defined ' + names.length + ' so you must manually run the tester by calling ' +
                '"window.it410Test(el)" where el is your component to test.');
        } else {
            const component = document.querySelector(names[0]);
            if (!component) {
                console.error('You must have one instance of your component in your index.html file')
            } else {
                runTests(component);
            }
        }

    }

    function test(score, message, fn) {
        try {
            fn();
            score.pass++;
            console.info(message);
        } catch (e) {
            score.fail++;
            console.error(message + '\n', e.stack);
        }
    }

    window.it410Test = runTests;

})();
