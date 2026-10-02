/* 나두 PC 대국 - 장기·샹치 공용 판 그리기 (교차점 9x10, 궁성 X선, 샹치는 강) */
(function () {
  'use strict';
  window.NadooJXUI = function (opt) { // opt: {R, river:bool, labels:[[..8],[..8]], colors:[c0,c1]}
    var C = 40, P = 26, W = P * 2 + C * 8, H = P * 2 + C * 9, sel = -1;
    return function render(el, s, ctx, api) {
      var LB = typeof opt.labels === 'function' ? opt.labels() : opt.labels, FF = typeof opt.font === 'function' ? opt.font() : opt.font;
      var flip = ctx.view === 1, legal = ctx.myTurn ? opt.R.moves(s) : [], dests = {}, i;
      if (sel >= 0) legal.forEach(function (m) { if (m.f === sel) dests[m.t] = 1; });
      function XY(k) { var r = (k / 9) | 0, c = k % 9; if (flip) { r = 9 - r; c = 8 - c; } return [P + c * C, P + r * C]; }
      var lc = '#5a3a10', h = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="board">';
      h += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="12" fill="#e9c27d"/>';
      for (i = 0; i < 10; i++) h += '<line x1="' + P + '" y1="' + (P + i * C) + '" x2="' + (P + 8 * C) + '" y2="' + (P + i * C) + '" stroke="' + lc + '"/>';
      for (i = 0; i < 9; i++) {
        if (opt.river && i > 0 && i < 8) {
          h += '<line x1="' + (P + i * C) + '" y1="' + P + '" x2="' + (P + i * C) + '" y2="' + (P + 4 * C) + '" stroke="' + lc + '"/>';
          h += '<line x1="' + (P + i * C) + '" y1="' + (P + 5 * C) + '" x2="' + (P + i * C) + '" y2="' + (P + 9 * C) + '" stroke="' + lc + '"/>';
        } else h += '<line x1="' + (P + i * C) + '" y1="' + P + '" x2="' + (P + i * C) + '" y2="' + (P + 9 * C) + '" stroke="' + lc + '"/>';
      }
      [0, 7].forEach(function (r0) {
        h += '<line x1="' + (P + 3 * C) + '" y1="' + (P + r0 * C) + '" x2="' + (P + 5 * C) + '" y2="' + (P + (r0 + 2) * C) + '" stroke="' + lc + '"/>';
        h += '<line x1="' + (P + 5 * C) + '" y1="' + (P + r0 * C) + '" x2="' + (P + 3 * C) + '" y2="' + (P + (r0 + 2) * C) + '" stroke="' + lc + '"/>';
      });
      if (opt.river) h += '<text x="' + (W / 2) + '" y="' + (P + 4.5 * C + 7) + '" font-size="20" text-anchor="middle" fill="' + lc + '" letter-spacing="8">楚 河　　漢 界</text>';
      if (s.last) [s.last.f, s.last.t].forEach(function (k) { var xy = XY(k); h += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="' + (C * 0.47) + '" fill="#ffd32a" opacity=".5"/>'; });
      if (s.check) { var kx = XY(opt.R.JX.kingSq(s.b, s.turn)); h += '<circle cx="' + kx[0] + '" cy="' + kx[1] + '" r="' + (C * 0.52) + '" fill="#e74c3c" opacity=".55"/>'; }
      for (i = 0; i < 90; i++) {
        var p = s.b[i]; if (!p) continue;
        var sd = p >> 3, t = p & 7, xy2 = XY(i), col = opt.colors[sd], rr = C * (t === 1 ? 0.47 : (t === 2 || t === 7) ? 0.37 : 0.43);
        h += '<circle class="piece" cx="' + xy2[0] + '" cy="' + xy2[1] + '" r="' + rr + '" fill="#fdf3d8" stroke="' + col + '" stroke-width="' + (i === sel ? 4 : 2.2) + '"/>';
        if (i === sel) h += '<circle cx="' + xy2[0] + '" cy="' + xy2[1] + '" r="' + (rr + 4) + '" fill="none" stroke="#27ae60" stroke-width="3"/>';
        h += '<text x="' + xy2[0] + '" y="' + (xy2[1] + rr * 0.38) + '" font-size="' + (rr * 1.05) + '" text-anchor="middle" fill="' + col + '" font-weight="700"' + (FF ? ' font-family="' + FF + '"' : '') + '>' + LB[sd][t] + '</text>';
      }
      if (ctx.hints) Object.keys(dests).forEach(function (k) { var d = XY(+k); h += '<circle class="hint" cx="' + d[0] + '" cy="' + d[1] + '" r="' + (s.b[+k] ? C * 0.5 : 7) + '" fill="' + (s.b[+k] ? 'none' : '#27ae60') + '" stroke="#27ae60" stroke-width="3" opacity=".85"/>'; });
      h += '</svg>';
      el.innerHTML = h;
      var svg = el.firstChild;
      svg.addEventListener('click', function (ev) {
        if (!ctx.myTurn) return;
        var pt = NadooPlay.pt(svg, ev), c = Math.round((pt.x - P) / C), r = Math.round((pt.y - P) / C);
        if (r < 0 || r > 9 || c < 0 || c > 8) return;
        if (flip) { r = 9 - r; c = 8 - c; }
        var sq = r * 9 + c, pc = s.b[sq];
        if (sel >= 0 && dests[sq]) { var f = sel; sel = -1; api.move({ f: f, t: sq }); return; }
        sel = pc && (pc >> 3) === ctx.human && sq !== sel ? sq : -1;
        api.redraw();
      });
    };
  };
})();
