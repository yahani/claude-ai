const { seg, eio, lerp, clamp01 } = kit;
function sinkPose(t) {
  const p = eio(seg(t, 0, 5));
  return { x: 930 + 22 * Math.sin(t * 0.6), y: lerp(420, 600, p), rot: lerp(-12, -30, p) + 3 * Math.sin(t * 0.9), s: 0.95,
    flow: -Math.PI / 2 - 0.25, amp: 1.2, speed: 1.1, head: lerp(0, -12, p) };
}
kit.scene('sink', {
  init(kit) {
    this.w = UW.water(kit, 3);
    const cam = kit.h('<div class="layer"></div>');
    const svg = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    cam.appendChild(svg);
    kit.stage.append(cam);
    this.cam = cam.style;
    this.cam.transformOrigin = '50% 55%';
    this.fig = UW.figure('white');
    svg.appendChild(this.fig.g);
    this.bub = [];
    for (let i = 0; i < 10; i++) this.bub.push(UW.mk('circle', { class: 'bub', r: 4 + (i % 4) * 3 }, svg));
    kit.stage.append(kit.h('<div class="vig sink-vig"></div>'));
    this.vig = kit.stage.querySelector('.sink-vig').style;
  },
  render(t) {
    const p = eio(seg(t, 0, 5));
    this.w.render(t, { rise: 0.4 + p, light: lerp(1, 0.5, p) });
    this.cam.transform = 'scale(' + lerp(1, 1.07, p).toFixed(4) + ')';
    const o = sinkPose(t);
    const close = 1 - eio(seg(t, 2, 4.3));
    o.eye = clamp01(close * (0.72 + 0.28 * Math.cos(Math.max(0, t - 2) * 9)));
    o.armF = this.fig.at(o, [95 + 20 * Math.sin(t * 0.8), -70 + 15 * Math.sin(t * 0.6)]);
    o.armB = this.fig.at(o, [-60 + 15 * Math.sin(t * 0.7 + 1), -40]);
    this.fig.pose(t, o);
    for (let i = 0; i < this.bub.length; i++) {
      const b = this.bub[i], tb = 0.1 + i * 0.4, age = t - tb;
      if (age < 0) { b.style.opacity = 0; continue; }
      const m = this.fig.mouth(sinkPose(tb));
      b.setAttribute('cx', (m[0] + 10 * Math.sin(age * 5 + i) + age * 12).toFixed(1));
      b.setAttribute('cy', (m[1] - age * 230 - age * age * 40).toFixed(1));
      b.style.opacity = clamp01(age * 8) * (1 - seg(age, 1.4, 2.3));
    }
    this.vig.opacity = lerp(0.6, 1, p);
  },
});
