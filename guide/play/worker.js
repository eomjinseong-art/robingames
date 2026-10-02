/* 나두 PC 대국 AI 계산용 Web Worker (화면이 멈추지 않게) */
var loaded = {};
self.onmessage = function (e) {
  var d = e.data;
  try {
    if (!/^[a-z]+$/.test(d.game)) throw new Error('bad game');
    if (!loaded[d.game]) { importScripts('/guide/play/' + d.game + '.rules.js'); loaded[d.game] = 1; }
    var mv = self.NadooRules[d.game].ai(d.state, d.level);
    self.postMessage({ id: d.id, move: mv });
  } catch (err) { self.postMessage({ id: d.id, move: null, err: String(err && err.message || err) }); }
};
