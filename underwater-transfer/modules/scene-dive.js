const { seg, eo, eio, lerp, clamp01 } = kit;
const DA = [2150, -320], DC = [1460, 110], DB = [1090, 520];
function du(t) { return eo(seg(t, 0.3, 3.2)); }
function dP(u) { const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * DA[0] + b * DC[0] + c * DB[0], a * DA[1] + b * DC[1] + c * DB[1]]; }
function dAng(u) { const x = 2 * (1 - u) * (DC[0] - DA[0]) + 2 * u * (DB[0] - DC[0]), y = 2 * (1 - u) * (DC[1] - DA[1]) + 2 * u * (DB[1] - DC[1]); return Math.atan2(y, x); }
function whitePose(t) {
  const k = eo(seg(t, 3.0, 3.9));
  return { x: 820 + 40 * k + 8 * Math.sin(t * 0.7), y: lerp(560, 585, seg(t, 0, 3)) - 15 * k, rot: lerp(-28, -12, k), s: 0.95, flow: -Math.PI / 2 - 0.2, amp: 1.1, eye: 0.02, head: lerp(-12, -4, k) };
}
kit.scene('dive', {
  init(kit) {
    this.w = UW.water(kit, 5);
    const cam = kit.h('<div class="layer"></div>');
    const svg = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    cam.appendChild(svg); kit.stage.append(cam);
    this.cam = cam.style;
    this.trail2 = UW.mk('path', { class: 'silk-r2' }, svg);
    this.trail = UW.mk('path', { class: 'silk-r' }, svg);
    this.red = UW.figure('red'); svg.appendChild(this.red.g);
    this.wf = UW.figure('white'); svg.appendChild(this.wf.g);
    const rnd = kit.rng(11);
    this.fl = [];
    for (let i = 0; i < 16; i++) {
      const b = UW.butterfly('fly-r'); svg.appendChild(b.g);
      this.fl.push({ b, tb: 0.45 + i * 0.16, side: i % 2 ? 1 : -1, spread: (rnd() - 0.5) * 0.9, v: 150 + rnd() * 140, s: 0.45 + rnd() * 0.5 });
    }
    kit.stage.append(kit.h('<div class="vig"></div>'));
  },
  render(t) {
    this.w.render(t + 5, { rise: 1.2, light: 0.5 + 0.15 * seg(t, 0.4, 1.4) });
    this.cam.transform = 'scale(' + lerp(1, 1.05, eio(seg(t, 0, 5))).toFixed(4) + ')';
    const u = du(t), P = dP(u), av = dAng(u);
    const wo = whitePose(t);
    const turn = eio(seg(t, 2.5, 3.5));
    let dr = av * 180 / Math.PI + 90; if (dr > 180) dr -= 360;
    const ro = { x: P[0] + 6 * Math.sin(t * 0.8) * turn, y: P[1] - 10 * turn * Math.sin(t * 0.6), rot: lerp(dr, 8, turn), s: 0.95, flip: true,
      flow: UW.mixA(av + Math.PI, -Math.PI / 2, seg(t, 2.8, 4)), amp: lerp(1.5, 1, turn), speed: 1.3, eye: 1, head: 6 * turn };
    ro.armF = t > 2.5 ? this.wf.at(wo, [-42, -30]) : this.red.at(ro, [40, -320]);
    this.red.pose(t, ro);
    wo.armF = this.wf.at(wo, [80 + 15 * Math.sin(t), -50]);
    this.wf.pose(t, wo);
    const pts = [];
    for (let k = 0; k <= 18; k++) pts.push(dP(du(t - k * 0.04)));
    const mk = (w) => {
      const l = [], r = [];
      for (let k = 0; k < pts.length; k++) {
        const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)];
        let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const d = Math.hypot(nx, ny) || 1; nx /= d; ny /= d;
        const ww = w * (1 - k / 18) / 2;
        l.push((pts[k][0] + nx * ww).toFixed(1) + ' ' + (pts[k][1] + ny * ww).toFixed(1));
        r.push((pts[k][0] - nx * ww).toFixed(1) + ' ' + (pts[k][1] - ny * ww).toFixed(1));
      }
      return 'M' + l.join(' L') + ' L' + r.reverse().join(' L') + 'Z';
    };
    this.trail.setAttribute('d', mk(56));
    this.trail2.setAttribute('d', mk(140));
    const to = clamp01(seg(t, 0.3, 0.5)) * (1 - seg(t, 3.0, 4.0));
    this.trail.style.opacity = to * 0.9;
    this.trail2.style.opacity = to * 0.35;
    for (const f of this.fl) {
      const age = t - f.tb;
      if (age < 0) { f.b.set(0, 0, 0, 0.01, 0, 0); continue; }
      const ub = du(f.tb), p0 = dP(ub), a = dAng(ub) + f.side * Math.PI / 2 + f.spread;
      const go = f.v * (1 - Math.exp(-age * 1.5)) / 1.5;
      const x = p0[0] + Math.cos(a) * go + 12 * Math.sin(age * 4 + f.tb * 7), y = p0[1] + Math.sin(a) * go - age * 40;
      f.b.set(x, y, a * 180 / Math.PI + 90, f.s, t * 13 + f.tb * 5, clamp01(age * 6) * (1 - seg(age, 1.1, 1.9)));
    }
  },
});
