var on = addEventListener,
    $ = function(q) {
        return document.querySelector(q)
    },
    $$ = function(q) {
        return document.querySelectorAll(q)
    },
    $body = document.body,
    $inner = $('.inner'),
    client = (function() {
        var o = {
                browser: 'other',
                browserVersion: 0,
                os: 'other',
                osVersion: 0
            },
            ua = navigator.userAgent,
            a, i;
        a = [
            ['firefox', /Firefox\/([0-9\.]+)/],
            ['edge', /Edge\/([0-9\.]+)/],
            ['safari', /Version\/([0-9\.]+).+Safari/],
            ['chrome', /Chrome\/([0-9\.]+)/],
            ['ie', /Trident\/.+rv:([0-9]+)/]
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.browser = a[i][0];
                o.browserVersion = parseFloat(RegExp.$1);
                break;
            }
        }
        a = [
            ['ios', /([0-9_]+) like Mac OS X/, function(v) {
                return v.replace('_', '.').replace('_', '');
            }],
            ['ios', /CPU like Mac OS X/, function(v) {
                return 0
            }],
            ['android', /Android ([0-9\.]+)/, null],
            ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, function(v) {
                return v.replace('_', '.').replace('_', '');
            }],
            ['windows', /Windows NT ([0-9\.]+)/, null]
        ];
        for (i = 0; i < a.length; i++) {
            if (ua.match(a[i][1])) {
                o.os = a[i][0];
                o.osVersion = parseFloat(a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1);
                break;
            }
        }
        return o;
    }()),
    trigger = function(t) {
        if (client.browser == 'ie') {
            var e = document.createEvent('Event');
            e.initEvent(t, false, true);
            dispatchEvent(e);
        } else dispatchEvent(new Event(t));
    };
on('load', function() {
    setTimeout(function() {
        $body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
        setTimeout(function() {
            $body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
        }, 3000);
    }, 100);
});
var style, sheet, rule;
style = document.createElement('style');
style.appendChild(document.createTextNode(''));
document.head.appendChild(style);
sheet = style.sheet;
if (client.os == 'android') {
    (function() {
        sheet.insertRule('body::after { }', 0);
        rule = sheet.cssRules[0];
        var f = function() {
            rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
        };
        on('load', f);
        on('orientationchange', f);
        on('touchmove', f);
    })();
} else if (client.os == 'ios') {
    (function() {
        sheet.insertRule('body::after { }', 0);
        rule = sheet.cssRules[0];
        rule.style.cssText = '-webkit-transform: scale(1.0)';
    })();
    (function() {
        sheet.insertRule('body.ios-focus-fix::before { }', 0);
        rule = sheet.cssRules[0];
        rule.style.cssText = 'height: calc(100% + 60px)';
        on('focus', function(event) {
            $body.classList.add('ios-focus-fix');
        }, true);
        on('blur', function(event) {
            $body.classList.remove('ios-focus-fix');
        }, true);
    })();
} else if (client.browser == 'ie') {
    (function() {
        var t, f;
        f = function() {
            var mh, h, s, xx, x, i;
            x = $('#wrapper');
            x.style.height = 'auto';
            if (x.scrollHeight <= innerHeight) x.style.height = '100vh';
            xx = $$('.container.full');
            for (i = 0; i < xx.length; i++) {
                x = xx[i];
                s = getComputedStyle(x);
                x.style.minHeight = '';
                x.style.height = '';
                mh = s.minHeight;
                x.style.minHeight = 0;
                x.style.height = '';
                h = s.height;
                if (mh == 0) continue;
                x.style.height = (h > mh ? 'auto' : mh);
            }
        };
        (f)();
        on('resize', function() {
            clearTimeout(t);
            t = setTimeout(f, 250);
        });
        on('load', f);
    })();
}