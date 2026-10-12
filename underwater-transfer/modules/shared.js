window.UW = (function () {
  var NS = 'http://www.w3.org/2000/svg', TAU = Math.PI * 2, PI = Math.PI;
  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function f(n) { return (+n).toFixed(1); }
  function mixA(a, b, k) { var d = ((b - a) % TAU + TAU * 1.5) % TAU - PI; return a + d * k; }
  // a tapered silk ribbon along a waving centerline
  function flow(p, x, y, a, L, w0, w1, A, waves, ph) {
    var N = 16, ca = Math.cos(a), sa = Math.sin(a), l = [], r = [];
    for (var i = 0; i <= N; i++) {
      var s = i / N, off = A * s * Math.sin(s * waves * TAU - ph);
      var cx = x + ca * L * s - sa * off, cy = y + sa * L * s + ca * off, w = (w0 + (w1 - w0) * s) / 2;
      l.push(f(cx - sa * w) + ' ' + f(cy + ca * w)); r.push(f(cx + sa * w) + ' ' + f(cy - ca * w));
    }
    p.setAttribute('d', 'M' + l.join(' L') + ' L' + r.reverse().join(' L') + 'Z');
  }
  function rotAbout(P, h) {
    var r = h * PI / 180, x = P[0], y = P[1] + 170;
    return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r) - 170];
  }
  function toWorld(o, P) {
    var s = o.s || 1, fl = o.flip ? -1 : 1, r = (o.rot || 0) * PI / 180, x = P[0] * s * fl, y = P[1] * s;
    return [o.x + x * Math.cos(r) - y * Math.sin(r), o.y + x * Math.sin(r) + y * Math.cos(r)];
  }
  function toLocal(o, P) {
    var s = o.s || 1, fl = o.flip ? -1 : 1, r = -(o.rot || 0) * PI / 180, dx = P[0] - o.x, dy = P[1] - o.y;
    return [(dx * Math.cos(r) - dy * Math.sin(r)) / (s * fl), (dx * Math.sin(r) + dy * Math.cos(r)) / s];
  }
  // an original figure in profile, facing +x, waist at 0,0
  function figure(kind) {
    var red = kind === 'red', c = red ? 'r' : 'w', g = mk('g', {}), R = [];
    function rib(cls, x, y, rest, k, L, w0, w1, A, waves, sp, ph, extra) {
      var r = { p: mk('path', { class: cls }, g), x: x, y: y, rest: rest, k: k, L: L, w0: w0, w1: w1, A: A, waves: waves, sp: sp, ph: ph };
      for (var q in extra) r[q] = extra[q];
      R.push(r);
    }
    var n = red ? 6 : 4;
    for (var i = 0; i < n; i++) rib('hair', -30 + i * 4, -262 + i * 10, PI / 2 + 0.55, 0.85, (red ? 420 : 280) - i * 20, 30, 5, 26 + i * 5, 1.1, 1.5 + i * 0.12, i * 0.9, { hd: 1 });
    rib('silk-' + c + '2', 0, 0, PI / 2 + 0.35, 0.75, 210, 34, 70, 20, 0.9, 1.3, 1.1, { el: 'B' });
    var armB = mk('path', { class: 'arm-' + c }, g), handB = mk('circle', { class: 'skin', r: 13 }, g);
    rib('silk-' + c + '2', -22, -4, PI / 2 + 0.3, 0.5, 330, 70, 130, 26, 0.8, 1.1, 0.4);
    mk('path', { class: 'silk-' + c, d: 'M-38 -140 C-46 -90 -36 -40 -30 4 L30 4 C36 -40 44 -90 38 -140 Z' }, g);
    rib('silk-' + c, 2, -2, PI / 2 + 0.08, 0.45, 340, 66, 120, 24, 0.85, 1.2, 2.0);
    rib('silk-' + c, 24, -4, PI / 2 - 0.18, 0.4, 300, 50, 100, 22, 0.9, 1.25, 3.1);
    mk('path', { class: 'collar-' + c, d: 'M-12 -142 L6 -98 L22 -142' }, g);
    rib('sash-' + c, 4, -16, PI / 2 + 0.7, 0.9, 420, 14, 3, 40, 1.4, 1.7, 0.7);
    mk('rect', { class: 'skin', x: -12, y: -180, width: 24, height: 48 }, g);
    var hg = mk('g', {}, g);
    mk('path', { class: 'skin', d: 'M-44 -228 C-48 -286 6 -304 34 -270 C40 -262 42 -252 42 -244 L54 -224 L43 -219 C45 -212 44 -206 41 -201 C42 -196 40 -190 36 -186 C30 -172 14 -164 -2 -164 C-28 -166 -42 -190 -44 -228 Z' }, hg);
    mk('path', { class: 'hair', d: red ? 'M-52 -224 C-60 -300 14 -318 44 -264 C30 -274 14 -272 4 -262 C-8 -246 -12 -222 -28 -192 C-46 -196 -52 -210 -52 -224 Z' : 'M-50 -226 C-56 -296 12 -314 40 -268 C22 -280 4 -276 -6 -262 C-14 -244 -16 -220 -30 -196 C-44 -200 -50 -212 -50 -226 Z' }, hg);
    var eye = mk('ellipse', { class: 'eye', cx: 25, cy: -236, rx: 7, ry: 4.5 }, hg);
    var lid = mk('path', { class: 'feat', d: 'M17 -235 Q25 -229 33 -235' }, hg);
    mk('path', { class: 'feat', d: red ? 'M12 -254 L35 -246' : 'M14 -250 Q24 -256 34 -250' }, hg);
    mk('path', { class: 'feat', d: 'M42 -199 L34 -198' }, hg);
    var armF = mk('path', { class: 'arm-' + c }, g), handF = mk('circle', { class: 'skin', r: 13 }, g);
    rib('silk-' + c, 0, 0, PI / 2 + 0.2, 0.75, 210, 34, 70, 20, 0.95, 1.35, 2.6, { el: 'F' });
    function arm(p, hd, sx, sy, W, t, ph, o) {
      var T = W ? toLocal(o, W) : [sx + 14 + 10 * Math.sin(t * 1.1 + ph), sy + 140 + 6 * Math.sin(t * 0.9 + ph)];
      var dx = T[0] - sx, dy = T[1] - sy, d = Math.hypot(dx, dy) || 1;
      if (d > 200) { T = [sx + dx / d * 200, sy + dy / d * 200]; dx = T[0] - sx; dy = T[1] - sy; d = 200; }
      var b = Math.max(0, 210 - d) * 0.35, ex = (sx + T[0]) / 2 - dy / d * b, ey = (sy + T[1]) / 2 + dx / d * b;
      p.setAttribute('d', 'M' + f(sx) + ' ' + f(sy) + ' Q' + f(ex) + ' ' + f(ey) + ' ' + f(T[0]) + ' ' + f(T[1]));
      hd.setAttribute('cx', f(T[0])); hd.setAttribute('cy', f(T[1]));
      return [ex * 0.5 + (sx + T[0]) * 0.25, ey * 0.5 + (sy + T[1]) * 0.25];
    }
    function pose(t, o) {
      var s = o.s || 1, fl = o.flip ? -1 : 1, rot = o.rot || 0, h = o.head || 0;
      g.setAttribute('transform', 'translate(' + f(o.x) + ' ' + f(o.y) + ') rotate(' + f(rot) + ') scale(' + (s * fl).toFixed(3) + ' ' + s.toFixed(3) + ')');
      hg.setAttribute('transform', 'rotate(' + f(h) + ' 0 -170)');
      var la = (o.flow == null ? -PI / 2 : o.flow) - rot * PI / 180;
      if (fl < 0) la = PI - la;
      var amp = o.amp == null ? 1 : o.amp, sp = o.speed || 1;
      var eF = arm(armF, handF, 20, -122, o.armF, t, 0, o), eB = arm(armB, handB, -16, -124, o.armB, t, 1.7, o);
      for (var i = 0; i < R.length; i++) {
        var r = R[i], x = r.x, y = r.y, rest = r.rest;
        if (r.hd) { var q = rotAbout([x, y], h); x = q[0]; y = q[1]; rest += h * PI / 180; }
        if (r.el) { var E = r.el === 'F' ? eF : eB; x = E[0]; y = E[1]; }
        flow(r.p, x, y, mixA(rest, la, r.k), r.L, r.w0, r.w1, r.A * amp, r.waves, t * r.sp * sp + r.ph);
      }
      var e = o.eye == null ? 1 : Math.max(0, o.eye);
      eye.setAttribute('ry', f(0.4 + 4.6 * Math.min(e, 1.3)));
      eye.style.opacity = Math.min(1, e * 3);
      lid.style.opacity = 1 - Math.min(1, e * 2.5);
    }
    return {
      g: g, pose: pose,
      lips: function (o) { return toWorld(o, rotAbout([42, -199], o.head || 0)); },
      mouth: function (o) { return toWorld(o, rotAbout([46, -204], o.head || 0)); },
      at: function (o, P) { return toWorld(o, P); }
    };
  }
  function butterfly(cls) {
    var g = mk('g', {}), wl = mk('g', {}, g), wr = mk('g', {}, g);
    var wing = 'M0 0 C-10 -40 -46 -54 -52 -26 C-54 -6 -30 2 0 0 C-26 6 -42 26 -26 38 C-12 44 -4 20 0 0 Z';
    mk('path', { d: wing, class: cls }, wl);
    mk('path', { d: wing, class: cls, transform: 'scale(-1 1)' }, wr);
    mk('ellipse', { cx: 0, cy: 4, rx: 3.5, ry: 17, class: cls }, g);
    return {
      g: g,
      set: function (x, y, rot, s, flap, op) {
        g.setAttribute('transform', 'translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot) + ') scale(' + s.toFixed(3) + ')');
        var k = (0.18 + 0.82 * Math.abs(Math.cos(flap))).toFixed(3);
        wl.setAttribute('transform', 'scale(' + k + ' 1)'); wr.setAttribute('transform', 'scale(' + k + ' 1)');
        g.style.opacity = op == null ? 1 : op;
      }
    };
  }
  function water(kit, seed) {
    var root = kit.h('<div class="ground"></div>'), shafts = [];
    for (var i = 0; i < 4; i++) { var d = kit.h('<div class="shaft"></div>'); d.style.left = (220 + i * 440) + 'px'; root.appendChild(d); shafts.push(d.style); }
    var svg = mk('svg', { class: 'art', viewBox: '0 0 1920 1080' }); root.appendChild(svg);
    var cur = [], motes = [], rnd = kit.rng(seed || 3);
    for (i = 0; i < 6; i++) cur.push({ p: mk('path', { class: 'current' }, svg), y: 100 + i * 170, ph: i * 1.7 });
    for (i = 0; i < 46; i++) motes.push({ e: mk('circle', { class: 'mote', r: f(1.5 + rnd() * 3.5) }, svg), x: rnd() * 1920, y: rnd() * 1180, v: 12 + rnd() * 30, ph: rnd() * TAU });
    kit.stage.append(root);
    return {
      root: root, svg: svg,
      render: function (t, q) {
        q = q || {};
        var sp = q.speed == null ? 1 : q.speed, rise = q.rise || 0, li = q.light == null ? 1 : q.light;
        shafts.forEach(function (s, i) { s.transform = 'rotate(' + f(14 + 4 * Math.sin(t * 0.4 + i * 1.3)) + 'deg)'; s.opacity = li * (0.55 + 0.3 * Math.sin(t * 0.7 + i * 2)); });
        cur.forEach(function (c, i) { flow(c.p, -400 + ((t * 50 * sp + i * 130) % 260), c.y + 30 * Math.sin(t * 0.3 + i), 0.06 * Math.sin(i * 2.1), 2700, 60, 10, 70, 1.3, t * 0.8 * sp + c.ph); });
        motes.forEach(function (m) {
          var y = ((m.y - t * m.v * (1 + rise)) % 1180 + 1180) % 1180 - 50;
          m.e.setAttribute('cx', f(m.x + 14 * Math.sin(t * 0.8 + m.ph))); m.e.setAttribute('cy', f(y));
        });
      }
    };
  }
  return { mk: mk, f: f, flow: flow, mixA: mixA, toWorld: toWorld, toLocal: toLocal, figure: figure, butterfly: butterfly, water: water, TAU: TAU };
})();
