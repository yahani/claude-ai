const { seg, eo, eio, lerp, clamp01 } = kit;
kit.scene('fade', {
  init(kit) {
    this.w = UW.water(kit, 17);
    const cam = kit.h('<div class="layer"></div>');
    const halo = kit.h('<div class="glow" style="left:210px;top:-280px;width:1500px;height:1500px"></div>');
    const svg = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    cam.appendChild(halo); cam.appendChild(svg);
    kit.stage.append(cam);
    this.cam = cam.style; this.halo = halo.style;
    this.cam.transformOrigin = '50% 44%';
    this.red = UW.figure('red'); svg.appendChild(this.red.g);
    this.wf = UW.figure('white'); svg.appendChild(this.wf.g);
    kit.stage.append(kit.h('<div class="vig"></div>'));
    const veil = kit.h('<div class="veil"></div>');
    kit.stage.append(veil); this.veil = veil.style;
    const top = UW.mk('svg', { class: 'art', viewBox: '0 0 1920 1080' });
    this.bg = kit.h('<div class="glow" style="width:260px;height:260px"></div>');
    kit.stage.append(this.bg); kit.stage.append(top);
    this.bg = this.bg.style;
    this.fly = UW.butterfly('fly-s'); top.appendChild(this.fly.g);
  },
  render(t) {
    this.w.render(t + 27, { rise: 0.6, light: 1.1 });
    this.cam.transform = 'scale(' + lerp(1, 1.05, eio(seg(t, 0, 3))).toFixed(4) + ')';
    const w = { x: 0, y: 0, rot: -6, s: 1.9, flow: -Math.PI / 2 - 0.2, amp: 0.8, speed: 0.6, eye: 0, head: -15 };
    const r = { x: 330 * 1.9 / 1.7, y: -50, rot: 10, s: 1.9, flip: true, flow: -Math.PI / 2 + 0.2, amp: 0.8, speed: 0.6, eye: 0, head: 22 };
    const Lw = this.wf.lips(w), Lr = this.red.lips(r);
    r.x += Lw[0] + 3 - Lr[0]; r.y += Lw[1] - 1 - Lr[1];
    const dx = 960 - Lw[0], dy = 450 - Lw[1];
    w.x += dx; w.y += dy; r.x += dx; r.y += dy;
    r.armF = this.wf.at(w, [-44, -40]);
    this.red.pose(t, r);
    const up = eio(seg(t, 0, 1.0));
    const a = this.red.at(r, [36, -110]), b = this.red.at(r, [12, -142]), c = this.red.at(r, [-22, -146]);
    w.armF = [lerp(a[0], b[0], up), lerp(a[1], b[1], up)];
    w.armB = up > 0.02 ? [lerp(this.wf.at(w, [-30, 10])[0], c[0], up), lerp(this.wf.at(w, [-30, 10])[1], c[1], up)] : null;
    this.wf.pose(t, w);
    this.halo.opacity = 0.7 * (1 - seg(t, 1.0, 1.8));
    this.halo.transform = 'scale(' + (1 + 0.05 * Math.sin(t * 2.2)).toFixed(3) + ')';
    this.veil.opacity = eio(seg(t, 1.2, 1.9));
    const q = eo(seg(t, 1.5, 3.0)), fx = lerp(-120, 1420, q), fy = 600 - 120 * q + 45 * Math.sin(t * 3.2);
    this.fly.set(fx, fy, 70 + 10 * Math.sin(t * 3), 1.4, t * 10, clamp01(seg(t, 1.5, 1.8)));
    this.bg.left = (fx - 130).toFixed(1) + 'px'; this.bg.top = (fy - 130).toFixed(1) + 'px';
    this.bg.opacity = 0.55 * clamp01(seg(t, 1.5, 1.8));
  },
});
