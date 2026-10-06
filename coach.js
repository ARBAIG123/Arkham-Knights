// =====================================================================
//  ECHO — THE COACH
//  Teaches each idea at the moment it matters, once, in the game's own comic lettering,
//  then gets out of the way. Shown tips are remembered in the browser; the pause menu
//  can turn tips off (and turning them back on shows them all again).
// =====================================================================
(function () {
  'use strict';
  const KEY = 'echo_coach_seen';
  let seen = new Set();
  try { seen = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
  const C = window.__COACH = { cur: null, q: [], seen, heard: null, wasOn: true };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...seen])); } catch (e) {} };
  const active = () => SET.tut !== false && state === 'playing' && time > 4.5 && !CS && player && !player.dead;

  // queue a tip (once ever): key cap, headline, one line of explanation; done() clears it early
  function tip(id, key, head, line, o) {
    o = o || {};
    if (seen.has(id) || (C.cur && C.cur.id === id) || C.q.some(q => q.id === id)) return;
    const it = { id, key, head, line, done: o.done, min: o.min ?? 2.2, max: o.max ?? 8, mark: o.mark, prio: !!o.prio };
    if (it.prio) { // it cuts in: whatever was showing goes back to the front of the line
      if (C.cur && !C.cur.prio) { C.q.unshift(C.cur); C.cur = null; }
      C.q.unshift(it);
    } else C.q.push(it);
  }
  window.coachTip = tip;

  // ---- the moment that matters most: the first time a guard hears YOU ----
  { const f = enemyHear; enemyHear = function (e, x, y, o) {
    const was = e.state;
    f(e, x, y, o);
    if (o && o.owner === 'player' && SET.tut !== false && !seen.has('heard') && !C.heard && (was === 'patrol' || was === 'return') && (e.state === 'hunt' || e.state === 'search') && state === 'playing') {
      C.heard = { e, x, y, t: realT };
      slowT = Math.max(slowT, .55); // half a second to see cause and effect
      tip('heard', '!', 'HE HEARD YOU', 'Your footsteps gave you away. Stop moving and he loses you.', { prio: true, min: 3, max: 4.5 });
    }
  }; }

  function triggers() {
    const P = player, L = LV.id;
    const t = MS.tut || {};
    // Issue #1 basics, in the order a new player meets them
    if (L === 1 && MS.phase === 'infiltrate') {
      if (time > 6 && !t.moved) tip('move', 'WASD', 'MOVE', 'Every step makes a sound, and sound is the only light you get.', { done: () => MS.tut && MS.tut.moved });
      if (time > 12 && t.moved && !stats.pings) tip('sonar', 'Q', 'SONAR', 'Lights the room and marks every enemy. They hear it too.', { done: () => stats.pings > 0 });
      const fl = enemies.find(e => e.flash && !e.dead && Math.hypot(e.x - P.x, e.y - P.y) < 280 && los(e.x, e.y, P.x, P.y));
      if (fl) tip('flash', '☀', 'FLASHLIGHTS', 'Stay out of the beam. In the light, they can SEE you.', { max: 6 });
    }
    if (MS.target && !P.strike) tip('strike', 'SPACE', 'ECHO STRIKE', 'A silent kill on a marked enemy. Kills reset it.', { mark: () => MS.target, done: () => !!player.strike, max: 7 });
    if (P.running && L !== 3) tip('run', 'SHIFT', 'RUNNING', 'Faster, and twice as loud.', { max: 4 });
    if (P.hp <= 2 && P.meds > 0) tip('heal', 'H', 'HEAL', 'Use a medkit before the next hit.', { done: () => player.hp > 2, max: 7 });
    if (MS.phase === 'lights' && L === 1) tip('lamps', 'CLICK', 'SHOOT THE LIGHTS', 'Every lamp you kill gives the dark back to you.', { max: 6 });
    if (MS.phase === 'lights' && L === 2) tip('furnace', 'CLICK', 'SHOOT THE GAS MAINS', 'One valve kills three furnaces at once.', { max: 6 });
    // Issue #2
    if (L === 2 && enemies.some(e => e.type === 'hound' && !e.dead && time - (e.litT ?? -9) < 1 && Math.hypot(e.x - P.x, e.y - P.y) < 420))
      tip('hound', '!', 'HOUNDS', 'They track your scent, not your sound. Keep moving, or knife them.', { max: 6 });
    if (L === 2 && MS.lightning > 0 && realT - MS.lightning < 2) tip('storm', '⚡', 'THUNDER', 'Move when it thunders. The storm covers your steps.', { max: 5 });
    // Issue #3
    if (L === 3 && MS.phase === 'corridor' && MS.l3 && MS.l3.corr && MS.l3.corr.state === 'fight')
      tip('beat', 'CLICK', 'SWING ON THE BEAT', 'Hit as the gold ring closes: harder blows, longer combos.', { min: 4, max: 6 });
    if (L === 3 && MS.phase === 'boss' && MS.shocks && MS.shocks.length)
      tip('rings', 'SPACE', 'DASH THROUGH THE RING', 'Time it as the ring reaches you.', { max: 6 });
  }

  function tick() {
    if (SET.tut !== false && !C.wasOn) { seen.clear(); save(); } // tips back on: show them all again
    C.wasOn = SET.tut !== false;
    if (!active()) return;
    triggers();
    const c = C.cur;
    if (c) {
      const age = realT - c.t;
      if (age > c.max || (age > c.min && c.done && c.done())) { seen.add(c.id); save(); C.cur = null; if (c.id === 'heard') C.heard = null; }
    }
    const bigCall = MS.call && MS.call.big && realT - MS.call.t < 2.6; // never on top of a big title
    if (!C.cur && !bigCall) {
      while (C.q.length && C.q[0].done && C.q[0].done()) { seen.add(C.q.shift().id); save(); } // already learned it: skip
      if (C.q.length) { C.cur = C.q.shift(); C.cur.t = realT; }
    }
  }
  { const f = updPhases; updPhases = function (dt) { f(dt); try { tick(); } catch (e) {} }; }

  // ---- drawing: a caption above him, a key cap, and the cause made visible ----
  function draw() {
    const c = C.cur; if (!c || !active()) return;
    const P = player, age = realT - c.t, a = Math.min(1, age / .18, (c.max - age) / .3);
    if (a <= 0) return;
    const s = clamp(Math.min(W / 1400, H / 860), .75, 1.2), sp = worldToScreen(P.x, P.y);
    ctx.save(); ctx.globalAlpha = a;
    // the cause: from where he stepped to the guard who heard it
    if (c.id === 'heard' && C.heard) {
      const h = C.heard, p0 = worldToScreen(h.x, h.y), p1 = worldToScreen(h.e.x, h.e.y);
      ctx.strokeStyle = rgba(CARR[1], .85); ctx.lineWidth = 2.5 * s; ctx.setLineDash([8 * s, 7 * s]); ctx.lineDashOffset = -realT * 40;
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(p1.x, p1.y, (18 + 6 * Math.sin(realT * 8)) * s, 0, TAU); ctx.stroke();
      text('!', p1.x, p1.y - 34 * s, 26 * s, CARR[1], 1, 'center', 700);
    }
    // the target, when the tip is about one
    if (c.mark) { const m = c.mark(); if (m) { const q = worldToScreen(m.x, m.y); ctx.strokeStyle = rgba(CARR[0], .9); ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.arc(q.x, q.y, (24 + 5 * Math.sin(realT * 7)) * s, 0, TAU); ctx.stroke(); } }
    // the caption
    ctx.font = `600 ${13 * s}px ${FONT}`;
    const kw = Math.max(34 * s, ctx.measureText(c.key).width + 18 * s), lw = ctx.measureText(c.line).width * 1.08 + c.line.length * .3 * s; // letter-spacing makes it wider than measured
    ctx.font = `700 ${17 * s}px ${FONT}`;
    const hw = ctx.measureText(c.head).width + c.head.length * 2 * s;
    const bw = kw + Math.max(hw, lw) + 44 * s, bh = 52 * s;
    const bx = clamp(sp.x - bw / 2, 16, W - bw - 16), by = clamp(sp.y - 120 * s - (age < .18 ? (1 - age / .18) * 10 * s : 0), 90 * s, H - bh - 120 * s);
    ctx.fillStyle = 'rgba(6,9,13,.9)'; ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = rgba(INK.yellow, .95); ctx.fillRect(bx, by, 4 * s, bh);
    brackets(bx, by, bw, bh, 10 * s, c.id === 'heard' ? CARR[1] : INK.yellow, .9, 1.4);
    keycap(bx + 16 * s, by + bh / 2, c.key, kw, s);
    const tx = bx + kw + 30 * s;
    text(c.head, tx, by + 17 * s, 17 * s, c.id === 'heard' ? CARR[1] : INK.yellow, 1, 'left', 700, `${2 * s}px`);
    text(c.line, tx, by + 36 * s, 13 * s, CARR[3], .85, 'left', 600, '0.3px');
    // how long it stays: a thin fuse under the box
    const k = clamp(age / c.max, 0, 1); ctx.fillStyle = rgba(CARR[3], .3); ctx.fillRect(bx, by + bh + 2, bw * (1 - k), 2);
    ctx.restore();
  }
  { const f = drawHUD; drawHUD = function (rdt) { f(rdt); try { draw(); } catch (e) {} }; }
})();
