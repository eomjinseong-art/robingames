/* 나두게임즈 invisible visit counter (Abacus, same pattern as other sites).
 * ns=robingames: key "visits" = site visit, once per browser per day (read by the daily visitor report);
 * key "home"/"game1".."game8" = page views of that page. Renders nothing, no cookies, failures silent. */
(function () {
  try {
    var h = location.hostname;
    if (!/^https?:$/.test(location.protocol) || h === 'localhost' || /^127\./.test(h) ||
        (/\.vercel\.app$/.test(h) && h !== 'robingames.vercel.app')) return; // skip local & preview builds
    var BASE = 'https://abacus.jasoncameron.dev/hit/robingames/', STORE = 'robingames_abacus_day_v1';
    var m = location.pathname.match(/^\/games\/([A-Za-z0-9_-]+)/);
    var page = m ? m[1] : (/^\/(index\.html)?$/.test(location.pathname) ? 'home' : '');
    var d = new Date(), today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var first = true;
    try { first = localStorage.getItem(STORE) !== today; if (first) localStorage.setItem(STORE, today); } catch (e) {}
    var hit = function (k) { try { fetch(BASE + k, { cache: 'no-store', keepalive: true }).catch(function () {}); } catch (e) {} };
    var go = function () { if (first) hit('visits'); if (page.length >= 3) hit(page); };
    if (document.readyState === 'complete') setTimeout(go, 0); else addEventListener('load', function () { setTimeout(go, 0); });
  } catch (e) {}
})();
