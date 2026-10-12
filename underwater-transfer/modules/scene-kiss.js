const { seg, eo, eio, lerp, clamp01 } = kit;
kit.scene('kiss', {
  init(kit) {
    this.w = UW.water(kit, 9);
    const cam = kit.h('<div class="layer"></div>');
    const halo = kit.h('<div class="glow" style="width:1800px;height:1800px"></div>');
    const svg = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    const core = kit.h('<div class="glow" style="width:420px;height:420px"></div>');
    cam.appendChild(halo); cam.appendChild(svg); cam.appendChild(core);
    kit.stage.append(cam);
    this.cam = cam.style; this.halo = halo.style; this.core = core.style;
    this.rings = [];
    for (let i = 0; i < 4; i++) this.rings.push(UW.mk('circle', { class: 'bub', fill: 'none' }, svg));
    this.red = UW.figure('red'); svg.appendChild(this.red.g);
    this.wf = UW.figure('white'); svg.appendChild(this.wf.g);
    this.sp = [];
    const rnd = kit.rng(21);
    for (let i = 0; i < 22; i++) this.sp.push({ e: UW.mk('circle', { class: 'fly-s', r: (2 + rnd() * 4).toFixed(1) }, svg), a: rnd() * UW.TAU, v: 60 + rnd() * 120, d: rnd() * 2 });
    kit.stage.append(kit.h('<div class="vig kiss-vig"></div>'));
    this.vig = kit.stage.querySelector('.kiss-vig').style;
  },
  render(t) {
    const lean = eio(seg(t, 0.4, 2.0)), lp = eo(seg(t, 1.9, 3.4)), soft = eio(seg(t, 2.2, 3.4));
    this.w.render(t + 15, { rise: 0.5, light: lerp(0.55, 1.1, lp) });
    this.cam.transformOrigin = '48% 48%';
    this.cam.transform = 'scale(' + lerp(1, 1.08, eio(seg(t, 0, 7))).toFixed(4) + ')';
    const w = { x: 840 + 5 * Math.sin(t * 0.6), y: 870, rot: -6, s: 1.7, flow: -Math.PI / 2 - 0.3, amp: lerp(0.9, 1.3, lp), speed: 0.85,
      eye: lerp(1.1, 0, soft), head: lerp(-6, -15, lean) };
    const r = { x: w.x + 330, y: w.y - 50, rot: lerp(4, 10, lean), s: 1.7, flip: true, flow: -Math.PI / 2 + 0.3, amp: lerp(0.9, 1.3, lp), speed: 0.85,
      eye: lerp(1, 0, eio(seg(t, 2.4, 3.4))), head: lerp(8, 22, lean) };
    const Lw = this.wf.lips(w), Lr = this.red.lips(r);
    r.x += (Lw[0] + 4 - Lr[0]) * lean;
    r.y += (Lw[1] - 2 - Lr[1]) * lean;
    r.armF = this.wf.at(w, [-44, -40]);
    this.red.pose(t, r);
    w.armF = this.red.at(r, [36, -110]);
    this.wf.pose(t, w);
    const cx = Lw[0] + 2, cy = Lw[1] - 4, br = 1 + 0.06 * Math.sin(t * 2.2);
    this.halo.left = (cx - 900) + 'px'; this.halo.top = (cy - 900) + 'px';
    this.halo.opacity = lp * 0.75;
    this.halo.transform = 'scale(' + (lerp(0.25, 1.15, lp) * br).toFixed(3) + ')';
    this.core.left = (cx - 210) + 'px'; this.core.top = (cy - 210) + 'px';
    this.core.opacity = lp;
    this.core.transform = 'scale(' + (lerp(0.1, 1, lp) * (1 + 0.08 * Math.sin(t * 3))).toFixed(3) + ')';
    for (let i = 0; i < 4; i++) {
      const age = t - 2.0 - i * 1.3, c = this.rings[i];
      c.setAttribute('cx', cx.toFixed(1)); c.setAttribute('cy', cy.toFixed(1));
      c.setAttribute('r', Math.max(1, age * 420).toFixed(1));
      c.style.opacity = age < 0 ? 0 : 0.6 * (1 - seg(age, 0, 2.6));
    }
    for (const s of this.sp) {
      const age = Math.max(0, t - 2.0 - s.d);
      const R = s.v * (1 - Math.exp(-age * 0.8)) / 0.8 + 30;
      s.e.setAttribute('cx', (cx + Math.cos(s.a + age * 0.3) * R).toFixed(1));
      s.e.setAttribute('cy', (cy + Math.sin(s.a + age * 0.3) * R - age * 25).toFixed(1));
      s.e.style.opacity = clamp01(age * 3) * (0.6 + 0.4 * Math.sin(t * 2 + s.a * 3));
    }
    this.vig.opacity = lerp(1, 0.55, lp);
  },
});
