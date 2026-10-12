const { seg, eo, eio, lerp, clamp01 } = kit;
function catchPoses(t) {
  const pull = eio(seg(t, 1.0, 2.3)), d = lerp(430, 300, pull);
  const snap = eo(seg(t, 0.7, 0.85));
  const w = { x: 940 - d / 2 + 6 * Math.sin(t * 0.7), y: 990 - 10 * pull, rot: lerp(-10, -5, pull), s: 2, flow: -Math.PI / 2 - 0.3, amp: 0.9, speed: 0.9,
    eye: 0.02 + 1.23 * snap - 0.13 * seg(t, 0.9, 1.6), head: lerp(-4, -10, snap) + 4 * pull };
  const r = { x: 940 + d / 2 + 5 * Math.sin(t * 0.6 + 1), y: 945, rot: lerp(2, 5, pull), s: 2, flip: true, flow: -Math.PI / 2 + 0.25, amp: 0.9, speed: 0.9, eye: 1, head: lerp(6, 10, pull) };
  return { w, r };
}
kit.scene('catch', {
  init(kit) {
    this.w = UW.water(kit, 7);
    const cam = kit.h('<div class="layer"></div>');
    const svg = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    cam.appendChild(svg); kit.stage.append(cam);
    this.cam = cam.style;
    this.cam.transformOrigin = '50% 45%';
    this.fl = [];
    for (let i = 0; i < 3; i++) { const b = UW.butterfly('fly-r'); svg.appendChild(b.g); this.fl.push(b); }
    this.red = UW.figure('red'); svg.appendChild(this.red.g);
    this.wf = UW.figure('white'); svg.appendChild(this.wf.g);
    this.bub = [];
    for (let i = 0; i < 9; i++) this.bub.push(UW.mk('circle', { class: 'bub', r: 6 + (i % 3) * 5 }, svg));
    kit.stage.append(kit.h('<div class="vig"></div>'));
  },
  render(t) {
    this.w.render(t + 10, { rise: 0.5, light: 0.55 });
    this.cam.transform = 'scale(' + lerp(1, 1.05, eio(seg(t, 0, 5))).toFixed(4) + ') translateX(' + lerp(0, -10, seg(t, 0, 5)).toFixed(1) + 'px)';
    const { w, r } = catchPoses(t);
    r.armF = this.wf.at(w, [-44, -40]);
    this.red.pose(t, r);
    w.armF = this.red.at(r, [36, lerp(-60, -110, eio(seg(t, 1.0, 2.3)))]);
    this.wf.pose(t, w);
    const m = this.wf.mouth(catchPoses(0.75).w);
    for (let i = 0; i < this.bub.length; i++) {
      const b = this.bub[i], age = t - 0.75 - i * 0.05;
      if (age < 0) { b.style.opacity = 0; continue; }
      b.setAttribute('cx', (m[0] + 20 + (i % 3 - 1) * 26 + 14 * Math.sin(age * 4 + i)).toFixed(1));
      b.setAttribute('cy', (m[1] - age * 300 - i * 6).toFixed(1));
      b.style.opacity = clamp01(age * 10) * (1 - seg(age, 1.0, 1.8));
    }
    for (let i = 0; i < 3; i++) {
      const x = lerp(1500 + i * 120, 1700 + i * 140, seg(t, 0, 5)), y = 260 + i * 170 - t * 30;
      this.fl[i].set(x, y, 20 + i * 15, 0.5 + i * 0.12, t * 11 + i * 2, 0.55 * (1 - seg(t, 1.5 + i * 0.6, 3 + i * 0.6)));
    }
  },
});
