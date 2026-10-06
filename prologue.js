// =====================================================================
//  ECHO — PROLOGUE: "THE LAST THING I SAW"
//  A React-driven cinematic that plays before Level 01.
//  Visuals: a small 3D wireframe engine (perspective camera, extruded sets,
//  bloom, grain, glitch) drawn on canvas in the game's echo-line style.
//  Text, chapter cards and controls: React.
//  Audio: reuses the game's synthesized audio engine (tone / noise / SFX).
// =====================================================================
(function () {
  'use strict';
  if (!window.React || !window.ReactDOM) return; // offline without the CDN: the game just skips the prologue
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;

  // ---------- palette & math ----------
  const COL = { cyan: [80, 225, 255], red: [255, 48, 72], amber: [255, 176, 64], white: [226, 242, 255], steel: [120, 165, 210] };
  const TAU = Math.PI * 2, PI = Math.PI;
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const lite = c => c.map(v => v + (255 - v) * .55);
  const mixC = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeIO = t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const rnd = (i, k = 1) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const vl = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };

  // ---------- audio (game engine) ----------
  const MOTIF = [440, 523.25, 659.25, 587.33]; // Lena's four notes
  const A = {
    ok() { return typeof AU !== 'undefined' && AU.ctx && !AU.muted; },
    note(f, vol = .16, delay = 0, dur = 2.4) {
      if (!this.ok()) return;
      tone({ vol, dur, f0: f, type: 'triangle', attack: .006, echo: .55, delay });
      tone({ vol: vol * .45, dur: dur * .7, f0: f * 2, type: 'sine', attack: .004, echo: .4, delay });
    },
    motif(vol = .16, gap = .55, delay = 0, n = 4, mul_ = 1) { MOTIF.slice(0, n).forEach((f, i) => this.note(f * mul_, vol, delay + i * gap)); },
    hum(vol = .07, gap = .7, delay = 0, n = 4) {
      if (!this.ok()) return;
      MOTIF.slice(0, n).forEach((f, i) => tone({ vol, dur: gap * 1.05, f0: f * .5, type: 'sine', attack: .12, echo: .7, delay: delay + i * gap }));
    },
    heart(v = .3) { if (this.ok()) SFX.heart(v); },
    kick() { if (!this.ok()) return; noise({ vol: .8, dur: .35, f0: 900, f1: 80, echo: .6 }); tone({ vol: .6, dur: .3, f0: 90, f1: 40, echo: .3 }); SFX.door(0, 0); },
    step(v = .25) { if (this.ok()) noise({ vol: v, dur: .06, f0: 1100, type: 'bandpass', q: 2, echo: .2 }); },
    clink() { if (!this.ok()) return; [3200, 2600, 3000].forEach((f, i) => tone({ vol: .08, dur: .12, f0: f, type: 'triangle', delay: i * .13, echo: .2 })); },
    bang() { if (!this.ok()) return; noise({ vol: 1, dur: 1.2, f0: 5000, f1: 300, echo: .9 }); tone({ vol: .7, dur: .6, f0: 120, f1: 30 }); },
    ring(dur = 7) { if (this.ok()) tone({ vol: .06, dur, f0: 4100, f1: 3900, type: 'sine', attack: .02, echo: 0 }); },
    muffled(v = .5) { if (this.ok()) { noise({ vol: v, dur: .4, f0: 380, f1: 90, echo: .5 }); tone({ vol: v * .6, dur: .25, f0: 70, f1: 35 }); } },
    tap() { if (!this.ok()) return; noise({ vol: .5, dur: .03, f0: 3800, type: 'highpass', echo: .9 }); tone({ vol: .12, dur: 1.4, f0: 1500, f1: 1460, echo: .95, attack: .003 }); },
    slash() { if (this.ok()) { SFX.swish(); SFX.kill(0, 0); } },
    radio() { if (this.ok()) noise({ vol: .12, dur: .25, f0: 2400, type: 'bandpass', q: 3, echo: 0 }); },
    thunder(v = .7) { if (this.ok()) { noise({ vol: v, dur: 3, f0: 260, f1: 40, echo: .9, attack: .08 }); tone({ vol: v * .6, dur: 2.6, f0: 48, f1: 28, echo: .8, attack: .1 }); } },
    boom() { if (this.ok()) { noise({ vol: .5, dur: 2.4, f0: 300, f1: 40, echo: .9 }); tone({ vol: .5, dur: 2.4, f0: 55, f1: 30, echo: .8 }); } },
    rain(vol = .07) {
      if (!this.ok()) return () => {};
      const X = AU.ctx, src = X.createBufferSource(); src.buffer = AU.noise; src.loop = true;
      const f = X.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = .5;
      const g = X.createGain(); g.gain.setValueAtTime(.0001, X.currentTime); g.gain.exponentialRampToValueAtTime(vol, X.currentTime + 1.5);
      src.connect(f); f.connect(g); g.connect(AU.master); src.start();
      return () => { const t = X.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(g.gain.value, .0002), t); g.gain.exponentialRampToValueAtTime(.0001, t + 1.2); src.stop(t + 1.3); };
    },
  };

  // =====================================================================
  //  3D WIREFRAME ENGINE
  // =====================================================================
  function camera(pos, tgt, fov, W, H, roll = 0) {
    const f = norm(sub(tgt, pos));
    let r = norm(cross(f, [0, 0, 1])), u = cross(r, f);
    if (roll) { const c = Math.cos(roll), s = Math.sin(roll); const r2 = add(mul(r, c), mul(u, s)), u2 = sub(mul(u, c), mul(r, s)); r = r2; u = u2; }
    return { pos, f, r, u, foc: (H / 2) / Math.tan(fov / 2), W, H };
  }
  function P(c, p) {
    const d = sub(p, c.pos), z = dot(d, c.f);
    if (z < 10) return null;
    return [c.W / 2 + c.foc * dot(d, c.r) / z, c.H / 2 - c.foc * dot(d, c.u) / z, z];
  }
  const fogOf = z => clamp(1.35 - z / 4200, .12, 1);
  function L3(g, c, a, b, col, al, w = 1.3) {
    if (al < .01) return;
    const p = P(c, a), q = P(c, b); if (!p || !q) return;
    const z = Math.min(p[2], q[2]);
    g.strokeStyle = rgba(col, Math.min(1, al * fogOf(z)));
    g.lineWidth = clamp(w * c.foc / z * .85, .5, 4);
    g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
  }
  function F3(g, c, pts, col, al) {
    if (al < .005) return;
    const ps = pts.map(p => P(c, p)); if (ps.some(p => !p)) return;
    g.beginPath(); ps.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
    g.fillStyle = rgba(col, al * fogOf(ps[0][2])); g.fill();
  }
  function ring3(g, c, x, y, z, r, col, al, w = 1.6, a0 = 0, a1 = TAU) {
    if (al < .01 || r <= 0) return;
    g.beginPath(); let pen = false;
    const n = Math.max(12, Math.round(72 * (a1 - a0) / TAU));
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n, p = P(c, [x + Math.cos(a) * r, y + Math.sin(a) * r, z]);
      if (!p) { pen = false; continue; }
      pen ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); pen = true;
    }
    g.strokeStyle = rgba(col, Math.min(1, al)); g.lineWidth = w; g.stroke();
  }
  function dot3(g, c, p, col, al, size) {
    const q = P(c, p); if (!q || al < .01) return;
    const r = clamp(size * c.foc / q[2], .35, 7);
    g.fillStyle = rgba(col, Math.min(1, al * fogOf(q[2]))); g.beginPath(); g.arc(q[0], q[1], r, 0, TAU); g.fill();
  }
  // map a local 2D frame lying on a horizontal plane (height z, rotated a) onto the screen
  function onPlane(g, c, x, y, z, a, dpr) {
    const o = P(c, [x, y, z]), e1 = P(c, [x + Math.cos(a), y + Math.sin(a), z]), e2 = P(c, [x - Math.sin(a), y + Math.cos(a), z]);
    if (!o || !e1 || !e2) return false;
    g.setTransform(dpr * (e1[0] - o[0]), dpr * (e1[1] - o[1]), dpr * (e2[0] - o[0]), dpr * (e2[1] - o[1]), dpr * o[0], dpr * o[1]);
    return true;
  }
  function pool(g, c, api, x, y, col, al, R) {
    if (al < .01) return;
    if (onPlane(g, c, x, y, 1, 0, api.dpr)) {
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, R); gr.addColorStop(0, rgba(col, al)); gr.addColorStop(1, rgba(col, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    }
    g.setTransform(api.dpr, 0, 0, api.dpr, 0, 0);
  }

  // set pieces
  const wall = (x1, y1, x2, y2, hh = 110) => ({ k: 'wall', a: [x1, y1], b: [x2, y2], h: hh, m: [(x1 + x2) / 2, (y1 + y2) / 2] });
  const box = (x, y, w, d, hh, z0 = 0) => ({ k: 'box', x, y, w, d, h: hh, z0, m: [x + w / 2, y + d / 2] });
  const line = (p, q, w = 1.1) => ({ k: 'line', p, q, w, m: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] });
  function drawSet(g, c, set, col, alphaAt) {
    for (const it of set) {
      const a = Math.min(1, alphaAt(it.m)); if (a < .012) continue;
      if (it.k === 'wall') {
        const [x1, y1] = it.a, [x2, y2] = it.b, hh = it.h;
        F3(g, c, [[x1, y1, 0], [x2, y2, 0], [x2, y2, hh], [x1, y1, hh]], col, a * .06);
        L3(g, c, [x1, y1, 0], [x2, y2, 0], col, a * .45);
        L3(g, c, [x1, y1, hh], [x2, y2, hh], col, a, 1.7);
        L3(g, c, [x1, y1, 0], [x1, y1, hh], col, a * .65); L3(g, c, [x2, y2, 0], [x2, y2, hh], col, a * .65);
      } else if (it.k === 'box') {
        const { x, y, w, d, z0 } = it, z1 = z0 + it.h, q = [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];
        F3(g, c, q.map(p => [p[0], p[1], z1]), col, a * .05);
        for (let i = 0; i < 4; i++) {
          const p0 = q[i], p1 = q[(i + 1) % 4];
          L3(g, c, [p0[0], p0[1], z0], [p1[0], p1[1], z0], col, a * .45);
          L3(g, c, [p0[0], p0[1], z1], [p1[0], p1[1], z1], col, a, 1.4);
          L3(g, c, [p0[0], p0[1], z0], [p0[0], p0[1], z1], col, a * .65);
        }
      } else L3(g, c, it.p, it.q, col, a, it.w);
    }
  }
  function grid(g, c, x0, y0, x1, y1, step, col, alphaAt) {
    for (let x = x0; x <= x1; x += step) for (let y = y0; y <= y1; y += step) {
      const a = alphaAt([x, y]) * .45; if (a < .02) continue;
      L3(g, c, [x - 6, y, 0], [x + 6, y, 0], col, a, .8); L3(g, c, [x, y - 6, 0], [x, y + 6, 0], col, a, .8);
    }
  }
  // brightness an echo leaves on a point: flares as the wavefront passes, then fades
  function echoA(x, y, evs, t) {
    let a = 0;
    for (const e of evs) {
      if (t < e.t) continue;
      const d = Math.hypot(x - e.x, y - e.y); if (d > e.R) continue;
      const age = t - (e.t + d / e.v); if (age < 0) continue;
      a = Math.max(a, (e.s || 1) * Math.exp(-age * (e.k || 1.2)) * (1 - d / e.R * .55));
    }
    return a;
  }
  function echoRings(g, c, evs, t, col) {
    for (const e of evs) {
      const r = (t - e.t) * e.v; if (r <= 0 || r > e.R) continue;
      const k = 1 - r / e.R, cc = e.c || col;
      ring3(g, c, e.x, e.y, 2, r, cc, k * .8 * (e.s || 1), 2);
      ring3(g, c, e.x, e.y, 2, Math.max(1, r - 18), cc, k * .3 * (e.s || 1), 1);
    }
  }

  // ---------- characters: rigged 3D bodies, rim-lit like the key art ----------
  // A small skeleton (hips, spine, shoulders, elbows, knees, feet) posed procedurally,
  // then drawn as solid black capsules with glowing rim edges, depth-sorted per frame.
  const B = { hip: 42, chest: 63, neck: 70, hr: 6.4, sh: 9.5, hw: 4.8, ua: 14.5, fa: 13.5, th: 20.5, sn: 20.5 };
  const rotZ = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  function ik(S, Hn, l1, l2, pole) {
    let d = sub(Hn, S), L = Math.hypot(d[0], d[1], d[2]) || .001;
    const max = l1 + l2 - .05;
    if (L > max) { Hn = add(S, mul(d, max / L)); d = sub(Hn, S); L = max; }
    const dir = mul(d, 1 / L), a = (l1 * l1 - l2 * l2 + L * L) / (2 * L), hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const pv = norm(sub(pole, mul(dir, dot(pole, dir))));
    return [add(add(S, mul(dir, a)), mul(pv, hh)), Hn];
  }
  // local frame: +x forward, +y left, +z up; feet on z = 0
  function rig(o) {
    const t = o.t || 0, st = o.stride || 0, ph = o.walk || 0, sit = o.sit || 0, hd = o.headDown || 0;
    const bob = Math.abs(Math.sin(ph)) * 1.8 * st;
    const lean = (o.lean || 0) + st * .25;
    const cr = o.crouch || 0, lg = o.lunge || 0, sk = o.stance || 0, sd = o.side || 0; // fight stance: crouch, a lunge, planted feet, a side lean
    const sway = Math.sin(ph) * 1.4 * Math.min(1, st) * (1 - (o.stance || 0)); // weight rides over the foot that's down
    const pelvis = [-2 * sit + lean * 1.5 + lg * 3, sd * 2.5 + sway, lerp(B.hip, 25, sit) - bob * .95 + 1.2 * st - cr * 13];
    const twist = Math.sin(ph) * .16 * st + (o.twist || 0);
    const chest = add(pelvis, [lean * 6 + sit * 3.5, sd * 5 - sway * .6, B.chest - B.hip + Math.sin(t * 2.1) * .45]); // the chest counters the hips
    const neck = add(chest, [1 + hd * 2, 0, 7 - hd]);
    const head = add(neck, [1.6 + hd * 3.5, 0, 6.4 - hd * 2.2]);
    const J = { pelvis, chest, neck, head, twist };
    for (const s of [1, -1]) {
      const k = s > 0 ? 'L' : 'R', off = s > 0 ? 0 : PI;
      const hip = add(pelvis, rotZ([0, s * B.hw, -2.5], -twist * .5));
      const sw = Math.sin(ph + off) * .5 * st;
      const bend = Math.max(0, Math.cos(ph + off)) * st * 1.0 + .06;
      let knee = add(hip, [Math.sin(sw) * B.th, s * .8, -Math.cos(sw) * B.th]);
      let foot = add(knee, [Math.sin(sw - bend) * B.sn, s * .4, -Math.cos(sw - bend) * B.sn]);
      if (sk > .001) { // feet planted wide, the left one forward when he lunges; knees take the crouch
        const F = [(s > 0 ? 1 : -1) * (3 + 13 * lg) + lean * 2, s * (B.hw + 3.5 + 2.5 * cr), 0];
        const [kS, fS] = ik(hip, F, B.th, B.sn, [1, s * .35, 0]);
        knee = vl(knee, kS, sk); foot = vl(foot, fS, sk);
      }
      if (sit > .001) {
        const kS = add(hip, [B.th - 1, s * 2, 1]), fS = [kS[0] + 3, kS[1] + s * .5, 1];
        knee = vl(knee, kS, sit); foot = vl(foot, fS, sit);
      }
      J['hip' + k] = hip; J['kn' + k] = knee; J['ft' + k] = foot; J['toe' + k] = add(foot, [5.5, 0, -.3]);
    }
    for (const s of [1, -1]) {
      const k = s > 0 ? 'L' : 'R', off = s > 0 ? 0 : PI;
      const sh = add(chest, rotZ([-.5, s * B.sh, 2.5], twist));
      const sw = -Math.sin(ph + off) * .5 * st;
      let hand = add(sh, [Math.sin(sw) * 23 + 2, s * 2.5, -Math.cos(sw) * 23]);
      if (o.aim) hand = vl(hand, add(chest, [25, s * .9 + (o.aimY || 0), 1 + (o.aimZ || 0)]), o.aim);
      if (o.piano) { const pk = o.piano[k]; hand = add(pelvis, [26.5, s * 6.5 + pk.x, 19 - pk.p * 3]); }
      if (s < 0 && o.slash != null && o.slash >= 0) { const q = ease(o.slash); hand = vl(add(chest, [2, -19, 2]), add(chest, [24, 13, -3]), q); }
      if (s > 0 && o.slash != null && o.slash >= 0) hand = add(chest, [10, 10, -6]);
      if (o.hands && o.hands[k]) hand = vl(hand, add(chest, rotZ(o.hands[k], twist)), o.handK ?? 1); // choreographed hands, turning with the torso
      const [el, ha] = ik(sh, hand, B.ua, B.fa, [-.35, s, -1]);
      J['sh' + k] = sh; J['el' + k] = el; J['ha' + k] = ha;
    }
    return J;
  }
  // fall: rotation about the feet around the local y axis (negative = falls backwards)
  function place(J, base, yaw, fall) {
    const out = {}, cf = Math.cos(fall || 0), sf = Math.sin(fall || 0);
    for (const k in J) {
      if (k === 'twist') continue;
      let p = J[k];
      if (fall) p = [p[0] * cf + p[2] * sf, p[1], -p[0] * sf + p[2] * cf];
      out[k] = add(rotZ(p, yaw), base);
    }
    return out;
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  // o: pose params (see rig) + t, fall ; st: { hair:'spiky'|'long', helmet, blind, coat, wind, gun:'light'|'dark', knife }
  function actor(g, c, api, base, yaw, col, al, o = {}, st = {}) {
    if (al < .01) return;
    const fall = o.fall || 0, lift_ = 5.5 * Math.abs(Math.sin(fall));
    const sc = st.scale || 1, R0 = rig(o);
    if (sc !== 1) for (const k in R0) if (k !== 'twist') R0[k] = mul(R0[k], sc);
    const J = place(R0, [base[0], base[1], (base[2] || 0) + lift_], yaw, fall);
    const fwd = rotZ([Math.cos(fall), 0, -Math.sin(fall)], yaw), up = rotZ([Math.sin(fall), 0, Math.cos(fall)], yaw);
    const side = cross(up, fwd); // points to the body's left
    const core = lite(col), prims = [], hi = st.lod !== 'low' && !(api && api.lod === 'low');
    const cap = (a, b, r, fill, r2, tag) => prims.push({ k: 'c', a, b, r: r * sc, r2: (r2 ?? r) * sc, fill, tag });
    if (hi) { // a body, not a stack of pills: tapered limbs, a chest that narrows to the waist, hands and feet
      const fa = (e, h) => norm(sub(h, e));
      cap(add(J.chest, mul(up, 2)), add(J.pelvis, mul(up, 7)), 8.4, null, 6.1); // ribcage to waist
      cap(add(J.pelvis, mul(up, 5)), J.pelvis, 6.4, null, 6.8);
      cap(J.shL, J.shR, 4.9); cap(J.hipL, J.hipR, 5.2);
      cap(add(J.chest, mul(up, 4)), J.neck, 2.9, null, 2.5);
      for (const k of ['L', 'R']) {
        cap(J['sh' + k], J['el' + k], 3.6, null, 2.8, 'arm'); cap(J['el' + k], J['ha' + k], 2.8, null, 2.0, 'arm');
        const d = fa(J['el' + k], J['ha' + k]); cap(J['ha' + k], add(J['ha' + k], mul(d, 4.2)), 2.4, null, 1.7, 'arm'); // the hand
        cap(J['hip' + k], J['kn' + k], 5.1, null, 3.5); cap(J['kn' + k], J['ft' + k], 3.5, null, 2.3);
        cap(add(J['ft' + k], mul(fwd, -1.8)), J['toe' + k], 2.6, null, 2.0); // the foot, heel to toe
      }
      cap(add(add(J.head, mul(up, -2.6)), mul(fwd, 1.4)), add(add(J.head, mul(up, -5.6)), mul(fwd, 3.2)), 3.4 * (st.helmet ? 1.12 : 1), null, 2.1); // the jaw
      if (st.coat) cap(add(add(J.neck, mul(side, 4.2)), mul(fwd, -1.2)), add(add(J.neck, mul(side, -4.2)), mul(fwd, -1.2)), 2.5, null, 2.5); // the coat's collar
    } else {
      cap(J.shL, J.shR, 4.6); cap(add(J.chest, mul(up, -4)), add(J.pelvis, mul(up, 3)), 7.2);
      cap(J.hipL, J.hipR, 4.8); cap(J.chest, J.neck, 3.4);
      cap(J.shL, J.elL, 3.3); cap(J.elL, J.haL, 2.8); cap(J.shR, J.elR, 3.3); cap(J.elR, J.haR, 2.8);
      cap(J.hipL, J.knL, 4.4); cap(J.knL, J.ftL, 3.6); cap(J.hipR, J.knR, 4.4); cap(J.knR, J.ftR, 3.6);
      cap(J.ftL, J.toeL, 2.8); cap(J.ftR, J.toeR, 2.8);
      prims.push({ k: 'b', p: J.haL, r: 2.6 }, { k: 'b', p: J.haR, r: 2.6 });
    }
    prims.push({ k: 'head', p: J.head, r: B.hr * sc * (st.helmet ? 1.12 : 1) });
    if (st.hair === 'long') cap(add(J.head, mul(fwd, -3.5)), add(add(J.neck, mul(fwd, -5)), mul(up, -9)), 5.6);
    if (st.coat) {
      const back = mul(fwd, -1), wv = st.wind || 0, fl = Math.sin(wv * 2.3) * 2 + Math.sin(wv * 3.7) * 1.2;
      const kz = mid(J.knL, J.knR);
      prims.push({ k: 'poly', pts: [add(J.shL, mul(back, 3)), add(J.shR, mul(back, 3)), add(add(add(J.knR, mul(back, 6 + fl)), mul(side, -3)), mul(up, 3)), add(add(add(J.knL, mul(back, 6 + fl * .7)), mul(side, 3)), mul(up, 3))], z: mid(J.chest, kz) });
    }
    if (st.gun) {
      const hm = mid(J.haL, J.haR), dir = norm(sub(hm, J.chest)), len = st.gun === 'rifle' ? 26 : 14;
      cap(hm, add(hm, mul(dir, len)), st.gun === 'rifle' ? 2.1 : 1.9, st.gun === 'dark' || st.gun === 'rifle' ? '#07090c' : '#d8e5ee');
    }
    if (st.deco) st.deco({ J, fwd, up, side, cap, add, mul, sub, mid, norm, sc, // extra costume pieces, depth-sorted with the body
      poly: (pts, fill) => prims.push({ k: 'poly', pts, z: mul(pts.reduce((a, b) => add(a, b), [0, 0, 0]), 1 / pts.length), fill }),
      ball: (p, r, fill, noRim) => prims.push({ k: 'b', p, r: r * sc, fill, noRim }) });
    if (st.knife) { const dir = norm(sub(J.haR, J.elR)); cap(J.haR, add(J.haR, mul(dir, 12)), .9, '#eaf6ff'); }
    if (st.hammer) { // Kade's sledge: a long handle out of the right fist, a heavy head across the end
      const dir = norm(sub(J.haR, J.elR)), end = add(J.haR, mul(dir, 26)), xp = cross(dir, up), pp = Math.hypot(xp[0], xp[1], xp[2]) > .15 ? norm(xp) : side;
      cap(add(J.haR, mul(dir, -5)), end, 1.4, '#cdbb8e');
      cap(add(end, mul(pp, -7)), add(end, mul(pp, 7)), 4.6, st.hammerHot ? '#ffe9a8' : '#0b0e12');
    }
    // depth sort (far first) and draw
    for (const p of prims) {
      const q = P(c, p.k === 'c' ? mid(p.a, p.b) : p.k === 'poly' ? p.z : p.p);
      p.d = q ? q[2] : -1;
    }
    prims.sort((a, b) => b.d - a.d);
    g.save(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = Math.min(1, al);
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (!hi) { drawFlat(g, c, prims, core, st, fwd, up, side); g.restore(); g.globalCompositeOperation = 'lighter'; return; }
    // a soft contact shadow where the feet meet the floor
    if (!(api && api.noShadow) && !fall) {
      const fm = mid(J.ftL, J.ftR), sp = [];
      for (let i = 0; i < 16; i++) { const t = i / 16 * TAU, q = P(c, [fm[0] + Math.cos(t) * 13 * sc, fm[1] + Math.sin(t) * 13 * sc, (base[2] || 0) + .4]); if (q) sp.push(q); }
      if (sp.length > 3) { g.beginPath(); sp.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fillStyle = 'rgba(0,0,0,.42)'; g.fill(); }
    }
    // resolve every primitive to screen space once
    const R = [];
    for (const p of prims) {
      if (p.d < 0) continue;
      if (p.k === 'c') {
        const a = P(c, p.a), b = P(c, p.b); if (!a || !b) continue;
        R.push({ p, k: 'c', ax: a[0], ay: a[1], bx: b[0], by: b[1], ra: Math.max(.7, p.r * c.foc / a[2]), rb: Math.max(.6, p.r2 * c.foc / b[2]) });
      } else if (p.k === 'b') { const q = P(c, p.p); if (q) R.push({ p, k: 'b', x: q[0], y: q[1], r: p.r * c.foc / q[2] }); }
      else if (p.k === 'poly') { const ps = p.pts.map(x => P(c, x)); if (!ps.some(x => !x)) R.push({ p, k: 'poly', ps }); }
      else if (p.k === 'head') {
        const q = P(c, p.p); if (!q) continue;
        const rp = p.r * c.foc / q[2], qb = P(c, add(p.p, mul(fwd, -p.r))) || q, qu = P(c, add(p.p, mul(up, p.r))) || q;
        let bx = qb[0] - q[0], by = qb[1] - q[1], ux = qu[0] - q[0], uy = qu[1] - q[1];
        const bl = Math.hypot(bx, by) || 1, ul = Math.hypot(ux, uy) || 1; bx /= bl; by /= bl; ux /= ul; uy /= ul;
        R.push({ p, k: 'head', x: q[0], y: q[1], z: q[2], r: rp, bx, by, ux, uy });
      }
    }
    const shape = (o, e) => { // the outline of one part, grown by e pixels
      g.beginPath();
      if (o.k === 'c') {
        const dx = o.bx - o.ax, dy = o.by - o.ay, L = Math.hypot(dx, dy) || .001, nx = -dy / L, ny = dx / L, ra = o.ra + e, rb = o.rb + e;
        const ang = Math.atan2(dy, dx);
        g.moveTo(o.ax + nx * ra, o.ay + ny * ra); g.lineTo(o.bx + nx * rb, o.by + ny * rb);
        g.arc(o.bx, o.by, rb, ang + PI / 2, ang - PI / 2, true);
        g.lineTo(o.ax - nx * ra, o.ay - ny * ra);
        g.arc(o.ax, o.ay, ra, ang - PI / 2, ang + PI / 2, true);
        g.closePath();
      } else if (o.k === 'b') g.arc(o.x, o.y, Math.max(.5, o.r + e), 0, TAU);
      else if (o.k === 'poly') { o.ps.forEach((x, i) => i ? g.lineTo(x[0], x[1]) : g.moveTo(x[0], x[1])); g.closePath(); }
      else if (o.k === 'head') {
        const rp = o.r + e;
        if (st.hair === 'spiky') {
          for (let i = 0; i <= 28; i++) {
            const a = i / 28 * TAU, dx = Math.cos(a), dy = Math.sin(a);
            const w = Math.max(0, dx * o.bx + dy * o.by) * .7 + Math.max(0, dx * o.ux + dy * o.uy) * .5;
            const r = rp * (i % 2 === 0 ? 1.08 + w * .45 : .96 + w * .08);
            i ? g.lineTo(o.x + dx * r, o.y + dy * r) : g.moveTo(o.x + dx * r, o.y + dy * r);
          }
          g.closePath();
        } else g.ellipse(o.x, o.y, rp * .94, rp * 1.08, Math.atan2(o.uy, o.ux) + PI / 2, 0, TAU); // a skull, not a ball
      }
    };
    // 1 · the rim: every part grown a little, all in the rim colour, so only the outside edge survives
    const rimW = clamp(c.foc / 900, .9, 2.2);
    g.fillStyle = rgba(core, 1); g.strokeStyle = rgba(core, 1); g.lineWidth = rimW * 2;
    for (const o of R) { if (o.p.noRim) continue; shape(o, rimW); if (o.k === 'poly') g.stroke(); g.fill(); }
    // 2 · the body, back to front: solid ink, a faint contour where parts cross, and the key light along the lit side
    const LX = -.55, LY = -.83; // the key light comes from the upper left
    for (const o of R) {
      shape(o, 0); g.fillStyle = o.p.fill || '#06090d'; g.fill();
      if (o.p.noRim || o.p.fill) continue;
      if (o.p.tag === 'arm') { g.strokeStyle = rgba(core, .38); g.lineWidth = .9; g.stroke(); } // only an arm across the body needs its own edge
      if (o.k === 'c') { // the key light: a soft sheen down the lit side, not a stripe
        const dx = o.bx - o.ax, dy = o.by - o.ay, L = Math.hypot(dx, dy) || .001; let nx = -dy / L, ny = dx / L;
        if (nx * LX + ny * LY < 0) { nx = -nx; ny = -ny; }
        const lit = Math.max(0, nx * LX + ny * LY); if (lit < .2) continue;
        const u0 = .18, u1 = .82, ra = lerp(o.ra, o.rb, u0) * .6, rb = lerp(o.ra, o.rb, u1) * .6;
        g.beginPath(); g.moveTo(o.ax + dx * u0 + nx * ra, o.ay + dy * u0 + ny * ra); g.lineTo(o.ax + dx * u1 + nx * rb, o.ay + dy * u1 + ny * rb);
        g.strokeStyle = rgba(core, .26 * lit); g.lineWidth = Math.max(.6, (o.ra + o.rb) * .1); g.stroke();
      } else if (o.k === 'head') {
        g.beginPath(); g.arc(o.x, o.y, o.r * .72, PI * 1.08, PI * 1.55); g.strokeStyle = rgba(core, .55); g.lineWidth = Math.max(.8, o.r * .16); g.stroke();
        const p = o.p, eyeL = P(c, add(add(p.p, mul(fwd, p.r * .86)), mul(side, p.r * .55))), eyeR = P(c, add(add(p.p, mul(fwd, p.r * .86)), mul(side, -p.r * .55)));
        const front = P(c, add(p.p, mul(fwd, p.r))), facing = front && front[2] < o.z;
        if (eyeL && eyeR && (facing || st.blind || st.helmet)) {
          g.beginPath(); g.moveTo(eyeL[0], eyeL[1]); g.lineTo(eyeR[0], eyeR[1]);
          if (st.blind) { g.strokeStyle = rgba(core, .95); g.lineWidth = Math.max(1.5, o.r * .38); g.stroke(); }
          else if (st.helmet) { g.strokeStyle = 'rgba(255,170,180,1)'; g.lineWidth = Math.max(1.4, o.r * .3); g.stroke(); }
        }
      }
    }
    g.restore();
    g.globalCompositeOperation = 'lighter';
  }
  // the low-detail figure: the original capsule look, cheap enough for crowds, bodies on the floor and slow machines
  function drawFlat(g, c, prims, core, st, fwd, up, side) {
    for (const p of prims) {
      if (p.d < 0) continue;
      if (p.k === 'c') {
        const a = P(c, p.a), b = P(c, p.b); if (!a || !b) continue;
        const rp = Math.max(.8, p.r * c.foc / ((a[2] + b[2]) / 2));
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0] + .01, b[1]);
        g.strokeStyle = rgba(core, 1); g.lineWidth = 2 * rp + 1.5; g.stroke();
        g.strokeStyle = p.fill || '#06090d'; g.lineWidth = 2 * rp; g.stroke();
      } else if (p.k === 'b') {
        const q = P(c, p.p); if (!q) continue; const rp = p.r * c.foc / q[2];
        g.beginPath(); g.arc(q[0], q[1], rp, 0, TAU); g.fillStyle = p.fill || '#06090d'; g.fill(); if (!p.noRim) { g.strokeStyle = rgba(core, 1); g.lineWidth = 1.1; g.stroke(); }
      } else if (p.k === 'poly') {
        const ps = p.pts.map(x => P(c, x)); if (ps.some(x => !x)) continue;
        g.beginPath(); ps.forEach((x, i) => i ? g.lineTo(x[0], x[1]) : g.moveTo(x[0], x[1])); g.closePath();
        g.fillStyle = p.fill || '#06090d'; g.fill(); g.strokeStyle = rgba(core, 1); g.lineWidth = 1.1; g.stroke();
      } else if (p.k === 'head') {
        const q = P(c, p.p); if (!q) continue;
        const rp = p.r * c.foc / q[2];
        // screen-space "back" direction of the head, for swept hair
        const qb = P(c, add(p.p, mul(fwd, -p.r))) || q, qu = P(c, add(p.p, mul(up, p.r))) || q;
        let bx = qb[0] - q[0], by = qb[1] - q[1], ux = qu[0] - q[0], uy = qu[1] - q[1];
        const bl = Math.hypot(bx, by) || 1, ul = Math.hypot(ux, uy) || 1; bx /= bl; by /= bl; ux /= ul; uy /= ul;
        g.beginPath();
        if (st.hair === 'spiky') {
          for (let i = 0; i <= 28; i++) {
            const a = i / 28 * TAU, dx = Math.cos(a), dy = Math.sin(a);
            const w = Math.max(0, dx * bx + dy * by) * .7 + Math.max(0, dx * ux + dy * uy) * .5;
            const r = rp * (i % 2 === 0 ? 1.08 + w * .45 : .96 + w * .08);
            i ? g.lineTo(q[0] + dx * r, q[1] + dy * r) : g.moveTo(q[0] + dx * r, q[1] + dy * r);
          }
          g.closePath();
        } else g.arc(q[0], q[1], rp, 0, TAU);
        g.fillStyle = '#06090d'; g.fill(); g.strokeStyle = rgba(core, 1); g.lineWidth = 1.4; g.stroke();
        const eyeL = P(c, add(add(p.p, mul(fwd, p.r * .86)), mul(side, p.r * .55))), eyeR = P(c, add(add(p.p, mul(fwd, p.r * .86)), mul(side, -p.r * .55)));
        const front = P(c, add(p.p, mul(fwd, p.r)));
        const facing = front && front[2] < q[2]; // the face is toward the camera
        if (eyeL && eyeR && (facing || st.blind || st.helmet)) {
          g.beginPath(); g.moveTo(eyeL[0], eyeL[1]); g.lineTo(eyeR[0], eyeR[1]);
          if (st.blind) { g.strokeStyle = rgba(core, .95); g.lineWidth = Math.max(1.5, rp * .38); g.stroke(); }
          else if (st.helmet) { g.strokeStyle = 'rgba(255,170,180,1)'; g.lineWidth = Math.max(1.4, rp * .3); g.stroke(); }
        }
      }
    }
  }


  // ---------- particles ----------
  function stepParts(list, dt, grav = 0) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]; p.life -= dt; if (p.life <= 0) { list.splice(i, 1); continue; }
      const dr = Math.exp(-(p.drag || 0) * dt);
      p.v[0] *= dr; p.v[1] *= dr; p.v[2] = p.v[2] * dr - grav * dt;
      p.p = add(p.p, mul(p.v, dt)); if (p.p[2] < 0) { p.p[2] = 0; p.v[2] *= -.3; }
    }
  }
  function drawParts(g, c, list) {
    for (const p of list) {
      const k = p.life / p.max;
      if (p.streak) { L3(g, c, p.p, sub(p.p, mul(p.v, .03)), p.c, k, 1.2); }
      else dot3(g, c, p.p, p.c, k * (p.a || 1), p.size || 1.4);
    }
  }
  function burst(list, at, n, col, spd, up, life, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, s = spd * (.3 + Math.random() * .7);
      list.push({ p: [...at], v: [Math.cos(a) * s + (o.dx || 0), Math.sin(a) * s + (o.dy || 0), up * Math.random()], life: life * (.5 + Math.random() * .5), max: life, c: col, drag: o.drag ?? 2, streak: o.streak, size: o.size });
    }
  }
  // 3D rain falling inside a box; ripples on the floor light nearby geometry
  function makeRain(n, x0, x1, y0, y1) { return Array.from({ length: n }, (_, i) => ({ x: x0 + rnd(i, 1) * (x1 - x0), y: y0 + rnd(i, 2) * (y1 - y0), sp: 700 + rnd(i, 3) * 500, ph: rnd(i, 4) * 10, top: 420 })); }
  function drawRain(g, c, drops, t, col, dim) {
    const rips = [];
    for (const d of drops) {
      const cyc = d.top / d.sp, u = ((t + d.ph) % cyc) / cyc, z = d.top * (1 - u);
      L3(g, c, [d.x, d.y, z], [d.x + 2, d.y + 1, z + 34], col, .22 * dim, .8);
      const age = u * cyc; // time since the previous impact
      if (age < .45) { ring3(g, c, d.x, d.y, 1, 4 + age * 60, col, (1 - age / .45) * .35 * dim, 1); rips.push([d.x, d.y, age]); }
    }
    return rips;
  }
  const ripA = (rips, m, R = 120) => { let a = 0; for (const r of rips) { const dd = Math.hypot(m[0] - r[0], m[1] - r[1]); if (dd < R) a = Math.max(a, (1 - dd / R) * (1 - r[2] / .45)); } return a; };

  // ---------- sets ----------
  const APT = [
    wall(240, 150, 400, 150), wall(560, 150, 1040, 150), wall(240, 150, 240, 610), wall(240, 610, 1040, 610),
    wall(1040, 150, 1040, 330), wall(1040, 420, 1040, 610), wall(640, 150, 640, 290), wall(700, 610, 700, 505),
    line([400, 150, 40], [560, 150, 40]), line([400, 150, 100], [560, 150, 100]), line([480, 150, 40], [480, 150, 100]), line([400, 150, 40], [400, 150, 100]), line([560, 150, 40], [560, 150, 100]),
    box(300, 192, 150, 72, 42), line([300, 250, 42], [450, 250, 42]), box(330, 290, 90, 22, 18),
    box(770, 490, 200, 50, 24), box(770, 470, 200, 20, 52), box(770, 490, 16, 50, 36), box(954, 490, 16, 50, 36),
    box(700, 250, 80, 56, 30), box(880, 170, 130, 40, 38),
    line([990, 575, 0], [990, 575, 120]), box(972, 557, 36, 36, 20, 120),
    line([560, 380, 1], [860, 380, 1], .8), line([860, 380, 1], [860, 460, 1], .8), line([860, 460, 1], [560, 460, 1], .8), line([560, 460, 1], [560, 380, 1], .8),
  ];
  const KEYS = []; for (let x = 306; x <= 444; x += 7) KEYS.push(line([x, 256, 42], [x, 264, 42], .8));
  const HOSP = [
    wall(420, 170, 860, 170), wall(420, 170, 420, 570), wall(420, 570, 700, 570), wall(780, 570, 860, 570), wall(860, 170, 860, 570),
    line([520, 170, 45], [760, 170, 45]), line([520, 170, 100], [760, 170, 100]), line([640, 170, 45], [640, 170, 100]),
    box(560, 280, 180, 90, 34), box(574, 292, 40, 66, 10, 34), line([630, 280, 38], [630, 370, 38]),
    line([770, 300, 0], [770, 300, 150]), box(760, 292, 20, 16, 26, 150),
    box(470, 430, 50, 50, 26), box(470, 430, 8, 50, 60),
    line([800, 215, 0], [800, 215, 60]), box(780, 200, 44, 30, 34, 60),
  ];
  const ALLEY = [
    wall(470, -300, 470, 250, 300), wall(470, 330, 470, 1000, 300), wall(300, 250, 470, 250, 300), wall(300, 330, 470, 330, 300),
    wall(810, -300, 810, 470, 300), wall(810, 540, 810, 1000, 300), wall(810, 470, 920, 470, 300), wall(810, 540, 920, 540, 300),
    box(700, 90, 80, 48, 52), line([700, 114, 52], [780, 114, 52]),
    box(472, 380, 44, 150, 4, 110), box(472, 380, 44, 150, 4, 210), line([516, 380, 110], [516, 380, 214]), line([516, 530, 110], [516, 530, 214]),
    line([800, 600, 0], [800, 600, 300], 1.4), line([794, 610, 0], [794, 610, 300], 1.4),
    box(505, 610, 46, 46, 46), box(522, 662, 40, 40, 38), box(730, 700, 60, 40, 30),
  ];
  const ROOF = [
    wall(300, 200, 980, 200, 26), wall(980, 200, 980, 640, 26), wall(980, 640, 300, 640, 26), wall(300, 640, 300, 200, 26),
    box(360, 420, 70, 50, 40), box(450, 430, 60, 50, 40), box(700, 470, 120, 90, 110), line([740, 470, 0], [740, 470, 80]), line([780, 470, 0], [780, 470, 80]),
    line([420, 290, 0], [420, 290, 260], 1.2), line([400, 290, 200], [440, 290, 200]), line([405, 290, 230], [435, 290, 230]),
    box(840, 500, 70, 70, 100, 30), line([845, 505, 0], [845, 505, 30]), line([905, 565, 0], [905, 565, 30]),
  ];
  const CITY = [];
  for (let i = 0; CITY.length < 70 && i < 400; i++) {
    const x = -1900 + rnd(i, 11) * 4900, y = -3400 + rnd(i, 12) * 3100, w = 120 + rnd(i, 13) * 220, d = 120 + rnd(i, 14) * 220, hh = 420 + rnd(i, 15) * 620;
    if (y + d > -180) continue;
    const b = box(x, y, w, d, hh, -900); b.win = Array.from({ length: 7 }, (_, k) => [x + rnd(i * 9 + k, 16) * w, y + d, -900 + rnd(i * 9 + k, 17) * hh, rnd(i * 9 + k, 18)]);
    CITY.push(b);
  }
  const ARCHIVE = { x: 1180, y: -1500 }; // the building that hums her song

  // =====================================================================
  //  SCENES
  // =====================================================================
  const NOTE_T = [2, 6.5, 11].flatMap(s => [0, .55, 1.1, 1.65].map(d => s + d));
  const S5 = { pings: [6, 9, 12], foes: [[760, 318], [528, 482], [708, 575]] };
  const LENA = [375, 295], ELIAS = [760, 372];
  const S5P = (() => { const pts = [[640, 400]]; S5.foes.forEach(([x, y], i) => { const [px, py] = pts[i], a = Math.atan2(y - py, x - px); pts.push([x - Math.cos(a) * 30, y - Math.sin(a) * 30]); }); return pts; })();
  function eliasS5(t) {
    for (let i = 0; i < S5.pings.length; i++) {
      const p = S5.pings[i], a0 = p + .35, a1 = p + .7;
      if (t < a0) return { pos: S5P[i], moving: 0, ph: 0 };
      if (t < a1) { const k = easeIO((t - a0) / (a1 - a0)); return { pos: [lerp(S5P[i][0], S5P[i + 1][0], k), lerp(S5P[i][1], S5P[i + 1][1], k)], moving: 1, ph: k * TAU * 1.5 }; }
    }
    return { pos: S5P[S5P.length - 1], moving: 0, ph: 0 };
  }
  // which hand presses which key: returns { L:{p,x}, R:{p,x} }
  function pianoHands(t, times) {
    const out = {};
    ['L', 'R'].forEach((hd, j) => {
      let pr = 0, x = 0;
      times.forEach((n, i) => { if ((i % 2 === 0) === (hd === 'R')) { const d = t - n; if (d >= 0 && d < 1.4) { const e = Math.exp(-d * 8); if (e > pr) { pr = e; x = [-4, -1, 2, 5][i % 4] * (hd === 'R' ? 1 : -1) * .7; } } } });
      out[hd] = { p: pr, x: x + Math.sin(t * 1.4 + j * 2) * 1.2 };
    });
    return out;
  }

  const SCENES = [
    {
      id: 'open', dur: 9,
      lines: [{ at: .8, text: 'Everything makes a sound.' }, { at: 4.6, text: 'Most people never listen.' }],
      cues: [1, 2.2, 3.4, 4.6, 5.8, 7].map(at => ({ at, fn: () => A.heart(.3) })),
      enter(m) { m.dust = Array.from({ length: 70 }, (_, i) => [rnd(i, 1), rnd(i, 2), .3 + rnd(i, 3) * .7]); },
      draw(g, t, api) {
        const { W, H, m } = api, beats = [1, 2.2, 3.4, 4.6, 5.8, 7], cy = H * .46;
        for (const d of m.dust) { const x = ((d[0] + t * .01 * d[2]) % 1) * W, y = ((d[1] - t * .006 * d[2] + 1) % 1) * H; g.fillStyle = rgba(COL.cyan, .08 * d[2]); g.fillRect(x, y, 1.6, 1.6); }
        let pulse = 0; for (const b of beats) { const dt = t - b; if (dt > 0 && dt < .6) pulse = Math.max(pulse, 1 - dt / .6); }
        const gr = g.createRadialGradient(W / 2, cy, 0, W / 2, cy, W * .45); gr.addColorStop(0, rgba(COL.cyan, .05 + .07 * pulse)); gr.addColorStop(1, rgba(COL.cyan, 0));
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
        const waveY = x => { // the heartbeat trace: one shape, shared by the line and the dot that rides it
          let y = cy;
          for (const b of beats) { const dx = (x - W / 2) / W * 1280, dtt = t - b; if (dtt > 0 && dtt < 1.2) y -= Math.exp(-dx * dx / 1400) * Math.sin(dx * .085) * H * .1 * (1 - dtt / 1.2); }
          return y;
        };
        g.beginPath();
        const x0 = W * .15, x1 = W * .85;
        for (let x = x0; x <= x1; x += 3) { const y = waveY(x); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); }
        const a = .55 + .3 * pulse;
        g.strokeStyle = rgba(COL.cyan, a); g.lineWidth = 1.6; g.stroke();
        const sweep = x0 + ((t * .35) % 1) * (x1 - x0), sy = waveY(sweep);
        g.strokeStyle = rgba(COL.white, .35); g.lineWidth = 2; g.beginPath(); // a short bright trail along the trace behind it
        for (let i = 0; i <= 12; i++) { const x = sweep - i * 3; if (x < x0) break; i ? g.lineTo(x, waveY(x)) : g.moveTo(x, waveY(x)); }
        g.stroke();
        const gl = g.createRadialGradient(sweep, sy, 0, sweep, sy, 10); gl.addColorStop(0, rgba(COL.white, .35)); gl.addColorStop(1, rgba(COL.white, 0));
        g.fillStyle = gl; g.fillRect(sweep - 10, sy - 10, 20, 20);
        g.fillStyle = rgba(COL.white, .95); g.beginPath(); g.arc(sweep, sy, 2.4, 0, TAU); g.fill();
      },
    },
    {
      id: 'lena', dur: 17, chapter: 'TWO YEARS AGO',
      lines: [
        { at: 2.4, text: 'Two years ago, I could still see.' },
        { at: 6.2, text: 'Lena played the same four notes every night.' },
        { at: 10.6, who: 'LENA', text: '“So you’ll always find your way home.”' },
        { at: 14.4, text: 'I always did.' },
      ],
      cues: [2, 6.5, 11].map(at => ({ at, fn: () => A.motif() })),
      enter(m) { m.dust = Array.from({ length: 110 }, (_, i) => ({ p: [260 + rnd(i, 1) * 760, 170 + rnd(i, 2) * 420, 10 + rnd(i, 3) * 110], ph: rnd(i, 4) * TAU })); m.notes = []; m.ni = 0; },
      draw(g, t, api) {
        const { W, H, m } = api, k = easeIO(t / 17);
        const c = camera(vl([700, 760, 640], [455, 470, 250], k), vl([600, 360, 20], [395, 285, 38], k), .95, W, H, Math.sin(t * .35) * .012);
        const flick = .9 + .1 * Math.sin(t * 11) * Math.sin(t * 4.3);
        const evs = NOTE_T.map(n => ({ x: 375, y: 228, t: n, v: 520, R: 560, s: .8, k: 1.6 }));
        const aAt = mm => (.42 + echoA(mm[0], mm[1], evs, t) * .6) * flick;
        pool(g, c, api, 990, 575, COL.amber, .2 * flick, 230);
        pool(g, c, api, 375, 250, COL.amber, .1 + .08 * Math.sin(t * 2), 190);
        grid(g, c, 264, 174, 1020, 590, 48, COL.amber, aAt);
        drawSet(g, c, APT, COL.amber, aAt); drawSet(g, c, KEYS, COL.amber, () => .55 * flick);
        L3(g, c, [1040, 330, 0], [1040, 420, 0], COL.white, .4); L3(g, c, [1040, 330, 105], [1040, 420, 105], COL.white, .7, 1.8);
        echoRings(g, c, evs, t, COL.amber);
        while (m.ni < NOTE_T.length && t >= NOTE_T[m.ni]) { m.notes.push({ p: [330 + Math.random() * 90, 230, 50], t0: t, g: Math.random() < .5 ? '♪' : '♫' }); m.ni++; }
        g.textAlign = 'center';
        for (const n of m.notes) {
          const age = t - n.t0; if (age > 3) continue;
          const q = P(c, [n.p[0] + Math.sin(age * 2) * 12, n.p[1] - age * 10, n.p[2] + age * 38]); if (!q) continue;
          g.font = `${clamp(22 * c.foc / q[2], 8, 40)}px serif`; g.fillStyle = rgba(COL.amber, (1 - age / 3) * .8); g.fillText(n.g, q[0], q[1]);
        }
        for (const d of m.dust) dot3(g, c, [d.p[0] + Math.sin(t * .3 + d.ph) * 14, d.p[1] + Math.cos(t * .23 + d.ph) * 10, d.p[2] + Math.sin(t * .5 + d.ph) * 6], COL.amber, .35 + .25 * Math.sin(t * 2 + d.ph), 1.1);
        actor(g, c, api, [LENA[0], LENA[1], 0], -PI / 2 + Math.sin(t * .8) * .04, COL.amber, flick, { t, sit: 1, piano: pianoHands(t, NOTE_T), lean: .25 + Math.sin(t * 1.7) * .06, headDown: .3 }, { hair: 'long' });
        actor(g, c, api, [ELIAS[0], ELIAS[1], 0], Math.atan2(LENA[1] - ELIAS[1], LENA[0] - ELIAS[0]), COL.white, flick, { t: t + 1, headDown: .12 }, { hair: 'spiky', coat: true, wind: t * .6 });
        const lk = g.createLinearGradient(0, 0, W, H); lk.addColorStop(0, rgba(COL.amber, .09)); lk.addColorStop(.5, rgba(COL.amber, 0)); lk.addColorStop(1, rgba(COL.red, .05));
        g.fillStyle = lk; g.fillRect(0, 0, W, H);
      },
    },
    {
      id: 'night', dur: 13, chapter: 'THE NIGHT THEY CAME', noFadeOut: true,
      lines: [
        { at: 2, text: 'I used to kill for a syndicate called The Quiet.' },
        { at: 4.6, text: 'I left it for her.' },
        { at: 7.4, text: 'The Quiet doesn’t take resignations.' },
      ],
      cues: [
        { at: .3, fn: () => A.motif(.14, .6) }, { at: 3.4, fn: () => A.motif(.12, .6, 0, 2) },
        { at: 6, fn: () => A.kick() },
        ...[6.5, 6.9, 7.3, 7.7, 8.1, 8.5].map(at => ({ at, fn: () => A.step(.3) })),
        { at: 10, fn: () => A.clink() }, { at: 11.4, fn: () => { A.bang(); A.ring(8); } },
      ],
      enter(m) { m.sp = []; m.kicked = false; },
      draw(g, t, api) {
        const { W, H, m } = api;
        if (!m.kicked && t >= 6) { m.kicked = true; burst(m.sp, [1040, 375, 55], 50, COL.white, 520, 260, 1.1, { dx: -260, streak: true }); }
        stepParts(m.sp, api.dt, 600);
        const cold = ease((t - 6) / 2), col = mixC(COL.amber, COL.steel, cold);
        let pos, tgt;
        if (t < 6) { const k = easeIO(t / 6); pos = vl([470, 560, 400], [590, 560, 330], k); tgt = vl([520, 320, 30], [660, 350, 40], k); }
        else if (t < 10) { const k = easeIO((t - 6) / 2.2); pos = vl([590, 560, 330], [780, 540, 250], k); tgt = vl([660, 350, 40], [950, 375, 50], k); }
        else { const k = easeIO((t - 10) / 1.4); pos = vl([780, 540, 250], [690, 470, 210], k); tgt = vl([950, 375, 50], [610, 345, 0], k); }
        const sh = Math.max(0, 1 - (t - 6) / .8) * (t > 6 ? 18 : 0);
        pos = add(pos, [(Math.random() - .5) * sh, (Math.random() - .5) * sh, (Math.random() - .5) * sh]);
        const c = camera(pos, tgt, .95, W, H, t > 6 ? Math.sin(t * 20) * .02 * Math.max(0, 1 - (t - 6)) : 0);
        const door = [{ x: 1040, y: 375, t: 6, v: 700, R: 1000, s: 1, c: COL.red, k: .9 }];
        const aAt = mm => lerp(.42, .26, cold) + echoA(mm[0], mm[1], door, t) * .75;
        pool(g, c, api, 990, 575, COL.amber, .2 * (1 - cold), 230);
        grid(g, c, 264, 174, 1020, 590, 48, col, aAt);
        drawSet(g, c, APT, col, aAt); drawSet(g, c, KEYS, col, () => .4);
        const da = t < 6 ? PI / 2 : lerp(PI / 2, PI * .96, ease((t - 6) / .22));
        drawSet(g, c, [wall(1040, 330, 1040 + Math.cos(da) * 90, 330 + Math.sin(da) * 90, 105)], t < 6 ? COL.white : COL.red, () => .9);
        echoRings(g, c, door, t, COL.red);
        drawParts(g, c, m.sp);
        // The Quiet walk in, laser sights first
        const foes = [[930, 300], [930, 450], [860, 375]].map(([x, y], i) => {
          const t0 = 6.3 + i * .25; if (t < t0) return null;
          const u = clamp((t - t0) / 1.9, 0, 1), k = easeIO(u), D = Math.hypot(x - 1080, y - 375);
          const px = lerp(1080, x, k), py = lerp(375, y, k), a = Math.atan2(ELIAS[1] - py, ELIAS[0] - px);
          return { px, py, a, ph: k * D * PI / 21, stride: u < 1 ? Math.min(1, u * 6) : Math.max(0, 1 - (t - t0 - 1.9) * 4) };
        }).filter(Boolean);
        for (const f of foes) {
          const s0 = [f.px + Math.cos(f.a) * 40, f.py + Math.sin(f.a) * 40, 64], s1 = [f.px + Math.cos(f.a) * 520, f.py + Math.sin(f.a) * 520, 64];
          L3(g, c, s0, s1, COL.red, .35, .8); dot3(g, c, [ELIAS[0] + Math.sin(t * 9 + f.px) * 6, ELIAS[1] + Math.cos(t * 7) * 6, 72], COL.red, .9, 2.2);
        }
        const up_ = ease((t - 6.25) / .7), toDoor = Math.atan2(375 - LENA[1], 1040 - LENA[0]);
        const lenaPose = t < 5.6 ? { t, sit: 1, piano: pianoHands(t, [.3, .9, 1.5, 2.1, 3.4, 4.0]), lean: .25, headDown: .3 } : { t, sit: 1 - up_, lean: .2 * (1 - up_), headDown: .3 * (1 - up_), twist: -.2 * up_ };
        actor(g, c, api, [LENA[0] + 6 * up_, LENA[1] + 14 * up_, 0], lerp(-PI / 2, toDoor, ease((t - 6.2) / .6)), COL.amber, .95, lenaPose, { hair: 'long' });
        const e0 = Math.atan2(LENA[1] - ELIAS[1], LENA[0] - ELIAS[0]), aimK = ease((t - 6.3) / .35);
        actor(g, c, api, [ELIAS[0] - 8 * aimK, ELIAS[1], 0], t < 6.1 ? e0 : lerp(e0 + TAU, .02, ease((t - 6.1) / .4)), COL.white, .95, { t: t + 1, aim: aimK, lean: .15 * aimK, headDown: .12 * (1 - aimK) }, { hair: 'spiky', coat: true, wind: t * .6, gun: aimK > .2 ? 'light' : null });
        for (const f of foes) actor(g, c, api, [f.px, f.py, 0], f.a, COL.red, 1, { t: t + f.px, walk: f.ph, stride: f.stride, aim: .9 }, { helmet: true, gun: 'dark' });
        if (t > 10) {
          const k = ease((t - 10) / 1.2), cx = lerp(1030, 600, k), cy = lerp(378, 340, k), z = 6 + Math.abs(Math.sin(k * 9)) * 30 * (1 - k);
          dot3(g, c, [cx, cy, z], COL.white, 1, 4.5);
          ring3(g, c, cx, cy, 1, 14 + Math.sin(t * 30) * 3, COL.white, .6, 1.2);
          api.fx.glitch = Math.max(api.fx.glitch, (t - 10) / 1.4 * .3);
        }
        if (t > 11.4) { api.fx.white = ease((t - 11.4) / .1); api.fx.glitch = 1 - ease((t - 11.4) / 1.4); }
      },
    },
    {
      id: 'light', dur: 12, noFadeIn: true,
      lines: [
        { at: 2.4, text: 'The last thing I saw was light.' },
        { at: 5.8, text: 'The last thing I heard was her humming.' },
        { at: 8, who: 'GUARD', text: 'She said take the eyes. Leave him breathing.' },
        { at: 10.7, text: 'Then it stopped.' },
      ],
      cues: [
        ...[3.1, 3.4, 4.3, 5.2].map(at => ({ at, fn: () => A.muffled(.45) })),
        { at: 6.6, fn: () => A.hum(.08, .75, 0, 3) },
        { at: 8.9, fn: () => A.muffled(.7) },
      ],
      enter(m) { m.ash = Array.from({ length: 90 }, (_, i) => [rnd(i, 1), rnd(i, 2), .4 + rnd(i, 3) * .6, rnd(i, 4) * TAU]); },
      draw(g, t, api) {
        const { W, H, m } = api;
        api.fx.white = 1 - ease(t / 3.4);
        api.fx.glitch = t < 2 ? .6 * (1 - t / 2) : 0;
        for (const a of m.ash) {
          const x = (a[0] + Math.sin(t * .4 + a[3]) * .01) * W, y = ((a[1] + t * .025 * a[2]) % 1) * H;
          g.fillStyle = rgba(COL.white, .12 * a[2] * clamp((t - 1) / 2, 0, 1) * (t > 9 ? Math.max(0, 1 - (t - 9) / 2) : 1)); g.fillRect(x, y, 1.8, 1.8);
        }
        // tinnitus
        const ti = Math.max(0, 1 - t / 7);
        if (ti > 0) { g.strokeStyle = rgba(COL.white, .35 * ti); g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= W; x += 6) { const y = H * .46 + Math.sin(x * .9 + t * 60) * 2 * ti; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
        for (const s of [3.1, 3.4, 4.3, 5.2, 8.9]) {
          const d = t - s; if (d > 0 && d < .5) {
            const gr = g.createRadialGradient(W / 2, H * .46, 0, W / 2, H * .46, W * .6); gr.addColorStop(0, rgba(COL.red, .28 * (1 - d / .5))); gr.addColorStop(1, rgba(COL.red, 0));
            g.fillStyle = gr; g.fillRect(0, 0, W, H); api.fx.glitch = Math.max(api.fx.glitch, .5 * (1 - d / .5));
          }
        }
        if (t > 6.6 && t < 8.9) { // her humming, the only thing left in the dark
          const k = Math.min(1, (t - 6.6) / .5), R = Math.min(W, H);
          for (let i = 0; i < 4; i++) { const u = ((t * .5 + i * .25) % 1); g.strokeStyle = rgba(COL.amber, k * .45 * (1 - u)); g.lineWidth = 1.5; g.beginPath(); g.arc(W / 2, H * .46, R * (.04 + u * .3), 0, TAU); g.stroke(); }
          const gr = g.createRadialGradient(W / 2, H * .46, 0, W / 2, H * .46, R * .3); gr.addColorStop(0, rgba(COL.amber, .12 * k)); gr.addColorStop(1, rgba(COL.amber, 0)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        }
      },
    },
    {
      id: 'after', dur: 16, chapter: 'AFTER',
      lines: [
        { at: 2.4, text: 'They left me alive.' },
        { at: 4.8, text: 'Blind. A lesson for anyone else who tried to leave.' },
        { at: 8.2, text: 'They thought the dark would finish the job.' },
        { at: 11, text: 'Because the dark isn’t empty.' },
        { at: 13.6, text: 'Every sound throws a shape.' },
      ],
      cues: [
        ...[.8, 2.1, 3.4, 4.7, 6, 7.3, 8.6].map(at => ({ at, fn: () => A.heart(.25) })),
        { at: 10.3, fn: () => A.tap() }, { at: 12.4, fn: () => A.tap() }, { at: 14.3, fn: () => A.tap() },
      ],
      draw(g, t, api) {
        const { W, H } = api, k = easeIO(t / 16);
        const c = camera(vl([650, 700, 620], [690, 470, 250], k), vl([650, 330, 0], [650, 322, 36], k), .95, W, H, .02);
        const evs = [10.3, 12.4, 14.3].map(tt => ({ x: 650, y: 325, t: tt, v: 480, R: 700, s: 1, k: 1 }));
        const aAt = mm => echoA(mm[0], mm[1], evs, t);
        grid(g, c, 444, 194, 836, 546, 48, COL.cyan, aAt);
        drawSet(g, c, HOSP, COL.cyan, aAt);
        echoRings(g, c, evs, t, COL.cyan);
        // bedside monitor keeps drawing his heartbeat even when nothing else can be seen
        const mq = P(c, [802, 215, 80]);
        if (mq) {
          g.strokeStyle = rgba(COL.cyan, .5); g.lineWidth = 1.2; g.beginPath();
          const s = c.foc / mq[2] * 18;
          for (let i = 0; i <= 40; i++) { const u = i / 40, x = mq[0] - s + u * 2 * s, ph = (u * 2 + t * .8) % 1; const y = mq[1] - (ph > .45 && ph < .55 ? Math.sin((ph - .45) * 62) * s * .6 : 0); i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.stroke();
        }
        actor(g, c, api, [690, 325, 34], 0, COL.white, Math.max(.18, echoA(650, 325, evs, t)), { t, fall: -PI / 2 }, { hair: 'spiky', blind: true });
      },
    },
    {
      id: 'listen', dur: 18, chapter: 'TWO YEARS OF LISTENING',
      lines: [
        { at: 2.4, text: 'So I listened.' },
        { at: 4.4, text: 'Footsteps. Breathing. Rain on steel.' },
        { at: 7.8, text: 'The weight a man puts on a floorboard, just before he pulls the trigger.' },
        { at: 13.4, text: 'They started calling me Echo.' },
        { at: 15.8, text: 'You only know I was there after I’m gone.' },
      ],
      enter(m) { m.drops = makeRain(220, 470, 810, -200, 950); m.sp = []; m.cut = {}; return A.rain(.09); },
      cues: [
        ...S5.pings.map(at => ({ at, fn: () => SFX.sonar() })),
        ...S5.pings.map(at => ({ at: at + .7, fn: () => A.slash() })),
        { at: 2.6, fn: () => A.thunder(.5) }, { at: 11, fn: () => A.thunder(.7) },
      ],
      draw(g, t, api) {
        const { W, H, m } = api;
        const th = lerp(.35, 1.45, easeIO(t / 18));
        const EL = eliasS5(t);
        if (!m.cf) m.cf = [...EL.pos]; m.cf[0] = lerp(m.cf[0], EL.pos[0], Math.min(1, api.dt * 2.5)); m.cf[1] = lerp(m.cf[1], EL.pos[1], Math.min(1, api.dt * 2.5));
        const c = camera([m.cf[0] + Math.sin(th) * 215, m.cf[1] + Math.cos(th) * 215, 225 + Math.sin(t * .4) * 10], [m.cf[0], m.cf[1], 38], 1.0, W, H);
        let flash = 0; for (const lt of [2.2, 2.35, 10.6]) { const d = t - lt; if (d > 0 && d < .25) flash = Math.max(flash, 1 - d / .25); }
        const pings = S5.pings.map((tt, i) => ({ x: S5P[i][0], y: S5P[i][1], t: tt, v: 800, R: 800, s: 1, k: 1.1 }));
        const rips = drawRain(g, c, m.drops, t, COL.cyan, 1);
        const aAt = mm => Math.max(.05, echoA(mm[0], mm[1], pings, t), ripA(rips, mm) * .7, flash * .9);
        grid(g, c, 494, -160, 794, 920, 48, COL.cyan, aAt);
        drawSet(g, c, ALLEY, COL.cyan, aAt);
        echoRings(g, c, pings, t, COL.cyan);
        if (m.face == null) m.face = -PI / 2;
        let faceT = -PI / 2 + Math.sin(t * .6) * .5, slash = -1;
        S5.foes.forEach(([x, y], i) => {
          const p = S5.pings[i], O = S5P[i], hitT = p + Math.hypot(x - O[0], y - O[1]) / 800, cut = p + .7;
          if (t > p + .15 && t < cut + .9) faceT = Math.atan2(y - EL.pos[1], x - EL.pos[0]);
          if (t > p + .5 && t < cut + .35) slash = (t - (p + .5)) / .35;
          if (t < hitT && flash < .3) return;
          const toE = Math.atan2(EL.pos[1] - y, EL.pos[0] - x);
          const vis = Math.max(flash, t >= hitT ? Math.max(.12, Math.exp(-(t - hitT) * .7)) : 0);
          if (t < cut) actor(g, c, api, [x, y, 0], toE, COL.red, vis, { t: t + i * 3, aim: 1, aimZ: 2 }, { helmet: true, gun: 'dark' });
          else {
            if (!m.cut[i]) { m.cut[i] = true; m.fallA = m.fallA || {}; m.fallA[i] = toE; burst(m.sp, [x, y, 60], 44, COL.red, 330, 220, 1.2, { drag: 3 }); burst(m.sp, [x, y, 60], 18, COL.white, 620, 160, .35, { streak: true }); }
            const k = t - cut, u = clamp(k / .55, 0, 1), fa = Math.max(Math.exp(-k * .4), flash * .8), fy = m.fallA[i];
            const kb = ease(k / .5) * 14, bx = x - Math.cos(fy) * kb, by = y - Math.sin(fy) * kb;
            pool(g, c, api, bx - Math.cos(fy) * 30, by - Math.sin(fy) * 30, COL.red, .25 * fa, 55 * ease(k / 1.2));
            actor(g, c, api, [bx, by, 0], fy, COL.red, fa, { t, fall: -u * u * PI / 2 - (u >= 1 ? Math.sin(Math.min(1, (k - .55) / .2) * PI) * .05 : 0), aim: 1 - ease(k / .4) }, { helmet: true });
            if (k < .3) ring3(g, c, EL.pos[0], EL.pos[1], 58, 34, COL.cyan, 1 - k / .3, 3, fy + PI - 1.2 + k * 3, fy + PI + .3 + k * 3);
          }
        });
        m.face = m.face + clamp(angDiff(m.face, faceT), -api.dt * 14, api.dt * 14);
        if (EL.moving) for (let j = 0; j < 2; j++) m.sp.push({ p: [EL.pos[0] + (Math.random() - .5) * 10, EL.pos[1] + (Math.random() - .5) * 10, 20 + Math.random() * 50], v: [-Math.cos(m.face) * 200, -Math.sin(m.face) * 200, 0], life: .25, max: .25, c: COL.cyan, drag: 4, streak: true });
        stepParts(m.sp, api.dt, 500); drawParts(g, c, m.sp);
        actor(g, c, api, [EL.pos[0], EL.pos[1], 0], m.face, COL.white, 1, { t, walk: EL.ph, stride: EL.moving ? 1.3 : 0, lean: EL.moving ? .6 : .1, slash, headDown: slash < 0 && !EL.moving ? .05 + Math.sin(t * .7) * .08 : 0, twist: slash >= 0 ? Math.sin(clamp(slash, 0, 1) * PI) * .4 : Math.sin(t * .6) * .12 }, { hair: 'spiky', coat: true, wind: t * 2.2 + (EL.moving ? t * 6 : 0), blind: true, knife: true });
        if (flash > 0) { g.fillStyle = rgba(COL.white, flash * .18); g.fillRect(0, 0, W, H); }
      },
    },
    {
      id: 'call', dur: 22, chapter: 'THE CALL',
      lines: [
        { at: 2.4, who: 'MARCUS', text: 'The ones who gave the order. Their names are in the Archive.' },
        { at: 6.6, who: 'MARCUS', text: 'Twenty guns. No lights. And they’ll hear you coming.' },
        { at: 10.4, who: 'ECHO', text: 'Good. I’ll hear them first.' },
        { at: 12.8, who: 'MARCUS', text: '…Elias. Lena wouldn’t want this.' },
        { at: 16.4, who: 'ECHO', text: 'She’d want me to find my way home.' },
        { at: 19.2, who: 'ECHO', text: 'I can still hear her. I just follow the song.' },
      ],
      enter(m) { m.drops = makeRain(170, 250, 1030, 150, 700); return A.rain(.045); },
      cues: [
        { at: 2.2, fn: () => A.radio() }, { at: 6.4, fn: () => A.radio() }, { at: 12.6, fn: () => A.radio() },
        { at: 8.3, fn: () => A.thunder(.4) }, { at: 19.4, fn: () => A.motif(.08, .6) },
      ],
      draw(g, t, api) {
        const { W, H, m } = api, k = easeIO(t / 22);
        const c = camera(vl([650, 620, 330], [700, 520, 280], k), vl([650, -300, -120], [820, -500, -200], k), 1.0, W, H, -.015);
        let flash = 0; { const d = t - 8; if (d > 0 && d < .3) flash = 1 - d / .3; }
        const song = t > 19.3 ? [0, .6, 1.2, 1.8].map(d => ({ x: ARCHIVE.x, y: ARCHIVE.y, t: 19.3 + d, v: 900, R: 1600, s: .9, k: .6, c: COL.amber })) : [];
        // the city far below
        for (const b of CITY) {
          const a = .1 + flash * .6 + echoA(b.m[0], b.m[1], song, t) * .8;
          drawSet(g, c, [b], COL.steel, () => a);
          for (const w of b.win) if (w[3] > .55) dot3(g, c, w, COL.amber, (.25 + .2 * Math.sin(t * (1 + w[3] * 3) + w[3] * 20)) * (w[3] > .8 ? 1 : .6), 3);
        }
        const beacon = .3 + .3 * Math.sin(t * 2) + (t > 19.3 ? .5 : 0);
        L3(g, c, [ARCHIVE.x, ARCHIVE.y, -300], [ARCHIVE.x, ARCHIVE.y, 900], COL.amber, beacon * .5, 1.4);
        dot3(g, c, [ARCHIVE.x, ARCHIVE.y, 120], COL.amber, beacon, 10);
        for (const e of song) { const r = (t - e.t) * e.v; if (r > 0 && r < e.R) ring3(g, c, e.x, e.y, 110, r, COL.amber, (1 - r / e.R) * .7, 1.8); }
        const rips = drawRain(g, c, m.drops, t, COL.cyan, .7);
        drawSet(g, c, ROOF, COL.cyan, mm => Math.max(.1, ripA(rips, mm, 140) * .6, flash));
        actor(g, c, api, [640, 236, 0], -PI / 2 + Math.sin(t * .5) * .06, COL.white, 1, { t, headDown: t < 19.3 ? .45 : lerp(.45, -.15, ease((t - 19.3) / 1.2)) }, { hair: 'spiky', coat: true, wind: t * 1.8, blind: true });
        if (flash > 0) { g.fillStyle = rgba(COL.white, flash * .15); g.fillRect(0, 0, W, H); }
        // voice waveform
        const cur = api.currentLine, speaking = cur && cur.typing;
        const cc = cur && cur.who === 'MARCUS' ? COL.amber : COL.cyan, amp = speaking ? 1 : .06;
        const cx = W / 2, cy = H * .19, bw = Math.min(W * .42, 520);
        for (let i = 0; i < 72; i++) {
          const x = cx - bw / 2 + i * bw / 71, env = Math.exp(-Math.pow((i - 35.5) / 22, 2));
          const v = (Math.sin(t * 17 + i * .7) * .5 + .5) * (Math.sin(t * 7.3 + i * 1.9) * .5 + .5);
          const hh = 2 + v * 44 * env * amp;
          g.fillStyle = rgba(cc, .25 + .6 * env); g.fillRect(x - 1.5, cy - hh / 2, 3, hh);
        }
        g.font = '600 12px Rajdhani, sans-serif'; g.textAlign = 'center';
        g.fillStyle = rgba(COL.red, .55 + .35 * Math.sin(t * 4)); g.fillText('●  ENCRYPTED LINE  ·  M. VOSS', cx, cy + 38);
      },
    },
    {
      id: 'title', dur: 9.5, noFadeOut: true,
      lines: [],
      cues: [{ at: .4, fn: () => SFX.sonar() }, { at: 1.2, fn: () => A.boom() }],
      draw(g, t, api) {
        const { W, H } = api;
        const c = camera([640, 400 + 900, 650], [640, 400, 0], 1.0, W, H, Math.sin(t * .2) * .02);
        const evs = [.4, 2.2, 4, 5.8, 7.6].map(tt => ({ x: 640, y: 400, t: tt, v: 520, R: 1300, s: 1, k: .8 }));
        grid(g, c, 0, -400, 1280, 1200, 64, COL.cyan, mm => echoA(mm[0], mm[1], evs, t) * .8 + .04);
        echoRings(g, c, evs, t, COL.cyan);
        if (t > 8.3) api.fx.fade = ease((t - 8.3) / 1.1);
      },
      overlay(t) {
        const a1 = ease((t - .5) / 1.2), a2 = ease((t - 2.4) / 1), a3 = ease((t - 5) / 1);
        return h('div', { className: 'pr-titlecard' },
          h('div', { className: 'pr-logo' + (t > .5 && t < 1.4 ? ' glitch' : ''), style: { opacity: a1, letterSpacing: `${lerp(.9, .38, a1)}em` } }, 'ECH', h('span', { className: 'pr-o' })),
          h('div', { className: 'pr-tag', style: { opacity: a2 } }, 'They took his eyes. He kept his ears.'),
          h('div', { className: 'pr-lvl', style: { opacity: a3 } }, h('span', null, 'LEVEL 01'), ' THE ARCHIVE'));
      },
    },
  ];

  // =====================================================================
  //  CLIFFHANGERS — the hall of the one above The Quiet.
  //  The echo lights everything in the hall except the throne: a shape it can't map.
  // =====================================================================
  const HALL = [
    wall(300, -1500, 300, 700, 260), wall(980, -1500, 980, 700, 260), wall(300, -1500, 980, -1500, 260),
    ...[-1100, -700, -300, 100, 500].flatMap(y => [box(330, y, 40, 40, 260), box(910, y, 40, 40, 260)]),
    ...[-900, -770, -640, -510, -380, -250, -120, 10, 140, 270, 400].flatMap(y => [box(370, y, 230, 24, 16), box(680, y, 230, 24, 16)]),
    box(480, -1400, 320, 200, 22), box(530, -1360, 220, 130, 44),
    ...Array.from({ length: 21 }, (_, i) => line([420 + i * 22, -1492, 30], [420 + i * 22, -1492, 150 + Math.abs(Math.sin(i * .7)) * 90], 1.2)),
  ];
  const THRONE = [640, -1300, 44];
  const CHOIR = [-770, -510, -250, 10].flatMap(y => [430, 520, 760, 850].map(x => [x, y + 40]));
  // the figure on the throne: a cut-out against its own red backlight, nothing but outline and eyes.
  // o: glow, eyes (0..1), rise (0..1), third (0..1: the third eye), hum (0..1: the choir is singing)
  function throneFigure(g, c, t, o) {
    const q = P(c, THRONE); if (!q) return;
    const s = c.foc / q[2], rise = o.rise || 0, lift = rise * 60, hy = -178 - lift, hum = o.hum || 0;
    const RIM = a => rgba(COL.red, a * o.glow);
    const ink = (w, rim) => { g.fillStyle = '#000'; g.fill(); g.strokeStyle = RIM(rim ?? .32); g.lineWidth = w || 1.3; g.stroke(); };
    g.save();
    g.globalCompositeOperation = 'lighter';
    // backlight, and thin shafts of light falling between the pipes
    const gr = g.createRadialGradient(q[0], q[1] - 140 * s, 0, q[0], q[1] - 140 * s, 360 * s);
    gr.addColorStop(0, rgba(COL.red, .55 * o.glow)); gr.addColorStop(.45, rgba(COL.red, .17 * o.glow)); gr.addColorStop(1, rgba(COL.red, 0));
    g.fillStyle = gr; g.fillRect(q[0] - 380 * s, q[1] - 520 * s, 760 * s, 580 * s);
    g.translate(q[0], q[1]); g.scale(s, s);
    for (let i = -3; i <= 3; i++) {
      const x = i * 34 + 17, a = (.06 + .05 * Math.sin(t * .7 + i)) * o.glow;
      const sh = g.createLinearGradient(0, -470, 0, 20); sh.addColorStop(0, rgba(COL.red, a)); sh.addColorStop(1, rgba(COL.red, 0));
      g.fillStyle = sh; g.beginPath(); g.moveTo(x - 4, -470); g.lineTo(x + 4, -470); g.lineTo(x + 22, 20); g.lineTo(x - 22, 20); g.closePath(); g.fill();
    }
    // sound-rings breathing out behind the head — the only "sound" it makes
    for (let i = 0; i < 3; i++) {
      const u = (t * .22 + i / 3) % 1;
      g.strokeStyle = rgba(COL.red, (1 - u) * .32 * o.glow); g.lineWidth = 1.4;
      g.beginPath(); g.arc(0, hy - 6, 34 + u * 120, PI * 1.08, PI * 1.92); g.stroke();
    }
    g.globalCompositeOperation = 'source-over';
    // the throne is an organ: graded pipes rising behind the seat, ringing red when the choir sings
    for (let i = -7; i <= 7; i++) {
      const x = i * 13, ht = 150 + (7 - Math.abs(i)) * 16 + (i % 2 ? 0 : 8), w = 9;
      g.beginPath(); g.moveTo(x - w / 2, 0); g.lineTo(x - w / 2, -ht + w / 2); g.arc(x, -ht + w / 2, w / 2, PI, 0); g.lineTo(x + w / 2, 0); g.closePath();
      const ring = hum * Math.max(0, Math.sin(t * 6 - Math.abs(i) * .6));
      ink(1, .22 + ring * .7);
      g.beginPath(); g.moveTo(x - w / 2 + 1, -ht * .62); g.lineTo(x + w / 2 - 1, -ht * .62); g.strokeStyle = RIM(.25 + ring * .5); g.lineWidth = 1; g.stroke(); // the pipe's mouth
    }
    // The Quiet's mark, burning above it all
    g.globalCompositeOperation = 'lighter';
    g.strokeStyle = RIM(.85); g.lineWidth = 3;
    g.beginPath(); g.arc(0, -318, 17, 0, TAU); g.moveTo(0, -345); g.lineTo(0, -291); g.stroke();
    g.globalCompositeOperation = 'source-over';
    // armrests
    for (const sd of [-1, 1]) { g.beginPath(); g.rect(sd * 92 - 14, -46, 28, 56); ink(1.2); }
    // the cape: pooling down the dais in jagged folds
    g.beginPath();
    g.moveTo(-46, hy + 52);
    g.quadraticCurveTo(-86, -40, -150, 34);
    for (let i = 0; i <= 12; i++) { const x = -150 + i * 25; g.lineTo(x, 34 + (i % 2 ? 14 : 0) + Math.sin(t * .8 + i) * 2); }
    g.quadraticCurveTo(86, -40, 46, hy + 52); g.closePath(); ink(1.4);
    for (const fx of [-60, -25, 25, 60]) { g.beginPath(); g.moveTo(fx * .5, hy + 70); g.quadraticCurveTo(fx * .9, -40, fx * 1.6, 36); g.strokeStyle = RIM(.16); g.lineWidth = 1; g.stroke(); }
    // shadow that won't hold still: wisps curling up off the shoulders
    for (let i = 0; i < 6; i++) {
      const sd = i % 2 ? 1 : -1, x0 = sd * (26 + (i >> 1) * 9), ph = t * 1.3 + i * 1.7;
      g.beginPath(); g.moveTo(x0, hy + 36);
      g.bezierCurveTo(x0 + sd * 14 + Math.sin(ph) * 8, hy + 6, x0 + sd * 4 + Math.sin(ph * 1.3) * 12, hy - 30, x0 + sd * 18 + Math.sin(ph * .8) * 10, hy - 62 - (i >> 1) * 10);
      g.strokeStyle = '#000'; g.lineWidth = 3.4 - (i >> 1) * .7; g.stroke(); g.strokeStyle = RIM(.18); g.lineWidth = .7; g.stroke();
    }
    // the high flared collar, rising either side of the head
    for (const sd of [-1, 1]) {
      g.beginPath(); g.moveTo(sd * 18, hy + 40); g.lineTo(sd * 54, hy - 26); g.lineTo(sd * 40, hy - 4); g.lineTo(sd * 46, hy + 54); g.closePath(); ink(1.2, .38);
    }
    // long fingers draped over the armrests
    for (const sd of [-1, 1]) {
      const hx = sd * 92, hy2 = -50 + (sd > 0 ? -lift * .4 : 0);
      g.beginPath(); g.ellipse(hx, hy2, 11, 7, 0, 0, TAU); ink(1, .3);
      for (let f = 0; f < 4; f++) {
        const fx = hx + sd * (-6 + f * 5);
        g.beginPath(); g.moveTo(fx, hy2 + 3); g.quadraticCurveTo(fx + sd * 4, hy2 + 18, fx + sd * 2 - f, hy2 + 30 + (f === 1 ? 4 : 0));
        g.strokeStyle = '#000'; g.lineWidth = 2.6; g.stroke(); g.strokeStyle = RIM(.32); g.lineWidth = .7; g.stroke();
      }
    }
    // the sigil on its chest
    g.globalCompositeOperation = 'lighter';
    g.strokeStyle = RIM(.55); g.lineWidth = 1.4; g.beginPath(); g.arc(0, hy + 72, 6, 0, TAU); g.moveTo(0, hy + 62); g.lineTo(0, hy + 82); g.stroke();
    g.globalCompositeOperation = 'source-over';
    // a narrow, too-long head
    g.beginPath(); g.ellipse(0, hy, 15, 22, 0, 0, TAU); ink(1.3, .4);
    // a crown of tuning forks
    for (let i = -2; i <= 2; i++) {
      const a = -PI / 2 + i * .32, L = 34 + (2 - Math.abs(i)) * 16, bx = Math.cos(a) * 15, by = hy + Math.sin(a) * 21, tx = Math.cos(a) * (15 + L), ty = hy + Math.sin(a) * (21 + L);
      const px = -Math.sin(a) * 4, py = Math.cos(a) * 4;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(tx - Math.cos(a) * 9, ty - Math.sin(a) * 9);
      g.moveTo(tx - Math.cos(a) * 9 + px, ty - Math.sin(a) * 9 + py); g.lineTo(tx + px, ty + py);
      g.moveTo(tx - Math.cos(a) * 9 - px, ty - Math.sin(a) * 9 - py); g.lineTo(tx - px, ty - py);
      g.moveTo(tx - Math.cos(a) * 9 + px, ty - Math.sin(a) * 9 + py); g.lineTo(tx - Math.cos(a) * 9 - px, ty - Math.sin(a) * 9 - py);
      g.strokeStyle = '#000'; g.lineWidth = 3; g.stroke(); g.strokeStyle = RIM(.4); g.lineWidth = .8; g.stroke();
    }
    // the eyes — the only part of it anyone has seen
    g.globalCompositeOperation = 'lighter';
    const slit = (x, y, w, h, rot, a) => {
      const eg = g.createRadialGradient(x, y, 0, x, y, w + 3); eg.addColorStop(0, `rgba(255,235,235,${.8 * a})`); eg.addColorStop(.45, rgba(COL.red, .45 * a)); eg.addColorStop(1, rgba(COL.red, 0));
      g.fillStyle = eg; g.fillRect(x - w - 3, y - w - 3, (w + 3) * 2, (w + 3) * 2);
      g.fillStyle = `rgba(255,250,250,${a})`; g.beginPath(); g.ellipse(x, y, w, h, rot, 0, TAU); g.fill();
    };
    if (o.eyes > .01) for (const ex of [-6.5, 6.5]) slit(ex, hy + 3, 5.5 * o.eyes, .8 + .6 * o.eyes, ex < 0 ? .16 : -.16, o.eyes);
    if (o.third > .01) slit(0, hy - 11, .7 + .5 * o.third, 6 * o.third, 0, o.third); // the third one, vertical, opens last
    g.restore();
    g.globalCompositeOperation = 'lighter';
  }
  // ---------- the villain's powers, drawn like an anime/comic beat: impact frames, a flame aura, focus lines,
  //            floor shockwaves, supervillain sound-effect lettering and rubble lifting around the dais ----------
  const SHARDS = Array.from({ length: 26 }, (_, i) => ({ a: rnd(i, 51) * TAU, r: 120 + rnd(i, 52) * 230, sz: 6 + rnd(i, 53) * 11, lift: 50 + rnd(i, 54) * 230, ph: rnd(i, 55) * TAU, spin: (rnd(i, 56) - .5) * 3 }));
  const pulseAfter = (list, t, rate) => list.reduce((a, ti) => t >= ti ? Math.max(a, Math.exp(-(t - ti) * rate)) : a, 0);
  // the figure's screen frame: origin at the seat, y up is negative, units of the throne drawing
  function throneFrame(c, rise) { const q = P(c, THRONE); if (!q) return null; return { x: q[0], y: q[1], s: c.foc / q[2], hy: -178 - rise * 60 }; }
  // a crackling flame aura behind the silhouette; stepped at 14 fps like hand-drawn animation
  function villainAura(g, f, t, A) {
    if (!f || A < .02) return;
    const fs = Math.floor(t * 14), lift = (-178 - f.hy), Am = Math.min(1, A);
    g.save(); g.translate(f.x, f.y); g.scale(f.s, f.s); g.globalCompositeOperation = 'lighter'; g.lineJoin = 'miter'; g.lineCap = 'butt';
    const gr = g.createRadialGradient(0, -110 - lift * .5, 40, 0, -110 - lift * .5, 300); gr.addColorStop(0, rgba(COL.red, .22 * Am)); gr.addColorStop(1, rgba(COL.red, 0));
    g.fillStyle = gr; g.fillRect(-320, -440 - lift, 640, 560);
    for (let i = 0; i < 36; i++) {
      const th = i / 36 * TAU, bx = Math.cos(th) * 112, by = -112 - lift * .5 + Math.sin(th) * 172;
      let dx = Math.cos(th) * .55, dy = Math.sin(th) * .35 - 1; const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      const len = (34 + 52 * rnd(i, fs)) * Math.min(1.5, A), px = -dy, py = dx;
      const pts = []; for (let k = 0; k <= 4; k++) { const j = k ? (rnd(i * 7 + k, fs + 3) - .5) * 22 * (k / 4) : 0; pts.push([bx + dx * len * k / 4 + px * j, by + dy * len * k / 4 + py * j]); }
      const line = () => { g.beginPath(); pts.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); };
      line(); g.strokeStyle = rgba(COL.red, .55 * Am); g.lineWidth = 6; g.stroke();
      line(); g.strokeStyle = `rgba(255,225,215,${.75 * Am})`; g.lineWidth = 1.6; g.stroke();
    }
    for (let i = 0; i < 14; i++) { // sparks streaking up out of it
      const u = (t * (.8 + rnd(i, 61)) + rnd(i, 62)) % 1, x = (rnd(i, 63) - .5) * 260, y = 40 - u * 520 - lift;
      g.strokeStyle = rgba(COL.red, (1 - u) * .8 * Am); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(i) * 4, y - 26); g.stroke();
    }
    g.restore();
  }
  // a blast of sound across the floor: a white-hot front, red echoes behind it, streaks kicked off the ring
  function floorShocks(g, c, shocks, t) {
    for (const e of shocks) {
      const r = (t - e.t) * e.v; if (r <= 0 || r > e.R) continue;
      const k = 1 - r / e.R;
      ring3(g, c, e.x, e.y, 3, r, [255, 235, 230], k * .95, 3.2);
      ring3(g, c, e.x, e.y, 3, Math.max(1, r - 26), COL.red, k * .7, 2);
      ring3(g, c, e.x, e.y, 3, Math.max(1, r - 70), COL.red, k * .35, 1.2);
      for (let i = 0; i < 28; i++) { const a = i / 28 * TAU + e.t; L3(g, c, [e.x + Math.cos(a) * (r - 60), e.y + Math.sin(a) * (r - 60), 4], [e.x + Math.cos(a) * (r - 8), e.y + Math.sin(a) * (r - 8), 4 + 10 * k], COL.red, k * .5, 1.2); }
    }
  }
  // manga focus lines: the frame itself rushes in toward it
  function focusLines(g, f, t, k, W, H) {
    if (!f || k < .02) return;
    const cx = f.x, cy = f.y + (f.hy + 10) * f.s, R = Math.hypot(W, H), fs = Math.floor(t * 24);
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) {
      const a = (i + rnd(i, fs) * .8) / 90 * TAU, rin = Math.max(150 * f.s, 90) * (1.1 + rnd(i * 3, fs) * 1.4), w = .006 + rnd(i * 5, fs) * .012;
      g.beginPath(); g.moveTo(cx + Math.cos(a - w) * R, cy + Math.sin(a - w) * R); g.lineTo(cx + Math.cos(a) * rin, cy + Math.sin(a) * rin); g.lineTo(cx + Math.cos(a + w) * R, cy + Math.sin(a + w) * R); g.closePath();
      g.fillStyle = i % 5 ? `rgba(255,240,240,${.32 * k})` : rgba(COL.red, .5 * k); g.fill();
    }
    g.restore();
  }
  // supervillain sound effects in comic lettering: extruded, angled, popping in and trembling with power
  // ev: { t, text, x, y (offsets in throne units), size, rot, dur, wave }
  try { document.fonts && document.fonts.load('80px Bangers'); } catch (e) {} // fetch the comic face now, not on the first hit
  function villainSFX(g, f, t, events) {
    if (!f) return;
    for (const e of events) {
      const u = t - e.t, dur = e.dur || 2; if (u < 0 || u > dur) continue;
      const a = Math.min(1, u * 8) * (1 - ease((u - (dur - .45)) / .45));
      const pop = 1 + Math.max(0, .55 - u * 3.6), sz = clamp(f.s * e.size, 30, 150) * pop;
      const fs = Math.floor(t * 16), x = e.screen ? innerWidth * e.screen[0] : f.x + e.x * f.s, y = e.screen ? innerHeight * e.screen[1] : f.y + e.y * f.s; // screen: pinned to the frame, for shots where the camera is rushing in
      g.save(); g.translate(x, y); g.rotate(e.rot || 0); g.globalAlpha = a;
      g.font = `${sz}px Bangers, Impact, "Arial Black", sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.lineJoin = 'round';
      const chars = [...e.text], ws = chars.map(ch => g.measureText(ch).width * .98), total = ws.reduce((p, q) => p + q, 0);
      let cx = -total / 2;
      const place = chars.map((ch, i) => { // each letter shakes on its own; the long sounds ripple like a wave
        const jx = (rnd(i * 3, fs) - .5) * sz * .06, jy = (rnd(i * 3 + 1, fs) - .5) * sz * .06 + (e.wave ? Math.sin(t * 9 - i * .7) * sz * .09 : 0);
        const r = (rnd(i * 3 + 2, fs) - .5) * .12, p = { ch, x: cx + jx, y: jy + (e.wave ? 0 : -i * sz * .015), r, w: ws[i] }; cx += ws[i]; return p;
      });
      const each = fn => place.forEach(p => { g.save(); g.translate(p.x + p.w / 2, p.y); g.rotate(p.r); fn(p); g.restore(); });
      g.globalCompositeOperation = 'source-over';
      for (let d = 7; d >= 1; d--) { g.fillStyle = d > 1 ? '#1a0005' : '#3d000c'; each(p => g.fillText(p.ch, -p.w / 2 + d * sz * .012, d * sz * .014)); } // the 3D extrusion
      g.lineWidth = sz * .13; g.strokeStyle = '#050002'; each(p => g.strokeText(p.ch, -p.w / 2, 0));
      const gr = g.createLinearGradient(0, -sz * .5, 0, sz * .5); gr.addColorStop(0, '#fff2ee'); gr.addColorStop(.38, rgba(COL.red, 1)); gr.addColorStop(1, '#8a0018');
      g.fillStyle = gr; each(p => g.fillText(p.ch, -p.w / 2, 0));
      g.lineWidth = sz * .025; g.strokeStyle = 'rgba(255,235,230,.85)'; each(p => g.strokeText(p.ch, -p.w / 2, 0));
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * .35; g.fillStyle = rgba(COL.red, 1); each(p => g.fillText(p.ch, -p.w / 2, 0)); // neon bleed
      g.restore();
    }
  }
  // rubble lifting off the floor around the dais as it rises
  function rubble(g, c, t, u) {
    if (u < .01) return;
    for (const d of SHARDS) {
      const p = [THRONE[0] + Math.cos(d.a) * d.r, THRONE[1] + Math.sin(d.a) * d.r * .6 + 40, 4 + u * d.lift + Math.sin(t * 1.3 + d.ph) * 6 * u];
      const q = P(c, p); if (!q) continue;
      const r = d.sz * c.foc / q[2], rot = d.ph + t * d.spin;
      g.save(); g.translate(q[0], q[1]); g.rotate(rot); g.globalCompositeOperation = 'source-over';
      g.beginPath(); g.moveTo(-r, -r * .6); g.lineTo(r * .7, -r); g.lineTo(r, r * .5); g.lineTo(-r * .4, r); g.closePath();
      g.fillStyle = '#050304'; g.fill(); g.strokeStyle = rgba(COL.red, .8); g.lineWidth = 1.2; g.stroke();
      g.restore();
      if (u < 1) dot3(g, c, [p[0], p[1], 2], COL.red, (1 - u) * .5, 3);
    }
  }
  // one hall scene, shared by the interlude and the epilogue
  const ROSE = [640, -1494, 470];
  const CANDLES = [-900, -640, -380, -120, 140, 400].flatMap(y => [[362, y + 12], [918, y + 12]]);
  const PILLAR_Y = [-1100, -700, -300, 100, 500];
  function roseWindow(g, c, glow, t) {
    const [cx, cy, cz] = ROSE, col = COL.red, a = .25 + .45 * glow;
    const pt = (r, ang) => [cx + Math.cos(ang) * r, cy, cz + Math.sin(ang) * r];
    const disc = Array.from({ length: 24 }, (_, i) => pt(80, i / 24 * TAU));
    F3(g, c, disc, col, .06 * glow);
    for (const [r, w] of [[80, 1.8], [52, 1.2], [20, 1.4]]) for (let i = 0; i < 32; i++) L3(g, c, pt(r, i / 32 * TAU), pt(r, (i + 1) / 32 * TAU), col, a, w);
    for (let i = 0; i < 12; i++) { const ang = i / 12 * TAU + t * .03; L3(g, c, pt(20, ang), pt(80, ang), col, a * .8, 1); }
    for (let i = 0; i < 8; i++) { const ang = i / 8 * TAU + t * .03 + .2, m = pt(64, ang); for (let j = 0; j < 12; j++) L3(g, c, [m[0] + Math.cos(j / 12 * TAU) * 10, cy, m[2] + Math.sin(j / 12 * TAU) * 10], [m[0] + Math.cos((j + 1) / 12 * TAU) * 10, cy, m[2] + Math.sin((j + 1) / 12 * TAU) * 10], col, a * .7, .9); }
    L3(g, c, [cx, cy, cz - 30], [cx, cy, cz + 30], col, a + .2, 2); // the mark at its heart
  }
  function banners(g, c, aAt) {
    for (const y of PILLAR_Y) for (const [x, sd] of [[371, 1], [909, -1]]) {
      const a = .1 + aAt([x, y + 20]) * .5, y0 = y + 6, y1 = y + 34;
      F3(g, c, [[x, y0, 240], [x, y1, 240], [x, y1, 120], [x, y0, 120]], COL.red, .1 + a * .15);
      L3(g, c, [x, y0, 120], [x, y0 + 7, 108], COL.red, a, .8); L3(g, c, [x, y0 + 7, 108], [x, y0 + 14, 120], COL.red, a, .8);
      L3(g, c, [x, y0 + 14, 120], [x, y0 + 21, 108], COL.red, a, .8); L3(g, c, [x, y0 + 21, 108], [x, y1, 120], COL.red, a, .8);
      for (let j = 0; j < 12; j++) L3(g, c, [x, y + 20 + Math.cos(j / 12 * TAU) * 8, 190 + Math.sin(j / 12 * TAU) * 8], [x, y + 20 + Math.cos((j + 1) / 12 * TAU) * 8, 190 + Math.sin((j + 1) / 12 * TAU) * 8], COL.red, a + .15, 1);
      L3(g, c, [x, y + 20, 176], [x, y + 20, 204], COL.red, a + .15, 1);
    }
  }
  function hallScene(o) {
    return {
      id: o.id, dur: o.dur, chapter: o.chapter, kicker: o.kicker, lines: o.lines,
      // the score: a swell into the eyes opening, and another into the final push
      cues: [...o.cues, { at: o.eyesAt - 3.6, fn: () => SCORE && SCORE.rise(3.6) }, { at: o.eyesAt, fn: () => { SCORE && SCORE.hit(); A.boom(); } },
        ...(o.rise ? [{ at: o.rise + .2, fn: () => { SCORE && SCORE.hit(.7); A.thunder(.5); } }] : []),
        ...(o.push ? [{ at: o.push - .4, fn: () => SCORE && SCORE.rise(3) }, { at: o.push + 2.6, fn: () => SCORE && SCORE.hit(.9) }] : [])],
      enter(m) {
        m.kneel = 0; m.em = [];
        m.dust = Array.from({ length: 150 }, (_, i) => ({ p: [320 + rnd(i, 1) * 640, -1450 + rnd(i, 2) * 2000, 10 + rnd(i, 3) * 300], ph: rnd(i, 4) * TAU, sp: .4 + rnd(i, 5) }));
      },
      draw(g, t, api) {
        const { W, H, m } = api, k = easeIO(t / o.dur), push = o.push ? ease((t - o.push) / 3.2) : 0;
        // its powers: impacts when the eyes open, when it rises, and on the final push; a blast of sound when it speaks
        const said = (o.lines.find(l => l.who === 'THRONE') || {}).at;
        const impacts = [o.eyesAt, ...(o.rise ? [o.rise + .2] : []), ...(o.push ? [o.push + 2.6] : [])];
        const shocks = [...impacts, ...(said != null ? [said, said + .45, said + .9] : [])].map(ts => ({ x: 640, y: -1300, t: ts, v: 1500, R: 1900, s: 1, k: 1.6 }));
        const jolt = pulseAfter(impacts, t, 7) * 7;
        const from = [640, 640, 175], to = [640, -560, 120], eye = [640, -930, 258];
        const pos = vl(vl(from, to, k), eye, push), tgt = vl([640, -1300, 120], [640, -1300, 258], push);
        const c = camera(add(pos, [Math.sin(t * .9) * 3 + (Math.random() - .5) * jolt, 0, Math.sin(t * 1.3) * 2 + (Math.random() - .5) * jolt]), tgt, .95 - push * .55, W, H, Math.sin(t * .3) * .01);
        const humK = o.hum ? clamp((t - o.hum[0]) / .5, 0, 1) * clamp((o.hum[o.hum.length - 1] + 2.4 - t) / .8, 0, 1) : 0;
        const glow = clamp(.55 + .45 * ease((t - o.eyesAt) / 1.2) + humK * .25 * Math.sin(t * 3), 0, 1.3);
        // the walker's footsteps and the choir's hum are the only light in here
        const wy = lerp(560, -860, clamp(t / o.walk, 0, 1)); // stops at the foot of the dais, well clear of the throne
        const steps = Array.from({ length: Math.floor(Math.min(t, o.walk) / .55) }, (_, i) => ({ x: 640, y: lerp(560, -860, clamp(i * .55 / o.walk, 0, 1)), t: i * .55, v: 520, R: 520, s: .55, k: 1.6 }));
        const hum = (o.hum || []).map(ht => ({ x: 640, y: -400, t: ht, v: 700, R: 1700, s: 1, k: .7, c: COL.amber }));
        const evs = steps.concat(hum);
        const aAt = mm => Math.max(.05, echoA(mm[0], mm[1], evs, t));
        // the throne's light, mirrored in a polished floor
        pool(g, c, api, 640, -1180, COL.red, .28 * glow, 560);
        pool(g, c, api, 640, -1180, COL.red, .18 * glow, 220);
        roseWindow(g, c, glow, t);
        grid(g, c, 300, -1500, 980, 700, 64, COL.steel, aAt);
        drawSet(g, c, HALL, COL.steel, aAt);
        banners(g, c, aAt);
        // candles at the end of every pew
        for (const [x, y] of CANDLES) {
          const fl = .75 + .25 * Math.sin(t * 11 + x * .1 + y) * Math.sin(t * 7.3 + y);
          L3(g, c, [x, y, 0], [x, y, 22], COL.amber, .35, 1.2);
          dot3(g, c, [x + Math.sin(t * 5 + y) * .8, y, 27], COL.amber, .95 * fl, 2.6);
          dot3(g, c, [x, y, 31], [255, 240, 200], .7 * fl, 1.2);
          pool(g, c, api, x, y, COL.amber, .12 * fl, 70);
        }
        echoRings(g, c, evs, t, COL.cyan);
        floorShocks(g, c, shocks, t);
        for (const [x, y] of CHOIR) {
          const hit = echoA(x, y, shocks, t); // the choir flinches as each blast passes through them
          actor(g, c, api, [x, y, 0], -PI / 2, COL.red, Math.max(.14, aAt([x, y]) * 1.1, humK * .6, hit), { t: t + x, sit: .55, headDown: .55 - humK * .25 - hit * .5, lean: .35 - hit * .9 }, { helmet: true });
          if (humK > .02) for (let j = 0; j < 2; j++) { const u = ((t * .9 + j * .5 + x * .003) % 1); ring3(g, c, x, y - 10, 62, 6 + u * 46, COL.amber, humK * (1 - u) * .55, 1.2); }
        }
        const kneel = ease((t - o.walk) / .8), walking = t < o.walk;
        actor(g, c, api, [640, wy, 0], -PI / 2, o.walkerCol, Math.max(.35, aAt([640, wy]) * 1.2) * (1 - .45 * kneel), // kneels low, then fades back so the throne owns the frame
          { t, walk: t * 5.6, stride: walking ? 1 : 0, sit: kneel * .9, headDown: kneel * .9, lean: kneel * .6 }, o.walkerStyle);
        const riseK = o.rise ? ease((t - o.rise) / 2.4) * .65 : 0, fr = throneFrame(c, riseK);
        const aura = .5 * ease((t - o.eyesAt) / .6) + (o.rise ? .6 * ease((t - o.rise) / .8) : 0) + .7 * pulseAfter(impacts, t, 2.5);
        if (o.rise) rubble(g, c, t, ease((t - o.rise) / 2.2));
        villainAura(g, fr, t, aura);
        throneFigure(g, c, t, { glow, eyes: ease((t - o.eyesAt) / .7), rise: riseK, third: o.push ? ease((t - o.push - 1.4) / .9) : 0, hum: humK });
        focusLines(g, fr, t, pulseAfter(impacts, t, 3.2) * (t >= o.eyesAt ? 1 : 0), W, H);
        villainSFX(g, fr, t, [
          { t: o.eyesAt + .05, text: o.rise ? 'THOOM!' : 'KRA-THOOM!', x: -250, y: -330, size: 92, rot: -.14, dur: 2.2 },
          ...(said != null ? [{ t: said + .1, text: 'HMMMMMMMM…', x: 250, y: -150, size: 74, rot: .1, dur: 3, wave: true }] : []),
          ...(o.rise ? [{ t: o.rise + .25, text: 'RRRUMMBLE!', x: -40, y: 60, size: 84, rot: -.05, dur: 2.6 }] : []),
          ...(o.push ? [{ t: o.push + 2.62, text: 'BWAAAMM!', x: 0, y: 0, screen: [.5, .26], size: 110, rot: -.08, dur: 2 }] : []),
        ]);
        for (const ti of impacts) { const d = t - ti; if (d >= 0 && d < .05 || d >= .1 && d < .15) api.fx.invert = 1; else if (d >= .05 && d < .1) api.fx.white = Math.max(api.fx.white, .35); }
        // dust hanging in the red light, embers lifting off the dais
        for (const d of m.dust) {
          const p = [d.p[0] + Math.sin(t * .2 * d.sp + d.ph) * 18, d.p[1] + Math.cos(t * .15 * d.sp + d.ph) * 14, d.p[2] + ((t * 6 * d.sp) % 40) - 20];
          const near = clamp(1 - Math.hypot(p[0] - 640, p[1] + 1300) / 1100, 0, 1);
          dot3(g, c, p, near > .25 ? COL.red : COL.steel, (.06 + near * .35 * glow) * (.6 + .4 * Math.sin(t * 2 + d.ph)), 1.1);
        }
        if (Math.random() < api.dt * 6) m.em.push({ p: [640 + (Math.random() - .5) * 300, -1300 + (Math.random() - .5) * 160, 8], v: [(Math.random() - .5) * 12, (Math.random() - .5) * 8, 30 + Math.random() * 40], life: 4 + Math.random() * 2, t0: t });
        m.em = m.em.filter(e => t - e.t0 < e.life);
        for (const e of m.em) { const age = t - e.t0, p = add(e.p, mul(e.v, age)); p[0] += Math.sin(age * 2 + e.t0) * 6; dot3(g, c, p, age < .6 ? [255, 190, 120] : COL.red, (1 - age / e.life) * .9 * glow, 1.6); }
        if (o.push && t > o.push + 2.6) api.fx.glitch = Math.max(api.fx.glitch, (t - o.push - 2.6) * .8);
        if (t > o.dur - 1.1) api.fx.fade = ease((t - (o.dur - 1.1)) / 1);
      },
    };
  }
  // a hologram of the page Marcus is reading, floating beside Echo
  function holoPage(g, t, api, kind) {
    const { W, H } = api, a = ease((t - .9) / 1.2), fl = .85 + .15 * Math.sin(t * 23) * (Math.sin(t * 3.1) > .9 ? 3 : 1);
    if (a < .01) return;
    const w = Math.min(W * .19, 230), h = w * 1.32, x0 = W * .7 - w / 2, y0 = H * .22;
    const AM = COL.amber, al = v => rgba(AM, v * a * fl);
    g.save(); g.translate(x0, y0); g.transform(1, -.06, .1, 1, 0, 0);
    g.fillStyle = al(.05); g.fillRect(0, 0, w, h);
    g.strokeStyle = al(.6); g.lineWidth = 1.2; g.strokeRect(0, 0, w, h);
    g.lineWidth = 2; g.beginPath();
    for (const [cx, cy, dx, dy] of [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]]) { g.moveTo(cx + dx * 14, cy); g.lineTo(cx, cy); g.lineTo(cx, cy + dy * 14); }
    g.strokeStyle = al(.9); g.stroke();
    g.font = '10px "Share Tech Mono", monospace'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = al(.85);
    g.fillText(kind === 'ledger' ? 'THE LEDGER  ·  LAST PAGE' : 'MANIFEST  ·  THE CHOIR', 10, 13);
    g.fillRect(10, 22, w - 20, 1);
    const mark = (mx, my, r, pulse) => { g.strokeStyle = rgba(COL.red, (.6 + .4 * pulse) * a); g.lineWidth = 1.6; g.beginPath(); g.arc(mx, my, r, 0, TAU); g.moveTo(mx, my - r * 1.45); g.lineTo(mx, my + r * 1.45); g.stroke(); };
    const pulse = .5 + .5 * Math.sin(t * 4);
    if (kind === 'ledger') {
      // a circled mark where a name should be, above everything
      const reveal = clamp((t - 7.5) / 1, 0, 1);
      mark(w / 2, 46, 9, pulse * reveal);
      if (reveal > 0) { g.strokeStyle = rgba(COL.red, .6 * reveal * a); g.lineWidth = 1; g.beginPath(); g.ellipse(w / 2, 46, 22, 17, -.1, 0, TAU); g.stroke(); }
      const rows = 9, shown = Math.floor(clamp((t - 1) / 4, 0, 1) * rows);
      for (let i = 0; i < shown; i++) { const y = 74 + i * ((h - 100) / rows); g.fillStyle = al(.35); g.fillRect(10, y, (w - 20) * (.45 + rnd(i, 7) * .5), 5); }
      if (t > 3) { g.fillStyle = al(1); g.fillText('KADE, B.  —  FOUNDRY', 10, h - 16); g.fillStyle = al(.8); g.fillRect(10, h - 8, (w - 20) * clamp((t - 3) / .6, 0, 1), 1); }
    } else {
      const n = Math.floor(clamp((t - 1) / 6, 0, 1) * 40);
      for (let i = 0; i < n; i++) { const col = i % 2, row = i >> 1, y = 32 + row * ((h - 70) / 20); g.fillStyle = al(.3 + (i === n - 1 ? .5 : 0)); g.fillRect(10 + col * (w / 2 - 4), y, (w / 2 - 22) * (.5 + rnd(i, 9) * .5), 3); }
      if (t > 8) { g.fillStyle = al(.85); g.fillText('ALL ANSWER TO', 10, h - 18); mark(w - 24, h - 18, 7, pulse); }
    }
    const sy = ((t * 60) % h); g.fillStyle = al(.12); g.fillRect(0, sy, w, 2); // scanline
    g.restore();
  }
  const CALL = SCENES.find(s => s.id === 'call');
  const roofScene = (id, chapter, kicker, lines, dur) => ({ id, dur, chapter, kicker, lines, enter: CALL.enter,
    draw(g, t, api) { CALL.draw(g, t, api); holoPage(g, t, api, id === 'ledger' ? 'ledger' : 'manifest'); },
    cues: [{ at: 1.2, fn: () => A.radio() }, { at: 6, fn: () => A.thunder(.35) }] });
  // ---------- the same building, all the way up: the terrace is a setback of the Archive, and the wall behind it climbs to the throne ----------
  // the facade rises from the terrace's back parapet (y = 640); the throne room sits on its top floor
  const BLD = { x0: 140, x1: 1140, y: 680, depth: 900, top: 4000, crown: 420 };
  const bldSegs = (() => {
    const S = [], { x0, x1, y, depth, top, crown } = BLD, yb = y + depth, ct = top + crown;
    const L = (a, b, al, w = 1.2) => S.push([a, b, al, w]);
    for (const x of [x0, x1]) { L([x, y, 0], [x, y, ct], .9, 1.6); L([x, yb, 0], [x, yb, ct], .35); L([x, y, top], [x, yb, top], .5); L([x, y, ct], [x, yb, ct], .7); } // corners & sides
    L([x0, yb, ct], [x1, yb, ct], .4);
    for (let x = x0 + 100; x < x1; x += 100) L([x, y, 0], [x, y, top], (x - x0) % 300 === 0 ? .42 : .2, 1); // pilasters
    for (let z = 160; z < top; z += 160) L([x0, y, z], [x1, y, z], z % 640 === 0 ? .55 : .22, z % 640 === 0 ? 1.4 : 1); // floor bands
    for (let z = 640; z < top; z += 640) { L([x0 - 30, y - 30, z], [x1 + 30, y - 30, z], .5, 1.2); L([x0 - 30, y - 30, z], [x0, y, z], .5); L([x1 + 30, y - 30, z], [x1, y, z], .5); } // ledges
    for (const px of [x0 + 60, x1 - 60]) { L([px, y - 14, 0], [px, y - 14, top], .55, 1.3); for (let z = 120; z < top; z += 240) L([px - 10, y - 14, z], [px + 10, y - 14, z], .5, 1); } // pipes
    // the throne floor: a cornice that juts out, then the crown with its organ-pipe spires
    L([x0 - 50, y - 50, top], [x1 + 50, y - 50, top], 1, 1.8); L([x0 - 50, y - 50, top], [x0, y, top], .9); L([x1 + 50, y - 50, top], [x1, y, top], .9);
    L([x0, y, ct], [x1, y, ct], 1, 1.8);
    for (let i = 0; i < 22; i++) { const x = x0 + 40 + i * (x1 - x0 - 80) / 21, hh = 140 + (10.5 - Math.abs(i - 10.5)) * 34 + (i % 2 ? 0 : 40); L([x, y + 40, ct], [x, y + 40, ct + hh], .75, 1.2); }
    L([(x0 + x1) / 2, y + 40, ct], [(x0 + x1) / 2, y + 40, ct + 1100], .9, 1.4);
    return S;
  })();
  const bldWins = (() => { const W = []; let i = 0; for (let z = 60; z < BLD.top - 60; z += 160) for (let x = BLD.x0 + 50; x < BLD.x1; x += 100) { i++; if (rnd(i, 41) > .8) W.push([x, BLD.y - 1, z + 50, rnd(i, 42)]); } return W; })();
  function drawBuilding(g, c, t, lit, flash) {
    for (const [a, b, al, w] of bldSegs) L3(g, c, a, b, COL.steel, al * (lit + flash * .9) * 1.4, w);
    for (const [x, y, z, r] of bldWins) { // dim amber slits, a few on each floor
      const p = P(c, [x - 18, y, z]), q = P(c, [x + 18, y, z]); if (!p || !q) continue;
      L3(g, c, [x - 18, y, z], [x + 18, y, z], COL.amber, (.25 + .3 * Math.sin(t * (1 + r * 3) + r * 30)) * (.6 + lit), 2.2);
    }
    // the throne room: a band of red windows across the top floor, The Quiet's mark burning above them
    const { x0, x1, y, top, crown } = BLD, pulse = .75 + .25 * Math.sin(t * 3.1), n = 9, wz0 = top + crown * .14, wz1 = top + crown * .58;
    for (let i = 0; i < n; i++) {
      const xa = x0 + 60 + i * (x1 - x0 - 120) / n, xb = xa + (x1 - x0 - 120) / n - 26;
      const ps = [[xa, y - 1, wz0], [xb, y - 1, wz0], [xb, y - 1, wz1], [xa, y - 1, wz1]].map(p => P(c, p)); if (ps.some(p => !p)) continue;
      g.beginPath(); ps.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fillStyle = rgba(COL.red, .5 * pulse); g.fill();
    }
    const mc = P(c, [(x0 + x1) / 2, y - 1, top + crown * .8]);
    if (mc) {
      const r = Math.max(1.5, crown * .13 * c.foc / mc[2]);
      const gr = g.createRadialGradient(mc[0], mc[1], 0, mc[0], mc[1], r * 6); gr.addColorStop(0, rgba(COL.red, .5 * pulse)); gr.addColorStop(1, rgba(COL.red, 0));
      g.fillStyle = gr; g.fillRect(mc[0] - r * 6, mc[1] - r * 6, r * 12, r * 12);
      g.strokeStyle = rgba(COL.red, .95); g.lineWidth = Math.max(1, r * .14);
      g.beginPath(); g.arc(mc[0], mc[1], r, 0, TAU); g.moveTo(mc[0], mc[1] - r * 1.45); g.lineTo(mc[0], mc[1] + r * 1.45); g.stroke();
    }
    // red light spilling down the wall from the top floor
    const sp = P(c, [(x0 + x1) / 2, y - 2, top]);
    if (sp) { const R = Math.max(40, 900 * c.foc / sp[2]), gr = g.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], R); gr.addColorStop(0, rgba(COL.red, .16 * pulse)); gr.addColorStop(1, rgba(COL.red, 0)); g.fillStyle = gr; g.fillRect(sp[0] - R, sp[1] - R, R * 2, R * 2); }
  }
  const towerScene = {
    id: 'tower', dur: 11, chapter: 'SOMEWHERE ABOVE', kicker: 'MEANWHILE',
    lines: [],
    enter: CALL.enter,
    cues: [{ at: 2.4, fn: () => A.thunder(.65) }, { at: 5.6, fn: () => A.thunder(.4) }, { at: 6.4, fn: () => SCORE && SCORE.rise(2.6) }, { at: 9, fn: () => { SCORE && SCORE.hit(.6); A.heart(.35); } }],
    draw(g, t, api) {
      const { W, H, m } = api;
      let flash = 0; for (const s of [2.4, 5.6]) { const d = t - s; if (d >= 0 && d < .55) flash = Math.max(flash, (1 - d / .55) * (d < .09 || d > .16 ? 1 : .3)); }
      // low in front of Elias, the wall of his own building behind him; then the camera climbs it, floor after floor, to the top
      const { y, top, crown } = BLD, k = easeIO((t - 1.6) / 7.4), kp = ease((t - 9) / 1.9);
      const z = lerp(70, top + crown * .4, k), cz = top + crown * .45;
      let pos = [640, lerp(-90, 120, k), z];
      // facing the wall as it climbs, floor after floor; it only tips up to the top floor at the very end
      let tgt = [640, y, lerp(z + 230, cz, ease((k - .8) / .2))];
      if (t < 1.6) tgt = [640, y, lerp(170, 300, ease(t / 1.6))];
      if (t > 9) pos = vl(pos, [640, y - 330, cz - 10], kp);
      const c = camera(pos, tgt, 1.1, W, H, -.008 + Math.sin(t * .35) * .006);
      if (flash > 0) { const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, rgba(COL.white, flash * .14)); sky.addColorStop(.8, rgba(COL.white, 0)); g.fillStyle = sky; g.fillRect(0, 0, W, H); }
      drawBuilding(g, c, t, .45 + .25 * k, flash);
      const rips = drawRain(g, c, m.drops, t, COL.cyan, .7);
      drawSet(g, c, ROOF, COL.cyan, mm => Math.max(.1, ripA(rips, mm, 140) * .6, flash));
      actor(g, c, api, [640, 236, 0], -PI / 2 + Math.sin(t * .5) * .06, COL.white, 1, { t, headDown: .3 }, { hair: 'spiky', coat: true, wind: t * 1.8, blind: true });
      if (t > 9.2) { const kk = ease((t - 9.2) / 1.6); g.fillStyle = rgba(COL.red, kk * .2); g.fillRect(0, 0, W, H); }
      if (t > this.dur - .9) api.fx.fade = ease((t - (this.dur - .9)) / .8);
    },
  };
  // ---------- THE FINALE: the overload, the memory, the quiet ----------
  const FIN_ELIAS = [640, -720, 0];
  const SHARDS_ROSE = Array.from({ length: 40 }, (_, i) => ({ a: rnd(i, 71) * TAU, r: rnd(i, 72) * 70, v: 160 + rnd(i, 73) * 260, s: 4 + rnd(i, 74) * 9, spin: (rnd(i, 75) - .5) * 8 }));
  const MASK_BITS = Array.from({ length: 9 }, (_, i) => [600 + rnd(i, 81) * 90, -1110 + rnd(i, 82) * 70, 3 + rnd(i, 83) * 4, rnd(i, 84) * TAU]);
  function hallBack(g, c, t, api, glow, aAt) { // the hall, dim: rose window, floor, walls, banners, candles
    pool(g, c, api, 640, -1180, COL.red, .2 * glow, 520);
    roseWindow(g, c, glow, t);
    grid(g, c, 300, -1500, 980, 700, 64, COL.steel, aAt);
    drawSet(g, c, HALL, COL.steel, aAt);
    banners(g, c, aAt);
    for (const [x, y] of CANDLES) { const fl = .75 + .25 * Math.sin(t * 11 + x * .1 + y) * Math.sin(t * 7.3 + y); dot3(g, c, [x, y, 27], COL.amber, .9 * fl, 2.4); pool(g, c, api, x, y, COL.amber, .1 * fl, 60); }
  }
  const overloadScene = {
    id: 'overload', dur: 19.4, chapter: 'THE OVERLOAD', kicker: 'THE LAST SONG',
    lines: [
      { at: 1.2, who: 'ECHO', text: 'You want it? Then take it. All of it.' },
      { at: 5, who: 'ECHO', text: 'Two years of listening. Every footstep. Every heartbeat. Your four notes.' },
      { at: 10.2, who: 'CANTOR', text: 'It’s too loud… it’s too much…' },
    ],
    noFadeOut: true,
    cues: [{ at: .3, fn: () => SCORE && SCORE.rise(4) }, { at: 4.4, fn: () => A.heart(.4) }, { at: 12.8, fn: () => SCORE && SCORE.rise(3.8) }, { at: 16.6, fn: () => { SCORE && SCORE.hit(1); A.boom(); A.thunder(.8); } }],
    draw(g, t, api) {
      const { W, H } = api, k = easeIO(t / 16.6), blast = ease((t - 16.6) / 1.6);
      const shake = (t > 13.2 ? (t - 13.2) * 1.4 : 0) * (t < 16.6 ? 1 : 2.4 * (1 - blast));
      const pos = add(vl([640, -540, 150], [640, -860, 175], k), [(Math.random() - .5) * shake, 0, (Math.random() - .5) * shake]);
      const c = camera(pos, [640, -1300, 190], .95 - k * .25, W, H, Math.sin(t * .4) * .012);
      const evs = Array.from({ length: Math.floor(t / .5) }, (_, i) => ({ x: FIN_ELIAS[0], y: FIN_ELIAS[1], t: i * .5, v: 900, R: 900, s: .7, k: 1.2 }));
      const aAt = mm => Math.max(.06, echoA(mm[0], mm[1], evs, t));
      hallBack(g, c, t, api, .6 + .4 * k, aAt);
      echoRings(g, c, evs, t, COL.cyan);
      const fr = throneFrame(c, .65);
      villainAura(g, fr, t, .8 + k * 1.2 + (t > 16.6 ? 1 - blast : 0));
      if (t < 16.8) throneFigure(g, c, t, { glow: 1.2, eyes: 1, rise: .65, third: 1, hum: Math.min(1, t / 6) });
      // the tether: everything he ever heard, pouring out of him and into her
      const a = [FIN_ELIAS[0], FIN_ELIAS[1], 60], b = [640, -1300, 194], n = 26, amp = 6 + k * 14;
      for (let pass = 0; pass < 2 && t < 16.8; pass++) {
        let prev = null;
        for (let i = 0; i <= n; i++) {
          const u = i / n, j = Math.sin(u * 11 + t * (14 + pass * 5)) * amp * Math.sin(u * PI);
          const p = [lerp(a[0], b[0], u) + j, lerp(a[1], b[1], u), lerp(a[2], b[2], u) + j * .6];
          if (prev) L3(g, c, prev, p, pass ? COL.white : COL.cyan, (.35 + .5 * k) * (pass ? .6 : 1), pass ? 1.2 : 2.6);
          prev = p;
        }
        for (let i = 0; i < 8; i++) { const u = ((t * (.6 + k) + i / 8) % 1); dot3(g, c, [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)], COL.cyan, .9, 4 + k * 4); }
      }
      actor(g, c, api, FIN_ELIAS, -PI / 2, COL.white, 1, { t, headDown: -.2, lean: -.25 - k * .2, twist: Math.sin(t * 9) * .05 * k }, { hair: 'spiky', coat: true, wind: t * (2 + k * 6), blind: true });
      focusLines(g, fr, t, t > 13.2 ? Math.min(1, (t - 9) / 3) * (t < 16.8 ? .7 : 1 - blast) : 0, W, H);
      if (t > 16.6) { // the window goes
        const u = t - 16.6;
        for (const sh of SHARDS_ROSE) {
          const p = [ROSE[0] + Math.cos(sh.a) * (sh.r + u * sh.v), ROSE[1] + u * 180, ROSE[2] + Math.sin(sh.a) * (sh.r + u * sh.v) - u * u * 160];
          const q = P(c, p); if (!q) continue; const r = sh.s * c.foc / q[2];
          g.save(); g.translate(q[0], q[1]); g.rotate(sh.a + u * sh.spin); g.globalCompositeOperation = 'lighter';
          g.strokeStyle = rgba(COL.red, Math.max(0, 1 - u / 2.4)); g.lineWidth = 1.2; g.beginPath(); g.moveTo(-r, -r * .6); g.lineTo(r, 0); g.lineTo(-r * .3, r); g.closePath(); g.stroke(); g.restore();
        }
      }
      villainSFX(g, fr, t, [{ t: 16.62, text: 'BWAAAMM!', x: 0, y: 0, screen: [.5, .3], size: 120, rot: -.08, dur: 2.2 }]);
      { const d = t - 16.6; if (d >= 0 && d < .05 || d >= .1 && d < .15) api.fx.invert = 1; }
      if (t > 16.6) api.fx.glitch = Math.max(api.fx.glitch, (1 - blast) * .8);
      if (t > 17.6) api.fx.white = Math.max(api.fx.white, ease((t - 17.6) / 1.5));
    },
  };
  const memoryScene = {
    id: 'memory', dur: 17, chapter: 'THE MEMORY', kicker: 'AFTER',
    lines: [
      { at: 2.4, who: 'LENA', text: 'Four notes…' },
      { at: 5.2, who: 'LENA', text: 'Elias? You found me.' },
      { at: 8.6, who: 'ECHO', text: 'I always find my way home.' },
      { at: 11.8, who: 'LENA', text: 'I know. I made sure of it.' },
    ],
    noFadeIn: true,
    cues: [{ at: 14.6, fn: () => A.motif(.07, .62) }],
    draw(g, t, api) {
      const { W, H } = api, k = easeIO(t / 17);
      const c = camera(vl([790, -900, 150], [745, -955, 112], k), [640, -1080, 14], .85, W, H, -.02);
      const aAt = mm => Math.max(.05, .1 * Math.exp(-Math.hypot(mm[0] - 630, mm[1] + 1070) / 260));
      hallBack(g, c, t, api, .12, aAt);
      pool(g, c, api, 630, -1070, COL.amber, .3, 220);
      for (const [x, y, sz, a] of MASK_BITS) { const q = P(c, [x, y, 1]); if (!q) continue; const r = sz * c.foc / q[2]; g.save(); g.translate(q[0], q[1]); g.rotate(a); g.fillStyle = 'rgba(236,240,248,.8)'; g.beginPath(); g.moveTo(-r, -r * .5); g.lineTo(r, -r * .2); g.lineTo(0, r); g.closePath(); g.fill(); g.restore(); }
      const fade = 1 - ease((t - 15.2) / 1.4); // the moment the humming stops
      // she lies on her back, head toward him; he kneels at her side, bent over her
      actor(g, c, api, [700, -1092, 0], 0, COL.amber, .95 * Math.max(.25, fade), { t: t * .2, fall: -PI / 2 * .97, headDown: .2 }, { hair: 'long', coat: true, wind: 0 });
      actor(g, c, api, [618, -1046, 0], -PI / 2 - .25, COL.white, 1, { t, sit: .92, headDown: .85, lean: .7 }, { hair: 'spiky', coat: true, wind: t * .8, blind: true });
      if (t > 13.4 && t < 15.4) for (let i = 0; i < 3; i++) { const u = ((t - 13.4) * .8 + i / 3) % 1; ring3(g, c, 628, -1092, 12, 8 + u * 60, COL.amber, (1 - u) * .5 * fade, 1); } // her last notes, rippling out
      if (t < 1.6) api.fx.white = Math.max(api.fx.white, 1 - ease(t / 1.6));
      if (t > 16) api.fx.fade = ease((t - 16) / .9);
    },
  };
  const quietScene = {
    id: 'quiet', dur: 6.5, lines: [{ at: 1.4, text: 'Then it stopped. All of it.' }],
    cues: [{ at: .6, fn: () => A.heart(.25) }],
    draw(g, t, api) { if (t > 5.4) api.fx.fade = ease((t - 5.4) / 1); },
  };
  const endScene = {
    id: 'end1', dur: 9.5, lines: [{ at: 1.4, text: 'I can’t see the sound anymore.' }, { at: 5, text: 'But I can still hear her.' }],
    cues: [{ at: 6.8, fn: () => A.motif(.05, .7) }],
    draw(g, t, api) { if (t > 8.6) api.fx.fade = ease((t - 8.6) / .9); },
  };
  const endCard = {
    id: 'endcard', dur: 8.5, lines: [], cues: [], noFadeOut: true,
    draw(g, t, api) { if (t > 7.3) api.fx.fade = ease((t - 7.3) / 1.1); },
    overlay(t) {
      const a1 = ease((t - .5) / 1.4), a2 = ease((t - 2.4) / 1), a3 = ease((t - 4) / 1);
      return h('div', { className: 'pr-titlecard' },
        h('div', { className: 'pr-logo', style: { opacity: a1, letterSpacing: `${lerp(.9, .38, a1)}em` } }, 'ECH', h('span', { className: 'pr-o' })),
        h('div', { className: 'pr-tag', style: { opacity: a2, letterSpacing: '12px' } }, 'THE END'),
        h('div', { className: 'pr-lvl', style: { opacity: a3, fontSize: '15px' } }, h('span', null, 'ISSUES #1 – #3'), ' THANK YOU FOR LISTENING'));
    },
  };
  const stingerScene = { // after the credits: six months later, a heart monitor, and all four notes, the fourth one too
    id: 'stinger', dur: 15.5, noFadeOut: true,
    lines: [{ at: 10.6, who: 'LENA', text: '“So you’ll always find your way home.”' }],
    cues: [...[1.4, 2.6, 3.8, 5, 6.2, 7.4, 8.6, 9.8, 11, 12.2].map(at => ({ at, fn: () => { if (A.ok()) tone({ vol: .05, dur: .12, f0: 1046.5, type: 'sine', echo: .25 }); } })),
      { at: 6.4, fn: () => A.hum(.09, .6, 0, 4) }],
    draw(g, t, api) {
      const { W, H } = api, y = H * .56, x0 = W * .18, x1 = W * .82, head = x0 + ((t * .16) % 1) * (x1 - x0);
      g.save(); g.globalCompositeOperation = 'lighter'; g.lineWidth = 2; g.strokeStyle = rgba(COL.red, .75 * ease(t / 1.5) * (1 - ease((t - 13.6) / 1.2)));
      g.beginPath();
      for (let x = x0; x <= head; x += 3) { // the trace: flat, with a beat every 1.2 s
        const ph = ((x - x0) / (x1 - x0) / .16) % 1.2, b = ph > .5 && ph < .62 ? Math.sin((ph - .5) / .12 * PI * 2) * 34 : 0;
        x === x0 ? g.moveTo(x, y - b) : g.lineTo(x, y - b);
      }
      g.stroke(); g.restore();
      const eo = ease((t - 12.4) / .5) * (1 - ease((t - 14.2) / .6)); // after her line: two slits open in the dark
      if (eo > .01) {
        g.save(); g.globalCompositeOperation = 'lighter';
        for (const k of [-1, 1]) {
          const x = W / 2 + k * 26, ey = H * .36, gr = g.createRadialGradient(x, ey, 0, x, ey, 40);
          gr.addColorStop(0, rgba(COL.red, .55 * eo)); gr.addColorStop(1, rgba(COL.red, 0)); g.fillStyle = gr; g.fillRect(x - 40, ey - 40, 80, 80);
          g.fillStyle = `rgba(255,240,240,${eo})`; g.beginPath(); g.ellipse(x, ey, 15 * eo, 2.2, k * -.16, 0, TAU); g.fill();
        }
        g.restore();
      }
      if (t > 13.8) api.fx.fade = ease((t - 13.8) / 1.1);
    },
    overlay(t) {
      const a = ease((t - .4) / 1) * (1 - ease((t - 4.4) / 1));
      return h('div', { className: 'pr-titlecard' }, h('div', { className: 'pr-lvl', style: { opacity: a, fontSize: '16px', letterSpacing: '10px' } }, 'SIX MONTHS LATER'));
    },
  };
  const SETS = {
    interlude: { label: 'INTERLUDE  ·  THE NAME ABOVE', scenes: [
      roofScene('ledger', 'THE LAST PAGE', 'AFTER THE ARCHIVE', [
        { at: 1.6, who: 'MARCUS', text: 'Kade’s name is on the last page. Above it, there’s no name at all.' },
        { at: 6.4, who: 'ECHO', text: 'Then what’s there?' },
        { at: 8.6, who: 'MARCUS', text: 'A mark. A circle, with a line through it.' },
        { at: 12.2, who: 'ECHO', text: 'The Quiet’s mark. Someone sits above the Conductor.' },
      ], 16),
      towerScene, // the chapter card rides on the tower; the throne room carries straight on from it
      hallScene({ id: 'hall1', dur: 17, walk: 6.5, eyesAt: 11.2, walkerCol: COL.red, walkerStyle: { helmet: true },
        lines: [
          { at: 7.4, who: 'GUARD', text: 'The Conductor is dead. The blind man has the ledger.' },
          { at: 12.4, who: 'THRONE', text: 'Then let him listen.' },
        ],
        hum: [14, 14.55, 15.1], // three of her four notes. Never the fourth.
        cues: [...Array.from({ length: 12 }, (_, i) => ({ at: i * .55, fn: () => A.step(.18) })), { at: 11.2, fn: () => A.heart(.35) }, { at: 14, fn: () => A.hum(.1, .55, 0, 3) }],
      }),
    ] },
    finale: { label: 'FINALE  ·  THE LAST SONG', scenes: [overloadScene, memoryScene, quietScene] },
    theend: { label: 'ECHO  ·  THE END', scenes: [endScene, endCard, stingerScene] },
    epilogue: { label: 'EPILOGUE  ·  THE CHOIR', scenes: [
      roofScene('manifest', 'THE MANIFEST', 'AFTER THE FOUNDRY', [
        { at: 1.6, who: 'MARCUS', text: 'The manifest isn’t a list of the dead, Elias. It’s a list of singers.' },
        { at: 6.8, who: 'ECHO', text: 'Singers.' },
        { at: 8.6, who: 'MARCUS', text: 'Forty names. One choir. And every one of them answers to the mark.' },
        { at: 13.4, who: 'ECHO', text: 'Then I’ll find who’s conducting it.' },
      ], 17),
      hallScene({ id: 'hall2', dur: 22, chapter: 'THE ONE ABOVE', kicker: 'MEANWHILE', walk: 6.5, eyesAt: 10.6, hum: [13, 13.55, 14.1], rise: 14.6, push: 17.4,
        walkerCol: COL.white, walkerStyle: { hair: 'long', coat: true, wind: 2 },
        lines: [
          { at: 7.4, who: 'MASK', text: 'He knows my voice now.' },
          { at: 10.8, who: 'THRONE', text: 'Good. Let him follow it home.' },
        ],
        cues: [...Array.from({ length: 12 }, (_, i) => ({ at: i * .55, fn: () => A.step(.14) })), { at: 10.6, fn: () => A.heart(.35) },
          { at: 13, fn: () => A.hum(.11, .55, 0, 3) }, { at: 17.6, fn: () => A.thunder(.5) }],
      }),
      { id: 'tbc', dur: 7, lines: [], noFadeOut: true, cues: [{ at: .4, fn: () => SCORE && SCORE.hit(.8) }],
        draw(g, t, api) { if (t > 5.8) api.fx.fade = ease((t - 5.8) / 1.1); },
        overlay(t) {
          const a1 = ease((t - .4) / 1), a2 = ease((t - 1.8) / 1);
          return h('div', { className: 'pr-titlecard' },
            h('div', { className: 'pr-tag', style: { opacity: a1, letterSpacing: '10px' } }, 'TO BE CONTINUED'),
            h('div', { className: 'pr-lvl', style: { opacity: a2, fontSize: '22px' } }, h('span', null, 'ECHO #3'), ' THE CHOIR'));
        } },
    ] },
  };

  // =====================================================================
  //  REACT
  // =====================================================================
  const CSS = `
  .pr-root{position:fixed;inset:0;z-index:50;background:#000;cursor:pointer;color:#e2f2ff;
    font-family:Rajdhani,"Segoe UI",sans-serif;opacity:1;transition:opacity .9s ease;user-select:none;overflow:hidden}
  .pr-root.pr-in{animation:prFade 1.2s ease}
  .pr-root.pr-leave{opacity:0}
  .pr-canvas{position:absolute;inset:0;width:100%;height:100%}
  .pr-bar{position:absolute;left:0;right:0;height:10vh;background:#000;z-index:2}
  .pr-top{top:0;animation:prBarT 1.4s cubic-bezier(.2,.8,.2,1)} .pr-bot{bottom:0;animation:prBarB 1.4s cubic-bezier(.2,.8,.2,1)}
  .pr-card{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
  .pr-card small{font-size:12px;letter-spacing:10px;color:rgba(80,225,255,.8)}
  .pr-card b{margin-top:14px;font-size:clamp(28px,4vw,54px);font-weight:600;letter-spacing:.42em;padding-left:.42em;color:#eaf6ff;text-shadow:0 0 28px rgba(80,225,255,.45)}
  .pr-card i{display:block;height:1px;margin-top:18px;background:linear-gradient(90deg,transparent,#50e1ff,transparent)}
  .pr-chapter{position:absolute;top:calc(10vh + 24px);left:52px;z-index:3;font-size:11px;letter-spacing:6px;color:rgba(80,225,255,.7)}
  .pr-chapter b{display:block;margin-top:5px;font-size:16px;font-weight:600;letter-spacing:8px;color:rgba(226,242,255,.85)}
  .pr-subs{position:absolute;left:8%;right:8%;bottom:calc(10vh + 34px);text-align:center;z-index:3;min-height:70px}
  .pr-line{display:inline-block;padding:10px 26px;font-size:clamp(18px,2vw,29px);font-weight:500;letter-spacing:1.2px;line-height:1.35;
    text-shadow:0 0 22px rgba(80,225,255,.35),0 2px 0 #000;background:radial-gradient(ellipse at center,rgba(0,0,0,.55),transparent 72%)}
  .pr-line .scr{color:#50e1ff;opacity:.7}
  .pr-who{display:block;font-size:11px;font-weight:700;letter-spacing:8px;margin-bottom:8px}
  .pr-who.MARCUS,.pr-who.LENA{color:#ffb040}.pr-who.ECHO{color:#50e1ff}.pr-who.THRONE,.pr-who.GUARD{color:#ff3048}.pr-who.MASK{color:#c89cff}.pr-who.CANTOR{color:#ff4a6e}
  .pr-line.THRONE{text-shadow:0 0 26px rgba(255,48,72,.55),0 2px 0 #000;letter-spacing:3px}
  .pr-line.MARCUS,.pr-line.LENA{text-shadow:0 0 22px rgba(255,176,64,.35),0 2px 0 #000}
  .pr-hint{position:absolute;right:44px;bottom:3.6vh;z-index:3;font-size:11px;letter-spacing:4px;color:rgba(226,242,255,.45);display:flex;align-items:center;gap:12px}
  .pr-hint svg{width:22px;height:22px}
  .pr-dots{position:absolute;left:52px;bottom:4.2vh;z-index:3;display:flex;gap:6px}
  .pr-dots i{width:18px;height:2px;background:rgba(226,242,255,.15);transition:background .4s}
  .pr-dots i.done{background:rgba(80,225,255,.55)} .pr-dots i.on{background:#50e1ff;box-shadow:0 0 8px #50e1ff}
  .pr-label{position:absolute;left:52px;top:3.6vh;z-index:3;font-size:11px;letter-spacing:6px;color:rgba(226,242,255,.4)}
  .pr-time{position:absolute;right:44px;top:3.6vh;z-index:3;font-size:11px;letter-spacing:3px;color:rgba(226,242,255,.35);font-family:"Share Tech Mono",monospace}
  .pr-titlecard{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:6vh}
  .pr-logo{font-size:clamp(64px,10vw,150px);font-weight:500;color:#eaf6ff;text-shadow:0 0 30px rgba(80,225,255,.5);display:flex;align-items:center;padding-left:.38em}
  .pr-logo.glitch{animation:prGlitch .12s steps(2) infinite}
  .pr-o{display:inline-block;width:.72em;height:.72em;border-radius:50%;border:.045em solid #50e1ff;box-shadow:0 0 24px #50e1ff,inset 0 0 18px rgba(80,225,255,.5);position:relative}
  .pr-o::after{content:"";position:absolute;inset:26%;border-radius:50%;border:.07em solid #50e1ff;box-shadow:0 0 16px #50e1ff}
  .pr-tag{margin-top:26px;font-size:clamp(16px,1.7vw,24px);letter-spacing:5px;color:#50e1ff;text-shadow:0 0 16px rgba(80,225,255,.5)}
  .pr-lvl{margin-top:44px;font-size:14px;letter-spacing:8px;color:rgba(226,242,255,.7)}
  .pr-lvl span{color:#ffb040;margin-right:14px}
  @keyframes prFade{from{opacity:0}to{opacity:1}}
  @keyframes prBarT{from{transform:translateY(-100%)}to{transform:none}}
  @keyframes prBarB{from{transform:translateY(100%)}to{transform:none}}
  @keyframes prGlitch{0%{transform:translate(-3px,1px);text-shadow:3px 0 #ff3048,-3px 0 #50e1ff}50%{transform:translate(3px,-1px);text-shadow:-3px 0 #ff3048,3px 0 #50e1ff}100%{transform:none}}
  `;

  const CPS = 34; // typewriter characters per second
  const GLYPHS = '▮▯░▒/\\|<>_-=+#';
  function lineState(sc, t) {
    const L = sc.lines;
    for (let i = L.length - 1; i >= 0; i--) {
      const ln = L[i]; if (t < ln.at) continue;
      const end = i + 1 < L.length ? L[i + 1].at - .15 : sc.dur - .3;
      if (t > end) return null;
      const n = Math.floor((t - ln.at) * CPS);
      return { ...ln, i, n, typing: n < ln.text.length, alpha: Math.min(1, (t - ln.at) / .25, (end - t) / .35) };
    }
    return null;
  }
  const WHO_NAME = { THRONE: '·  ·  ·', MASK: 'THE MIMIC', GUARD: 'QUIET SOLDIER', CANTOR: 'THE CANTOR' };
  function Subtitle({ line, t }) {
    if (!line) return null;
    const shown = line.text.slice(0, line.n);
    let scr = '';
    if (line.typing) for (let k = 0; k < Math.min(4, line.text.length - line.n); k++) scr += line.text[line.n + k] === ' ' ? ' ' : GLYPHS[Math.floor((t * 30 + k * 7) % GLYPHS.length)];
    return h('div', { className: 'pr-line ' + (line.who || ''), key: line.i, style: { opacity: Math.max(0, line.alpha) } },
      line.who && h('span', { className: 'pr-who ' + line.who }, WHO_NAME[line.who] || line.who), shown, scr && h('span', { className: 'scr' }, scr));
  }
  function SkipRing({ k }) {
    const r = 9, c = 2 * PI * r;
    return h('svg', { viewBox: '0 0 22 22' },
      h('circle', { cx: 11, cy: 11, r, fill: 'none', stroke: 'rgba(226,242,255,.2)', strokeWidth: 1.5 }),
      h('circle', { cx: 11, cy: 11, r, fill: 'none', stroke: '#50e1ff', strokeWidth: 2, strokeDasharray: c, strokeDashoffset: c * (1 - k), transform: 'rotate(-90 11 11)' }));
  }
  function ChapterCard({ sc, si, t }) {
    if (!sc.chapter || t > 2.6) return null;
    const a = Math.min(ease(t / .5), 1 - ease((t - 1.9) / .6));
    return h('div', { className: 'pr-card', style: { opacity: a } },
      h('small', null, sc.kicker || 'CHAPTER ' + String(si).padStart(2, '0')),
      h('b', { style: { letterSpacing: `${lerp(.7, .42, ease(t / 1.4))}em` } }, sc.chapter),
      h('i', { style: { width: `${ease(t / 1.2) * 320}px` } }));
  }

  // ---------- post: bloom, glitch, grain, vignette ----------
  function makePost() {
    const buf = document.createElement('canvas'), b1 = document.createElement('canvas'), b2 = document.createElement('canvas');
    const grain = document.createElement('canvas'); grain.width = grain.height = 200;
    const gx = grain.getContext('2d'), id = gx.createImageData(200, 200);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    gx.putImageData(id, 0, 0);
    return { buf, bx: buf.getContext('2d'), b1, b1x: b1.getContext('2d'), b2, b2x: b2.getContext('2d'), grain };
  }
  function composite(ctx, post, W, H, d, fx) {
    const { buf, b1, b1x, b2, b2x } = post;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, buf.width, buf.height);
    ctx.drawImage(buf, 0, 0);
    b1x.globalCompositeOperation = 'copy'; b1x.filter = 'blur(2px)'; b1x.drawImage(buf, 0, 0, b1.width, b1.height);
    b2x.globalCompositeOperation = 'copy'; b2x.filter = 'blur(2px)'; b2x.drawImage(b1, 0, 0, b2.width, b2.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = .8; ctx.drawImage(b1, 0, 0, buf.width, buf.height);
    ctx.globalAlpha = 1; ctx.drawImage(b2, 0, 0, buf.width, buf.height);
    if (fx.glitch > .02) {
      ctx.globalCompositeOperation = 'source-over';
      const n = 3 + Math.floor(fx.glitch * 12);
      for (let i = 0; i < n; i++) {
        const y = Math.random() * buf.height, hh = (3 + Math.random() * 28) * d, off = (Math.random() - .5) * 80 * fx.glitch * d;
        ctx.drawImage(buf, 0, y, buf.width, hh, off, y, buf.width, hh);
      }
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * fx.glitch;
      ctx.drawImage(buf, 6 * fx.glitch * d, 0); ctx.drawImage(buf, -6 * fx.glitch * d, 0);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (fx.invert) { ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, buf.width, buf.height); ctx.globalCompositeOperation = 'source-over'; } // anime impact frame
    ctx.setTransform(d, 0, 0, d, 0, 0);
    if (fx.white > 0) { ctx.fillStyle = `rgba(255,255,255,${fx.white})`; ctx.fillRect(0, 0, W, H); }
    ctx.globalAlpha = .05; ctx.globalCompositeOperation = 'lighter';
    const pat = ctx.createPattern(post.grain, 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix([1, 0, 0, 1, Math.random() * 200, Math.random() * 200]));
    ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .28, W / 2, H / 2, Math.max(W, H) * .75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.88)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
    if (fx.fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fx.fade})`; ctx.fillRect(0, 0, W, H); }
  }

  function Prologue({ onDone, scenes, label }) {
    const SCENES = scenes;
    const [si, setSi] = useState(0);
    const [t, setT] = useState(0);
    const [skipK, setSkipK] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const canvasRef = useRef(null);
    const st = useRef(null);

    useEffect(() => {
      const s = st.current = { si: 0, t0: performance.now(), fired: new Set(), exit: null, done: false, spaceDown: null, mem: {}, last: 0 };
      const finish = () => {
        if (s.done) return; s.done = true;
        if (s.exit) s.exit(); s.exit = null;
        if (window.echoVoiceStop) window.echoVoiceStop();
        setLeaving(true); setTimeout(onDone, 900);
      };
      const go = n => {
        if (s.done) return;
        if (s.exit) s.exit(); s.exit = null;
        if (n >= SCENES.length) return finish();
        s.si = n; s.t0 = performance.now(); s.fired = new Set(); s.mem = {}; s.last = 0; s.spoken = new Set();
        if (window.echoVoiceStop) window.echoVoiceStop();
        setSi(n); setT(0);
        if (SCENES[n].enter) s.exit = SCENES[n].enter(s.mem) || null;
      };
      s.go = go; s.finish = finish;
      go(0);
      // dev hook: jump to (scene, time) and optionally hold the frame
      window.__prSeek = (n, tt, hold) => { go(n); s.t0 = performance.now() - tt * 1000; s.last = tt; s.hold = hold ? tt : null; };

      const cv = canvasRef.current, ctx = cv.getContext('2d'), post = makePost();
      const size = () => {
        const d = Math.min(devicePixelRatio || 1, 2); s.dpr = d;
        // never 0×0 (a hidden or minimised window would make drawImage throw and kill the loop)
        const w = Math.max(16, innerWidth), hh = Math.max(16, innerHeight);
        cv.width = post.buf.width = w * d; cv.height = post.buf.height = hh * d;
        post.b1.width = Math.ceil(w / 4); post.b1.height = Math.ceil(hh / 4);
        post.b2.width = Math.ceil(w / 10); post.b2.height = Math.ceil(hh / 10);
      };
      size(); addEventListener('resize', size);

      let raf;
      const loop = now => {
        if (s.hold != null) s.t0 = now - s.hold * 1000;
        const sc = SCENES[s.si], tt = (now - s.t0) / 1000, dt = Math.min(.05, Math.max(0, tt - s.last)); s.last = tt;
        sc.cues.forEach((c, i) => { if (tt >= c.at && !s.fired.has(i)) { s.fired.add(i); try { c.fn(); } catch (e) {} } });
        // voice: each subtitle line is spoken once, as it appears (narration is Elias)
        const vl = lineState(sc, tt);
        if (vl && !s.spoken.has(vl.i) && tt - vl.at < .4) { s.spoken.add(vl.i); if (window.echoSpeak) window.echoSpeak(vl.who || 'ECHO', vl.text, { ch: 'prologue' }); }
        const W = innerWidth, H = innerHeight, d = s.dpr, g = post.bx;
        g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
        g.fillStyle = '#000'; g.fillRect(0, 0, post.buf.width, post.buf.height);
        g.setTransform(d, 0, 0, d, 0, 0); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
        const fx = { glitch: 0, white: 0, fade: 0, invert: 0 };
        try { sc.draw(g, tt, { W, H, dpr: d, dt, m: s.mem, fx, currentLine: lineState(sc, tt) }); } catch (e) { console.error(e); }
        if (!sc.noFadeIn) fx.fade = Math.max(fx.fade, 1 - ease(tt / .8));
        if (!sc.noFadeOut) fx.fade = Math.max(fx.fade, ease((tt - (sc.dur - .7)) / .7));
        composite(ctx, post, W, H, d, fx);
        if (s.spaceDown) { const k = Math.min(1, (now - s.spaceDown) / 900); setSkipK(k); if (k >= 1) finish(); }
        setT(tt);
        if (tt >= sc.dur) go(s.si + 1);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const kd = e => {
        if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) s.spaceDown = performance.now(); }
        else if (e.code === 'Escape') finish();
        else if ((e.code === 'Enter' || e.code === 'ArrowRight') && !e.repeat) go(s.si + 1);
      };
      const ku = e => { if (e.code === 'Space') { s.spaceDown = null; setSkipK(0); } };
      addEventListener('keydown', kd); addEventListener('keyup', ku);
      return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('keydown', kd); removeEventListener('keyup', ku); if (s.exit) s.exit(); };
    }, []);

    const sc = SCENES[si];
    const total = SCENES.reduce((a, b) => a + b.dur, 0), elapsed = SCENES.slice(0, si).reduce((a, b) => a + b.dur, 0) + t;
    const mmss = x => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
    return h('div', { className: 'pr-root pr-in' + (leaving ? ' pr-leave' : ''), onMouseDown: () => st.current && st.current.go(st.current.si + 1) },
      h('canvas', { ref: canvasRef, className: 'pr-canvas' }),
      h('div', { className: 'pr-bar pr-top' }), h('div', { className: 'pr-bar pr-bot' }),
      h('div', { className: 'pr-label' }, label),
      h('div', { className: 'pr-time' }, `${mmss(elapsed)} / ${mmss(total)}`),
      h(ChapterCard, { sc, si, t }),
      sc.chapter && t > 2.4 && h('div', { className: 'pr-chapter', key: 'ch' + si, style: { opacity: ease((t - 2.4) / .8) } }, sc.kicker || 'CHAPTER ' + String(si).padStart(2, '0'), h('b', null, sc.chapter)),
      h('div', { className: 'pr-subs' }, h(Subtitle, { line: lineState(sc, t), t })),
      sc.overlay && sc.overlay(t),
      h('div', { className: 'pr-dots' }, SCENES.map((_, i) => h('i', { key: i, className: i < si ? 'done' : i === si ? 'on' : '' }))),
      h('div', { className: 'pr-hint' }, 'CLICK  NEXT   ·   HOLD SPACE  SKIP', h(SkipRing, { k: skipK })));
  }

  // ---------- the cliffhanger score: horror, not melody ----------
  // a beating sub drone, a dark dissonant string cluster that breathes, beating glass tones, a slow heartbeat,
  // and on cue: a rising swell that cuts to silence, then a deep "braam" hit
  let SCORE = null;
  function hauntingScore() {
    if (!A.ok()) return null;
    const X = AU.ctx, t0 = X.currentTime, out = X.createGain(), nodes = [];
    out.gain.setValueAtTime(.0001, t0); out.gain.exponentialRampToValueAtTime(.8, t0 + 5);
    const lim = X.createDynamicsCompressor(); lim.threshold.value = -9; lim.knee.value = 10; lim.ratio.value = 8; lim.attack.value = .01; lim.release.value = .6;
    out.connect(lim); lim.connect(AU.musVol || AU.sfx || AU.master); // the music slider, then the sfx bus, so it ducks under every spoken line
    const keep = n => (nodes.push(n), n);
    const osc = (type, f, det = 0, when) => { const o = X.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(when); return keep(o); };
    const gain = (v, to) => { const g = X.createGain(); g.gain.value = v; if (to) g.connect(to); return g; };
    const filt = (type, f, q, to) => { const b = X.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (to) b.connect(to); return b; };
    const lfo = (rate, depth, param) => { const o = osc('sine', rate); o.connect(gain(depth, param)); };
    // a dark six-second hall: reverb noise that loses its highs as it decays
    const len = Math.floor(X.sampleRate * 6), ir = X.createBuffer(2, len, X.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < len; i++) { const k = i / len; lp += ((Math.random() * 2 - 1) - lp) * (.9 - .8 * k); d[i] = lp * Math.pow(1 - k, 2.2); } }
    const conv = X.createConvolver(); conv.buffer = ir; conv.connect(gain(1.1, out));
    const bus = gain(1); bus.connect(gain(.5, out)); bus.connect(filt('highpass', 110, .7, conv)); // keep the lows out of the reverb
    // 1. the floor: two sub sines a fraction apart, beating slowly, under a dark low drone
    const sub = gain(.07, bus); osc('sine', 36.71).connect(sub); osc('sine', 37.6).connect(sub);
    const low = osc('triangle', 73.42); low.connect(gain(.12, filt('lowpass', 160, .7, bus))); lfo(.02, 20, low.detune);
    // 2. strings that can't resolve: D, E-flat, A-flat, A held together — no tremolo, just a slow breath in and out
    const strLp = filt('lowpass', 750, .5, bus), swell = gain(.5, strLp);
    lfo(.035, .45, swell.gain); lfo(.013, 250, strLp.frequency);
    for (const f of [73.42, 146.83, 155.56, 207.65, 220]) for (const d of [-6, 6]) osc('sawtooth', f, d).connect(gain(.03, swell));
    // 3. glass: pure high tones in close pairs, beating against each other, fading in and out
    for (const [f, beat, rate] of [[880, 1.3, .027], [1244.5, .8, .019], [1661.2, 1.1, .023]]) {
      const g = gain(.016, bus); osc('sine', f).connect(g); osc('sine', f + beat).connect(g);
      lfo(rate, .016, g.gain); // swells between silence and full
    }
    // 4. a slow heartbeat, far below
    const thud = (when, v) => {
      const o = X.createOscillator(); o.frequency.setValueAtTime(55, when); o.frequency.exponentialRampToValueAtTime(30, when + .35);
      const g = gain(0, bus); g.gain.setValueAtTime(.0001, when); g.gain.exponentialRampToValueAtTime(v, when + .03); g.gain.exponentialRampToValueAtTime(.0001, when + .7);
      o.connect(g); o.start(when); o.stop(when + .75);
    };
    let tnext = t0 + 4;
    const timer = setInterval(() => { while (tnext < X.currentTime + 1) { thud(tnext, .22); thud(tnext + .34, .14); tnext += 2.6; } }, 250);
    // the dread swell: the cluster slides slowly upward and opens up, then cuts to silence
    const rise = (dur = 3.5) => {
      const w = X.currentTime, end = w + dur, lp = filt('lowpass', 500, .7, bus), g = gain(0, lp);
      g.gain.setValueAtTime(.0001, w); g.gain.exponentialRampToValueAtTime(1, end - .05); g.gain.setValueAtTime(.0001, end);
      lp.frequency.setValueAtTime(500, w); lp.frequency.exponentialRampToValueAtTime(3200, end);
      for (const f of [146.83, 155.56, 207.65, 220, 311.13]) {
        const o = X.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, w); o.frequency.exponentialRampToValueAtTime(f * 2, end);
        o.connect(gain(.03, g)); o.start(w); o.stop(end + .02);
      }
    };
    // the hit: a deep, warm brass blast that sinks away, over a falling sub
    const hit = (v = .8) => {
      const w = X.currentTime, ws = X.createWaveShaper(), curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 1.6); } ws.curve = curve;
      const lp = filt('lowpass', 900, .7, bus), g = gain(0, lp);
      g.gain.setValueAtTime(.0001, w); g.gain.exponentialRampToValueAtTime(.7 * v, w + .06); g.gain.exponentialRampToValueAtTime(.0001, w + 6);
      lp.frequency.setValueAtTime(900, w); lp.frequency.exponentialRampToValueAtTime(140, w + 4.5);
      ws.connect(g);
      for (const f of [36.71, 73.42, 77.78, 110]) for (const d of [-8, 8]) { const o = X.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; o.connect(gain(.25, ws)); o.start(w); o.stop(w + 6.1); }
      const s = X.createOscillator(); s.frequency.setValueAtTime(65, w); s.frequency.exponentialRampToValueAtTime(26, w + 2.5);
      const sg = gain(0, bus); sg.gain.setValueAtTime(.0001, w); sg.gain.exponentialRampToValueAtTime(.4 * v, w + .03); sg.gain.exponentialRampToValueAtTime(.0001, w + 3.2); s.connect(sg); s.start(w); s.stop(w + 3.3);
    };
    const stop = () => {
      clearInterval(timer); const now = X.currentTime;
      out.gain.cancelScheduledValues(now); out.gain.setValueAtTime(Math.max(out.gain.value, .0001), now); out.gain.exponentialRampToValueAtTime(.0001, now + 3);
      setTimeout(() => { nodes.forEach(n => { try { n.stop(); } catch (e) {} }); try { lim.disconnect(); } catch (e) {} }, 3300);
    };
    return { stop, rise, hit };
  }

  // ---------- public API ----------
  let root = null, host = null;
  // give every voiced line room to finish: push later lines back and stretch the scene if needed
  function voiceRetime(list) {
    const V = window.VO_LINES; if (!V) return;
    for (const sc of list || SCENES) {
      if (!sc.lines || !sc.lines.length) continue;
      sc.dur0 = sc.dur0 ?? sc.dur;
      let shift = 0, prevEnd = 0;
      for (const ln of sc.lines) {
        ln.at0 = ln.at0 ?? ln.at;
        let at = ln.at0 + shift;
        if (at < prevEnd) { shift += prevEnd - at; at = prevEnd; }
        ln.at = at;
        const e = V[(ln.who || 'ECHO') + '|' + ln.text];
        prevEnd = at + (e ? e.d : 1.5) + .35;
      }
      sc.dur = Math.max(sc.dur0, prevEnd + .6);
    }
  }
  function mount(scenes, label, onDone, music) {
      voiceRetime(scenes);
      const score = SCORE = music ? hauntingScore() : null;
      if (!document.getElementById('pr-style')) { const st = document.createElement('style'); st.id = 'pr-style'; st.textContent = CSS; document.head.appendChild(st); }
      host = document.createElement('div'); host.id = 'prologue-root'; document.body.appendChild(host);
      root = ReactDOM.createRoot(host);
      root.render(h(Prologue, {
        scenes, label,
        onDone: () => { if (score) { score.stop(); if (SCORE === score) SCORE = null; } const r = root, hh = host; root = host = null; setTimeout(() => { r.unmount(); hh.remove(); }, 0); onDone && onDone(); },
      }));
  }
  window.EchoPrologue = {
    play(onDone) { mount(SCENES, 'PROLOGUE  ·  THE LAST THING I SAW', onDone); },
    playSet(name, onDone) { const S = SETS[name]; if (!S) return onDone && onDone(); mount(S.scenes, S.label, onDone, true); }, // interlude / epilogue, with the score
    score: () => SCORE, // debug handle
    engine: { camera, P, L3, F3, ring3, dot3, actor, COL }, // the game borrows the wireframe engine for its side-on shots
  };
})();
