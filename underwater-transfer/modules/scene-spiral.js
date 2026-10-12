const { seg, eo, eio, lerp, clamp01 } = kit;
kit.scene('spiral', {
  init(kit) {
    this.w = UW.water(kit, 13);
    const mkSvg = () => UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    const back = mkSvg(), pair = mkSvg(), front = mkSvg();
    const halo = kit.h('<div class="glow" style="left:60px;top:-380px;width:1800px;height:1800px"></div>');
    const core = kit.h('<div class="glow" style="left:810px;top:350px;width:300px;height:300px"></div>');
    kit.stage.append(back); kit.stage.append(halo); kit.stage.append(pair); kit.stage.append(core); kit.stage.append(front);
    this.halo = halo.style; this.core = core.style;
    this.pg = UW.mk('g', {}, pair);
    this.red = UW.figure('red'); this.pg.appendChild(this.red.g);
    this.wf = UW.figure('white'); this.pg.appendChild(this.wf.g);
    const rnd = kit.rng(31);
    this.els = [];
    for (let i = 0; i < 38; i++) {
      const fly = i % 3 === 0;
      const make = (svg) => {
        if (fly) { const b = UW.butterfly('fly-s'); svg.appendChild(b.g); return b; }
        return UW.mk('circle', { class: 'bub', r: (5 + rnd() * 12).toFixed(1) }, svg);
      };
      this.els.push({ fly, bk: make(back), fr: make(front), th: rnd() * UW.TAU, r0: 300 + rnd() * 380, y0: rnd() * 1380, v: 140 + rnd() * 140, s: 0.45 + rnd() * 0.45 });
    }
    kit.stage.append(kit.h('<div class="vig spiral-vig"></div>'));
    this.vig = kit.stage.querySelector('.spiral-vig').style;
  },
  render(t) {
    const p = eio(seg(t, 0, 5));
    this.w.render(t + 22, { rise: 1.5, light: lerp(1.1, 1.4, p), speed: 1.6 });
    const w = { x: 0, y: 0, rot: -6, s: 1.15, flow: -Math.PI / 2 - 0.3, amp: 1.3, speed: 0.9, eye: 0, head: -15 };
    const r = { x: 330 * 1.15 / 1.7, y: -30, rot: 10, s: 1.15, flip: true, flow: -Math.PI / 2 + 0.3, amp: 1.3, speed: 0.9, eye: 0, head: 22 };
    let Lw = this.wf.lips(w), Lr = this.red.lips(r);
    r.x += Lw[0] + 3 - Lr[0]; r.y += Lw[1] - 1 - Lr[1];
    w.x += 960 - Lw[0]; w.y += 500 - Lw[1]; r.x += 960 - Lw[0]; r.y += 500 - Lw[1];
    w.flow += lerp(0, 0.35, p); r.flow += lerp(0, 0.35, p);
    r.armF = this.wf.at(w, [-44, -40]);
    this.red.pose(t, r);
    w.armF = this.red.at(r, [36, -110]);
    this.wf.pose(t, w);
    const roll = lerp(0, -22, p);
    this.pg.setAttribute('transform', 'rotate(' + roll.toFixed(2) + ' 960 500) translate(960 500) scale(' + (1 - 0.05 * Math.sin(Math.PI * p)).toFixed(4) + ' 1) translate(-960 -500)');
    const br = 1 + 0.06 * Math.sin(t * 2.2);
    this.halo.opacity = 0.75; this.halo.transform = 'scale(' + (lerp(1.15, 1.4, p) * br).toFixed(3) + ')';
    this.core.transform = 'scale(' + (1 + 0.1 * Math.sin(t * 3)).toFixed(3) + ')';
    for (const e of this.els) {
      const y = ((e.y0 - t * e.v) % 1380 + 1380) % 1380 - 150;
      const th = e.th + t * 1.3 + roll * Math.PI / 180, depth = Math.sin(th);
      const R = e.r0 * (0.55 + 0.45 * y / 1080);
      const x = 960 + Math.cos(th) * R, yy = y + depth * 60, sc = e.s * (0.75 + 0.3 * depth);
      const fo = depth > 0 ? 1 : 0, bo = depth > 0 ? 0 : 0.55;
      if (e.fly) {
        const rot = (Math.cos(th) > 0 ? -25 : 25);
        e.fr.set(x, yy, rot, sc, t * 12 + e.th * 3, fo);
        e.bk.set(x, yy, rot, sc, t * 12 + e.th * 3, bo);
      } else {
        for (const [c, o] of [[e.fr, fo], [e.bk, bo]]) {
          c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', yy.toFixed(1));
          c.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + yy.toFixed(1) + ') scale(' + (sc * 1.6).toFixed(3) + ') translate(' + (-x).toFixed(1) + ' ' + (-yy).toFixed(1) + ')');
          c.style.opacity = o;
        }
      }
    }
    this.vig.transform = 'scale(' + lerp(1, 1.7, p).toFixed(3) + ')';
    this.vig.opacity = lerp(0.6, 0.85, p);
  },
});
