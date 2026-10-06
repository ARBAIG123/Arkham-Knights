// =====================================================================
//  ECHO — TOP-DOWN ENEMY MODELS, SECOND PASS
//  Same rim-lit neon language, built to read at 30px: a key light that gives
//  every body volume, arms on the unarmed, and silhouettes you can tell apart
//  at a glance (the Conductor's tailcoat, the Resonant's fork, a real hound).
// =====================================================================
(function () {
  'use strict';
  const KEY = -2.25; // the light comes from the top-left of the screen, whichever way they face
  const isEnemy = () => RC !== RIM.player;
  const facing = () => (CUR && CUR.a) || 0;
  // a soft highlight on the edge facing the light: turns flat discs into round shoulders and skulls
  function keyLight(cx, cy, rx, ry, w) {
    const la = KEY - facing();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(RC.glow, .32); ctx.lineWidth = w || 1.6;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, la - .85, la + .85); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,240,244,.28)'; ctx.lineWidth = (w || 1.6) * .45;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, la - .45, la + .45); ctx.stroke();
    ctx.restore();
  }
  const phase = () => (CUR && CUR.ph) || 0, moving = () => Math.min(1, (CUR && CUR.mv) || 0);

  // ---------- torsos ----------
  { const f = drawTorso; drawTorso = function (k) {
    if (!isEnemy() || k === 'clone' || k === 'cantor') return f(k);
    const w = HALFW[k] || 15.5;
    if (k === 'boss') { // the Conductor: tailcoat tails swinging behind, a high collar, a baton-white sash
      const sw = Math.sin(phase()) * 1.6 * moving(), fl = Math.sin(realT * 3) * .5;
      // the tailcoat, flaring out behind him as one panel, split up the middle
      ctx.beginPath(); ctx.moveTo(-2, -w * .9); ctx.quadraticCurveTo(-11, -w * 1.05, -16 - fl, -w * .62 + sw);
      ctx.quadraticCurveTo(-18 - fl, -w * .2 + sw, -14.5 - fl, sw * .5); ctx.quadraticCurveTo(-18 - fl, w * .2 + sw, -16 - fl, w * .62 + sw);
      ctx.quadraticCurveTo(-11, w * 1.05, -2, w * .9); ctx.closePath(); body(null, 1.2);
      ctx.strokeStyle = rgba(RC.glow, .45); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-8, sw * .2); ctx.lineTo(-14.5 - fl, sw * .5); // the vent
      for (const s of [-1, 1]) { ctx.moveTo(-6, s * w * .55); ctx.quadraticCurveTo(-11, s * w * .6, -15 - fl, s * w * .5 + sw); } ctx.stroke();
    }
    if (k === 'resonant') { // the fork rides high on its back, tines up past the shoulders
      f('boss'); // the broad barrel chest underneath
      const hum = .55 + .45 * Math.sin(realT * 6);
      ctx.save(); ctx.translate(-9, 0);
      ctx.beginPath(); ctx.moveTo(2, -1.6); ctx.lineTo(-6, -1.6); ctx.lineTo(-6, 1.6); ctx.lineTo(2, 1.6); ctx.closePath(); body(null, 1); // the stem
      ctx.beginPath(); // the U: two tines reaching back
      ctx.moveTo(-5, -8.5); ctx.lineTo(-24, -8.5); ctx.lineTo(-24, -5); ctx.lineTo(-9, -5); ctx.quadraticCurveTo(-6, -5, -6, -2); ctx.lineTo(-6, 2); ctx.quadraticCurveTo(-6, 5, -9, 5);
      ctx.lineTo(-24, 5); ctx.lineTo(-24, 8.5); ctx.lineTo(-5, 8.5); ctx.quadraticCurveTo(-1, 8.5, -1, 4); ctx.lineTo(-1, -4); ctx.quadraticCurveTo(-1, -8.5, -5, -8.5); ctx.closePath();
      ctx.fillStyle = BODY; ctx.fill(); ctx.strokeStyle = `rgba(255,214,140,${.6 + .35 * hum})`; ctx.lineWidth = 1.1; ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,200,120,${.25 * hum})`; ctx.lineWidth = 3.5; // it hums
      ctx.beginPath(); ctx.moveTo(-24, -6.75); ctx.lineTo(-11, -6.75); ctx.moveTo(-24, 6.75); ctx.lineTo(-11, 6.75); ctx.stroke();
      ctx.restore();
      keyLight(0, 0, 8.5, w * .92, 2);
      return;
    }
    if (k === 'heavy') { // the ammo drum on his back, a belt feeding over the shoulder to the gun
      ctx.beginPath(); ctx.ellipse(-13, 0, 6.5, 8.5, 0, 0, TAU); body(null, 1.3);
      ctx.strokeStyle = rgba(RC.glow, .6); ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(-13, 0, 3.6, 5, 0, 0, TAU); ctx.stroke();
    }
    if (k === 'gunner') { // a pack: radio and spare mags
      ctx.beginPath(); ctx.rect(-15, -6.5, 8, 13); body(null, 1.2);
      ctx.strokeStyle = rgba(RC.glow, .55); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-7, 0); ctx.moveTo(-11, -6.5); ctx.lineTo(-11, 6.5); ctx.stroke();
    }
    if (k === 'hunter') { // a short cape over one shoulder
      const fl = Math.sin(realT * 4 + phase()) * 1.2 * (.4 + moving());
      ctx.beginPath(); ctx.moveTo(2, -w * .95); ctx.quadraticCurveTo(-9, -w * 1.05, -14 - fl, -w * .45); ctx.quadraticCurveTo(-13 - fl, 0, -9, w * .25); ctx.lineTo(-3, w * .2); ctx.closePath(); body(null, 1.1);
    }
    f(k);
    if (k === 'heavy') { // the feed belt
      ctx.strokeStyle = rgba(RC.glow, .75); ctx.lineWidth = 2.2; ctx.setLineDash([1.2, 1.4]);
      ctx.beginPath(); ctx.moveTo(-8, w * .45); ctx.quadraticCurveTo(0, w * .75, 8, w * .25); ctx.stroke(); ctx.setLineDash([]);
    }
    if (k === 'boss') {
      ctx.strokeStyle = 'rgba(245,235,240,.85)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(6, -w * .62); ctx.lineTo(-6, w * .62); ctx.stroke(); // the sash
      ctx.beginPath(); ctx.ellipse(2, 0, 3.5, w * .5, 0, -PI * .5, PI * .5); body(null, 1); // the high collar
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-1, s * w * .82, 5.6, 3.6, 0, 0, TAU); body(null, 1.2); ctx.strokeStyle = rgba(RC.glow, .7); ctx.lineWidth = .8; ctx.beginPath(); for (let i = -3; i <= 3; i += 2) { ctx.moveTo(-3 + i, s * w * .82 + s * 2.4); ctx.lineTo(-3 + i, s * w * .82 + s * 4.2); } ctx.stroke(); } // fringed epaulettes
    }
    if (k === 'mirror') for (const s of [-1, 1]) { // shards of glass sewn onto the shoulders
      ctx.save(); ctx.translate(-1, s * w * .78);
      ctx.beginPath(); ctx.moveTo(-4, -s * 1); ctx.lineTo(3, -s * 3.2); ctx.lineTo(4.5, s * 2.6); ctx.lineTo(-2, s * 3.4); ctx.closePath();
      const g = ctx.createLinearGradient(-4, -3, 4, 3); g.addColorStop(0, 'rgba(220,235,250,.9)'); g.addColorStop(1, 'rgba(110,140,170,.8)');
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = .6; ctx.stroke(); ctx.restore();
    }
    const robe = k === 'singer' || k === 'husher';
    keyLight(robe ? -1 : 0, 0, robe ? 9 : 8, w * .9, 2);
  }; }

  // ---------- heads: a highlight for the skull, so they read as round ----------
  { const f = drawHeadTop; drawHeadTop = function (k, o) {
    f(k, o);
    if (!isEnemy() || k === 'cantor' || k === 'clone' || (CUR && CUR.dead)) return;
    keyLight(1, 0, 6.6, 6.6, 1.5);
  }; }
  { const f = drawHeadTop; drawHeadTop = function (k, o) {
    if (isEnemy() && k === 'gunner' && !(CUR && CUR.dead)) { ctx.beginPath(); ctx.ellipse(-.2, 0, 10, 9.2, 0, 0, TAU); body(null, 1.2); } // the helmet's brim, under the dome
    f(k, o);
  }; }

  // ---------- the heavy's gun: a rotary cannon, not a ladder ----------
  { const f = drawGunTop; drawGunTop = function (wp, G, light) {
    if (wp !== 'heavygun' || light) return f(wp, G, light);
    const L = G.len, d = G.wd, spin = realT * 9;
    ctx.beginPath(); ctx.moveTo(-8, -d - 1); ctx.lineTo(L * .42, -d - 1); ctx.quadraticCurveTo(L * .5, 0, L * .42, d + 1); ctx.lineTo(-8, d + 1); ctx.closePath(); body(null, 1.2); // the housing
    for (let i = 0; i < 3; i++) { // three barrels, turning
      const y = Math.sin(spin + i * TAU / 3) * d * .7, z = Math.cos(spin + i * TAU / 3);
      ctx.beginPath(); ctx.rect(L * .42, y - .9, L * .58, 1.8); ctx.fillStyle = BODY; ctx.fill();
      ctx.strokeStyle = rgba(RC.glow, .45 + .45 * z); ctx.lineWidth = .7; ctx.stroke();
    }
    ctx.beginPath(); ctx.rect(L * .8, -d * .95, 2.4, d * 1.9); body(null, .9); // the muzzle clamp
    ctx.strokeStyle = rgba(RC.glow, .55); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-4, -d * .4); ctx.lineTo(L * .3, -d * .4); ctx.moveTo(-4, d * .4); ctx.lineTo(L * .3, d * .4); ctx.stroke();
  }; }

  // ---------- the unarmed: arms of their own ----------
  { const f = drawArmsWeapon; drawArmsWeapon = function (o, k) {
    if (o.weapon !== 'none' || k === 'cantor') return f(o, k);
    const w = HALFW[k] || 15.5, ph = o.ph || 0, m = Math.min(1, o.mv || 0), sing = o.sing || 0;
    const shL = [1, -w * .78], shR = [1, w * .78];
    if (k === 'singer') { // a choir member's hands, folded at the chest; they open as the note rises
      const open = Math.max(sing, m * .25);
      const hL = [16 + open * 2, -1.8 - open * 7], hR = [16 + open * 2, 1.8 + open * 7];
      for (const [sh, hh, s] of [[shL, hL, -1], [shR, hR, 1]]) {
        tube([[sh[0] + 2, sh[1] * .85], [11, s * w * .55], [hh[0] - 2.5, hh[1]]], 5.2); // the sleeve
        hand(hh[0], hh[1]);
      }
      return;
    }
    // the Resonant: long heavy arms that swing like a gorilla's, big hands
    for (const s of [-1, 1]) {
      const sw = Math.sin(ph + (s > 0 ? PI : 0)) * 6 * m, sh = s < 0 ? shL : shR;
      const hx = 10 + sw, hy = s * (w + .5);
      tube([sh, [sh[0] + 4 + sw * .4, s * (w + 2.5)], [hx, hy]], 5.4);
      ctx.beginPath(); ctx.ellipse(hx + 1, hy, 3.4, 2.7, 0, 0, TAU); body(null, 1.2);
      ctx.strokeStyle = rgba(RC.glow, .55); ctx.lineWidth = .6; ctx.beginPath(); for (const k of [-1.2, 0, 1.2]) { ctx.moveTo(hx + 2.4, hy + k); ctx.lineTo(hx + 4, hy + k * 1.1); } ctx.stroke(); // knuckles
    }
  }; }

  // ---------- the hound: a lean, deep-chested dog, not a stick ----------
  { const f = drawHound; drawHound = function (x, y, o) {
    if (!(o.alpha > .01) || o.dead) return f(x, y, o);
    RC = (o.hurt || 0) > .4 ? RIM.hurt : RIM.enemy;
    ctx.save(); ctx.globalAlpha = Math.min(1, o.alpha);
    if (o.additive) ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.translate(x, y); ctx.rotate(o.a || 0);
    const m = clamp(o.mv || 0, 0, 1.3), ph = (o.ph || 0) * 1.7, L = o.lunge ? 5 : 0;
    const flex = Math.sin(ph * 2) * 1.6 * Math.min(1, m); // the spine stretches and gathers at a run
    // legs: a trotting diagonal pair, paws out past the body
    for (const [lx, s, off] of [[8, -1, 0], [8, 1, PI], [-9, -1, PI], [-9, 1, 0]]) {
      const sw = Math.sin(ph + off) * 9 * Math.min(1, m), bx = lx + (lx > 0 ? flex : -flex) * .5;
      const sw2 = Math.sin(ph + off) * 11 * Math.min(1, m);
      const knee = [bx + sw2 * .45, s * 6], paw = [bx + sw2 + 1.5, s * 6.6];
      tube([[bx, s * 3.4], knee, paw], 3.2);
      ctx.beginPath(); ctx.ellipse(paw[0] + 1.2, paw[1], 2.7, 2, 0, 0, TAU); body(null, 1);
    }
    // tail
    const wag = Math.sin(realT * (m > .3 ? 15 : 5)) * 4;
    tube([[-15 - flex, 0], [-19.5 - flex, wag * .5], [-24 - flex, wag]], 2.6);
    // body: deep ribcage up front, narrow hips behind
    ctx.beginPath();
    ctx.moveTo(10 + flex, -6.4); ctx.quadraticCurveTo(-2, -7.6, -10 - flex, -4.6); ctx.quadraticCurveTo(-17 - flex, -3, -17 - flex, 0);
    ctx.quadraticCurveTo(-17 - flex, 3, -10 - flex, 4.6); ctx.quadraticCurveTo(-2, 7.6, 10 + flex, 6.4); ctx.quadraticCurveTo(15 + flex, 0, 10 + flex, -6.4); ctx.closePath();
    const g = ctx.createRadialGradient(2, 0, 1, 0, 0, 16); g.addColorStop(0, '#17222c'); g.addColorStop(1, '#030507');
    ctx.fillStyle = g; ctx.fill(); rimPath(1.5);
    ctx.strokeStyle = rgba(RC.glow, .4); ctx.lineWidth = .8; ctx.beginPath(); // the spine, and the hackles up over the shoulders
    ctx.moveTo(-13 - flex, 0); ctx.quadraticCurveTo(-2, .6, 9 + flex, 0);
    ctx.stroke();
    // neck, head, snout, ears pinned back
    const hx = 17 + flex + L;
    tube([[11 + flex, 0], [hx - 3, 0]], 6);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx - 2, s * 3); ctx.lineTo(hx - 8, s * 6.5); ctx.lineTo(hx - 1, s * 4.6); ctx.closePath(); body(null, .9); }
    ctx.beginPath(); ctx.ellipse(hx, 0, 5.6, 4.6, 0, 0, TAU); body(null, 1.3);
    ctx.beginPath(); ctx.moveTo(hx + 3, -2.6); ctx.quadraticCurveTo(hx + 10, -1.8, hx + 10.5, 0); ctx.quadraticCurveTo(hx + 10, 1.8, hx + 3, 2.6); ctx.closePath(); body(null, 1.1);
    ctx.fillStyle = rgba(RC.glow, .9); ctx.beginPath(); ctx.arc(hx + 10, 0, 1, 0, TAU); ctx.fill(); // the nose: the part that finds you
    ctx.fillStyle = 'rgba(255,215,222,1)'; ctx.beginPath(); ctx.arc(hx + 2.5, -2.2, .9, 0, TAU); ctx.arc(hx + 2.5, 2.2, .9, 0, TAU); ctx.fill();
    const la = KEY - (o.a || 0); // the same key light
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(RC.glow, .3); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(-1, 0, 13, 6.6, 0, la - .8, la + .8); ctx.stroke();
    ctx.restore();
  }; }

  // =====================================================================
  //  THE CHOIR SINGER: a bell of a robe, a white stole, a peaked hood,
  //  an open hymnal held out front — and when the note comes, it pours out of the hood.
  // =====================================================================
  const IVORY = a => `rgba(244,236,222,${a})`, sing = () => (CUR && CUR.sing) || 0;
  { const f = drawTorso; drawTorso = function (k) {
    if (k !== 'singer' || !isEnemy()) return f(k);
    const w = HALFW.singer, ph = phase(), m = moving(), s = sing();
    const sway = Math.sin(ph) * 1.8 * m + Math.sin(realT * 1.7) * .5, swell = s * 2.2; // the hem swings with the walk; the robe swells on the note
    // the robe: narrow at the shoulders, a bell at the hem, scalloped
    ctx.beginPath(); ctx.moveTo(6, -w * .8);
    ctx.quadraticCurveTo(-4, -w * 1.08 - swell, -15, -w * 1.02 - swell + sway * .5);
    const N = 4, hx = -17;
    for (let i = 0; i < N; i++) { // scallops along the back hem
      const y0 = lerp(-w * 1.02 - swell, w * 1.02 + swell, i / N) + sway * .5, y1 = lerp(-w * 1.02 - swell, w * 1.02 + swell, (i + 1) / N) + sway * .5;
      ctx.quadraticCurveTo(hx - 4.5 + Math.sin(realT * 2 + i) * .8, (y0 + y1) / 2, hx + (i === N - 1 ? 2 : 0), y1);
    }
    ctx.quadraticCurveTo(-4, w * 1.08 + swell, 6, w * .8); ctx.quadraticCurveTo(10.5, 0, 6, -w * .8); ctx.closePath();
    const g = ctx.createRadialGradient(-2, 0, 1, -3, 0, w * 1.2); g.addColorStop(0, '#1a1418'); g.addColorStop(.6, '#0c0a0e'); g.addColorStop(1, '#040305');
    ctx.fillStyle = g; ctx.fill(); rimPath(1.5);
    // pleats falling from the shoulders to the hem
    ctx.strokeStyle = rgba(RC.glow, .3); ctx.lineWidth = .7; ctx.beginPath();
    for (const t of [-.7, -.35, .35, .7]) { ctx.moveTo(-2, t * w * .7); ctx.quadraticCurveTo(-9, t * w * .95, hx - 1, t * w * 1.05 + sway * .5); }
    ctx.stroke();
    // the stole: two white bands over the shoulders, fringed tips hanging down the back
    for (const sd of [-1, 1]) {
      const y = sd * 4.6;
      ctx.beginPath(); ctx.moveTo(8.5, y - sd * .2); ctx.lineTo(8.5, y + sd * 2.6); ctx.quadraticCurveTo(-2, y + sd * 3.6, -12, y + sd * 2.4 + sway * .4); ctx.lineTo(-12, y - sd * .4 + sway * .4); ctx.quadraticCurveTo(-2, y + sd * .8, 8.5, y - sd * .2); ctx.closePath();
      ctx.fillStyle = IVORY(.88); ctx.fill(); ctx.strokeStyle = rgba(RC.glow, .55); ctx.lineWidth = .6; ctx.stroke();
      ctx.strokeStyle = IVORY(.7); ctx.lineWidth = .6; ctx.beginPath(); for (let i = 0; i < 4; i++) { const yy = y - sd * .2 + sd * i * .8 + sway * .4; ctx.moveTo(-12, yy); ctx.lineTo(-14, yy + sway * .2); } ctx.stroke(); // fringe
      ctx.strokeStyle = 'rgba(200,60,80,.9)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-6, y + sd * .4); ctx.lineTo(-6, y + sd * 2.6); ctx.moveTo(-7.2, y + sd * 1.5); ctx.lineTo(-4.8, y + sd * 1.5); ctx.stroke(); // a stitched cross on each band
    }
    // the hush mark: a tuning fork stitched between the shoulder blades
    ctx.strokeStyle = rgba(RC.glow, .75); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-7, 0); ctx.moveTo(-7, -1.6); ctx.lineTo(-7, 1.6); ctx.moveTo(-7, -1.6); ctx.lineTo(-10.5, -1.6); ctx.moveTo(-7, 1.6); ctx.lineTo(-10.5, 1.6); ctx.stroke();
    keyLight(-1, 0, 9, w * .95, 2);
  }; }
  { const f = drawArmsWeapon; drawArmsWeapon = function (o, k) {
    if (k !== 'singer' || !isEnemy()) return f(o, k);
    const w = HALFW.singer, s = o.sing || 0, m = Math.min(1, o.mv || 0), bob = Math.sin((o.ph || 0) * 2) * .5 * m;
    // the hymnal: held open in both hands; on the note the right hand leaves it and rises, conducting
    const bx = 13.5 + bob, lift = s;
    const hL = [bx, -6.6], hR = lift > .05 ? [lerp(bx, 9, lift), lerp(6.6, w + 5, lift)] : [bx, 6.6];
    tube([[3, -w * .72], [9, -w * .78], [hL[0] - 2, hL[1]]], 5); // wide sleeves
    tube([[3, w * .72], [9, w * .78], [hR[0] - 2, hR[1]]], 5);
    ctx.save(); ctx.translate(bx + 2.5, 0); ctx.rotate(-lift * .25);
    for (const sd of [-1, 1]) { // two pages, a spine down the middle, lines of hymn
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-3.4, sd * 6.2); ctx.lineTo(3.4, sd * 6.6); ctx.lineTo(3.2, 0); ctx.closePath();
      ctx.fillStyle = IVORY(.92); ctx.fill(); ctx.strokeStyle = rgba(RC.glow, .6); ctx.lineWidth = .6; ctx.stroke();
      ctx.strokeStyle = 'rgba(60,40,48,.55)'; ctx.lineWidth = .45; ctx.beginPath(); for (let i = 1; i <= 3; i++) { ctx.moveTo(-2.2 + i * .1, sd * (1.4 * i + .2)); ctx.lineTo(2.4, sd * (1.4 * i + .4)); } ctx.stroke();
    }
    ctx.restore();
    hand(hL[0], hL[1]); hand(hR[0], hR[1]);
  }; }
  { const f = drawHeadTop; drawHeadTop = function (k, o) {
    if (k !== 'singer' || !isEnemy() || (CUR && CUR.dead)) return f(k, o);
    const s = (o && o.sing) || 0, br = Math.sin(realT * 2.2) * .3;
    // the hood: round over the skull, its peak trailing back over the stole
    ctx.beginPath(); ctx.moveTo(-13 - br, 0); ctx.quadraticCurveTo(-6, -9.6, 1.5, -8); ctx.arc(1.5, 0, 8, -PI / 2, PI / 2); ctx.quadraticCurveTo(-6, 9.6, -13 - br, 0); ctx.closePath();
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 10); g.addColorStop(0, '#201a20'); g.addColorStop(1, '#050406');
    ctx.fillStyle = g; ctx.fill(); rimPath(1.5);
    ctx.strokeStyle = rgba(RC.glow, .35); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.quadraticCurveTo(-4, -.6, 3, 0); ctx.stroke(); // the seam
    // the face is only a dark opening; the mouth is all you see, and it opens on the note
    ctx.beginPath(); ctx.ellipse(6.2, 0, 3, 5, 0, -PI / 2, PI / 2); ctx.fillStyle = '#000'; ctx.fill(); ctx.strokeStyle = rgba(RC.glow, .55); ctx.lineWidth = .7; ctx.stroke();
    const mo = .35 + s * .65;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const mg = ctx.createRadialGradient(7.6, 0, 0, 7.6, 0, 3 + s * 5); mg.addColorStop(0, `rgba(255,${235 - 90 * s},${225 - 110 * s},${.9 * mo})`); mg.addColorStop(1, 'rgba(255,80,100,0)');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(7.6, 0, 3 + s * 5, 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(255,${240 - 80 * s},${235 - 100 * s},${.6 + .4 * s})`; ctx.beginPath(); ctx.ellipse(7.4, 0, .9 + s * 1.2, 1.2 + s * 2.2, 0, 0, TAU); ctx.fill();
    if (s > .05) for (let i = 0; i < 3; i++) { // the note leaving the hood
      const u = (realT * 1.6 + i / 3) % 1, r = 6 + u * 16;
      ctx.strokeStyle = `rgba(255,${210 - 80 * s},${200 - 90 * s},${(1 - u) * Math.min(1, .5 + s)})`; ctx.lineWidth = 1.8 - u;
      ctx.beginPath(); ctx.arc(5, 0, r, -.6, .6); ctx.stroke();
    }
    ctx.restore();
    keyLight(1, 0, 7.4, 7.4, 1.5);
  }; }

  // =====================================================================
  //  ONE SILHOUETTE: each enemy is drawn off-screen as a single figure, then
  //  gets one crisp neon outline around the whole body (and a soft glow);
  //  inside, the parts are separated by thin dim lines instead of a tangle of rims.
  // =====================================================================
  let TD2 = false;
  { const r0 = rimPath; rimPath = function (lw) {
    if (!TD2) return r0(lw);
    if (RC === RIM.player) { ctx.strokeStyle = 'rgba(200,240,255,.8)'; ctx.lineWidth = Math.max(.7, (lw || 1.6) * .6); ctx.stroke(); return; } // Echo keeps his inner edges, like the key art
    ctx.strokeStyle = rgba(RC.glow, .5); ctx.lineWidth = Math.max(.6, (lw || 1.6) * .45); ctx.stroke();
  }; }
  { const t0 = tube; tube = function (p, w) {
    if (!TD2) return t0(p, w);
    ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
    if (p.length === 3) ctx.quadraticCurveTo(p[1][0], p[1][1], p[2][0], p[2][1]); else ctx.lineTo(p[1][0], p[1][1]);
    ctx.strokeStyle = RC === RIM.player ? 'rgba(200,240,255,.75)' : rgba(RC.glow, .5); ctx.lineWidth = w + (RC === RIM.player ? 1.4 : 1.1); ctx.stroke();
    ctx.strokeStyle = BODY; ctx.lineWidth = w; ctx.stroke();
  }; }
  const OA = document.createElement('canvas'), OB = document.createElement('canvas');
  const XA = OA.getContext('2d'), XB = OB.getContext('2d');
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [.71, .71], [-.71, .71], [.71, -.71], [-.71, -.71]];
  function unified(x, y, o, rad, draw) {
    if (window.__noTD2) return draw(o);
    const m = ctx.getTransform(), sc = Math.hypot(m.a, m.b);
    const R = Math.ceil(rad * sc) + 6, n = R * 2;
    if (n > 900) return draw(o); // absurd zoom: just draw it
    const sx = m.a * x + m.c * y + m.e, sy = m.b * x + m.d * y + m.f;
    if (OA.width < n) { OA.width = OA.height = OB.width = OB.height = n; }
    XA.setTransform(1, 0, 0, 1, 0, 0); XA.globalAlpha = 1; XA.globalCompositeOperation = 'source-over'; XA.clearRect(0, 0, n, n);
    XA.setTransform(m.a, m.b, m.c, m.d, m.e - sx + R, m.f - sy + R);
    const old = ctx; ctx = XA; TD2 = true;
    try { draw({ ...o, alpha: 1, noGlow: true }); } finally { ctx = old; TD2 = false; }
    const rc = RC;
    XB.setTransform(1, 0, 0, 1, 0, 0); XB.globalCompositeOperation = 'source-over'; XB.clearRect(0, 0, n, n);
    XB.drawImage(OA, 0, 0, n, n, 0, 0, n, n); XB.globalCompositeOperation = 'source-in'; XB.fillStyle = rc.core; XB.fillRect(0, 0, n, n); XB.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = Math.min(1, o.alpha);
    const lw = Math.max(1, 1.25 * sc);
    if (GQ !== 'low') { // a cheap glow: a soft pool of the rim colour under the figure (no blur filters)
      const gr = R * .62, g = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr);
      g.addColorStop(0, rgba(rc.glow, .16)); g.addColorStop(.55, rgba(rc.glow, .07)); g.addColorStop(1, rgba(rc.glow, 0));
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(sx - gr, sy - gr, gr * 2, gr * 2); ctx.globalCompositeOperation = 'source-over';
    }
    for (const [dx, dy] of (GQ === 'high' ? DIRS : DIRS.slice(0, 4))) ctx.drawImage(OB, 0, 0, n, n, sx - R + dx * lw, sy - R + dy * lw, n, n); // the outline: the silhouette, nudged all round
    ctx.drawImage(OA, 0, 0, n, n, sx - R, sy - R, n, n);
    ctx.restore();
  }
  const SKIP = new Set(['cantor']);
  { const f = drawCharacter; drawCharacter = function (x, y, o) {
    if (!o || o.additive || (o.rim !== 'enemy' && o.kind !== 'player') || SKIP.has(o.kind) || !(o.alpha > .01)) return f(x, y, o);
    const S = (KSCALE[o.kind] || 1) * (o.scale || 1);
    unified(x, y, o, 50 * S, oo => f(x, y, oo));
  }; }
  { const f = drawHound; drawHound = function (x, y, o) {
    if (TD2 || !o || o.additive || !(o.alpha > .01)) return f(x, y, o);
    unified(x, y, o, 44, oo => f(x, y, oo));
  }; }
  { const f = drawFallen; drawFallen = function (x, y, a, o) {
    if (!o || (o.rim !== 'enemy' && o.kind !== 'player') || SKIP.has(o.kind) || !(o.alpha > .01)) return f(x, y, a, o);
    const S = (KSCALE[o.kind] || 1);
    unified(x, y, o, 44 * S, oo => f(x, y, a, oo));
  }; }

  // =====================================================================
  //  ECHO HIMSELF, after the key art: a dark jacket with open lapels and a hem that
  //  swings behind him, both hands on the pistol, a mess of swept-back spikes for hair.
  //  (The clone wears the same body, in red.)
  // =====================================================================
  const isEcho = k => k === 'player' || k === 'clone';
  const ekey = (cx, cy, rx, ry, w) => { // the key light, for him too
    const la = KEY - facing();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(RC.glow, .35); ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, la - .8, la + .8); ctx.stroke();
    ctx.strokeStyle = 'rgba(240,252,255,.3)'; ctx.lineWidth = w * .45; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, la - .4, la + .4); ctx.stroke();
    ctx.restore();
  };
  { const f = drawTorso; drawTorso = function (k) {
    if (!isEcho(k)) return f(k);
    const w = 15.5, m = moving(), sw = Math.sin(phase()) * 1.3 * m, fl = Math.sin(realT * 2.6) * .3;
    // the jacket: square shoulders, a chest, and a hem that flares and swings behind
    ctx.beginPath();
    ctx.moveTo(5.5, -w * .66);
    ctx.quadraticCurveTo(3.5, -w * 1.02, -1, -w * 1.02);            // left shoulder
    ctx.quadraticCurveTo(-6, -w * 1.02, -8.5, -w * .86 + sw * .3);  // down the back
    ctx.quadraticCurveTo(-11.5 - fl, -w * .5 + sw, -11 - fl, sw * .5); // the hem, just showing behind
    ctx.quadraticCurveTo(-11.5 - fl, w * .5 + sw, -8.5, w * .86 + sw * .3);
    ctx.quadraticCurveTo(-6, w * 1.02, -1, w * 1.02);
    ctx.quadraticCurveTo(3.5, w * 1.02, 5.5, w * .66);             // right shoulder
    ctx.quadraticCurveTo(9.5, 0, 5.5, -w * .66);                   // across the chest
    ctx.closePath();
    const g = ctx.createRadialGradient(-1, -2, 1, -2, 0, w * 1.15); g.addColorStop(0, '#1b2731'); g.addColorStop(.55, '#0b1218'); g.addColorStop(1, '#030507');
    ctx.fillStyle = g; ctx.fill(); rimPath(1.6);
    // the shirt in the open V, and the lapels either side of it
    ctx.beginPath(); ctx.moveTo(5.2, -w * .44); ctx.lineTo(9, 0); ctx.lineTo(5.2, w * .44); ctx.quadraticCurveTo(2.2, 0, 5.2, -w * .44); ctx.fillStyle = '#020304'; ctx.fill();
    ctx.strokeStyle = rgba(RC.glow, .75); ctx.lineWidth = .9; ctx.beginPath();
    for (const sd of [-1, 1]) { ctx.moveTo(4.2, sd * w * .7); ctx.lineTo(6, sd * w * .42); ctx.lineTo(9, 0); ctx.moveTo(6, sd * w * .42); ctx.lineTo(3.4, sd * w * .3); } // lapel edges and their notch
    ctx.stroke();
    ctx.strokeStyle = rgba(RC.glow, .5); ctx.lineWidth = .8; ctx.beginPath();
    ctx.moveTo(-.5, -5.5); ctx.quadraticCurveTo(-4, 0, -.5, 5.5);                      // the collar, standing up behind the neck
    ctx.moveTo(-6, sw * .1); ctx.lineTo(-10.5 - fl, sw * .5);                           // the back vent
    ctx.stroke();
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-.5, sd * w * .8, 5.2, 4.2, 0, 0, TAU); body(null, 1); } // shoulder caps under the sleeves
    ekey(-2, 0, 8, w * .95, 1.6);
  }; }
  { const f = drawHeadTop; drawHeadTop = function (k, o) {
    if (!isEcho(k) || (CUR && CUR.dead && k === 'clone')) return f(k, o);
    // the hair: a mess of spikes, the front ones forward over his eyes, the rest swept back
    // smooth over the brow, then curved spikes that sweep back and out, longest at the crown's back
    const SPK = [[1.05, 11.6, .5], [1.6, 13, .62], [2.15, 14.2, .7], [2.7, 14.8, .55], [3.14, 13.4, 0]]; // angle, tip length, how far it sweeps back
    const wob = i => Math.sin(realT * 1.4 + i * 1.7) * .04 * (1 + moving());
    ctx.beginPath();
    ctx.moveTo(Math.cos(-.75) * 8.4, Math.sin(-.75) * 8.4);
    ctx.quadraticCurveTo(9.6, -2.6, 9.4, -.4); ctx.lineTo(10.2, .5); ctx.quadraticCurveTo(9.8, 3, Math.cos(.75) * 8.4, Math.sin(.75) * 8.4); // the fringe, one lock dipping forward
    const side = sd => { // down one side to the back
      const list = sd > 0 ? SPK : [...SPK].reverse();
      for (let j = 0; j < list.length; j++) {
        const i = sd > 0 ? j : list.length - 1 - j, [an, r, sw] = list[i];
        if (an === 3.14 && sd < 0) continue;
        const A = an * sd, base0 = A - sd * .3, base1 = A + sd * .22, tip = A + sd * sw * .35 + wob(i);
        if (sd > 0 || an !== 3.14) {
          ctx.lineTo(Math.cos(base0) * 8.6, Math.sin(base0) * 8.6);
          ctx.quadraticCurveTo(Math.cos(A) * (r * .82), Math.sin(A) * (r * .82), Math.cos(tip) * r, Math.sin(tip) * r); // out along a curve
          ctx.quadraticCurveTo(Math.cos(A + sd * .12) * (r * .7), Math.sin(A + sd * .12) * (r * .7), Math.cos(base1) * 8.8, Math.sin(base1) * 8.8);
        }
      }
    };
    side(1);
    const back = SPK[4]; ctx.lineTo(Math.cos(PI - .25) * 9, Math.sin(PI - .25) * 9); ctx.lineTo(-back[1], .8); ctx.lineTo(Math.cos(PI + .25) * 9, Math.sin(PI + .25) * 9); // the long one at the back
    side(-1);
    ctx.closePath();
    const g = ctx.createRadialGradient(2, -1, .5, 0, 0, 12); g.addColorStop(0, '#1d2a34'); g.addColorStop(.6, '#0a1117'); g.addColorStop(1, '#020304');
    ctx.fillStyle = g; ctx.fill(); rimPath(1.4);
    ctx.strokeStyle = rgba(RC.glow, .35); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(2, 0); ctx.quadraticCurveTo(-3, .5, -9, 1.2); ctx.stroke(); // one part, swept back
    ekey(1, 0, 8.6, 8.6, 1.6);
  }; }
  { const f = drawArmsWeapon; drawArmsWeapon = function (o, k) {
    if (!isEcho(k) || o.weapon !== 'pistol' || (o.reload || 0) > 0) return f(o, k);
    // the pistol in both hands, arms reaching forward, elbows out: the key art's grip
    const w = 15.5, G = GUN.pistol, rk = -(o.recoil || 0) * 3.5, gx = G.grip + 3 + rk;
    ctx.save(); ctx.translate(gx, 0); drawGunTop('pistol', G, RC === RIM.player); ctx.restore();
    const shL = [1, -w * .8], shR = [1, w * .8], hL = [gx - .5, -2.1], hR = [gx - 1.5, 1.9];
    tube([shL, [7 + rk * .3, -w * .55], hL], 4.8); tube([shR, [6.5 + rk * .3, w * .52], hR], 4.8);
    hand(hL[0], hL[1]); hand(hR[0], hR[1]);
  }; }
})();
