// =====================================================================
//  ECHO #3 — THE CHOIR
//  Back into the Archive, up the floors above the vault. The humming was coming from above him the whole time.
//  The ascent (stealth through the choir's hum) · the Choir Corridor (one take, a hammer, the beat) ·
//  THE CANTOR (the organ, the rise, the consumption) · silence.
//  Loaded after the game script: it hooks the engine the same way the Mimic did — by wrapping functions.
// =====================================================================
const LEVEL3 = {
  id: 3, num: '03', name: 'THE CHOIR', sub: 'THE ARCHIVE  ·  UPPER FLOORS  ·  3:40 AM',
  brief: 'Break the tuning masts. Climb to the corridor. Reach the top. End the song.',
  winTitle: 'THE SONG IS OVER', bossName: 'THE CANTOR', bossVerb: 'SILENCED',
  lockedMsg: 'SEALED — THE THREE TUNING MASTS HOLD THE STAIR GATE', sealed: 'THE CHOIR TOOK YOU.',
  rooms: [
    [2, 36, 10, 6], [12, 38, 2, 2], [14, 33, 20, 9],            // vestibule · nave
    [6, 34, 2, 2], [2, 25, 12, 9], [14, 28, 4, 2],              // organ loft
    [24, 31, 2, 2], [18, 25, 12, 6],                            // chapel
    [34, 37, 2, 2], [36, 30, 14, 12],                           // cloister
    [50, 33, 2, 2], [52, 26, 10, 10], [56, 22, 6, 3],           // bell room · stair landing
    [4, 19, 58, 3],                                             // THE CHOIR CORRIDOR
    [14, 16, 3, 2], [30, 16, 3, 2], [46, 16, 3, 2], [22, 23, 3, 1], [40, 23, 3, 2], // its closets
    [8, 2, 48, 13],                                             // the throne hall, at the top
  ],
  crates: [
    [16, 35, 6, 1], [16, 38, 6, 1], [24, 35, 6, 1], [24, 38, 6, 1], // pews
    [3, 26, 3, 1], [10, 29, 2, 2],                                // the loft's organ
    [22, 25, 4, 1],                                               // the chapel altar
    [39, 33, 1, 1], [45, 33, 1, 1], [39, 38, 1, 1], [45, 38, 1, 1], // cloister pillars
    [56, 29, 2, 2],                                               // the bell
    [30, 2, 3, 1],                                                // the throne
    [14, 5, 1, 1], [14, 10, 1, 1], [21, 4, 1, 1], [21, 11, 1, 1], [42, 4, 1, 1], [42, 11, 1, 1], [49, 5, 1, 1], [49, 10, 1, 1],
  ],
  doors: [
    [13, 38], [13, 39], [6, 35], [7, 35], [16, 28], [16, 29], [24, 32], [25, 32], [35, 37], [35, 38], [51, 33], [51, 34],
    [58, 25, 1], [59, 25, 1],                                     // the stair gate
    [15, 18], [31, 18], [47, 18], [23, 22], [41, 22],             // corridor closets
  ],
  gates: [[58, 25], [59, 25]],
  enemies: [
    { t: 'singer', x: 18, y: 36, f: -PI / 2 }, { t: 'singer', x: 27, y: 36, f: -PI / 2 }, { t: 'singer', x: 19, y: 39, f: -PI / 2 }, { t: 'singer', x: 26, y: 40, f: -PI / 2 },
    { t: 'hunter', x: 31, y: 34, p: [[31, 34], [31, 40]] },
    { t: 'singer', x: 4, y: 28, f: 0 }, { t: 'singer', x: 11, y: 26, f: PI },
    { t: 'husher', x: 8, y: 31, p: [[8, 31], [12, 27], [4, 31]] },
    { t: 'singer', x: 20, y: 27, f: -PI / 2 }, { t: 'singer', x: 24, y: 27, f: -PI / 2 }, { t: 'singer', x: 28, y: 27, f: -PI / 2 },
    { t: 'mirror', x: 19, y: 29, p: [[19, 29], [28, 29]] },
    { t: 'singer', x: 38, y: 31, f: PI / 2 }, { t: 'singer', x: 47, y: 40, f: PI },
    { t: 'resonant', x: 42, y: 32, p: [[42, 32], [42, 40]] }, { t: 'gunner', x: 48, y: 31, f: PI },
    { t: 'resonant', x: 54, y: 28, f: PI / 2 }, { t: 'husher', x: 53, y: 34, p: [[53, 34], [60, 34]] }, { t: 'singer', x: 60, y: 27, f: PI },
  ],
  pickups: [
    ['ammo', 10, 40], ['med', 32, 41], ['decoy', 3, 30], ['ammo', 28, 26], ['smg', 2, 33], ['shotgun', 37, 41],
    ['tape', 12, 32], ['tape', 29, 30], ['tape', 61, 35],
    ['med', 61, 26], ['ammo', 52, 27], ['med', 57, 23], ['med', 61, 23], ['ammo', 60, 24],
  ],
  barrels: [], traps: [], jammers: [],
  hints: [
    [6.5, 40.6, 'INSIDE THE CHOIR\'S HUM YOUR ECHO DIES SHORT  ·  SO DO YOUR STEPS'],
    [9.5, 37.4, 'BREAK THE THREE TUNING MASTS  ·  THE STAIR GATE OPENS'],
    [22.5, 41.4, 'SINGERS HOLD A NOTE BEFORE THEY SCREAM  ·  HIT THEM TO CUT IT OFF'],
  ],
  start: [4, 39],
  exit: [53, 13, 2, 2],
  masts: [[5, 31, 0], [42, 35, 1], [59, 33, 2]],            // [x, y, the hum zone it feeds]
  hum: [[14, 33, 20, 9], [36, 30, 14, 12], [18, 25, 12, 6]], // nave · cloister · chapel
  corr: { y: 20.5, x0: 4, x1: 61, enter: 54.5, elevator: 6.5 },
  hall: { arrive: [31.5, 13.2], seat: [31.5, 3.7], pipes: [[18, 2], [22, 2], [26, 2], [37, 2], [41, 2], [45, 2]] },
  candles: [[22.5, 34], [22.5, 40.6], [30.5, 34], [30.5, 40.6], [20, 26], [28, 26], [12, 3], [51, 3], [12, 13.6], [51, 13.6], [25, 13.6], [38, 13.6]],
};
// voiced lines that aren't radio() calls — generate_voices.py reads this block
const L3VO = /*vojson*/{
  "brief": [
    ["MARCUS", "The manifest had one address on it. Not a foundry. Not a warehouse. The Archive."],
    ["ECHO", "The same building."],
    ["MARCUS", "The floors above the vault. You were under them the whole time. That humming you followed never came from the keycard."],
    ["ECHO", "It came from upstairs."],
    ["MARCUS", "Forty singers live up there. They hum day and night, and the hum eats your echo. Three tuning masts carry it through the floors."],
    ["ECHO", "Break the masts. Climb."],
    ["MARCUS", "Whatever keeps that list is waiting at the top. Engine's running. I'll be at the east stairs when it's done."],
    ["ECHO", "Keep it running."]
  ]
}/*endvo*/;
LEVEL3.briefing = L3VO.brief;
LEVELS.push(LEVEL3);

// ---------- the new voices of the choir ----------
ETYPE.singer = { hp: 2, walk: 70, run: 175, ear: .9, stepR: 70, stride: 40, stepVol: .25, r: 13, pts: 350, w: 'none' };
ETYPE.resonant = { hp: 3, walk: 55, run: 120, ear: .8, stepR: 120, stride: 50, stepVol: .45, r: 17, pts: 600, w: 'none' };
ETYPE.husher = { hp: 1, walk: 85, run: 200, ear: 1.2, stepR: 0, stride: 46, stepVol: .02, r: 12, pts: 500, w: 'blade' };
ETYPE.mirror = { hp: 1, walk: 80, run: 190, ear: 1.1, stepR: 80, stride: 44, stepVol: .3, r: 13, pts: 450, w: 'bat' };
ETYPE.clone = { hp: 1, walk: 120, run: 245, ear: 1.5, stepR: 60, stride: 46, stepVol: .2, r: 13, pts: 200, w: 'knife' };
ETYPE.cantor = { hp: 99, walk: 110, run: 160, ear: 2, stepR: 0, stride: 50, stepVol: 0, r: 22, pts: 10000, w: 'none' };
Object.assign(KSCALE, { singer: 1, resonant: 1.32, husher: .94, mirror: 1, cantor: 2.05, clone: 1 });
Object.assign(HALFW, { singer: 16.5, resonant: 19, husher: 14, mirror: 15.5, cantor: 23, clone: 15.5 });

(() => {
  const L3T = (x, y) => [(x + .5) * T, (y + .5) * T];
  const on3 = () => LV.id === 3 && MS && MS.l3;
  const STEAL = ['q', 'g', 'c', 'e', 'sp'];
  const STEAL_NAME = { q: 'SONAR', g: 'PHANTOM', c: 'DISGUISE', e: 'DECOY', sp: 'DASH' };
  const BEAT = .6; // the choir's tempo in the corridor: 100 bpm

  // ================= mission state =================
  function initPhases3(cp) {
    const S = MS.l3 = {
      masts: LV.masts.map(([x, y, zone], id) => revealable({ id, x: (x + .5) * T, y: (y + .5) * T, zone, hp: 3, gone: !!(cp && cp.masts && cp.masts.includes(id)), humT: rand(0, 2), hurtT: -9, c: 2 })),
      tapes: cp && cp.tapes ? [...cp.tapes] : [], stolen: new Set(), kills: [], btUntil: -9, aiT: 0, hushT: -9, invertT: -9,
      corr: null, boss: null, giveIt: false, silence: null, candleT: 0, padT: 2, combo: 0, tilt: 0, tiltSign: 1, rageT: -9,
      thrown: null, whip: null, pulseT: -9, beat0: 0, beatN: -1, heartT: 0,
    };
    for (const p of pickups) if (p.type === 'tape') p.tapeId = LV.pickups.filter((q, i) => q[0] === 'tape' && i < p.id).length;
    for (const e of enemies) if (ETYPE[e.type] && ETYPE[e.type].hp > 1 && e.type !== 'cantor') e.trueHp = ETYPE[e.type].hp;
    if (!MS.fakes) MS.fakes = [];
    MS.blind = true; MS.intel = 1; // after the Foundry every one of them knows it's Calder
    const done = S.masts.every(m => m.gone);
    MS.phase = cp ? (cp.phase === 'boss' ? 'bossrestore' : done ? 'climb' : 'ascent') : 'ascent';
    S.cpStage = cp && cp.phase === 'boss' ? cp.bossStage || 1 : 0; // read it now: the checkpoint can be re-saved before the boss rebuilds
    gate(!done);
    if (MS.phase === 'bossrestore') timers.push({ t: time + .05, fn: () => startBoss(true) });
  }
  function gate(lock) { for (const d of doors) if (LV.gates.some(([x, y]) => d.tx === x && d.ty === y)) { d.locked = lock; if (lock) { d.open = false; d.amt = 0; } } }
  function objective3() {
    const S = MS.l3, B = S.boss;
    switch (MS.phase) {
      case 'climb': return { t: 'Climb to the Choir Corridor', s: 'STAIRS', c: CARR[2] };
      case 'corridor': return { t: `Survive the corridor  ·  ${S.corr ? Math.min(4, Math.max(1, S.corr.wave)) : 1}/4`, s: 'CORRIDOR', c: CARR[1] };
      case 'elevator': case 'bossgo': return { t: 'Reach the elevator', s: 'ELEVATOR', c: CARR[2] };
      case 'finale': return { t: 'Give it all', s: 'THE CANTOR', c: CARR[3] };
      case 'boss': case 'bossrestore': return { t: !B || B.stage === 1 ? 'Break the organ' : B.stage === 2 ? 'Bring the Cantor down' : S.giveIt ? 'Give it all  ·  [Q]' : 'Stop the consumption', s: 'THE CANTOR', c: CARR[1] };
      case 'silence': return { t: 'Follow her song', s: 'HOME', c: CARR[0] };
      default: return { t: `Break the tuning masts  ${S.masts.filter(m => m.gone).length}/${S.masts.length}`, s: 'MAST', c: CARR[2] };
    }
  }
  function objectiveSrc3() {
    const P = player, S = MS.l3;
    switch (MS.phase) {
      case 'climb': return { x: 58.5 * T, y: 21 * T };
      case 'elevator': return { x: 5 * T, y: 20.5 * T };
      case 'ascent': { let b = null, bd = 1e9; for (const m of S.masts) if (!m.gone) { const d = Math.hypot(m.x - P.x, m.y - P.y); if (d < bd) { bd = d; b = m; } } return b; }
      default: return null;
    }
  }

  // ================= the hum, the masts, the tapes =================
  const zoneLive = i => MS.l3.masts.some(m => m.zone === i && !m.gone);
  function humAt(x, y) { const tx = x / T, ty = y / T; for (let i = 0; i < LV.hum.length; i++) { const [zx, zy, zw, zh] = LV.hum[i]; if (tx >= zx && tx < zx + zw && ty >= zy && ty < zy + zh && zoneLive(i)) return i + 1; } return 0; }
  const hushers = () => enemies.filter(e => e.type === 'husher' && !e.dead && !e.hidden);
  const HUSH_R = 150;
  function inHusher(x, y) { for (const h of hushers()) if (Math.hypot(h.x - x, h.y - y) < HUSH_R) return h; return null; }
  function mastDown(m, silent) {
    if (m.gone) return;
    m.gone = true; stats.score += 600;
    const S = MS.l3, left = S.masts.filter(o => !o.gone).length;
    callout('MAST DOWN', `${S.masts.length - left}/${S.masts.length}  ·  ${left ? 'THE SONG THINS' : 'THE STAIR GATE IS OPEN'}  +600`, 0, !left);
    emitSound(m.x, m.y, { hear: silent ? 80 : 300, reveal: 520, col: 2, owner: 'player', str: 1, force: true });
    ring(m.x, m.y, 8, 160, 2, .7, 4); sparks(m.x, m.y, 0, 30, 2, 520, PI); smoke(m.x, m.y, 6, .9); light(m.x, m.y, 280, 2, .6, 1.1);
    comicWord(m.x, m.y - 40, 'KRANNNG!', { col: INK.yellow, size: 30, burst: true, burstCol: INK.red, range: 2600, life: 1.2 });
    shake = Math.max(shake, 9); hitstop = Math.max(hitstop, .06);
    if (!play('bell', { x: m.x, y: m.y, range: 2200, vol: .9, rev: .6 }) && AU.ctx && !AU.muted) tone({ vol: .3, dur: 2.2, f0: 330, f1: 310, type: 'triangle', echo: .8 });
    if (left === 2) radio('MARCUS', "That's one mast. The hum's thinner.");
    else if (left === 1) radio('MARCUS', 'Two down. One left.');
    if (!left) {
      gate(false); MS.phase = 'climb';
      radio('MARCUS', "That's the last mast. The stair gate's open. Go up.");
      for (const d of doors) if (LV.gates.some(([x, y]) => d.tx === x && d.ty === y)) emitSound(d.x, d.y, { hear: 0, reveal: 360, col: 2, owner: 'env', str: 1, force: true });
    }
    saveCheckpoint();
  }
  function hitMast(m, dmg, silent) {
    if (m.gone) return;
    m.hp -= dmg; m.hurtT = time; m.litS = 1.1; m.litT = time;
    sparks(m.x, m.y, rand(0, TAU), 10, 2, 380, .8);
    if (m.hp <= 0) mastDown(m, silent);
    else popups.push({ x: m.x, y: m.y - 50, text: `MAST  ${m.hp}`, t: time, c: 2, size: 15, vy: -14, pop: true });
  }
  function collectL3(p) {
    const P = player, S = MS.l3;
    if (p.type === 'hammer') { p.taken = true; P.hammer = true; WEAP.knife.name = 'HAMMER'; SFX.pickup(); comicWord(P.x, P.y - 30, 'CLANK!', { col: INK.yellow, size: 22 }); return; }
    p.taken = true; SFX.pickup(); ring(p.x, p.y, 8, 90, 2, .6, 3);
    const id = p.tapeId ?? S.tapes.length; S.tapes.push(id); stats.score += 750;
    callout(`RECORDING  ${S.tapes.length}/3`, "THE QUIET'S LAB LOGS", 2);
    if (id === 0) { radio('LAB', 'Log one. The Calder house. The husband is blinded, as ordered. The wife is taken alive. She will not stop humming.'); thought('Taken alive.'); }
    else if (id === 1) radio('LAB', 'Log sixty. The procedure took. Her voice carries through every floor now. She no longer answers to her name.');
    else { radio('LAB', 'Log four hundred. She remembers nothing before the choir. She hears every heartbeat in the building. She sits above all of us now.'); thought('Above all of us.'); }
  }

  // ================= the choir, alive =================
  function singerTick(e, dt) { // a held note: they plant, open up, and scream down a cone
    const P = player;
    if (e.note) {
      e.note.t -= dt; e.moveAmt = 0; e.a = turnTo(e.a, Math.atan2(P.y - e.y, P.x - e.x), dt * 3);
      if (Math.random() < .3) { e.litS = Math.max(e.litS, .8); e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a; }
      if (e.note.t <= 0) singerRelease(e);
      return true;
    }
    if (e.state === 'patrol' && !e.patrol && time > (e.humAt || 0)) { // kneeling, humming: you can hear where they are
      e.humAt = time + rand(3, 5.5);
      if (Math.hypot(e.x - P.x, e.y - P.y) < 1100) {
        emitSound(e.x, e.y, { hear: 0, reveal: 75, col: 2, owner: 'enemy', str: .55 });
        const s = spat(e.x, e.y, 1100); if (AU.ctx && !AU.muted) tone({ pan: s.pan, vol: .045 * s.vol, dur: 1.4, f0: [196, 220, 247][e.id % 3], f1: [196, 220, 247][e.id % 3] * 1.005, type: 'triangle', echo: .7, attack: .4 });
      }
    }
    return false;
  }
  function singerAfter(e, dt) {
    const P = player, d = Math.hypot(P.x - e.x, P.y - e.y);
    if (e.dead || e.note || P.dead || e.state !== 'hunt' || e.cd > 0 || d < 90 || d > 300) return;
    if (time < (e.noteCD || 0) || Math.random() > dt * .6 || !los(e.x, e.y, P.x, P.y)) return;
    if (enemies.some(o => o !== e && o.note && !o.dead)) return; // one voice at a time
    e.note = { t: .75, t0: .75 }; e.noteCD = time + 3.2;
    const s = spat(e.x, e.y, 1300); if (AU.ctx && !AU.muted) tone({ pan: s.pan, vol: .12 * s.vol + .02, dur: .75, f0: 330, f1: 660, type: 'sawtooth', echo: .5, attack: .2 });
    if (!MS.said.note) { MS.said.note = 1; callout('CHOIR SINGER', 'IT HOLDS A NOTE · HIT IT TO CUT IT OFF', 1); }
  }
  function singerRelease(e) {
    const P = player, d = Math.hypot(P.x - e.x, P.y - e.y), a = Math.atan2(P.y - e.y, P.x - e.x);
    e.note = null; e.cd = 1.4; e.noteFX = { t: time, a: e.a };
    emitSound(e.x, e.y, { hear: 0, reveal: 260, col: 1, owner: 'enemy', str: 1, force: true, ind: true });
    const s = spat(e.x, e.y, 1400); if (AU.ctx && !AU.muted) { noise({ pan: s.pan, vol: .25 * s.vol, dur: .4, f0: 2800, f1: 900, type: 'bandpass', q: 2, echo: .5 }); tone({ pan: s.pan, vol: .14 * s.vol, dur: .45, f0: 880, f1: 600, type: 'sawtooth', echo: .5 }); }
    if (!P.dead && d < 320 && Math.abs(angDiff(e.a, a)) < .42 && los(e.x, e.y, P.x, P.y)) {
      if (P.iframe <= 0) { MS.hitBy = { by: e, t: time }; damagePlayer(1, e.x, e.y); moveCircle(P, Math.cos(a) * 70, Math.sin(a) * 70, P.r, true); }
      else popups.push({ x: P.x, y: P.y - 30, text: 'DODGED', t: time, c: 0, size: 15, vy: -16, pop: true });
    }
  }
  // ---- the coven's runes: from range, a singer plants, draws a sigil in light, and throws it ----
  const RUNE = { cast: .95, speed: 255, turn: .85, life: 3.4, r: 10 };
  const runeAmber = a => `rgba(255,172,70,${a})`;
  function castTick(e, dt) {
    const P = player, S = MS.l3;
    if (e.cast) {
      e.cast.t -= dt; e.moveAmt = 0; e.a = turnTo(e.a, Math.atan2(P.y - e.y, P.x - e.x), dt * 4);
      e.litS = Math.max(e.litS, .9); e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a; // the sigil lights its caster
      if (e.cast.t <= 0) castRelease(e);
      return true;
    }
    if (e.dead || e.note || P.dead || e.state !== 'hunt') return false;
    if (e.castCD == null) e.castCD = time + rand(1.5, 4);
    if (time < e.castCD) return false;
    const d = Math.hypot(P.x - e.x, P.y - e.y);
    if (d < 230 || d > 640 || Math.random() > dt * .45 || !los(e.x, e.y, P.x, P.y)) return false;
    const live = enemies.filter(o => !o.dead && o.cast).length + (S.runes || []).length;
    if (live >= (S.corr ? 2 : 3)) return false; // never a wall of spells: two or three in the air at most
    e.cast = { t: RUNE.cast, t0: RUNE.cast }; e.castCD = time + rand(4.5, 7.5);
    const s = spat(e.x, e.y, 1500);
    if (AU.ctx && !AU.muted) { tone({ pan: s.pan, vol: .07 * s.vol + .01, dur: RUNE.cast, f0: 440, f1: 880, type: 'triangle', echo: .6, attack: .5 }); tone({ pan: s.pan, vol: .05 * s.vol, dur: RUNE.cast, f0: 554, f1: 1108, type: 'sine', echo: .6, attack: .5 }); }
    if (!MS.said.rune) { MS.said.rune = 1; callout('RUNE CAST', 'THE CHOIR WRITES IN LIGHT · DASH THROUGH IT, OR SWING TO BREAK IT', 1); }
    return true;
  }
  function castRelease(e) {
    const P = player, S = MS.l3, a = Math.atan2(P.y - e.y, P.x - e.x);
    e.cast = null; e.cd = Math.max(e.cd || 0, .8); e.castFX = time;
    (S.runes || (S.runes = [])).push({ x: e.x + Math.cos(a) * 24, y: e.y + Math.sin(a) * 24, a, t: 0, rot: 0, by: e, sp: RUNE.speed * (DIFF_NOW().spd || 1) });
    const s = spat(e.x, e.y, 1500);
    if (AU.ctx && !AU.muted) { noise({ pan: s.pan, vol: .16 * s.vol, dur: .35, f0: 3200, f1: 1200, type: 'bandpass', q: 3, echo: .6 }); tone({ pan: s.pan, vol: .09 * s.vol, dur: .4, f0: 1320, f1: 990, type: 'triangle', echo: .6 }); }
    emitSound(e.x, e.y, { hear: 0, reveal: 160, col: 2, owner: 'enemy', str: .7, force: true });
  }
  function runeBreak(r, hit) {
    sparks(r.x, r.y, r.a + PI, 14, 2, 260, PI);
    pp({ k: 'ring', x: r.x, y: r.y, r0: 4, r1: 46, life: .35, max: .35, c: 2, s: 2 });
    const s = spat(r.x, r.y, 1300); if (AU.ctx && !AU.muted) noise({ pan: s.pan, vol: .2 * s.vol, dur: .25, f0: 5000, f1: 2000, type: 'highpass', q: 1, echo: .4 });
    if (hit === 'cut') { stats.score += 200; popups.push({ x: r.x, y: r.y - 26, text: 'RUNE BROKEN  +200', t: time, c: 0, size: 14, vy: -14 }); comicWord(r.x, r.y - 10, 'SHATTER!', { col: [255, 190, 90], size: 18, life: .7 }); }
  }
  function updRunes(dt) {
    const S = MS.l3, P = player; if (!S || !S.runes) return;
    S.runes = S.runes.filter(r => {
      r.t += dt; r.rot += dt * 4;
      if (!P.dead) { const want = Math.atan2(P.y - r.y, P.x - r.x); r.a += clamp(angDiff(want, r.a), -RUNE.turn * dt, RUNE.turn * dt); } // it bends after you, a little
      const nx = r.x + Math.cos(r.a) * r.sp * dt, ny = r.y + Math.sin(r.a) * r.sp * dt;
      if (!passable(Math.floor(nx / T), Math.floor(ny / T))) { runeBreak(r); return false; }
      r.x = nx; r.y = ny;
      if (Math.random() < dt * 40) pp({ k: 'spark', x: r.x, y: r.y, vx: -Math.cos(r.a) * 60 + rand(-30, 30), vy: -Math.sin(r.a) * 60 + rand(-30, 30), life: .35, max: .35, c: 2 });
      const d = Math.hypot(P.x - r.x, P.y - r.y);
      if (!P.dead && P.meleeT > 0 && d < 74) { runeBreak(r, 'cut'); return false; } // swing through it
      if (!P.dead && d < P.r + RUNE.r) {
        if (P.iframe > 0 || P.dashT > 0) { if (!r.passed) { r.passed = 1; popups.push({ x: P.x, y: P.y - 30, text: 'THROUGH IT', t: time, c: 0, size: 15, vy: -16, pop: true }); } return true; } // dashed through: it keeps going
        MS.hitBy = { by: r.by, t: time }; damagePlayer(1, r.x, r.y); runeBreak(r); return false;
      }
      if (r.t >= RUNE.life) { runeBreak(r); return false; }
      return true;
    });
  }
  { const f = updPhases; updPhases = function (dt) { f(dt); if (on3() && state === 'playing') updRunes(dt); }; }
  const inBrawl = () => on3() && MS.phase === 'corridor' && MS.l3.corr && MS.l3.corr.state === 'fight';
  { const f = damageEnemy; damageEnemy = function (e, dmg, cause, silent) { // the score counts in the corner; the fight doesn't need it written over it
    const n = popups.length; f(e, dmg, cause, silent);
    if (inBrawl()) for (let i = popups.length - 1; i >= n; i--) if (/^(CRUSHED|x\d|\+\d|SILENT|ECHO STRIKE)/.test(popups[i].text)) popups.splice(i, 1);
  }; }
  { const f = callout; callout = function (t, sub, c, big) { if (inBrawl() && /(DOUBLE|TRIPLE|QUAD) ECHO|^SILENCE x/.test(t)) return; return f(t, sub, c, big); }; }
  { const f = comicWord; let lastW = -9; comicWord = function (x, y, text, o) { // one impact word at a time
    if (inBrawl() && !(o && o.burst)) { if (realT - lastW < .32) return; lastW = realT; }
    return f(x, y, text, o);
  }; }
  function resonantRing(e) {
    e.ringT = time;
    let n = 0;
    for (const o of enemies) if (o !== e && !o.dead && !o.hidden && o.type !== 'cantor' && Math.hypot(o.x - e.x, o.y - e.y) < 190) {
      o.state = 'stun'; o.stunT = 2.4; o.note = null; o.litS = 1; o.litT = time; o.gx = o.x; o.gy = o.y; o.ga = o.a; o.gpose = { stun: true }; n++;
    }
    ring(e.x, e.y, 10, 190, 2, .7, 5); ring(e.x, e.y, 6, 110, 3, .4, 3);
    emitSound(e.x, e.y, { hear: 0, reveal: 300, col: 2, owner: 'env', str: 1, force: true });
    if (!play('bell', { x: e.x, y: e.y, range: 1800, vol: .8, rev: .5 }) && AU.ctx && !AU.muted) tone({ vol: .25, dur: 1.8, f0: 523, f1: 520, type: 'triangle', echo: .8 });
    comicWord(e.x, e.y - 36, 'GONNNG!', { col: INK.yellow, size: 24, range: 2200 });
    if (n && !MS.said.reso) { MS.said.reso = 1; callout('RESONANT', `IT RINGS WHEN STRUCK · ${n} STUNNED`, 2); thought('It rings when you hit it. Everything near it goes still.'); }
  }
  function mirrorAnswer() { // mirrors answer your ping, and tell everyone where it came from
    const P = player;
    for (const m of enemies) if (m.type === 'mirror' && !m.dead && !m.hidden && Math.hypot(m.x - P.x, m.y - P.y) < 900) {
      timers.push({ t: time + .45, fn: () => {
        if (m.dead) return;
        emitSound(m.x, m.y, { hear: 0, reveal: 260, col: 1, owner: 'enemy', str: .9, force: true, ind: true });
        comicWord(m.x, m.y - 28, 'PING!', { col: INK.red, size: 18, range: 1800 });
        m.litS = 1.1; m.litT = time; m.gx = m.x; m.gy = m.y; m.ga = m.a;
        for (const e of enemies) if (!e.dead && !e.hidden && e.type !== 'cantor' && Math.hypot(e.x - P.x, e.y - P.y) < 700) { e.know = { x: P.x, y: P.y, t: time }; if (e.state !== 'stun') { e.state = 'hunt'; e.path = null; } }
        if (!MS.said.mirror) { MS.said.mirror = 1; callout('MIRROR', 'IT ANSWERS YOUR PING · KILL IT QUIETLY', 1); thought('It answered my ping.'); }
      } });
    }
  }
  function updHushers() {
    const P = player;
    for (const h of hushers()) { // lit by gunfire, a candle, or right next to you
      let lit = Math.hypot(h.x - P.x, h.y - P.y) < 110;
      if (!lit) for (const l of lights) if (l.life > 0 && Math.hypot(l.x - h.x, l.y - h.y) < Math.max(160, l.r)) { lit = true; break; }
      if (!lit) for (const [cx, cy] of LV.candles) if (Math.hypot((cx + .5) * T - h.x, (cy + .5) * T - h.y) < 110) { lit = true; break; }
      if (lit) { h.litS = 1; h.litT = time; h.gx = h.x; h.gy = h.y; h.ga = h.a; h.gw = h.walk; h.seenT = time; if (!MS.said.husher) { MS.said.husher = 1; callout('HUSHER', 'IT CARRIES SILENCE · FIND IT WITH LIGHT', 1); thought("A hole in the sound. Something's carrying silence."); } }
    }
  }

  // ================= the Choir Corridor =================
  const CY = () => LV.corr.y * T;
  const WAVES = [null,
    { wall: true },                                                     // 1: the front row of the wall
    { wall2: true },                                                    // 2: the back row
    { rear: ['singer', 'singer', 'singer'], front: ['mirror', 'singer'], whip: true },        // 3: behind you
    { pile: true, front: ['singer', 'resonant', 'singer', 'singer'], rear: ['singer', 'husher', 'singer'], top: [['singer', 0], ['singer', 2]], bottom: [['singer', 1]] }, // 4: the pile
  ];
  function corrSpot(where, i) {
    if (where === 'front') return L3T(5 + (i % 3) * .8, 19 + (i % 3));
    if (where === 'rear') return L3T(57.5 + (i % 3), 22.5 + (i % 2));
    if (where === 'top') return L3T([15, 31, 47][i] , 16.5);
    return L3T([23, 41][i], 23);
  }
  function spawnW(type, x, y, wave, hunt) {
    const e = makeEnemy(type, x, y, 'w' + (MS.nid++));
    e.wave = wave; if (ETYPE[type].hp > 1) e.trueHp = ETYPE[type].hp;
    if (!hunt) { e.state = 'patrol'; e.know = null; e.a = 0; e.home = { x, y }; e.homeA = 0; }
    enemies.push(e); return e;
  }
  function startCorridor() {
    const S = MS.l3, P = player;
    MS.phase = 'corridor';
    saveCheckpoint(); // the corridor is one take: a death starts it from the top
    const C = S.corr = { wave: 0, alive: 0, q: [], camX: P.x - 230, lightT: 0, state: 'intro', pile: false, lastman: false, knifeT: -1, clearT: -1 };
    S.beat0 = time; S.beatN = -1; S.combo = 0; S.prevWeapon = P.weapon;
    // the wall: the first two waves, standing shoulder to shoulder at the far end
    for (let i = 0; i < 5; i++) spawnW('singer', (8.5 + (i % 2) * .6) * T, (19.3 + i * .55) * T, 1, false);
    for (let i = 0; i < 4; i++) spawnW(i === 2 ? 'resonant' : 'singer', 6.6 * T, (19.4 + i * .7) * T, 2, false);
    corridorLights();
    playCutscene([
      { cam: [33 * T, CY(), .36], dur: 2.8, camDur: 1.3, fn: () => { // the whole hallway lights at once: and the wall of them, waiting
        const sweep = () => { for (let x = LV.corr.x0 + 1; x <= LV.corr.x1; x += 4) emitSound(x * T, CY(), { hear: 0, reveal: 360, col: 3, owner: 'env', str: .9, force: true, ring: 0 }); };
        sweep(); timers.push({ t: time + 1.2, cine: true, fn: sweep });
        if (AU.ctx && !AU.muted) tone({ vol: .08, dur: 2.6, f0: 110, f1: 104, type: 'sawtooth', echo: .8, attack: .6 }); } },
      { cam: [9 * T, CY(), .9], say: ['ECHO', 'Forty voices. One hallway.'] },
      { cam: () => [player.x, player.y, 1.25], fn: () => { player.hammer = true; WEAP.knife.name = 'HAMMER'; player.weapon = 'knife'; comicWord(player.x, player.y - 34, 'CLANK!', { col: INK.yellow, size: 26 }); }, say: ['ECHO', "Kade's hammer. I brought it for this."] },
    ], () => { C.state = 'fight'; nextWave(); callout('THE CHOIR CORRIDOR', 'ONE TAKE · SWING ON THE BEAT', 1, true); });
  }
  function corridorLights() { // the corridor's tubes hum on: the brawl is lit, not echoed
    if (!MS.l3.corr) return;
    for (let k = -2; k <= 2; k++) {
      const x = clamp(cam.x + k * 260, (LV.corr.x0 + 1) * T, (LV.corr.x1 - .5) * T);
      emitSound(x, CY(), { hear: 0, reveal: 330, col: 3, owner: 'env', str: .75, force: true, ring: 0 });
    }
  }
  function nextWave() {
    const S = MS.l3, C = S.corr, P = player;
    C.wave++; C.advancing = false;
    const W = WAVES[C.wave]; if (!W) return corridorClear();
    if (W.wall || W.wall2) {
      for (const e of enemies) if (!e.dead && e.wave === C.wave) { e.state = 'hunt'; e.know = { x: P.x, y: P.y, t: time }; e.path = null; e.holdT = time + Math.random() * 1.4; } // not in step: each breaks from the wall on his own beat
    }
    const q = [];
    for (const [where, list] of [['front', W.front], ['rear', W.rear]]) (list || []).forEach((type, i) => q.push({ type, where, i }));
    for (const [where, list] of [['top', W.top], ['bottom', W.bottom]]) (list || []).forEach(([type, i]) => q.push({ type, where, i }));
    q.forEach((s, k) => timers.push({ t: time + .3 + k * .38, fn: () => { if (!S.corr) return; const [x, y] = corrSpot(s.where, s.i); spawnW(s.type, x, y, C.wave, true); SFX.door(x, y); emitSound(x, y, { hear: 0, reveal: 200, col: 1, owner: 'enemy', str: 1, force: true, ind: true }); } }));
    C.pending = q.length; timers.push({ t: time + .4 + q.length * .38, fn: () => { if (S.corr) S.corr.pending = 0; } });
    if (W.whip) { // BEHIND YOU: the camera whips back to the stairs
      S.whip = { x: 57 * T, until: realT + 1.1 }; moco('rev', .4, 1.2);
      slowT = Math.max(slowT, .6);
      comicWord(P.x, P.y - 40, 'BEHIND YOU!', { col: INK.red, size: 24, life: 1.2 });
      thought('Behind me.');
    }
    if (W.pile) { C.pile = true; callout('THE PILE', 'EVERYTHING THEY HAVE LEFT', 1, true); }
  }
  function waveAlive() { const C = MS.l3.corr; return enemies.filter(e => !e.dead && e.wave === C.wave).length; }
  function corridorKill(e) {
    const S = MS.l3, C = S.corr; if (!C || e.wave == null) return;
    MOCO.kills++;
    // bullet time: three down inside a second and a half
    S.kills.push(realT); S.kills = S.kills.filter(t => realT - t < 1.5);
    if (S.kills.length >= 3 && S.btUntil < realT) { S.btUntil = realT + 1.8; S.kills = []; play('whoosh', { vol: .6 }); comicWord(player.x, player.y - 44, 'SLOW...', { col: INK.cyan, size: 22, life: 1 }); }
    if (e.wave !== C.wave || C.pending) return;
    const left = waveAlive();
    if (left === 1 && C.wave === 4 && player.hammer && !C.lastman) { C.lastman = true; callout('LAST ONE', '[F] / RIGHT-CLICK — THROW THE HAMMER', 2, true); }
    if (left > 0) return;
    waveCleared(e);
  }
  function waveCleared(e) {
    const S = MS.l3, C = S.corr; if (!C || C.advancing) return;
    C.advancing = true; C.lastman = false;
    if (!e) e = player;
    // the last man of a wave goes down in slow motion, on an impact frame
    slowT = Math.max(slowT, 1.1); S.invertT = realT; zoomPunch = Math.max(zoomPunch, .1); shake = Math.max(shake, 14);
    S.tiltSign *= -1; camRot += .07 * S.tiltSign;
    moco('top', .85, 1.4); // the last man falls: the rig cranes overhead in one hard move
    comicWord(e.x, e.y - 40, ['KRAK!', 'THUD!', 'WHAM!'][C.wave % 3], { col: INK.white, size: 34, burst: true, burstCol: INK.red, life: 1.1 });
    if (C.wave === 3) { C.state = 'knife'; C.knifeT = time + 1.3; return; }
    timers.push({ t: time + 1.4, fn: () => { if (MS.l3.corr) nextWave(); } });
  }
  function theKnife() { // the Oldboy beat: a blade in the back, and he keeps going
    const S = MS.l3, C = S.corr, P = player;
    C.state = 'fight';
    const a = P.a + PI, x = P.x + Math.cos(a) * 30, y = P.y + Math.sin(a) * 30;
    const e = spawnW('husher', x, y, 3.5, true);
    panelFreeze(P.x, P.y, 'SHNK!', INK.red); moco('knife', .22, 2.2); MUS.muteUntil = realT + 1.9; MUS.slam = true; // the band stops dead with him
    P.hp = Math.max(1, P.hp - 2); stats.dmg += 2; hurtFlash = 1; shake = Math.max(shake, 16); blood(P.x, P.y, P.a, 30);
    for (let i = 0; i < 5; i++) hpFlash[i] = realT;
    timers.push({ t: time + .25, fn: () => {
      slowT = Math.max(slowT, 1.6);
      if (!e.dead) { e.hp = 1; damageEnemy(e, 99, 'hammer', false); }
      radio('ECHO', 'Not yet.');
      S.rageT = time + 9;
      callout('SECOND WIND', 'FASTER SWINGS · HARDER HITS', 0, true);
      if (AU.ctx && !AU.muted) [110, 138.6, 164.8, 220].forEach((f, i) => tone({ vol: .09, dur: 2.4, f0: f, f1: f, type: 'sawtooth', echo: .8, attack: .05, delay: i * .02 }));
      timers.push({ t: time + 1.8, fn: () => { if (MS.l3.corr) nextWave(); } });
    } });
  }
  function corridorClear() {
    const S = MS.l3, C = S.corr;
    C.state = 'clear'; C.lastman = false; C.pile = false; MS.phase = 'elevator'; musEnd();
    callout('CORRIDOR CLEAR', `ON-BEAT HITS  ${C.beatHits || 0}  ·  +2500`, 2, true); stats.score += 2500;
    timers.push({ t: time + 1.4, fn: () => radio('MARCUS', "Those tapes, Elias. If that's her up there... I told you she was gone. I stopped looking.") });
    timers.push({ t: time + 9, fn: () => thought('Going up.') });
  }
  // ---- hammer choreography: five moves, each a wind-up, a strike that accelerates into the impact, and a follow-through ----
  // keys: u (0..1 of the swing), hR/hL (hands, chest frame: x forward, y left, z up), tw (torso twist), ln (lean),
  // cr (crouch), lg (lunge), yaw (whole-body turn, for the spin). e: how the segment arriving at this key eases.
  const GUARD = { hR: [8, -8, -6], hL: [6, -2, -10], tw: -.15, ln: .05, cr: .22, lg: .25, yaw: 0 };
  const CARRY = { hR: [4, -11, -16], hL: [6, -5, -12], tw: -.1, ln: .1, cr: .06, lg: 0, yaw: 0 };
  const MOVES = {
    sweep: { dur: .42, hit: .26, keys: [
      { u: 0, ...GUARD },
      { u: .16, e: 'out', hR: [-8, -18, 12], hL: [-6, -14, 8], tw: -.8, ln: -.1, cr: .3, lg: .1, yaw: 0 },
      { u: .26, e: 'in', hR: [24, 2, 4], hL: [20, -2, 2], tw: .3, ln: .32, cr: .38, lg: .95, yaw: 0 },
      { u: .56, e: 'out', hR: [10, 20, 0], hL: [8, 16, -2], tw: .85, ln: .22, cr: .32, lg: .75, yaw: 0 },
      { u: 1, e: 'io', ...GUARD }] },
    backhand: { dur: .42, hit: .26, keys: [
      { u: 0, ...GUARD },
      { u: .16, e: 'out', hR: [-6, 16, 10], hL: [-4, 12, 6], tw: .75, ln: -.1, cr: .3, lg: .1, yaw: 0 },
      { u: .26, e: 'in', hR: [24, -4, 2], hL: [20, 0, 0], tw: -.3, ln: .3, cr: .38, lg: .95, yaw: 0 },
      { u: .56, e: 'out', hR: [8, -20, 0], hL: [6, -16, -2], tw: -.85, ln: .2, cr: .3, lg: .7, yaw: 0 },
      { u: 1, e: 'io', ...GUARD }] },
    overhead: { dur: .5, hit: .3, keys: [
      { u: 0, ...GUARD },
      { u: .2, e: 'out', hR: [-6, -4, 30], hL: [-4, 0, 26], tw: -.1, ln: -.28, cr: .12, lg: .1, yaw: 0 },
      { u: .3, e: 'in', hR: [26, 0, -10], hL: [22, 0, -6], tw: 0, ln: .58, cr: .58, lg: 1, yaw: 0 },
      { u: .62, e: 'out', hR: [22, 0, -16], hL: [18, 0, -12], tw: 0, ln: .5, cr: .52, lg: .9, yaw: 0 },
      { u: 1, e: 'io', ...GUARD }] },
    uppercut: { dur: .45, hit: .28, keys: [
      { u: 0, ...GUARD },
      { u: .17, e: 'out', hR: [4, -10, -22], hL: [2, -6, -24], tw: -.4, ln: .38, cr: .62, lg: .45, yaw: 0 },
      { u: .28, e: 'in', hR: [16, 0, 30], hL: [12, 2, 26], tw: .3, ln: -.2, cr: .05, lg: .85, yaw: 0 },
      { u: .6, e: 'out', hR: [6, 4, 36], hL: [4, 6, 32], tw: .2, ln: -.26, cr: 0, lg: .6, yaw: 0 },
      { u: 1, e: 'io', ...GUARD }] },
    spin: { dur: .6, hit: .42, keys: [
      { u: 0, ...GUARD },
      { u: .14, e: 'out', hR: [6, -16, 4], hL: [4, -12, 2], tw: -.55, ln: .1, cr: .38, lg: .2, yaw: 0 },
      { u: .42, e: 'in', hR: [26, -6, 4], hL: [22, -4, 2], tw: 0, ln: .2, cr: .32, lg: .7, yaw: TAU * .85 },
      { u: .7, e: 'out', hR: [22, 6, 2], hL: [18, 6, 0], tw: .4, ln: .15, cr: .3, lg: .6, yaw: TAU },
      { u: 1, e: 'io', ...GUARD, yaw: TAU }] },
  };
  const EASE = { in: k => k * k * k, out: k => 1 - Math.pow(1 - k, 3), io: k => easeInOut(k) };
  const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  function moveFrame(name, u) {
    const K = MOVES[name].keys; let i = 0;
    while (i < K.length - 2 && u >= K[i + 1].u) i++;
    const A = K[i], B = K[i + 1], k = EASE[B.e || 'io'](clamp((u - A.u) / (B.u - A.u), 0, 1));
    return { hR: lerp3(A.hR, B.hR, k), hL: lerp3(A.hL, B.hL, k), tw: lerp(A.tw, B.tw, k), ln: lerp(A.ln, B.ln, k), cr: lerp(A.cr, B.cr, k), lg: lerp(A.lg, B.lg, k), yaw: lerp(A.yaw, B.yaw, k) };
  }
  function nextMove(S, onBeat, rage) { // a combo flows through the set; a hot streak earns the spin
    const P = player, chain = time - (P.lastSwingT ?? -9) < .95; P.lastSwingT = time;
    P.chain = chain ? (P.chain || 0) + 1 : 0;
    if (onBeat && S.combo >= 3 && S.combo % 4 === 3) return 'spin';
    if (rage && P.chain % 3 === 2) return 'spin';
    return ['sweep', 'backhand', 'overhead', 'uppercut'][P.chain % 4];
  }
  const KNOCK = { sweep: 1, backhand: 1, overhead: .35, uppercut: .7, spin: 1.45 };
  const FLING = { sweep: 380, backhand: 380, overhead: 60, uppercut: 240, spin: 540 };
  function hammerSwing() {
    const S = MS.l3, P = player;
    if (P.meleeCD > 0) return;
    sideAssist(130, 1.9);
    const bp = beatPos(), fr = bp - Math.floor(bp), off = Math.min(fr, 1 - fr), onBeat = off < .19, rage = S.rageT > time;
    const move = nextMove(S, onBeat, rage), M = MOVES[move];
    P.meleeCD = rage ? .26 : .4; P.meleeT = .22; P.meleeA = P.a;
    const sw = P.swing = { t0: time, move, dur: M.dur * (rage ? .85 : 1), onBeat, rage, a: P.a };
    timers.push({ t: time + sw.dur * .14, fn: () => SFX.swish() });
    timers.push({ t: time + sw.dur * M.hit, fn: () => resolveSwing(sw) }); // the blow lands on the impact frame, not the click
  }
  function resolveSwing(sw) {
    const S = MS.l3, P = player; if (!S.corr || P.dead || !P.hammer || P.swing !== sw) return;
    const { onBeat, rage, move } = sw, a0 = sw.a;
    moveCircle(P, Math.cos(a0) * 12, Math.sin(a0) * 12, P.r, true); // he steps into it
    emitSound(P.x, P.y, { hear: 110, reveal: 120, col: 0, owner: 'player', str: .6 });
    let hits = 0, last = null;
    for (const e of enemies) {
      if (e.dead || e.hidden || e.type === 'cantor') continue;
      const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > 78 + e.r - 13 + (move === 'spin' ? 14 : 0)) continue;
      const a = Math.atan2(e.y - P.y, e.x - P.x);
      if ((move !== 'spin' && Math.abs(angDiff(a0, a)) > 1.3) || !los(P.x, P.y, e.x, e.y)) continue;
      hits++; last = e;
      const kb = (onBeat ? 78 : 42) * KNOCK[move];
      moveCircle(e, Math.cos(a) * kb, Math.sin(a) * kb, e.r, false);
      e.rx = { move, t0: time, side: move === 'backhand' ? -1 : 1 };
      if (!e.brawlHp) { e.brawlHp = 1; if (e.trueHp != null) e.trueHp += 2; else e.hp += 2; } // corridor fighters can take a hit
      damageEnemy(e, (onBeat ? 4 : 2) + (rage ? 1 : 0) + (move === 'overhead' || move === 'spin' ? 1 : 0), 'hammer', false);
      if (e.dead) { e.deathMove = move; e.cvx = Math.cos(a) * FLING[move]; e.cvy = Math.sin(a) * FLING[move]; } // the body goes where the blow sends it
      else { e.flinch = onBeat ? .55 : .28; e.note = null; e.cast = null; }
    }
    if (!hits) return;
    shake = Math.max(shake, (onBeat ? 11 : 7) + (move === 'overhead' ? 5 : 0)); sparks(last.x, last.y, a0, 14, 2, 480, .7);
    if (move === 'overhead') ring(last.x, last.y, 8, 70, 2, .35, 3); // the floor takes it too
    if (onBeat) {
      hitstop = Math.max(hitstop, move === 'spin' || move === 'overhead' ? .12 : .09); zoomPunch = Math.max(zoomPunch, .065);
      S.combo++; S.corr.beatHits = (S.corr.beatHits || 0) + hits; musStab(); mocoPunch();
      if (S.combo <= 1) comicWord(P.x + Math.cos(a0) * 40, P.y + Math.sin(a0) * 40 - 30, 'ON BEAT!', { col: INK.yellow, size: 22, life: .8 }); // after the first, the HUD keeps the count
    } else { hitstop = Math.max(hitstop, .05); S.combo = 0; }
    if (AU.ctx && !AU.muted) { tone({ vol: .22, dur: .25, f0: move === 'overhead' ? 95 : 120, f1: 45, echo: .4 }); noise({ vol: .2, dur: .15, f0: 900, f1: 200, echo: .3 }); }
  }
  function throwHammer() {
    const S = MS.l3, P = player;
    const tgt = enemies.find(e => !e.dead && e.wave === S.corr.wave);
    if (tgt && SV.on) P.a = Math.atan2(tgt.y - P.y, tgt.x - P.x); // side-on, depth is hard to judge: the throw finds him
    let a = P.a; if (tgt) { const at = Math.atan2(tgt.y - P.y, tgt.x - P.x); if (Math.abs(angDiff(a, at)) < 1.1) a = at; }
    S.thrown = { x: P.x, y: P.y, vx: Math.cos(a) * 820, vy: Math.sin(a) * 820, rot: 0, d: 0, tgt };
    moco(Math.cos(a) < 0 ? 'chaseE' : 'chaseW', .38, 2.2); // ride behind the hammer
    P.hammer = false; WEAP.knife.name = 'KNIFE'; S.corr.lastman = false;
    slowT = Math.max(slowT, 2.2);
    play('whoosh', { vol: .7 }); comicWord(P.x, P.y - 30, 'HRAAH!', { col: INK.white, size: 22 });
  }
  function updThrown(dt) { // the hammer cam: the camera rides the throw in slow motion
    const S = MS.l3, h = S.thrown; if (!h) return;
    const st = Math.hypot(h.vx, h.vy) * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.d += st; h.rot += dt * 18;
    const t = h.tgt;
    if (t && !t.dead && Math.hypot(t.x - h.x, t.y - h.y) < t.r + 16) {
      t.hp = 1; damageEnemy(t, 99, 'hammer', false);
      panelFreeze(t.x, t.y, 'THOOM!', INK.yellow); S.invertT = realT;
      S.thrown = null; pickups.push(revealable({ id: 'hammer' + (MS.nid++), type: 'hammer', ...safeSpot(t.x, t.y), taken: false, c: 2 }));
      return;
    }
    if (tileSolid(Math.floor(h.x / T), Math.floor(h.y / T)) || h.d > 1000) {
      h.x -= h.vx * dt * 2; h.y -= h.vy * dt * 2;
      sparks(h.x, h.y, 0, 12, 2, 300, PI); SFX.boom(h.x, h.y);
      pickups.push(revealable({ id: 'hammer' + (MS.nid++), type: 'hammer', ...safeSpot(h.x, h.y), taken: false, c: 2 }));
      S.thrown = null;
      if (enemies.some(e => !e.dead && e.wave === S.corr.wave)) showMsg('MISSED  ·  PICK THE HAMMER BACK UP', 1);
    }
  }
  function updCorridor(dt) {
    const S = MS.l3, C = S.corr, P = player;
    if (!C) return;
    if ((C.lightAcc = (C.lightAcc || 0) + dt) > .3) { C.lightAcc = 0; corridorLights(); }
    if (C.state === 'fight' && !C.pending && !C.advancing && C.wave >= 1 && C.wave <= 4 && !waveAlive()) waveCleared(null); // nobody left, however it happened
    // the beat
    const n = Math.floor(beatPos()); // the score carries the beat now (see musTick)
    if (n !== S.beatN && C.state !== 'intro') { S.beatN = n; S.pulseT = realT; }
    if (C.state === 'knife' && time >= C.knifeT) theKnife();
    updThrown(dt);
    // bullet time: you move, they wade
    if (S.btUntil > realT && realT - S.aiT > .045) { S.aiT = realT; afterimages.push({ x: P.x, y: P.y, a: P.a, t: time, w: P.walk, ma: P.moveA, ph: P.stepPh }); }
    if (S.btUntil > realT && realT - (S.heartT || 0) > .55) { S.heartT = realT; SFX.heart(.35); }
    if (S.btWas && S.btUntil < realT) play('whoosh', { vol: .5 });
    S.btWas = S.btUntil > realT;
    if (P.hp <= 1 && realT - (S.heartT || 0) > .8) { S.heartT = realT; SFX.heart(.5); }
    S.tilt = clamp(S.combo * .011, 0, .065) * S.tiltSign + (P.hp <= 1 ? .035 : 0) + (C.pile ? .02 : 0);
  }


  // ================= the corridor score =================
  // "The Choir" at 100 bpm in D minor (i - VI - iv - V): kick and a driving bass first, then string
  // ostinato and hats, then the choir itself and taiko, then a lead line over the pile. It keeps its own
  // clock so "on the beat" means on the music; bullet time drags the whole band down and muffles it.
  const MUS = { on: false, pos: 0, last: 0, sched: 0, f: 1, bus: null, lp: null, muteUntil: -9, slam: false };
  const PROG = [
    { root: 73.42, oct: 146.83, fifth: 110.0, arp: [293.66, 349.23, 440.0], choir: [146.83, 220.0, 349.23], lead: [440.0, 349.23, 329.63, 293.66] },
    { root: 58.27, oct: 116.54, fifth: 87.31, arp: [233.08, 293.66, 349.23], choir: [116.54, 174.61, 293.66], lead: [587.33, 523.25, 466.16, 440.0] },
    { root: 49.0, oct: 98.0, fifth: 73.42, arp: [196.0, 233.08, 293.66], choir: [146.83, 196.0, 233.08], lead: [466.16, 440.0, 392.0, 349.23] },
    { root: 55.0, oct: 110.0, fifth: 82.41, arp: [220.0, 277.18, 329.63], choir: [138.59, 164.81, 220.0], lead: [329.63, 349.23, 392.0, 554.37] },
  ];
  function beatPos() { // in beats: the music's clock while it plays, otherwise game time
    if (MUS.on && AU.ctx) return MUS.pos + (AU.ctx.currentTime - MUS.last) / BEAT * MUS.f;
    return (time - MS.l3.beat0) / BEAT;
  }
  function musBus() {
    const A = AU.ctx;
    if (MUS.bus && MUS.ctx === A) return;
    const g = A.createGain(); g.gain.value = 0;
    const lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 16000; lp.Q.value = .5;
    const comp = A.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .2;
    g.connect(lp); lp.connect(comp); comp.connect(AU.musVol || AU.sfx || AU.master);
    const rs = A.createGain(); rs.gain.value = .3; comp.connect(rs); rs.connect(AU.echo);
    MUS.bus = g; MUS.lp = lp; MUS.ctx = A;
  }
  function mEnv(g, t, att, peak, dur) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + att); g.gain.setTargetAtTime(0, t + att, Math.max(.01, dur / 3)); }
  function mOut(t, peak, att, dur, pan) {
    const A = AU.ctx, g = A.createGain(); mEnv(g, t, att, peak, dur);
    if (pan && A.createStereoPanner) { const p = A.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(MUS.bus); } else g.connect(MUS.bus);
    return g;
  }
  function mOsc(type, f, t, end, to, det) { const o = AU.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (det) o.detune.value = det; o.connect(to); o.start(t); o.stop(end); return o; }
  function mNoise(t, dur, filt, fq, q, to) { const A = AU.ctx, n = A.createBufferSource(); n.buffer = AU.noise; const f = A.createBiquadFilter(); f.type = filt; f.frequency.value = fq; if (q) f.Q.value = q; n.connect(f); f.connect(to); n.start(t, Math.random()); n.stop(t + dur); }
  const M = {
    kick(t, v) { const o = mOsc('sine', 130, t, t + .5, mOut(t, v, .003, .32)); o.frequency.exponentialRampToValueAtTime(44, t + .12); },
    taiko(t, v) { const o = mOsc('sine', 96, t, t + .8, mOut(t, v, .004, .55)); o.frequency.exponentialRampToValueAtTime(52, t + .25); mNoise(t, .4, 'lowpass', 280, 0, mOut(t, v * .6, .002, .16)); },
    hat(t, v, pan) { mNoise(t, .15, 'highpass', 7000, 0, mOut(t, v, .001, .04, pan)); },
    snare(t, v) { mNoise(t, .3, 'bandpass', 1900, .7, mOut(t, v, .002, .12)); mOsc('triangle', 190, t, t + .12, mOut(t, v * .5, .002, .06)); },
    bass(t, f, dur) {
      const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(260, t + dur);
      lp.connect(mOut(t, .2, .006, dur * .8));
      mOsc('sawtooth', f, t, t + dur * 2, lp); mOsc('sine', f, t, t + dur * 2, mOut(t, .22, .006, dur));
    },
    string(t, f, dur, v, pan) {
      const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = .7;
      lp.connect(mOut(t, v, .012, dur, pan));
      mOsc('sawtooth', f, t, t + dur * 3 + .1, lp, -7); mOsc('sawtooth', f, t, t + dur * 3 + .1, lp, 7);
    },
    choir(t, f, dur, v, pan) { // saws through three "ah" formants, with a slow vibrato: the choir, singing
      const A = AU.ctx, sum = A.createGain(), fs = [], end = t + dur * 3 + .6;
      sum.connect(mOut(t, v, .5, dur, pan));
      for (const [fq, q, k] of [[730, 7, 1], [1090, 9, .55], [2440, 10, .22]]) { const b = A.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = fq; b.Q.value = q; const bg = A.createGain(); bg.gain.value = k * 3; b.connect(bg); bg.connect(sum); fs.push(b); }
      for (const det of [-9, 0, 9]) {
        const o = A.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det;
        const lfo = A.createOscillator(), lg = A.createGain(); lfo.frequency.value = 5 + Math.random() * .6; lg.gain.value = f * .006; lfo.connect(lg); lg.connect(o.frequency);
        for (const b of fs) o.connect(b);
        o.start(t); o.stop(end); lfo.start(t); lfo.stop(end);
      }
    },
    lead(t, f, dur, v) {
      const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
      lp.connect(mOut(t, v, .02, dur, .1));
      mOsc('triangle', f, t, t + dur * 3, lp); mOsc('sawtooth', f, t, t + dur * 3, lp, 4);
    },
  };
  function musStep(s, t, L, st) { // one eighth note of the score
    const bar = PROG[Math.floor(s / 8) % 4], i = s % 8, beat = st * 2;
    if (MUS.slam) { MUS.slam = false; M.taiko(t, .6); M.kick(t, .6); for (const f of bar.choir) M.choir(t, f, beat * 4, .045, 0); } // the second wind lands on a downbeat
    if (i % 2 === 0) M.kick(t, L >= 2 ? .5 : .42);
    M.bass(t, [bar.root, bar.root, bar.oct, bar.root, bar.root, bar.root, bar.oct, bar.fifth][i], st * .9);
    if (L >= 2) {
      if (i % 2) M.hat(t, .03, .25); else if (L >= 4) M.hat(t, .015, -.25);
      const f = bar.arp[[0, 1, 2, 1, 0, 1, 2, 1][i]] * (L >= 4 && i >= 4 ? 2 : 1);
      M.string(t, f, st * .7, .05, i % 2 ? .3 : -.3);
    }
    if (L >= 3 && i === 0) bar.choir.forEach((f, k) => M.choir(t, f, beat * 4, .032, (k - 1) * .4));
    if (L >= 3 && i === 6) M.taiko(t, .32);
    if (L >= 4) {
      if (i === 2) M.taiko(t, .26);
      if (i === 7) M.taiko(t, .18);
      if (i % 2 === 0) M.lead(t, bar.lead[i / 2], beat * .95, .05);
      if (Math.floor(s / 8) % 4 === 3 && i >= 4) M.snare(t, .05 + (i - 4) * .025); // a roll into the top of the loop
    }
  }
  function musStart() {
    musBus();
    const A = AU.ctx, now = A.currentTime;
    MUS.bus.gain.cancelScheduledValues(now); MUS.bus.gain.setValueAtTime(MUS.bus.gain.value, now); MUS.bus.gain.linearRampToValueAtTime(.5, now + .4);
    MUS.on = true; MUS.pos = 0; MUS.last = now; MUS.sched = 0; MUS.f = 1; MUS.slam = false;
  }
  function musStop(fade) {
    MUS.on = false;
    if (MUS.bus && AU.ctx) { const now = AU.ctx.currentTime; MUS.bus.gain.cancelScheduledValues(now); MUS.bus.gain.setTargetAtTime(0, now, (fade || .8) / 3); }
  }
  function musEnd() { // the corridor's last chord, ringing out
    if (!MUS.on || !AU.ctx) return musStop();
    const t = AU.ctx.currentTime + .05, bar = PROG[0];
    M.taiko(t, .7); M.kick(t, .6); M.bass(t, bar.root, 2.4);
    bar.choir.forEach((f, k) => M.choir(t, f, 2.6, .05, (k - 1) * .4));
    bar.arp.forEach((f, k) => M.string(t, f, 1.6, .045, (k - 1) * .3));
    MUS.on = false;
    MUS.bus.gain.cancelScheduledValues(t); MUS.bus.gain.setValueAtTime(.5, t); MUS.bus.gain.setTargetAtTime(0, t + 2.6, 1);
  }
  function musStab() { // an on-beat hit adds a string stab to the bar
    if (!MUS.on || !AU.ctx) return;
    const t = AU.ctx.currentTime, bar = PROG[Math.floor(MUS.pos / 4) % 4];
    bar.arp.forEach((f, k) => M.string(t, f * 2, .16, .03, (k - 1) * .35));
  }
  function musTick(dt) {
    const S = MS.l3, C = S && S.corr, P = player, A = AU.ctx;
    const want = !!(A && !AU.muted && AU.noise && C && MS.phase === 'corridor' && C.state !== 'intro' && !P.dead && state === 'playing');
    if (!want) { if (MUS.on && state !== 'paused') musStop(P.dead ? 1.4 : .8); return; }
    if (!MUS.on) musStart();
    const now = A.currentTime, bt = S.btUntil > realT, tf = bt ? .5 : slowT > 0 ? .75 : 1;
    MUS.pos += (now - MUS.last) / BEAT * MUS.f; MUS.last = now;
    MUS.f = lerp(MUS.f, tf, 1 - Math.exp(-dt * 5));
    MUS.lp.frequency.setTargetAtTime(bt ? 900 : slowT > 0 ? 3500 : 16000, now, .12);
    const L = clamp((C.pile || C.wave >= 4 ? 4 : C.wave) + (S.rageT > time ? 1 : 0), 1, 4), st = BEAT / 2 / MUS.f;
    if (MUS.sched < MUS.pos * 2 - 1) MUS.sched = Math.ceil(MUS.pos * 2); // back from a pause: skip the backlog
    while (MUS.sched / 2 < MUS.pos + .15 * MUS.f / BEAT) {
      const t = now + Math.max(0, (MUS.sched / 2 - MUS.pos) * BEAT / MUS.f);
      if (realT >= MUS.muteUntil) musStep(MUS.sched, t, L, st);
      MUS.sched++;
    }
  }

  // ================= THE CANTOR =================
  function startBoss(fromCp) {
    const S = MS.l3, P = player;
    if (S.boss) return;
    MS.phase = 'boss'; S.corr = null; S.thrown = null; CAMZ = 1;
    P.hammer = false; WEAP.knife.name = 'KNIFE'; if (P.weapon === 'knife' && S.prevWeapon) P.weapon = S.prevWeapon;
    if (!fromCp || Math.hypot(P.x - LV.hall.arrive[0] * T, P.y - LV.hall.arrive[1] * T) > 400) { [P.x, P.y] = L3T(LV.hall.arrive[0] - .5, LV.hall.arrive[1] - .5); }
    cam.x = P.x; cam.y = P.y;
    restockForBoss(); P.meds = Math.max(P.meds || 0, 2); // the last fight: walk in with something in your pocket
    const [sx, sy] = LV.hall.seat, e = makeEnemy('cantor', sx * T, sy * T, 'cantor');
    e.cantor = true; e.trueHp = e.maxHp = Math.round(48 / DIFF_NOW().boss); // Easy 34 · Medium 48 · Hard 60; stage three still opens at 12 e.state = 'seated'; e.hp = 99; e.r = 22; e.a = PI / 2; e.know = null; e.cd = 2;
    enemies.push(e);
    S.boss = { e, stage: 1, pipes: LV.hall.pipes.map(([x, y], i) => ({ i, x: (x + .5) * T, y: (y + .62) * T, hp: 2, gone: false, charge: -1, vuln: 0, hurtT: -9 })), pipeT: 2.5, addT: 4, stealT: 6, herPing: 3, cloneT: 4, fakeT: 3, heartT: 0, transit: false };
    if (!fromCp) saveCheckpoint();
    if (fromCp) {
      const st = S.cpStage || (checkpoint && checkpoint.bossStage) || 1, B = S.boss;
      if (st >= 2) { // a death after the organ falls doesn't send you back to it: she's already standing
        for (const p of B.pipes) p.gone = true;
        B.stage = st; e.state = 'idle'; e.cd = 2; e.y += 70; e.gy = e.y;
        if (st === 3) { e.trueHp = Math.min(e.trueHp, 12); S.mask = 1; B.stealT = 3; }
        callout(st === 3 ? 'THE CONSUMPTION' : 'SHE RISES', st === 3 ? "SHE'S TAKING YOUR ECHO · END IT BEFORE IT'S ALL GONE" : 'SHE SLAMS · SHE SINGS · SHE HUSHES THE ROOM', 1, true);
        return;
      }
      callout('THE CANTOR', 'BREAK THE ORGAN · DASH THROUGH THE SOUND', 1, true); return;
    }
    S.boss.transit = true;
    playCutscene([
      { cam: [sx * T, (sy + 2) * T, .8], dur: 1.8, fn: () => { emitSound(sx * T, sy * T, { hear: 0, reveal: 900, col: 1, owner: 'env', str: 1.1, force: true }); SFX.boom(sx * T, sy * T); } },
      { say: ['THRONE', 'You came home, little echo.'], keep: true },
      { cam: () => [player.x, player.y, 1.1], say: ['ECHO', "That song. You're humming her song."], keep: true },
      { cam: [sx * T, (sy + 2) * T, .9], say: ['THRONE', 'I hum what the choir gives me. Every voice in this building is mine.'], keep: true },
      { cam: () => [player.x, player.y, 1.1], say: ['ECHO', 'Not mine.'], keep: true },
      { cam: [sx * T, (sy + 2) * T, 1], say: ['THRONE', 'Not yet.'], keep: true },
    ], () => { S.boss.transit = false; callout('THE CANTOR', 'BREAK THE ORGAN · DASH THROUGH THE SOUND', 1, true); });
  }
  function pipeHit(p, dmg) {
    const B = MS.l3.boss; if (!B || p.gone) return;
    if (p.charge < 0 && p.vuln <= 0) { if (time > (p.clangT || 0)) { p.clangT = time + .3; popups.push({ x: p.x, y: p.y - 46, text: 'SEALED', t: time, c: 3, size: 14, vy: -12 }); tone({ vol: .12, dur: .3, f0: 1500, f1: 1400, type: 'triangle', echo: .4 }); } return; }
    p.hp -= dmg; p.hurtT = time; sparks(p.x, p.y, rand(0, TAU), 10, 1, 380, .8);
    if (p.hp > 0) return;
    p.gone = true; p.charge = -1; p.vuln = 0;
    comicWord(p.x, p.y - 50, 'KRANG!', { col: INK.yellow, size: 28, burst: true, burstCol: INK.red, range: 2600 });
    ring(p.x, p.y, 8, 130, 1, .5, 4); smoke(p.x, p.y, 5, .8); shake = Math.max(shake, 10); hitstop = Math.max(hitstop, .06);
    emitSound(p.x, p.y, { hear: 0, reveal: 420, col: 1, owner: 'env', str: 1, force: true });
    B.e.hurtT = time;
    const left = B.pipes.filter(q => !q.gone).length;
    popups.push({ x: B.e.x, y: B.e.y - 70, text: `ORGAN  ${left}/6`, t: time, c: 1, size: 18, vy: -16, pop: true });
    if (!left) toStage2();
  }
  function hallDrop() { // a medkit and ammo, far from her
    const e = MS.l3.boss.e, spots = [[10, 3], [53, 3], [10, 13], [53, 13], [24, 13], [39, 13]].map(([x, y]) => ({ x: (x + .5) * T, y: (y + .5) * T })).sort((a, b) => Math.hypot(b.x - e.x, b.y - e.y) - Math.hypot(a.x - e.x, a.y - e.y));
    ['med', 'ammo'].forEach((type, i) => { const s = spots[i]; pickups.push(revealable({ id: 'drop' + (MS.nid++), type, x: s.x, y: s.y, taken: false, c: 2 })); emitSound(s.x, s.y, { hear: 0, reveal: 160, col: 2, owner: 'heart', str: 1, force: true }); comicWord(s.x, s.y - 22, i ? 'CLUNK!' : 'SUPPLIES!', { col: INK.yellow, size: 18, range: 2400 }); });
  }
  function toStage2() {
    const S = MS.l3, B = S.boss, e = B.e;
    hallDrop();
    B.stage = 2; B.transit = true; e.state = 'idle'; e.cd = 1.5; MS.shocks = [];
    S.invertT = realT; slowT = Math.max(slowT, 1.2); shake = Math.max(shake, 18);
    comicWord(e.x, e.y - 60, 'RRRUMMBLE!', { col: INK.red, size: 34, burst: true, burstCol: INK.yellow, range: 3000, life: 1.6 });
    playCutscene([
      { cam: () => [e.x, e.y + 60, 1.05], dur: 1.2, fn: () => { SFX.boom(e.x, e.y); for (let i = 0; i < 3; i++) ring(e.x, e.y, 10, 160 + i * 80, 1, .6 + i * .2, 4); } },
      { say: ['THRONE', 'Then hear me properly.'], keep: true, fn: () => { e.y += 70; e.gy = e.y; } },
    ], () => { B.transit = false; callout('SHE RISES', 'SHE SLAMS · SHE SINGS · SHE HUSHES THE ROOM', 1, true); saveCheckpoint(); });
  }
  function toStage3() {
    const S = MS.l3, B = S.boss, e = B.e;
    hallDrop();
    B.stage = 3; B.transit = true; e.state = 'idle'; e.cd = 2; MS.shocks = []; S.hushT = -9;
    S.invertT = realT;
    playCutscene([
      { cam: () => [e.x, e.y, 1.35], dur: 1, fn: () => { slowT = Math.max(slowT, 1); } },
      { say: ['THRONE', 'Enough. Your echo is the last voice I do not have.'], keep: true },
      { dur: 2.2, fn: () => { // the mask breaks, and the forty voices she spoke with fall away from hers
        S.mask = 1; panelFreeze(e.x, e.y, 'KRAK!', INK.white); comicWord(e.x, e.y - 50, 'KRAK!', { col: INK.white, size: 30 }); play('shatter', { vol: .8 });
        if (AU.ctx && !AU.muted) [110, 138.6, 164.8, 207.7, 261.6].forEach((f, i) => tone({ vol: .07, dur: 2.2, f0: f, f1: f * .5, type: 'sawtooth', echo: .85, attack: .02, delay: i * .03 }));
        timers.push({ t: time + .9, cine: true, fn: () => comicWord(e.x, e.y - 96, 'THE CHOIR FALLS SILENT', { col: INK.white, size: 14, life: 1.6, range: 3000 }) });
      } },
      { cam: () => [player.x, player.y, 1.2], say: ['ECHO', '...Lena?'], keep: true },
      { cam: () => [e.x, e.y, 1.3], say: ['CANTOR', 'Who is Lena?'], keep: true },
      { cam: () => [player.x, player.y, 1.25], dur: 3.2, fn: () => { // he hums her four notes
        const N = [440, 523.25, 659.25, 587.33];
        if (AU.ctx && !AU.muted) N.forEach((f, i) => tone({ vol: .1, dur: .62, f0: f * .5, type: 'sine', attack: .08, echo: .7, delay: .2 + i * .62 }));
        comicWord(player.x, player.y - 40, 'hmm  hmm  hmm  hmm', { col: INK.cyan, size: 15, life: 2.6 });
      } },
      { cam: () => [e.x, e.y - 60, 1.45], dur: 2.4, camDur: .7, fn: () => { // and the last one comes back from her, before she knows it
        if (AU.ctx && !AU.muted) tone({ vol: .09, dur: 1.1, f0: 587.33, type: 'triangle', attack: .1, echo: .8, delay: .7 });
        comicWord(e.x + 34, e.y - 168, '...hmm', { col: INK.white, size: 20, life: 1.7, delay: .7, range: 3000 });
      } },
      { cam: () => [e.x, e.y, 1.35], say: ['CANTOR', '...Why do I know that?'], keep: true },
      { cam: () => [player.x, player.y, 1.15], say: ['ECHO', "Because it's yours. They took everything else."], keep: true },
      { cam: () => [e.x, e.y, 1.35], say: ['CANTOR', '...No. I taught it to you. So you would come to me when you were ready.'], keep: true },
      { cam: () => [e.x, e.y, 1.45], say: ['CANTOR', 'And now you are.'], keep: true },
    ], () => { B.transit = false; B.stealT = 3; callout('THE CONSUMPTION', "SHE'S TAKING YOUR ECHO · END IT BEFORE IT'S ALL GONE", 1, true); saveCheckpoint(); });
  }
  function cantorHurt(e, dmg, cause) {
    const S = MS.l3, B = S.boss; if (!B) return;
    e.hp = 99; e.hurtT = time; e.litS = 1.2; e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a;
    if (B.stage === 1 || B.transit || S.giveIt) { if (time > (e.clangT || 0)) { e.clangT = time + .35; popups.push({ x: e.x, y: e.y - 60, text: B.stage === 1 ? 'THE CHOIR SHIELDS HER' : 'NO EFFECT', t: time, c: 3, size: 15, vy: -14, pop: true }); } return; }
    const blade = cause === 'strike' || cause === 'knife' || cause === 'hammer';
    if (!blade) { if (time < (e.dmgCD || 0)) return; e.dmgCD = time + .45; } // bullets chip at her; they can't shred her
    const d = blade ? 3 : 1;
    e.trueHp = Math.max(B.stage === 3 ? 1 : 0, e.trueHp - d);
    hitMark = { t: realT, kill: false };
    popups.push({ x: e.x, y: e.y - 60, text: `-${d}`, t: time, c: 1, size: 20, vy: -22, pop: true });
    sparks(e.x, e.y, Math.atan2(e.y - player.y, e.x - player.x), 10, 1, 420, .6);
    if (e.state === 'windnote' || e.state === 'windslam') { e.state = 'idle'; e.cd = .6; popups.push({ x: e.x, y: e.y - 80, text: 'INTERRUPTED', t: time, c: 0, size: 14, vy: -12 }); }
    if (B.stage === 2 && e.trueHp <= 12) toStage3();
  }
  function cantorStep(e, near) {
    const P = player, S = MS.l3;
    for (let i = 0; i < 6; i++) afterimages.push({ x: lerp(e.x, e.x, i / 6), y: e.y, a: e.a, t: time - i * .03, w: 0, enemy: 'singer' });
    sparks(e.x, e.y, 0, 14, 1, 300, PI);
    const ang = Math.atan2(P.y - e.y, P.x - e.x) + PI + rand(-1.2, 1.2), d = near ? rand(90, 140) : rand(220, 330);
    const s = safeSpot(clamp(P.x + Math.cos(ang) * d, 9.5 * T, 54.5 * T), clamp(P.y + Math.sin(ang) * d, 3.5 * T, 13.5 * T));
    e.x = s.x; e.y = s.y; e.path = null;
    if (!S.stolen.has('c')) { e.litS = 1.1; e.litT = time; e.gx = e.x; e.gy = e.y; }
    comicWord(e.x, e.y - 46, 'VMMM', { col: INK.red, size: 18, life: .6 });
    const s2 = spat(e.x, e.y, 1500); if (AU.ctx && !AU.muted) tone({ pan: s2.pan, vol: .14 * s2.vol + .02, dur: .35, f0: 1300, f1: 300, type: 'sine', echo: .6 });
  }
  function updCantor(e, dt) {
    const S = MS.l3, B = S.boss, P = player; if (!B) return;
    e.hp = 99; e.moveAmt = Math.max(0, e.moveAmt - dt * 3);
    const cloaked = B.stage === 3 && S.stolen.has('c') && e.state !== 'windslam' && e.state !== 'windnote' && Math.hypot(P.x - e.x, P.y - e.y) > 110;
    if (!cloaked) { e.litS = Math.max(e.litS, .9); e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a; e.gw = e.walk; e.gmove = e.moveAmt; }
    if (B.transit || P.dead) return;
    const dP = Math.hypot(P.x - e.x, P.y - e.y), aP = Math.atan2(P.y - e.y, P.x - e.x);
    e.a = turnTo(e.a, aP, dt * 3);
    if (B.stage === 1) { [e.x, e.y] = [LV.hall.seat[0] * T, LV.hall.seat[1] * T]; return; }
    if (S.giveIt) { e.x += Math.sin(realT * 23) * .8; e.y += Math.cos(realT * 19) * .8; return; } // swollen with stolen echo, shaking
    switch (e.state) {
      case 'windslam':
        e.wT -= dt; if (e.wT <= 0) {
          e.state = 'idle'; e.cd = B.stage === 3 ? 1.1 : 1.5;
          MS.shocks.push({ x: e.x, y: e.y, r: 24, v: 480, max: 820, hit: false });
          for (let k = 1; k < (B.stage === 3 ? 3 : 2); k++) { const x = e.x, y = e.y; timers.push({ t: time + k * .38, fn: () => { if (MS.l3.boss) MS.shocks.push({ x, y, r: 24, v: 480, max: 820, hit: false }); } }); }
          SFX.boom(e.x, e.y); shake = Math.max(shake, 12); ring(e.x, e.y, 10, 110, 1, .4, 4);
          comicWord(e.x, e.y - 50, 'THOOM!', { col: INK.red, size: 26, range: 2400 });
          emitSound(e.x, e.y, { hear: 0, reveal: 420, col: 1, owner: 'heart', str: 1, force: true });
          if (dP < 75 && P.iframe <= 0) { MS.hitBy = { by: 'cantor', t: time }; damagePlayer(1, e.x, e.y); }
        }
        return;
      case 'windnote':
        e.wT -= dt; if (e.wT > .15) e.a = turnTo(e.a, aP, dt * 3.2);
        if (e.wT <= 0) {
          e.state = 'idle'; e.cd = B.stage === 3 ? 1 : 1.4; e.noteFX = { t: time, a: e.a, big: true };
          emitSound(e.x, e.y, { hear: 0, reveal: 480, col: 1, owner: 'heart', str: 1, force: true });
          if (AU.ctx && !AU.muted) { noise({ vol: .3, dur: .5, f0: 3200, f1: 800, type: 'bandpass', q: 2, echo: .6 }); tone({ vol: .18, dur: .6, f0: 990, f1: 660, type: 'sawtooth', echo: .6 }); }
          if (dP < 430 && Math.abs(angDiff(e.a, aP)) < .58 && P.iframe <= 0) { MS.hitBy = { by: 'cantor', t: time }; damagePlayer(1, e.x, e.y); moveCircle(P, Math.cos(aP) * 110, Math.sin(aP) * 110, P.r, true); }
        }
        return;
    }
    // ---- idle: hover at a distance, then choose
    const want = B.stage === 3 ? 260 : 220;
    if (dP > want + 70) navTo(e, P.x, P.y, B.stage === 3 ? 150 : 115, dt);
    else if (dP < want - 90) { const ox = e.x, oy = e.y; moveCircle(e, -Math.cos(aP) * 90 * dt, -Math.sin(aP) * 90 * dt, e.r, false); e.walk += Math.hypot(e.x - ox, e.y - oy) * .1; e.moveAmt = .6; }
    // the hush: five seconds of nothing but her heartbeat
    if (S.hushT > time) {
      if ((B.heartT -= dt) <= 0) { B.heartT = .9; emitSound(e.x, e.y, { hear: 0, reveal: 210, col: 1, owner: 'heart', str: 1, force: true }); SFX.heart(.4); }
      if (dP < 90 && e.cd <= 0) { e.state = 'windslam'; e.wT = e.wT0 = .55; }
      e.cd -= dt; return;
    }
    if (B.stage === 3) stage3Powers(e, dt, dP);
    B.far = dP > 320 ? (B.far || 0) + dt : 0;
    if (B.far > 2.5) { B.far = 0; cantorStep(e, true); e.state = 'windslam'; e.wT = e.wT0 = .5; return; } // keep your distance too long and she's right there
    e.cd -= dt; if (e.cd > 0) return;
    const r = Math.random();
    if (B.stage === 2 && time > (B.hushCD || 0) && r < .22) {
      B.hushCD = time + 15; S.hushT = time + 5; B.heartT = .2; e.cd = .5;
      radio('THRONE', 'Hush.');
      callout('HUSH', 'NO ECHO · ONLY HER HEARTBEAT', 1, true);
      return;
    }
    if (dP < 230 && r < .55) { e.state = 'windslam'; e.wT = e.wT0 = B.stage === 3 ? .6 : .75; ring(e.x, e.y, 6, 90, 1, .75, 3); return; }
    if (dP < 420 && los(e.x, e.y, P.x, P.y) && r < .85) { e.state = 'windnote'; e.wT = e.wT0 = B.stage === 3 ? .55 : .7; if (AU.ctx && !AU.muted) tone({ vol: .12, dur: e.wT0, f0: 300, f1: 900, type: 'sawtooth', echo: .5, attack: .15 }); return; }
    cantorStep(e, false); e.cd = 1;
  }
  function stage3Powers(e, dt, dP) { // she uses what she took
    const S = MS.l3, B = S.boss, P = player;
    if ((B.stealT -= dt) <= 0) {
      const k = STEAL.find(x => !S.stolen.has(x));
      if (k) steal(k);
      B.stealT = e.trueHp <= 1 ? 1.6 : 7;
    }
    if (e.trueHp <= 1 && S.stolen.size >= 3 && !S.giveIt) return giveIt();
    if (S.stolen.has('q') && (B.herPing -= dt) <= 0) { // her sonar finds you
      B.herPing = 4.5; emitSound(e.x, e.y, { hear: 0, reveal: 900, col: 1, owner: 'heart', str: .9, force: true });
      for (const o of enemies) if (!o.dead && o !== e) o.know = { x: P.x, y: P.y, t: time };
      if (dP > 300) cantorStep(e, true);
    }
    if (S.stolen.has('g') && (B.cloneT -= dt) <= 0) { // your own phantom, sent at you
      B.cloneT = 9;
      if (enemies.filter(o => !o.dead && o.type === 'clone').length < 3) for (let k = 0; k < 2; k++) { const s = safeSpot(e.x + rand(-60, 60), e.y + rand(-60, 60)); const c = makeEnemy('clone', s.x, s.y, 'c' + (MS.nid++)); c.state = 'hunt'; enemies.push(c); comicWord(s.x, s.y - 30, 'VMMM', { col: INK.red, size: 16 }); }
    }
    if (S.stolen.has('e') && (B.fakeT -= dt) <= 0) { B.fakeT = 6; for (let k = 0; k < 2; k++) { const a = rand(0, TAU), d = rand(220, 380), x = P.x + Math.cos(a) * d, y = P.y + Math.sin(a) * d; if (passable(Math.floor(x / T), Math.floor(y / T))) addFake(x, y, 'hunter', 6, { x: P.x, y: P.y }); } }
    if (S.stolen.has('sp') && time > (B.stepAt || 0)) { B.stepAt = time + 2.6; if (e.state === 'idle') cantorStep(e, Math.random() < .5); }
  }
  function steal(k) {
    const S = MS.l3, B = S.boss, P = player, e = B.e;
    S.stolen.add(k); S.stealFX = { k, t: realT };
    shake = Math.max(shake, 9); S.invertT = realT;
    for (let i = 0; i < 26; i++) { const t = i / 26; pp({ k: 'spark', x: lerp(P.x, e.x, t), y: lerp(P.y, e.y, t), vx: (e.x - P.x) * .8, vy: (e.y - P.y) * .8, life: .5, max: .5, c: 0, s: 1.6, drag: 1 }); }
    callout(`SHE TOOK YOUR ${STEAL_NAME[k]}`, k === 'sp' ? 'NO DASH · NO STRIKE · ONLY YOU' : 'AND NOW SHE USES IT', 1, true);
    comicWord(P.x, P.y - 40, 'TAKEN!', { col: INK.red, size: 24 });
    if (AU.ctx && !AU.muted) tone({ vol: .2, dur: .8, f0: 1400, f1: 120, type: 'sine', echo: .7 });
    if (S.stolen.size === 1) radio('CANTOR', 'Mine.');
    if (k === 'sp') radio('CANTOR', "Now you're only a blind man.");
    if (k === 'c') thought("I can't hear her anymore. She's using my silence.");
  }
  function giveIt() {
    const S = MS.l3; S.giveIt = true; MS.shocks = [];
    for (const o of enemies) if (!o.dead && o.type === 'clone') { o.hp = 1; damageEnemy(o, 9, 'blast', false); }
    radio('CANTOR', 'More... give me more!');
    callout('SHE CAN\'T HOLD IT', '[Q]  GIVE IT ALL', 0, true);
  }
  function triggerFinale() {
    const S = MS.l3, B = S.boss, e = B.e;
    S.giveIt = false; MS.phase = 'finale'; B.transit = true;
    S.invertT = realT; slowT = Math.max(slowT, 2.4); shake = Math.max(shake, 24); zoomPunch = .15;
    comicWord(e.x, e.y - 60, 'BWAAAMM!', { col: INK.white, size: 44, burst: true, burstCol: INK.red, range: 4000, life: 2 });
    for (let i = 0; i < 4; i++) ring(e.x, e.y, 10, 200 + i * 140, i % 2 ? 0 : 1, .8 + i * .2, 5);
    emitSound(player.x, player.y, { hear: 0, reveal: 2600, col: 0, owner: 'heart', str: 1.3, force: true });
    if (AU.ctx && !AU.muted) { tone({ vol: .3, dur: 3, f0: 55, f1: 30, echo: .9 }); noise({ vol: .4, dur: 3, f0: 4000, f1: 200, echo: .9 }); }
    timers.push({ t: time + 1.4, fn: () => {
      stopRain(); voStopAll();
      if (!window.EchoPrologue || !window.EchoPrologue.playSet) return startSilence();
      state = 'prologue';
      window.EchoPrologue.playSet('finale', () => startSilence());
    } });
  }

  // ================= SILENCE: the walk home, truly blind =================
  function startSilence() {
    const S = MS.l3, P = player;
    state = 'playing'; MS.phase = 'silence'; fadeT = realT; CAMZ = 1;
    for (const e of enemies) { if (!e.dead) e.overload = true; e.dead = true; e.hidden = true; e.dieT = e.dieT ?? -99; e.corpseA = e.corpseA ?? e.a; e.litS = 0; e.litT = -99; }
    MS.shocks = []; MS.rq = []; MS.radio = null; MS.call = null; S.boss = null; S.hushT = -9;
    S.stolen = new Set(STEAL);
    P.dead = false; P.hp = Math.max(1, P.hp); P.iframe = 9999; P.strike = null;
    [P.x, P.y] = L3T(31, 6); cam.x = P.x; cam.y = P.y;
    S.silence = { t0: time, noteT: 2.4, noteAt: -9, said: 0, end: false, bumpT: 0, dest: { x: 53.5 * T, y: 13.6 * T }, walkHint: realT };
  }
  function updSilence(dt) {
    const S = MS.l3, Z = S.silence, P = player; if (!Z) return;
    const d = Math.hypot(P.x - Z.dest.x, P.y - Z.dest.y), el = time - Z.t0;
    if ((Z.noteT -= dt) <= 0) { Z.noteT = 4.4; Z.noteAt = realT; if (!play('lena', { x: Z.dest.x, y: Z.dest.y, range: 2600, vol: .95, rev: .55, jit: 0 }) && AU.ctx && !AU.muted) [440, 523.25, 659.25, 587.33].forEach((f, i) => tone({ vol: .08, dur: .5, f0: f, f1: f, type: 'triangle', echo: .7, delay: i * .55 })); }
    if (el > 2.5 && Z.said === 0) { Z.said = 1; thought('No shapes. No walls. Just dark.'); }
    if (el > 9 && Z.said === 1) { Z.said = 2; thought('...Four notes.'); }
    if (el > 16 && Z.said === 2) { Z.said = 3; thought('So I always find my way home.'); }
    if (d < 70 && !Z.end) {
      Z.end = true; radio('MARCUS', "I've got you. Let's go home.");
      timers.push({ t: time + 3.4, fn: () => radio('MARCUS', 'The lab logs were signed, Elias. Every page. Every name.') });
      timers.push({ t: time + 8, fn: () => radio('MARCUS', 'The first signature is hers. Dated the night you lost your eyes.') });
      timers.push({ t: time + 13.4, fn: () => thought('She was never lost. She was calling me in.') });
      timers.push({ t: time + 17.4, fn: endGame });
    }
    const pushing = K.KeyW || K.KeyA || K.KeyS || K.KeyD || K.ArrowUp || K.ArrowDown || K.ArrowLeft || K.ArrowRight;
    if (pushing && P.speedNow < 30 && realT - Z.bumpT > .55) { Z.bumpT = realT; shake = Math.max(shake, 2.5); if (AU.ctx && !AU.muted) { tone({ vol: .16, dur: .18, f0: 90, f1: 55, echo: .1 }); noise({ vol: .08, dur: .08, f0: 600, f1: 200, echo: .05 }); } }
  }
  function endGame() { // the score card first; the ending and THE END follow it (playEpilogue)
    voStopAll();
    win();
  }

  // ================= update =================
  function updL3(dt) {
    const S = MS.l3, P = player;
    if (MS.phase === 'silence') return updSilence(dt);
    for (const m of S.masts) if (!m.gone && (m.humT -= dt) <= 0) {
      m.humT = 2.6;
      if (Math.hypot(m.x - P.x, m.y - P.y) < 1200) { emitSound(m.x, m.y, { hear: 0, reveal: 100, col: 2, owner: 'env', str: .85 }); const s = spat(m.x, m.y, 1200); if (AU.ctx && !AU.muted) tone({ pan: s.pan, vol: .06 * s.vol, dur: 1.2, f0: 440, f1: 441, type: 'triangle', echo: .7, attack: .1 }); }
    }
    // the choir's pad, under everything, while the masts still carry it
    if (MS.phase === 'ascent' && (S.padT -= dt) <= 0) { S.padT = 7; const n = S.masts.filter(m => !m.gone).length; if (n && AU.ctx && !AU.muted) [196, 233.1, 293.7].forEach((f, i) => tone({ vol: .018 * n, dur: 6.5, f0: f, f1: f * 1.003, type: 'triangle', echo: .8, attack: 2, delay: i * .05 })); }
    const hz = humAt(P.x, P.y); S.inHum = hz;
    if (hz && !MS.said.hum) { MS.said.hum = 1; thought("The hum's in everything. My echo dies a few feet out."); callout('THE HUM', 'YOUR PING AND YOUR STEPS ARE MUFFLED HERE', 2); }
    updHushers();
    // candles: a little light that never needs your echo
    if ((S.candleT -= dt) <= 0) { S.candleT = 1.1; for (const [cx, cy] of LV.candles) { const x = (cx + .5) * T, y = (cy + .5) * T; if (Math.abs(x - cam.x) < 900 && Math.abs(y - cam.y) < 700) emitSound(x, y, { hear: 0, reveal: 120, col: 2, owner: 'env', str: .6, force: true, ring: 0 }); } }
    if (MS.phase === 'climb' && !P.dead) { const ty = P.y / T, tx = P.x / T; if (ty < 22 && ty > 18.8 && tx < LV.corr.enter) startCorridor(); }
    if (MS.phase === 'corridor' || MS.phase === 'elevator' || MS.phase === 'boss') MS.toolCD = Math.max(MS.toolCD || 0, 3); // no ringers or clickers in the brawl or the throne room
    if (MS.phase === 'corridor' || MS.phase === 'elevator') updCorridor(dt);
    if (MS.phase === 'elevator' && !P.dead && P.x / T < LV.corr.elevator && Math.abs(P.y / T - LV.corr.y) < 2.2) elevator();
    if (MS.phase === 'boss' && S.boss && !S.boss.transit) updBossArena(dt);
  }
  function elevator() {
    const S = MS.l3, P = player;
    MS.phase = 'bossgo'; S.corr = null; S.whip = null; CAMZ = 1;
    playCutscene([
      { cam: L3T(4.5, 20), dur: 1.4, move: { o: P, x: 4.6 * T, y: 20.5 * T } },
      { card: ['GOING UP', 'THE CHOIR CORRIDOR  ·  ONE TAKE', 2.8, INK.yellow], dur: 2.8, fn: () => { if (AU.ctx && !AU.muted) [440, 523.25, 659.25, 587.33].forEach((f, i) => tone({ vol: .07, dur: .45, f0: f, f1: f, type: 'triangle', echo: .7, delay: .4 + i * .32 })); } },
    ], () => startBoss(false));
  }
  function updBossArena(dt) {
    const S = MS.l3, B = S.boss, e = B.e;
    if (B.stage === 1) { // the organ: two pipes light, then fire rings across the floor
      for (const p of B.pipes) {
        if (p.gone) continue;
        if (p.vuln > 0) p.vuln -= dt;
        if (p.charge >= 0) { p.charge -= dt; if (p.charge < 0) { p.vuln = 1; MS.shocks.push({ x: p.x, y: p.y + 24, r: 18, v: 440, max: 1000, hit: false }); SFX.boom(p.x, p.y); emitSound(p.x, p.y, { hear: 0, reveal: 340, col: 1, owner: 'env', str: 1, force: true }); } }
      }
      if ((B.pipeT -= dt) <= 0) {
        const live = B.pipes.filter(p => !p.gone && p.charge < 0);
        B.pipeT = 3.6 - (6 - B.pipes.filter(p => !p.gone).length) * .25;
        for (let k = 0; k < 2 && live.length; k++) { const p = live.splice((Math.random() * live.length) | 0, 1)[0]; p.charge = 1.1; if (AU.ctx && !AU.muted) tone({ vol: .08, dur: 1.1, f0: 110, f1: 220, type: 'sawtooth', echo: .5, attack: .3 }); }
        if (!MS.said.organ) { MS.said.organ = 1; thought('The pipes open when they fire. Hit them then.'); }
      }
    }
    if (B.stage < 3 && (B.addT -= dt) <= 0) { // her choir answers
      B.addT = 9;
      if (enemies.filter(o => !o.dead && o.type === 'singer').length < 2) { const [x, y] = Math.random() < .5 ? L3T(9, 8) : L3T(54, 8); const a = makeEnemy('singer', x, y, 'a' + (MS.nid++)); a.trueHp = 2; enemies.push(a); SFX.door(x, y); }
    }
  }

  // ================= engine hooks =================
  { const f = initPhases; initPhases = function (cp) { f(cp); if (LV.id === 3) initPhases3(cp); }; }
  { const f = objective; objective = function () { return on3() ? objective3() : f(); }; }
  { const f = objectiveSrc; objectiveSrc = function (kp) { return on3() ? objectiveSrc3() : f(kp); }; }
  { const f = updPhases; updPhases = function (dt) { f(dt); if (on3()) updL3(dt); else plantClues(); }; }
  function plantClues() { // Issues #1 and #2 hide that she's alive in plain hearing
    if (state !== 'playing' || !MS || MS.planted || !player || player.dead) return;
    if (LV.id === 1 && time > 70 && MS.phase !== 'boss' && !CS) { // her four notes, somewhere in the building, the last one wrong
      MS.planted = true;
      const s = spat(player.x + 520, player.y - 260, 1400), N = [440, 523.25, 659.25, 587.33 * .94];
      if (AU.ctx && !AU.muted) N.forEach((f, i) => tone({ pan: s.pan, vol: .05, dur: .7, f0: f * .5, type: 'sine', attack: .12, echo: .85, delay: i * .7 }));
      timers.push({ t: time + 3.4, fn: () => thought("Those notes. Off-key... No. She's gone.") });
    }
    if (LV.id === 2 && time > 80 && !CS) { // a lab channel bleeding into Marcus's frequency
      MS.planted = true;
      radio('LAB', 'Subject L. Four notes, on a loop. She will not stop.');
      timers.push({ t: time + 6, fn: () => thought('...L.') });
    }
  }
  { const f = cutIntro; cutIntro = function () {
    if (LV.id !== 3) return f();
    playCutscene([
      { cam: csAt(4, 38, 1.1), dur: 1.4, fn: () => { if (AU.ctx && !AU.muted) [196, 233.1, 293.7].forEach((fq, i) => tone({ vol: .04, dur: 4, f0: fq, f1: fq, type: 'triangle', echo: .8, attack: 1.2, delay: i * .08 })); } },
      { say: ['ECHO', "The vault is three floors down. I walked right under them."], keep: true },
      { cam: csAt(23, 36, .55), say: ['MARCUS', "Three tuning masts carry the song. Break them and the stair gate opens. Engine's running, Elias."], keep: true },
      { cam: csP(1), say: ['ECHO', "Then I'm going home."], keep: true },
    ], () => callout('THE CHOIR', 'BREAK THE THREE TUNING MASTS', 2, true));
  }; }
  { const f = saveCheckpoint; saveCheckpoint = function () {
    f();
    if (!on3() || !checkpoint) return;
    const S = MS.l3;
    checkpoint.phase = MS.phase === 'boss' || MS.phase === 'bossrestore' ? 'boss' : MS.phase;
    checkpoint.masts = S.masts.filter(m => m.gone).map(m => m.id); checkpoint.tapes = [...S.tapes]; checkpoint.key = false;
    checkpoint.bossStage = S.boss ? S.boss.stage : 0;
    if (checkpoint.p && checkpoint.p.weapon === 'knife' && S.prevWeapon) checkpoint.p.weapon = S.prevWeapon;
  }; }
  { const f = emitSound; emitSound = function (x, y, o) {
    if (on3() && o) {
      const S = MS.l3;
      if (S.hushT > time && o.owner !== 'heart') o = { ...o, reveal: 0, ring: 0 }; // the hush swallows everything but her heart
      else {
        if (o.owner === 'player' && humAt(x, y)) o = { ...o, hear: (o.hear || 0) * .5, reveal: (o.reveal || 0) * .55 };
        if (o.owner !== 'heart' && inHusher(x, y)) o = { ...o, reveal: (o.reveal || 0) * .12 };
      }
    }
    return f(x, y, o);
  }; }
  { const f = updReveals; updReveals = function () { // inside a husher's bubble nothing is ever lit by sound
    if (on3()) {
      const hs = hushers();
      if (hs.length) {
        const kill = o => { if (o.pt >= 0 && hs.some(h => (h.x - (o.px ?? o.x)) ** 2 + (h.y - (o.py ?? o.y)) ** 2 < HUSH_R * HUSH_R)) o.pt = -1; };
        for (const o of floors) kill(o); for (const o of edges) kill(o); for (const o of doors) kill(o); for (const o of pickups) kill(o);
        for (const o of enemies) if (o.type === 'husher') o.pt = -1; else kill(o);
      }
    }
    f();
  }; }
  // ---- the corridor crowd: like any real brawl, only two or three come at him; the rest circle, stalk and wait their turn ----
  const CROWD = { t: 0, attackers: new Set() };
  function crowdTick() { // who gets to engage, re-decided a few times a second (a fighter keeps his turn until he drops)
    if (realT - CROWD.t < .35) return; CROWD.t = realT;
    const P = player, C = MS.l3.corr, live = enemies.filter(e => !e.dead && !e.hidden && e.wave != null && e.type !== 'cantor');
    const n = C && C.pile ? 3 : 2;
    for (const e of [...CROWD.attackers]) if (e.dead || e.hidden || !live.includes(e) || Math.hypot(e.x - P.x, e.y - P.y) > 420) CROWD.attackers.delete(e);
    const rest = live.filter(e => !CROWD.attackers.has(e) && !(e.holdT > time)).sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y));
    while (CROWD.attackers.size < n && rest.length) CROWD.attackers.add(rest.shift());
    // the ones waiting take places down the hall on both sides of him, a few paces apart, nearest first
    const wait = rest.filter(e => !CROWD.attackers.has(e) && e.state === 'hunt');
    const L = wait.filter(e => e.x < P.x), R = wait.filter(e => e.x >= P.x);
    while (L.length > R.length + 1) R.push(L.pop()); while (R.length > L.length + 1) L.push(R.pop()); // keep the sides even: he's surrounded
    for (const [side, arr] of [[-1, L], [1, R]]) { arr.sort((a, b) => Math.abs(a.x - P.x) - Math.abs(b.x - P.x)); arr.forEach((e, i) => { e.slot = { s: side, rank: i }; }); }
  }
  function circle(e, dt) { // keep a fighting distance, sidestep, face him, never all at once
    const P = player, nid = e.nid ?? (e.nid = [...String(e.id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 997, 7));
    if (!e.ci || time > e.ci.until) { // a new intent every half second or so: step round, hold and watch, feint in, give ground
      const r = Math.random();
      e.ci = { until: time + .45 + Math.random() * 1.3, dir: r < .32 ? 1 : r < .64 ? -1 : 0, inn: r > .82 ? 1 : r > .74 ? -1 : 0, sp: 18 + Math.random() * 22 };
    }
    const I = e.ci, sl = e.slot || { s: e.x < P.x ? -1 : 1, rank: nid % 3 };
    const tx = P.x + sl.s * (135 + sl.rank * 62 - I.inn * 50), ty = CY() + (((nid + sl.rank) % 3) - 1) * 30; // a place in the hall, closer on a feint
    let vx = (tx - e.x) * 1.8, vy = (ty - e.y) * 1.8;
    vx += I.dir * I.sp; vy += I.dir * I.sp * .6; // shuffling, weight shifting
    for (const o of enemies) if (o !== e && !o.dead && !o.hidden && o.wave != null) { const ox = e.x - o.x, oy = e.y - o.y, od = Math.hypot(ox, oy); if (od < 64 && od > .1) { vx += ox / od * (64 - od) * 3; vy += oy / od * (64 - od) * 3; } } // give each other room
    const sp = Math.hypot(vx, vy), cap = 85 * (e.spdMul || 1); if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
    const k = 1 - Math.exp(-dt * 5); e.mvx = (e.mvx || 0) + (vx - (e.mvx || 0)) * k; e.mvy = (e.mvy || 0) + (vy - (e.mvy || 0)) * k; // momentum: no instant starts or stops
    const ox = e.x, oy = e.y; moveCircle(e, e.mvx * dt, e.mvy * dt, e.r, false);
    const moved = Math.hypot(e.x - ox, e.y - oy); e.walk += moved * .1; e.moveAmt = clamp(moved / Math.max(dt, 1e-4) / 120, 0, .8);
    e.a = turnTo(e.a, Math.atan2(P.y - e.y, P.x - e.x), dt * 4); e.circling = true;
    if (e.cd > 0) e.cd -= dt; if (e.flinch > 0) e.flinch -= dt;
  }
  { const f = updEnemy; updEnemy = function (e, dt) {
    if (!on3()) return f(e, dt);
    const S = MS.l3;
    if (S.btUntil > realT) dt *= .3;
    if (e.type === 'cantor') return updCantor(e, dt);
    if (e.spdMul == null) e.spdMul = .82 + Math.random() * .38; // nobody moves at the same pace
    e.circling = false;
    if (S.corr && MS.phase === 'corridor' && e.wave != null && !e.dead && e.state === 'hunt') {
      crowdTick();
      if (e.holdT > time) { e.moveAmt = 0; e.a = turnTo(e.a, Math.atan2(player.y - e.y, player.x - e.x), dt * 4); return; } // a beat before he moves
      if (e.type === 'singer' && singerTick(e, dt)) return;
      if (e.type === 'singer' && castTick(e, dt)) return; // from the ring: a rune
      if (!CROWD.attackers.has(e) && e.state !== 'stun' && e.state !== 'stunned') { circle(e, dt); if (e.type === 'singer') singerAfter(e, dt); return; }
      const ox = e.x, oy = e.y, st0 = e.state;
      f(e, dt * e.spdMul);
      if (st0 === 'hunt' && e.state === 'hunt' && dt > 1e-4) {
        const vx = (e.x - ox) / dt, vy = (e.y - oy) / dt;
        if (Math.hypot(vx, vy) < 600) { // not a teleport or a knockback
          const k = 1 - Math.exp(-dt * 6); e.mvx = (e.mvx || 0) + (vx - (e.mvx || 0)) * k; e.mvy = (e.mvy || 0) + (vy - (e.mvy || 0)) * k;
          e.x = ox; e.y = oy; moveCircle(e, e.mvx * dt, e.mvy * dt, e.r, false);
        }
      } else { e.mvx = 0; e.mvy = 0; }
      if (e.type === 'singer') singerAfter(e, dt);
      return;
    }
    if (e.type === 'singer' && singerTick(e, dt)) return;
    if (e.type === 'singer' && castTick(e, dt)) return;
    f(e, dt);
    if (e.type === 'singer') singerAfter(e, dt);
  }; }
  { const f = damageEnemy; damageEnemy = function (e, dmg, cause, silent) {
    if (!on3() || !e || e.dead) return f(e, dmg, cause, silent);
    if (e.type === 'cantor') return cantorHurt(e, dmg, cause);
    if (e.trueHp != null) {
      if (silent) { e.hp = 1; return f(e, 99, cause, silent); } // a silent kill from behind is still a kill
      e.hp = e.trueHp; f(e, dmg, cause, silent); e.trueHp = e.hp;
      if (!e.dead) { if (e.note) { e.note = null; stats.score += 150; popups.push({ x: e.x, y: e.y - 40, text: 'NOTE CUT  +150', t: time, c: 0, size: 14, vy: -14 }); } if (e.type === 'resonant') resonantRing(e); }
      return;
    }
    return f(e, dmg, cause, silent);
  }; }
  { const f = onKill; onKill = function (e, cause) { f(e, cause); if (on3()) corridorKill(e); }; }
  { const f = melee; melee = function () {
    if (on3()) { const S = MS.l3; if (S.corr && MS.phase === 'corridor' && player.hammer) return S.corr.lastman ? throwHammer() : hammerSwing(); }
    return f();
  }; }
  { const f = tryFire; tryFire = function () { if (on3() && MS.phase === 'corridor' && player.hammer) return hammerSwing(); if (on3() && MS.l3.hushT > time) MS.l3.boss && (MS.l3.boss.punish = true); return f(); }; }
  { const f = switchWeapon; switchWeapon = function (w) { if (on3() && MS.phase === 'corridor' && player.hammer) { if (realT - msg.t > 1.5) showMsg('NO GUNS IN HERE  ·  THE HAMMER', 1); return; } return f(w); }; }
  { const f = knifeRelays; knifeRelays = function (P) {
    f(P);
    if (!on3()) return;
    const S = MS.l3, hx = P.x + Math.cos(P.a) * 28, hy = P.y + Math.sin(P.a) * 28;
    for (const m of S.masts) if (!m.gone && Math.hypot(m.x - hx, m.y - hy) < 52) hitMast(m, 1, true);
    if (S.boss && S.boss.stage === 1) for (const p of S.boss.pipes) if (!p.gone && Math.hypot(p.x - hx, p.y - hy) < 54) pipeHit(p, 1);
  }; }
  { const f = relayBulletHit; relayBulletHit = function (b) {
    if (on3() && b.o === 'p') {
      const S = MS.l3;
      for (const m of S.masts) if (!m.gone && Math.hypot(m.x - b.x, m.y - b.y) < 26) { hitMast(m, 1, false); return true; }
      if (S.boss && S.boss.stage === 1) for (const p of S.boss.pipes) if (!p.gone && Math.hypot(p.x - b.x, p.y - b.y) < 26) { pipeHit(p, 1); return true; }
      const B = S.boss, e = B && B.e; // her drawn body stands up from her feet: a shot that hits the figure hits her
      if (e && B.stage >= 2 && !B.transit && !e.dead && !e.hidden && Math.abs(b.x - e.x) < 24 && b.y < e.y && b.y > e.y - 165) { damageEnemy(e, b.dmg, 'gun', false); return true; }
    }
    return f(b);
  }; }
  { const f = collect; collect = function (p) { if (on3() && (p.type === 'tape' || p.type === 'hammer')) return collectL3(p); return f(p); }; }
  const stolenFizzle = k => {
    const P = player;
    if (MS.phase === 'silence') { if (k === 'q' && !MS.said.nothing) { MS.said.nothing = 1; thought('Nothing comes back.'); } if (AU.ctx && !AU.muted) tone({ vol: .06, dur: .06, f0: 1800, f1: 1700, echo: 0 }); return; }
    if (realT - msg.t > 1) showMsg(`${STEAL_NAME[k]} — STOLEN`, 1);
    sparks(P.x, P.y, 0, 6, 1, 160, PI);
  };
  for (const [name, k] of [['castPhantom', 'g'], ['disguise', 'c'], ['throwDecoy', 'e'], ['dash', 'sp']]) {
    const f = window[name];
    window[name] = function () { if (on3() && MS.l3.stolen.has(k)) return stolenFizzle(k); return f.apply(this, arguments); };
  }
  { const f = sonar; sonar = function () {
    if (on3()) {
      const S = MS.l3;
      if (S.giveIt) return triggerFinale();
      if (S.stolen.has('q')) return stolenFizzle('q');
      if (S.hushT > time) { if (realT - msg.t > 1) showMsg('HUSHED  ·  NO ECHO', 1); return; }
      const cd = player.sonarCD; f(); if (player.sonarCD > cd) mirrorAnswer(); return;
    }
    return f();
  }; }
  { const f = updCamera; updCamera = function (dt) {
    const cx0 = cam.x, cy0 = cam.y;
    f(dt);
    if (!on3()) { if (MUS.on) musStop(); return; }
    musTick(dt);
    const own = () => { cam.x = cx0; cam.y = cy0; }; // these shots replace the usual follow-the-mouse camera instead of fighting it
    const S = MS.l3, C = S.corr, P = player;
    let tz = 1;
    if (C && (MS.phase === 'corridor' || MS.phase === 'elevator')) {
      // the one take: locked to the corridor, it only dollies forward when he wins ground
      const target = P.x - 230;
      C.camX = Math.min(C.camX, target);
      if (P.x - C.camX > 560) C.camX = lerp(C.camX, P.x - 330, 1 - Math.exp(-dt * 3));
      C.camX = Math.max(C.camX, (LV.corr.x0 + 6) * T);
      own(); let tx = C.camX;
      if (S.whip && realT < S.whip.until) tx = S.whip.x;
      const k = 1 - Math.exp(-dt * (S.whip && realT < S.whip.until ? 9 : 5));
      cam.x = lerp(cam.x, tx, k); cam.y = lerp(cam.y, CY(), 1 - Math.exp(-dt * 7));
      tz = C.pile ? .64 : .8;
      camRot = lerp(camRot, S.tilt, 1 - Math.exp(-dt * 3));
    }
    if (S.thrown) { own(); const k = 1 - Math.exp(-dt * 8); cam.x = lerp(cam.x, S.thrown.x, k); cam.y = lerp(cam.y, S.thrown.y, k); tz = 1.25; }
    if (MS.phase === 'boss' && S.boss) {
      own(); const B = S.boss, fx = B.stage === 1 ? LV.hall.seat[0] * T : B.e.x, fy = B.stage === 1 ? (LV.hall.seat[1] - .6) * T : B.e.y, w = B.stage === 1 ? .58 : .35;
      const k = 1 - Math.exp(-dt * 4); cam.x = lerp(cam.x, lerp(P.x, fx, w), k); cam.y = lerp(cam.y, lerp(P.y, fy, w), k);
      tz = B.stage === 1 ? .66 : .84;
    }
    CAMZ = lerp(CAMZ, tz, 1 - Math.exp(-dt * 3));
  }; }
  { const f = composite; composite = function () {
    f();
    if (!on3()) return;
    const S = MS.l3, k = realT - S.invertT;
    let des = 0;
    if (S.btUntil > realT && !QF.low) des = .55; // the grey of bullet time is the priciest effect: first to go on a slow machine
    if (player && player.hp <= 1 && state === 'playing') des = Math.max(des, .45);
    if (S.boss && S.boss.stage === 3) des = Math.max(des, S.stolen.size * .14);
    if (QF.low) des = 0;
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    if (des > .02) { mctx.globalCompositeOperation = 'saturation'; mctx.globalAlpha = Math.min(.85, des); mctx.fillStyle = '#808080'; mctx.fillRect(0, 0, cv.width, cv.height); }
    if (k >= 0 && (k < .05 || (k >= .1 && k < .15))) { mctx.globalCompositeOperation = 'difference'; mctx.globalAlpha = 1; mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, cv.width, cv.height); }
    mctx.globalCompositeOperation = 'source-over'; mctx.globalAlpha = 1;
  }; }
  { const f = playEpilogue; playEpilogue = function () { // after each score card: the cliffhanger, then straight into the next issue; after the last, the ending
    if (!result || result.epiPlayed) return;
    result.epiPlayed = true;
    if (LV.id === 1) return playEnding(() => beginBriefing(1));
    if (LV.id === 2) return playEnding(() => beginBriefing(2));
    if (!window.EchoPrologue || !window.EchoPrologue.playSet) return toTitle();
    stopRain(); voStopAll(); state = 'prologue';
    window.EchoPrologue.playSet('theend', () => toTitle());
  }; }
  { const f = enemyPose; enemyPose = function (e, live) {
    const o = f(e, live);
    if (e.type === 'clone') { o.kind = 'player'; o.weapon = 'knife'; }
    if (e.type === 'singer') o.sing = e.note ? 1 - e.note.t / e.note.t0 : e.cast ? .55 * (1 - e.cast.t / e.cast.t0) : 0;
    if (e.type === 'resonant') o.ring = Math.max(0, 1 - (time - (e.ringT || -9)) / .8);
    if (e.type === 'cantor') { o.mask = MS.l3 && MS.l3.mask; o.sing = e.state === 'windnote' ? 1 - e.wT / e.wT0 : 0; }
    return o;
  }; }

  // ================= THE CANTOR, drawn the way the cliffhanger showed her =================
  // Not a top-down token: an upright cut-out standing in the room, black against her own red backlight,
  // the narrow too-long head, the crown of tuning forks, the flared collar, a cape that won't lie still,
  // shadow curling off her shoulders, white-hot slits for eyes. Units are the cliffhanger's; feet at 0.
  const CK = .54; // figure units -> world pixels
  const rr = (i, k) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
  function cantorAura(g, cy, A, t) { // the crackling flame aura, stepped at 14 fps like hand-drawn animation
    if (A < .02) return;
    const fs = Math.floor(t * 14), Am = Math.min(1, A);
    g.save(); g.globalCompositeOperation = 'lighter'; g.lineJoin = 'miter'; g.lineCap = 'butt';
    const gr = g.createRadialGradient(0, cy, 30, 0, cy, 300); gr.addColorStop(0, rgba(CARR[1], .24 * Am)); gr.addColorStop(1, rgba(CARR[1], 0));
    g.fillStyle = gr; g.fillRect(-320, cy - 330, 640, 520);
    for (let i = 0; i < 34; i++) {
      const th = i / 34 * TAU, bx = Math.cos(th) * 96, by = cy + Math.sin(th) * 150;
      let dx = Math.cos(th) * .55, dy = Math.sin(th) * .35 - 1; const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      const len = (30 + 50 * rr(i, fs)) * Math.min(1.6, A), px = -dy, py = dx;
      g.beginPath();
      for (let k = 0; k <= 4; k++) { const j = k ? (rr(i * 7 + k, fs + 3) - .5) * 22 * (k / 4) : 0, X = bx + dx * len * k / 4 + px * j, Y = by + dy * len * k / 4 + py * j; k ? g.lineTo(X, Y) : g.moveTo(X, Y); }
      g.strokeStyle = rgba(CARR[1], .5 * Am); g.lineWidth = 6; g.stroke();
      g.strokeStyle = `rgba(255,225,215,${.7 * Am})`; g.lineWidth = 1.5; g.stroke();
    }
    for (let i = 0; i < 12; i++) { // sparks streaking up out of it
      const u = (t * (.8 + rr(i, 61)) + rr(i, 62)) % 1, x = (rr(i, 63) - .5) * 240, y = 30 - u * 460;
      g.strokeStyle = rgba(CARR[1], (1 - u) * .8 * Am); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(i) * 4, y - 24); g.stroke();
    }
    g.restore();
  }
  function drawCantorGhost(x, y, o) { // the afterimage when she steps: a red cut-out, fading
    const g = ctx; g.save(); g.translate(x, y); g.scale(CK, CK); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, o.alpha) * .7;
    g.fillStyle = rgba(CARR[1], .35); g.strokeStyle = rgba(CARR[1], .9); g.lineWidth = 2;
    g.beginPath(); g.moveTo(-40, -200); g.quadraticCurveTo(-60, -100, -84, 0); g.lineTo(84, 0); g.quadraticCurveTo(60, -100, 40, -200); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(0, -262, 15, 22, 0, 0, TAU); g.fill(); g.stroke();
    g.restore();
  }
  function drawCantorFigure(x, y, o) {
    const S = MS.l3, B = S && S.boss, e = B && B.e; if (!e) return;
    const g = ctx, t = realT, al = Math.min(1, o.alpha);
    const seated = B.stage === 1 || e.state === 'seated', hurt = o.hurt || 0, mask = !!S.mask;
    const RIMC = hurt > .4 ? [255, 240, 240] : CARR[1], RIM = a => rgba(RIMC, Math.min(1, a));
    const ink = (w, a) => { g.fillStyle = '#000'; g.fill(); g.strokeStyle = RIM(a ?? .45); g.lineWidth = w || 1.4; g.stroke(); };
    const wk = e.state === 'windslam' ? 1 - e.wT / e.wT0 : -1, nk = e.state === 'windnote' ? 1 - e.wT / e.wT0 : -1;
    const hush = S.hushT > time, give = S.giveIt, sd = Math.cos(e.a) >= 0 ? 1 : -1;
    const lift = seated ? 0 : 16 + Math.sin(t * 1.7) * 5 + (wk > 0 && wk < .85 ? wk * 26 : 0); // she floats; she rises before she slams
    // pose
    const hy = seated ? -178 : -246 - lift, shY = hy + 40, waist = seated ? 0 : -118 - lift, hemY = seated ? 34 : -lift * .3;
    let A = (B.stage === 1 ? .32 : B.stage === 2 ? .55 : .8) + (wk > 0 ? wk * .9 : 0) + (nk > 0 ? nk * .7 : 0) + (give ? 1 : 0) + hurt * .6;
    g.save(); g.translate(x, y); g.scale(CK, CK); g.globalAlpha = al;
    // the floor under her: a shadow, and her breathing rings
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) { const u = (t * .45 + i / 3) % 1; g.strokeStyle = rgba(CARR[1], (1 - u) * .45); g.lineWidth = 2.4; g.beginPath(); g.ellipse(0, 0, 60 + u * 190, (60 + u * 190) * .45, 0, 0, TAU); g.stroke(); }
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = 'rgba(0,0,0,.6)'; g.beginPath(); g.ellipse(0, 4, seated ? 120 : 90, 26, 0, 0, TAU); g.fill();
    cantorAura(g, (hy + hemY) / 2, A, t);
    // backlight, and sound breathing out behind the head
    g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(0, hy + 40, 0, 0, hy + 40, 330); gr.addColorStop(0, rgba(CARR[1], .5)); gr.addColorStop(.45, rgba(CARR[1], .15)); gr.addColorStop(1, rgba(CARR[1], 0));
    g.fillStyle = gr; g.fillRect(-340, hy - 300, 680, 640);
    for (let i = 0; i < 3; i++) { const u = (t * .22 + i / 3) % 1; g.strokeStyle = rgba(CARR[1], (1 - u) * .35); g.lineWidth = 1.6; g.beginPath(); g.arc(0, hy - 6, 34 + u * 120, PI * 1.08, PI * 1.92); g.stroke(); }
    // The Quiet's mark, burning over her head
    g.strokeStyle = RIM(.8); g.lineWidth = 3; g.beginPath(); g.arc(0, hy - 140, 15, 0, TAU); g.moveTo(0, hy - 164); g.lineTo(0, hy - 116); g.stroke();
    g.globalCompositeOperation = 'source-over';
    if (seated) for (const k of [-1, 1]) { g.beginPath(); g.rect(k * 92 - 14, -46, 28, 56); ink(1.2, .35); } // the throne's armrests
    // the cape: from the shoulders to a jagged hem that never stops moving
    const hw = seated ? 150 : 84 + (wk > 0 ? wk * 20 : 0) + (give ? 30 : 0);
    g.beginPath(); g.moveTo(-20, shY - 2); g.quadraticCurveTo(-46, shY - 4, -58, shY + 14); // shoulders
    g.quadraticCurveTo(-hw * .62, (shY + hemY) / 2, -hw, hemY);
    for (let i = 0; i <= 12; i++) { const X = -hw + i * hw / 6; g.lineTo(X, hemY + (i % 2 ? 14 : 0) + Math.sin(t * 2.2 + i) * 4); }
    g.quadraticCurveTo(hw * .62, (shY + hemY) / 2, 58, shY + 14); g.quadraticCurveTo(46, shY - 4, 20, shY - 2); g.closePath(); ink(2.2, .75);
    // the cape hangs open down the front over a darker robe
    g.beginPath(); g.moveTo(-14, shY + 18); g.quadraticCurveTo(-22, (shY + hemY) / 2, -30, hemY + 4); g.lineTo(30, hemY + 4); g.quadraticCurveTo(22, (shY + hemY) / 2, 14, shY + 18); g.closePath();
    g.fillStyle = '#050102'; g.fill(); g.strokeStyle = RIM(.55); g.lineWidth = 1.4; g.stroke();
    for (const fx of [-.7, -.3, .3, .7]) { g.beginPath(); g.moveTo(fx * 30, shY + 30); g.quadraticCurveTo(fx * hw * .6, (shY + hemY) / 2, fx * hw * .95, hemY + 6); g.strokeStyle = RIM(.2); g.lineWidth = 1.2; g.stroke(); }
    // shadow that won't hold still: wisps curling up off the shoulders
    for (let i = 0; i < 6; i++) {
      const k = i % 2 ? 1 : -1, x0 = k * (26 + (i >> 1) * 9), ph = t * 1.3 + i * 1.7;
      g.beginPath(); g.moveTo(x0, shY - 4);
      g.bezierCurveTo(x0 + k * 14 + Math.sin(ph) * 8, shY - 34, x0 + k * 4 + Math.sin(ph * 1.3) * 12, shY - 70, x0 + k * 18 + Math.sin(ph * .8) * 10, shY - 102 - (i >> 1) * 10);
      g.strokeStyle = '#000'; g.lineWidth = 3.6 - (i >> 1) * .7; g.stroke(); g.strokeStyle = RIM(.22); g.lineWidth = .8; g.stroke();
    }
    // arms: long, thin, with fingers too long for them
    const hand = k => {
      if (seated) return [k * 92, -50];
      if (give) return [k * 120 + Math.sin(t * 40 + k) * 4, shY - 40 + Math.cos(t * 37) * 4];
      if (wk >= 0) return wk < .85 ? [k * 46, hy - 90 * Math.min(1, wk * 1.6)] : [k * 74, -20 - lift];
      if (nk >= 0 && k === sd) return [k * (60 + 70 * Math.min(1, nk * 2)), shY - 6];
      if (hush && k === 1) return [10, hy + 14];
      return [k * (54 + Math.sin(t * 1.4 + k) * 4), waist + 18];
    };
    const drawArms = () => { for (const k of [-1, 1]) {
      const sx = k * 48, sy = shY + 12, [hx, hy2] = hand(k), mx = (sx + hx) / 2, my = (sy + hy2) / 2, dl = Math.hypot(hx - sx, hy2 - sy) || 1;
      const bend = Math.max(0, 70 - dl * .4) * k, ex = mx + (-(hy2 - sy) / dl) * bend * -1, ey = my + ((hx - sx) / dl) * bend * -1;
      g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(ex, ey, hx, hy2); g.strokeStyle = RIM(.7); g.lineWidth = 11.5; g.stroke(); g.strokeStyle = '#000'; g.lineWidth = 9; g.stroke();
      const da = Math.atan2(hy2 - ey, hx - ex);
      g.beginPath(); g.ellipse(hx, hy2, 9, 6, da, 0, TAU); ink(1, .4);
      for (let f = 0; f < 4; f++) { // fingers
        const a = da + (f - 1.5) * .22, L = 26 + (f === 1 || f === 2 ? 6 : 0), cu = Math.sin(t * 3 + f + k) * .15;
        g.beginPath(); g.moveTo(hx, hy2); g.quadraticCurveTo(hx + Math.cos(a) * L * .6, hy2 + Math.sin(a) * L * .6, hx + Math.cos(a + .3 * k + cu) * L, hy2 + Math.sin(a + .3 * k + cu) * L);
        g.strokeStyle = '#000'; g.lineWidth = 2.8; g.stroke(); g.strokeStyle = RIM(.35); g.lineWidth = .8; g.stroke();
      }
    } };
    const armsUp = wk >= 0 && wk < .85 || give; // raised arms belong in front of the head
    if (!armsUp) drawArms();
    // the high flared collar, either side of the head
    for (const k of [-1, 1]) { g.beginPath(); g.moveTo(k * 18, hy + 40); g.lineTo(k * 56, hy - 28); g.lineTo(k * 40, hy - 4); g.lineTo(k * 46, hy + 54); g.closePath(); ink(1.2, .5); }
    // the sigil on her chest
    g.globalCompositeOperation = 'lighter'; g.strokeStyle = RIM(.6); g.lineWidth = 1.6; g.beginPath(); g.arc(0, hy + 76, 6, 0, TAU); g.moveTo(0, hy + 66); g.lineTo(0, hy + 86); g.stroke(); g.globalCompositeOperation = 'source-over';
    // under the mask, her hair: loose, drifting
    if (mask) for (let i = 0; i < 7; i++) {
      const x0 = (i - 3) * 4.5, ph = t * 1.6 + i;
      g.beginPath(); g.moveTo(x0, hy - 12); g.bezierCurveTo(x0 * 2.2 + Math.sin(ph) * 6, hy + 20, x0 * 3 + Math.sin(ph * 1.2) * 10, hy + 50, x0 * 3.4 + Math.sin(ph * .7) * 14, hy + 78);
      g.strokeStyle = 'rgba(225,230,240,.75)'; g.lineWidth = 1.3; g.stroke();
    }
    // a narrow, too-long head
    g.beginPath(); g.ellipse(0, hy, 15, 22, 0, 0, TAU); ink(2, .8);
    // the crown of tuning forks
    for (let i = -2; i <= 2; i++) {
      const a = -PI / 2 + i * .32, L = 34 + (2 - Math.abs(i)) * 16, bx = Math.cos(a) * 15, by = hy + Math.sin(a) * 21, tx = Math.cos(a) * (15 + L), ty = hy + Math.sin(a) * (21 + L);
      const px = -Math.sin(a) * 4, py = Math.cos(a) * 4, cx = Math.cos(a) * 9, cy = Math.sin(a) * 9;
      g.beginPath(); g.moveTo(bx, by); g.lineTo(tx - cx, ty - cy);
      g.moveTo(tx - cx + px, ty - cy + py); g.lineTo(tx + px, ty + py); g.moveTo(tx - cx - px, ty - cy - py); g.lineTo(tx - px, ty - py);
      g.moveTo(tx - cx + px, ty - cy + py); g.lineTo(tx - cx - px, ty - cy - py);
      g.strokeStyle = RIM(.55 + (nk > 0 ? nk * .4 : 0)); g.lineWidth = 6.4; g.stroke(); g.strokeStyle = '#000'; g.lineWidth = 4.2; g.stroke();
    }
    if (mask) { // the mask split open: a white fissure across the dark
      g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,245,240,.9)'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-14, hy - 8); g.lineTo(-5, hy - 2); g.lineTo(-8, hy + 6); g.lineTo(2, hy + 10); g.lineTo(-1, hy + 20); g.stroke();
      g.globalCompositeOperation = 'source-over';
    }
    // the eyes: the only part of her anyone has seen
    g.globalCompositeOperation = 'lighter';
    const fx = Math.cos(e.a) * 3, fy = Math.sin(e.a) * 1.5;
    const slit = (X, Y, w, h, rot, a, col) => {
      const eg = g.createRadialGradient(X, Y, 0, X, Y, w + 4); eg.addColorStop(0, `rgba(255,235,235,${.8 * a})`); eg.addColorStop(.45, rgba(col || CARR[1], .5 * a)); eg.addColorStop(1, rgba(col || CARR[1], 0));
      g.fillStyle = eg; g.fillRect(X - w - 4, Y - w - 4, (w + 4) * 2, (w + 4) * 2);
      g.fillStyle = `rgba(255,250,250,${a})`; g.beginPath(); g.ellipse(X, Y, w, h, rot, 0, TAU); g.fill();
    };
    const eo = .85 + .15 * Math.sin(t * 2.3);
    if (mask) { slit(-6.5 + fx, hy + 3 + fy, 2.6, 2.2, 0, .9, [150, 200, 255]); slit(6.5 + fx, hy + 3 + fy, 5.5, 1.3, -.16, eo); } // one human eye, pale; one still burning
    else for (const k of [-6.5, 6.5]) slit(k + fx, hy + 3 + fy, 5.5, 1.3, k < 0 ? .16 : -.16, eo);
    const third = Math.max(B.stage === 3 ? .8 : 0, nk > 0 ? nk : 0, give ? 1 : 0);
    if (third > .01) slit(fx * .5, hy - 11, .7 + .5 * third, 6 * third, 0, third); // the third one, vertical
    g.globalCompositeOperation = 'source-over';
    if (armsUp) drawArms();
    g.restore();
  }
  { const f = drawCharacter; drawCharacter = function (x, y, o) { // the hammer in his hands in the corridor
    if (o.kind === 'cantor' && on3()) return o.additive ? drawCantorGhost(x, y, o) : drawCantorFigure(x, y, o);
    if (o.kind === 'player' && o.rim !== 'enemy' && o.weapon === 'knife' && player && player.hammer) o = { ...o, weapon: 'sledge', swing: player.meleeT > 0 ? 1 - player.meleeT / .22 : -1 };
    return f(x, y, o);
  }; }

  // ================= drawing: the choir =================
  { const dt0 = drawTorso; drawTorso = function (k) {
    if (k === 'clone') return dt0('player');
    if (k === 'singer' || k === 'husher' || k === 'cantor') { // robes
      const w = HALFW[k], L = k === 'cantor' ? 16 : 11, fl = Math.sin(realT * 2.4) * 1.4;
      ctx.beginPath(); ctx.moveTo(6, -w * .9);
      ctx.quadraticCurveTo(-6, -w * 1.15 - fl, -L - 6, -w * .7); ctx.quadraticCurveTo(-L - 10, 0, -L - 6, w * .7);
      ctx.quadraticCurveTo(-6, w * 1.15 + fl, 6, w * .9); ctx.quadraticCurveTo(10, 0, 6, -w * .9); ctx.closePath();
      ctx.fillStyle = BODY; ctx.fill(); rimPath(1.4);
      ctx.strokeStyle = rgba(RC.glow, .35); ctx.lineWidth = .8; ctx.beginPath();
      for (const s of [-.55, 0, .55]) { ctx.moveTo(2, s * w); ctx.quadraticCurveTo(-L * .5, s * w * 1.2, -L - 4, s * w * 1.1); }
      ctx.stroke();
      // the tuning-fork collar every singer wears; the Cantor wears The Quiet's mark
      ctx.strokeStyle = rgba(k === 'husher' ? VIO : RC.glow, .85); ctx.lineWidth = 1;
      if (k === 'cantor') { ctx.beginPath(); ctx.arc(-4, 0, 3.4, 0, TAU); ctx.moveTo(-4, -5.2); ctx.lineTo(-4, 5.2); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(4, -3); ctx.lineTo(-3, -3); ctx.moveTo(4, 3); ctx.lineTo(-3, 3); ctx.moveTo(-3, -3); ctx.lineTo(-3, 3); ctx.moveTo(-3, 0); ctx.lineTo(-7, 0); ctx.stroke(); }
      if (k === 'cantor') for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(4, s * w * .7); ctx.quadraticCurveTo(14, s * w * .95, 20, s * w * .55); ctx.lineWidth = 4; ctx.strokeStyle = BODY; ctx.stroke(); rimPath(1); } // long sleeves
      return;
    }
    if (k === 'resonant') { // a giant fork on its back
      dt0(k);
      ctx.beginPath(); ctx.moveTo(-6, -7); ctx.lineTo(-22, -9); ctx.lineTo(-22, -5); ctx.lineTo(-10, -4); ctx.lineTo(-10, 4); ctx.lineTo(-22, 5); ctx.lineTo(-22, 9); ctx.lineTo(-6, 7); ctx.closePath();
      body(null, 1.3);
      return;
    }
    return dt0(k);
  }; }
  { const dh0 = drawHeadTop; drawHeadTop = function (k, o) {
    o = o || {};
    if (k === 'clone') return dh0('player', o);
    if (k === 'singer' || k === 'husher') {
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-5, -9, 2, -7.4); ctx.arc(2, 0, 7.4, -PI / 2, PI / 2); ctx.quadraticCurveTo(-5, 9, -12, 0); body(null, 1.4); // the hood
      if (k === 'singer') { const s = o.sing || 0; ctx.fillStyle = `rgba(255,${200 - 120 * s},${180 - 120 * s},${.55 + .45 * s})`; ctx.beginPath(); ctx.ellipse(6.6, 0, 1.4 + s * 1.6, 1.8 + s * 2.6, 0, 0, TAU); ctx.fill(); } // the open mouth
      else { ctx.strokeStyle = rgba(VIO, .95); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(6.4, -3); ctx.lineTo(6.4, 3); for (let i = -2; i <= 2; i += 2) { ctx.moveTo(5, i); ctx.lineTo(7.8, i); } ctx.stroke(); } // a stitched mouth
      return;
    }
    if (k === 'resonant') {
      ctx.beginPath(); ctx.arc(1, 0, 7.6, 0, TAU); body(null, 1.5);
      ctx.fillStyle = rgba(RC.glow, .9); ctx.beginPath(); ctx.arc(6.4, 0, 1.6, 0, TAU); ctx.fill();
      const r = o.ring || 0; if (r > 0) { ctx.strokeStyle = `rgba(255,220,140,${r})`; ctx.lineWidth = 1.2; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(1, 0, 8 + i * 4 * (1.2 - r), 0, TAU); ctx.stroke(); } }
      return;
    }
    if (k === 'mirror') {
      ctx.beginPath(); ctx.arc(1, 0, 7, 0, TAU); body(null, 1.4);
      const g = ctx.createLinearGradient(-3, -6, 7, 6); g.addColorStop(0, 'rgba(220,235,250,.95)'); g.addColorStop(.5, 'rgba(120,150,175,.9)'); g.addColorStop(1, 'rgba(235,245,255,.95)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(3.6, 0, 4, 6, 0, 0, TAU); ctx.fill(); // a mirror for a face
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(2.2, -4); ctx.lineTo(4.4, -1); ctx.stroke();
      return;
    }
    if (k === 'cantor') {
      const unmasked = o.mask;
      if (unmasked) { ctx.strokeStyle = 'rgba(232,236,245,.85)'; ctx.lineWidth = 1.1; ctx.beginPath(); for (let i = -3; i <= 3; i++) { ctx.moveTo(-3, i * 1.9); ctx.quadraticCurveTo(-11, i * 2.6 + Math.sin(realT * 2 + i) * 1.5, -20, i * 3.2 + Math.sin(realT * 1.6 + i) * 2.4); } ctx.stroke(); } // her hair, loose
      for (let i = -2; i <= 2; i++) { // the crown of tuning forks
        const a = PI + i * .38, L = 13 + (2 - Math.abs(i)) * 6, bx = Math.cos(a) * 7, by = Math.sin(a) * 7, tx = Math.cos(a) * (7 + L), ty = Math.sin(a) * (7 + L), px = -Math.sin(a) * 2, py = Math.cos(a) * 2;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx - Math.cos(a) * 4, ty - Math.sin(a) * 4); ctx.moveTo(tx - Math.cos(a) * 4 + px, ty - Math.sin(a) * 4 + py); ctx.lineTo(tx + px, ty + py); ctx.moveTo(tx - Math.cos(a) * 4 - px, ty - Math.sin(a) * 4 - py); ctx.lineTo(tx - px, ty - py);
        ctx.strokeStyle = BODY; ctx.lineWidth = 2.4; ctx.stroke(); ctx.strokeStyle = rgba(RC.glow, .9); ctx.lineWidth = .8; ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(1, 0, 8.4, 7.4, 0, 0, TAU); body(null, 1.5);
      if (!unmasked) { // the white mask, three slits
        ctx.fillStyle = 'rgba(236,240,248,.96)'; ctx.beginPath(); ctx.ellipse(4.2, 0, 4.6, 6.2, 0, 0, TAU); ctx.fill();
        const s = o.sing || 0; ctx.fillStyle = `rgba(255,${60 + 120 * (1 - s)},${70 + 100 * (1 - s)},1)`;
        ctx.beginPath(); ctx.ellipse(6, -2.4, 1.6, .5, .3, 0, TAU); ctx.ellipse(6, 2.4, 1.6, .5, -.3, 0, TAU); ctx.ellipse(4.2, 0, .4, 1.7, 0, 0, TAU); ctx.fill();
      } else { // the mask broken away: half of it hangs on, and under it, her
        ctx.fillStyle = 'rgba(236,240,248,.96)'; ctx.beginPath(); ctx.moveTo(4.2, -6.2); ctx.quadraticCurveTo(9, -4, 8.6, -.4); ctx.lineTo(6, .6); ctx.lineTo(5, -1.6); ctx.lineTo(3.4, -.2); ctx.lineTo(1, -4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(200,230,255,1)'; ctx.beginPath(); ctx.ellipse(6.2, 2.4, 1.2, .7, -.2, 0, TAU); ctx.fill(); // one human eye, pale
        ctx.fillStyle = 'rgba(255,90,100,1)'; ctx.beginPath(); ctx.ellipse(6, -2.6, 1.5, .5, .3, 0, TAU); ctx.fill(); // one still burning
      }
      return;
    }
    return dh0(k, o);
  }; }
  { const f = drawPickups; drawPickups = function () {
    f();
    if (!on3()) return;
    for (const p of pickups) {
      if (p.taken || (p.type !== 'tape' && p.type !== 'hammer')) continue;
      let a = Math.min(1, glintAlpha(p, alphaOf(p))); if (p.type === 'hammer') a = Math.max(a, .7); if (a < .02) continue;
      ctx.save(); ctx.translate(ex(p.x, .03), ey(p.y, .03) + Math.sin(realT * 3) * 2); ctx.strokeStyle = rgba(CARR[2], a); ctx.fillStyle = rgba(CARR[2], a * .12); ctx.lineWidth = 1.6;
      ctx.beginPath();
      if (p.type === 'tape') { ctx.rect(-12, -8, 24, 16); ctx.fill(); ctx.moveTo(-3, 0); ctx.arc(-6, 0, 3, 0, TAU); ctx.moveTo(9, 0); ctx.arc(6, 0, 3, 0, TAU); ctx.moveTo(-6, 5); ctx.lineTo(6, 5); }
      else { ctx.rotate(realT * 2); ctx.moveTo(-14, 0); ctx.lineTo(8, 0); ctx.rect(8, -6, 7, 12); }
      ctx.stroke(); ctx.restore();
    }
  }; }
  // floor-level things: the hum, the masts, the organ, candles
  { const f = drawRelays; drawRelays = function () {
    f();
    if (!on3()) return;
    const S = MS.l3;
    if (MS.phase === 'silence') return;
    for (let i = 0; i < LV.hum.length; i++) if (zoneLive(i)) { // the hum, a slow shimmer on the floor
      const [zx, zy, zw, zh] = LV.hum[i], x0 = zx * T, y0 = zy * T, w = zw * T, h = zh * T;
      if (x0 > vx1 || x0 + w < vx0 || y0 > vy1 || y0 + h < vy0) continue;
      ctx.strokeStyle = rgba(CARR[2], .05 + .03 * Math.sin(realT * 1.3 + i)); ctx.lineWidth = 1; ctx.beginPath();
      for (let yy = y0 + 20; yy < y0 + h; yy += 34) { ctx.moveTo(x0, yy); for (let xx = x0; xx <= x0 + w; xx += 24) ctx.lineTo(xx, yy + Math.sin(xx * .02 + realT * 2.2 + yy) * 4); }
      ctx.stroke();
    }
    for (const m of S.masts) { // the tuning masts: a fork as tall as a man, ringing
      if (m.x < vx0 - 80 || m.x > vx1 + 80 || m.y < vy0 - 80 || m.y > vy1 + 80) continue;
      const a = Math.min(1, Math.max(alphaOf(m) * 1.2, glintAlpha(m, 0), m.gone ? 0 : .18)), c = CARR[2], hgt = m.gone ? .04 : .16, vib = m.gone ? 0 : Math.sin(realT * 40) * 1.2;
      if (a < .03) continue;
      ctx.strokeStyle = rgba(c, a * .5); ctx.lineWidth = 1; ctx.strokeRect(m.x - 16, m.y - 16, 32, 32);
      const tx = ex(m.x, hgt), ty = ey(m.y, hgt);
      ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(ex(m.x, hgt * .45), ey(m.y, hgt * .45));
      if (!m.gone) for (const s of [-1, 1]) { ctx.moveTo(ex(m.x, hgt * .45) + s * 9, ey(m.y, hgt * .45)); ctx.lineTo(tx + s * 9 + vib * s, ty); }
      ctx.moveTo(ex(m.x, hgt * .45) - 9, ey(m.y, hgt * .45)); ctx.lineTo(ex(m.x, hgt * .45) + 9, ey(m.y, hgt * .45)); ctx.stroke();
      if (!m.gone) for (let i = 0; i < 3; i++) { const u = ((realT * .8 + i / 3) % 1); ctx.strokeStyle = rgba(c, a * (1 - u) * .6); ctx.beginPath(); ctx.arc(tx, ty, 8 + u * 46, 0, TAU); ctx.stroke(); }
      if (time - m.hurtT < .2) { ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(m.x, m.y, 22, 0, TAU); ctx.stroke(); }
    }
    for (const [cx, cy] of LV.candles) { // candles: tiny flames and the pool they throw
      const x = (cx + .5) * T, y = (cy + .5) * T; if (x < vx0 || x > vx1 || y < vy0 || y > vy1) continue;
      const fl = .75 + .25 * Math.sin(realT * 11 + cx) * Math.sin(realT * 7.3 + cy);
      const g = ctx.createRadialGradient(x, y, 0, x, y, 80); g.addColorStop(0, rgba(CARR[2], .16 * fl)); g.addColorStop(1, rgba(CARR[2], 0));
      ctx.fillStyle = g; ctx.fillRect(x - 80, y - 80, 160, 160);
      ctx.fillStyle = `rgba(255,220,150,${.9 * fl})`; ctx.beginPath(); ctx.arc(ex(x, .02), ey(y, .02), 2.4, 0, TAU); ctx.fill();
    }
    if (S.corr && S.corr.state === 'intro') for (const e of enemies) if (!e.dead && (e.wave === 1 || e.wave === 2)) { e.litS = 1; e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a; } // the wall, held in the light
    const B = S.boss;
    if (B && B.e && !B.e.dead && !(B.stage === 3 && S.stolen.has('c') && B.e.state === 'idle' && Math.hypot(player.x - B.e.x, player.y - B.e.y) > 110)) { const e = B.e; e.litS = Math.max(e.litS, .95); e.litT = time; e.gx = e.x; e.gy = e.y; e.ga = e.a; }
    if (B) { // the throne: an organ along the north wall, and the light it throws down the hall
      const [sx, sy] = LV.hall.seat, X = sx * T, Y = (sy - 1.2) * T, glow = .55 + .2 * Math.sin(realT * 1.4);
      const g = ctx.createRadialGradient(X, Y + 40, 10, X, Y + 40, 520); g.addColorStop(0, rgba(CARR[1], .2 * glow)); g.addColorStop(1, rgba(CARR[1], 0));
      ctx.fillStyle = g; ctx.fillRect(X - 520, Y - 120, 1040, 700);
      for (let i = -6; i <= 6; i++) { const px = X + i * 13, hh = .06 + (6 - Math.abs(i)) * .012; ctx.strokeStyle = rgba(CARR[1], .45); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(px, Y); ctx.lineTo(ex(px, hh), ey(Y, hh)); ctx.stroke(); }
      for (const p of B.pipes) { // the six great pipes
        const hh = p.gone ? .03 : .15, tx = ex(p.x, hh), ty = ey(p.y, hh), open = p.charge >= 0 || p.vuln > 0;
        const c = p.gone ? CARR[3] : open ? CARR[1] : CARR[2], a = p.gone ? .25 : open ? .7 + .3 * Math.sin(realT * 24) : .55;
        ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.x - 9, p.y); ctx.lineTo(tx - 9, ty); ctx.moveTo(p.x + 9, p.y); ctx.lineTo(tx + 9, ty); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(tx, ty, 9, 4, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(p.x, p.y, 9, 4, 0, 0, TAU); ctx.stroke();
        if (!p.gone && p.charge >= 0) { const k = 1 - p.charge / 1.1; ctx.fillStyle = rgba(CARR[1], .25 + .5 * k); ctx.beginPath(); ctx.ellipse(tx, ty, 9, 4, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(CARR[1], .8 * k); ctx.beginPath(); ctx.arc(p.x, p.y + 24, 30 * (1 - k) + 6, 0, TAU); ctx.stroke(); }
        if (open && !p.gone) { ctx.font = `700 11px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = rgba(CARR[3], .9); ctx.fillText(p.vuln > 0 ? 'OPEN' : 'CHARGING', p.x, ty - 12); }
      }
    }
  }; }
  const RUNES = [ // a small alphabet of strokes: each rune is a few segments in a unit box
    [[-1, -1, 1, 1], [-1, 1, 0, 0]], [[0, -1, 0, 1], [0, -1, 1, -.2], [0, .2, 1, 1]], [[-1, 1, 0, -1], [0, -1, 1, 1], [-.5, 0, .5, 0]],
    [[-1, -1, -1, 1], [1, -1, 1, 1], [-1, 0, 1, 0]], [[-1, -1, 1, -1], [0, -1, 0, 1], [-1, 1, 1, 1]], [[-1, 0, 0, -1], [0, -1, 1, 0], [1, 0, 0, 1], [0, 1, -1, 0]],
    [[-1, -1, 1, 0], [1, 0, -1, 1]], [[0, -1, 0, 1], [-1, -.4, 1, -.4], [-1, .4, 1, .4]],
  ];
  function sigil(g, x, y, R, rot, a, k, seed) { // the mandala: two counter-turning rings of runes, a hexagram, a hot core
    g.save(); g.translate(x, y); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    const gl = g.createRadialGradient(0, 0, 0, 0, 0, R * 1.6); gl.addColorStop(0, runeAmber(.28 * a)); gl.addColorStop(1, runeAmber(0));
    g.fillStyle = gl; g.beginPath(); g.arc(0, 0, R * 1.6, 0, TAU); g.fill();
    const dr = Math.min(1, k * 1.4); // the circle is drawn in, stroke by stroke
    g.strokeStyle = runeAmber(.95 * a); g.lineWidth = Math.max(.8, R * .07);
    g.beginPath(); g.arc(0, 0, R, rot, rot + TAU * dr); g.stroke();
    g.lineWidth = Math.max(.6, R * .045); g.beginPath(); g.arc(0, 0, R * .78, -rot * 1.3, -rot * 1.3 + TAU * dr); g.stroke();
    if (k > .35) { // runes ride the band between the rings
      const n = 10, rr = R * .89, sz = R * .065;
      for (let i = 0; i < n * Math.min(1, (k - .35) * 2.2); i++) {
        const t = rot * .6 + i / n * TAU, rx = Math.cos(t) * rr, ry = Math.sin(t) * rr, gl2 = RUNES[(i + seed) % RUNES.length];
        g.save(); g.translate(rx, ry); g.rotate(t + PI / 2); g.beginPath();
        for (const [x0, y0, x1, y1] of gl2) { g.moveTo(x0 * sz, y0 * sz); g.lineTo(x1 * sz, y1 * sz); }
        g.lineWidth = Math.max(.6, sz * .45); g.stroke(); g.restore();
      }
    }
    if (k > .55) { // the hexagram turning inside
      const h = R * .62, kk = Math.min(1, (k - .55) * 3);
      g.lineWidth = Math.max(.6, R * .04); g.strokeStyle = runeAmber(.8 * a * kk);
      for (const off of [0, PI / 3]) { g.beginPath(); for (let i = 0; i <= 3; i++) { const t = -rot * 2 + off + i * TAU / 3; i ? g.lineTo(Math.cos(t) * h, Math.sin(t) * h) : g.moveTo(Math.cos(t) * h, Math.sin(t) * h); } g.stroke(); }
      g.beginPath(); g.arc(0, 0, h * .42, 0, TAU); g.stroke();
    }
    g.fillStyle = `rgba(255,236,190,${a * (.4 + .6 * k)})`; g.beginPath(); g.arc(0, 0, Math.max(1, R * .1), 0, TAU); g.fill();
    g.restore();
  }
  // the same sigil in the 3D corridor: a vertical disc facing along a (in the engine's frame), built from segments
  function sigil3(E, g, c, cx, cy, z, R, a, rot, al, k) {
    const A = [255, 172, 70];
    // the disc faces its target, turned most of the way toward the lens so a side camera sees its face, not its edge
    let nx = Math.cos(a), ny = Math.sin(a); const fx = -c.f[0], fy = -c.f[1], fl = Math.hypot(fx, fy) || 1;
    nx = lerp(nx, fx / fl, .65); ny = lerp(ny, fy / fl, .65); const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    const ux = -ny, uy = nx; // across the disc (horizontal); the other axis is straight up
    const P3 = (r, t) => [cx + ux * Math.cos(t) * r, cy + uy * Math.cos(t) * r, z + Math.sin(t) * r];
    const ring = (r, a0, span, w, aa) => { const n = Math.max(6, Math.ceil(28 * span / TAU)); for (let i = 0; i < n; i++) E.L3(g, c, P3(r, a0 + span * i / n), P3(r, a0 + span * (i + 1) / n), A, aa, w); };
    const dr = Math.min(1, k * 1.4);
    ring(R, rot, TAU * dr, 2.2, al); ring(R * .78, -rot * 1.3, TAU * dr, 1.4, al * .85);
    if (k > .35) for (let i = 0; i < 10 * Math.min(1, (k - .35) * 2.2); i++) { const t = rot * .6 + i / 10 * TAU; E.dot3(g, c, P3(R * .89, t), A, al, 2); } // runes, as sparks of script
    if (k > .55) { const h = R * .62, kk = Math.min(1, (k - .55) * 3); for (const off of [0, PI / 3]) for (let i = 0; i < 3; i++) { const t0 = -rot * 2 + off + i * TAU / 3, t1 = t0 + TAU / 3; E.L3(g, c, P3(h, t0), P3(h, t1), A, al * .8 * kk, 1.3); } }
    E.dot3(g, c, [cx, cy, z], [255, 236, 190], al, 3.4);
  }
  // on top: notes, the tether, the thrown hammer, husher bubbles, the Cantor's aura
  { const f = drawBossFX; drawBossFX = function () {
    f();
    if (!on3() || MS.phase === 'silence') return;
    const S = MS.l3, P = player;
    for (const e of enemies) {
      if (e.dead || e.hidden) continue;
      if (e.note) { // a held note: a cone opening toward you
        const k = 1 - e.note.t / e.note.t0, a = e.a;
        ctx.strokeStyle = rgba(CARR[1], .25 + .55 * k); ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.arc(e.x, e.y, 320 * (.3 + .7 * k), a - .42, a + .42); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      }
      if (e.noteFX && time - e.noteFX.t < .4) { // the scream itself
        const u = (time - e.noteFX.t) / .4, R = (e.noteFX.big ? 430 : 320) * (.2 + .8 * u), w = e.noteFX.big ? .5 : .42;
        for (let i = 0; i < 4; i++) { ctx.strokeStyle = rgba(CARR[1], (1 - u) * (.9 - i * .18)); ctx.lineWidth = 3 - i * .5; ctx.beginPath(); ctx.arc(e.x, e.y, Math.max(1, R - i * 26), e.noteFX.a - w, e.noteFX.a + w); ctx.stroke(); }
      }
      if (e.cast) { // the sigil, drawn in light in front of its hands; a thin line where it will fly
        const k = 1 - e.cast.t / e.cast.t0, cx = e.x + Math.cos(e.a) * 34, cy = e.y + Math.sin(e.a) * 34;
        sigil(ctx, cx, cy, 20 + 12 * k, realT * 2.4, .55 + .45 * k, k, e.nid || 0);
        if (k > .45) { ctx.strokeStyle = runeAmber(.35 * (k - .45) / .55); ctx.lineWidth = 1; ctx.setLineDash([2, 8]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(P.x, P.y); ctx.stroke(); ctx.setLineDash([]); }
      }
      if (e.type === 'husher' && time - (e.seenT ?? -99) < 3) { ctx.strokeStyle = rgba(VIO, .35 * (1 - (time - e.seenT) / 3)); ctx.lineWidth = 1.2; ctx.setLineDash([3, 7]); ctx.beginPath(); ctx.arc(e.x, e.y, HUSH_R, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
    }
    for (const r of S.runes || []) { // runes in flight: a spinning seal and a comet's tail
      for (let i = 1; i <= 6; i++) { ctx.fillStyle = runeAmber(.22 - i * .03); ctx.beginPath(); ctx.arc(r.x - Math.cos(r.a) * i * 7, r.y - Math.sin(r.a) * i * 7, Math.max(1, 7 - i), 0, TAU); ctx.fill(); }
      sigil(ctx, r.x, r.y, 14, r.rot, 1, 1, 3);
    }
    const h = S.thrown;
    if (h) { ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot); ctx.strokeStyle = 'rgba(255,240,200,1)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(8, 0); ctx.stroke(); ctx.strokeRect(8, -7, 8, 14); ctx.restore(); for (let i = 1; i <= 5; i++) { ctx.strokeStyle = `rgba(255,240,200,${.3 - i * .05})`; ctx.beginPath(); ctx.arc(h.x - h.vx * .012 * i, h.y - h.vy * .012 * i, 6, 0, TAU); ctx.stroke(); } }
    const B = S.boss; if (!B) return;
    const e = B.e;
    if (e && !e.dead) {
      const cloaked = B.stage === 3 && S.stolen.has('c') && Math.hypot(P.x - e.x, P.y - e.y) > 110 && e.state === 'idle';
      if (!cloaked) { // her aura is part of her figure now (drawCantorFigure); here only the attack tells
        if (e.state === 'windslam') { const k = 1 - e.wT / e.wT0; ctx.strokeStyle = rgba(CARR[1], .4 + .6 * k); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, Math.max(1, 80 * (1 - k) + 24), 0, TAU); ctx.stroke(); }
        if (e.state === 'windnote') { const k = 1 - e.wT / e.wT0; ctx.strokeStyle = rgba(CARR[1], .3 + .6 * k); ctx.lineWidth = 1.6; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.arc(e.x, e.y, 430 * (.3 + .7 * k), e.a - .5, e.a + .5); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); }
      }
      if (B.stage === 3 && !P.dead && !B.transit) { // the tether: your echo, pouring into her
        const n = 16, amp = S.giveIt ? 16 : 8;
        ctx.strokeStyle = rgba(CARR[0], .55); ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= n; i++) { const t = i / n, x = lerp(P.x, e.x, t), y = lerp(P.y, e.y, t), j = Math.sin(t * 9 + realT * 14) * amp * Math.sin(t * PI); i ? ctx.lineTo(x + j, y - j) : ctx.moveTo(x, y); }
        ctx.stroke();
        for (let i = 0; i < 5; i++) { const t = ((realT * .9 + i / 5) % 1), x = lerp(P.x, e.x, t), y = lerp(P.y, e.y, t); ctx.fillStyle = rgba(CARR[0], .9); ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill(); }
      }
      if (S.giveIt) { const r = 40 + Math.sin(realT * 30) * 8; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, TAU); ctx.stroke(); }
    }
  }; }

  // ================= the Choir Corridor, shot from the side =================
  // The one-take fight is filmed side-on, like the hallway in the film: as the corridor begins, the
  // top-down camera swings down to the near wall and looks along the hall; at the elevator it rises
  // back up. The game underneath is unchanged (positions, AI, hits); only the view is. World (x, y)
  // maps to 3D (x, -y, z), so the overhead end of the move lines up with the normal 2D view.
  const SV = { k: 0, hk: 0, c: null, on: false, lastT: 0, s: 1 };
  const SIDE_FOV = .9, WALL_H = 150;
  const sideWanted = () => !!(MS.l3 && MS.l3.corr && (MS.phase === 'corridor' || MS.phase === 'elevator'));
  const sideAllowed = () => on3() && MS.l3 && (MS.phase === 'corridor' || MS.phase === 'elevator' || MS.phase === 'bossgo');
  function sideAssist(range, cone) { // side-on, depth is hard to judge: the swing finds the nearest singer in front of you
    if (!SV.on) return;
    const P = player; let best = null, bd = 1e9;
    for (const e of enemies) {
      if (e.dead || e.hidden || e.type === 'cantor') continue;
      const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > range + e.r) continue;
      const a = Math.atan2(e.y - P.y, e.x - P.x); if (Math.abs(angDiff(P.a, a)) > cone) continue;
      if (d < bd) { bd = d; best = a; }
    }
    if (best != null) P.a = best;
  }
  // ---- the motion-control rig: the corridor is shot like a robot-arm camera rig: hard, precise moves between set-ups ----
  // A shot is a spherical position around the action: yaw (around the hall), pitch (crane), dist (dolly), roll (dutch), fov (lens).
  // yaw 0 = the side view; + swings toward the elevator end (east of him, looking west, over his shoulder); − the other way.
  const SHOTS = {
    side:   { yaw: 0,     pitch: .34, dist: 1,    roll: 0,    fov: .9 },
    dutchL: { yaw: -.36,  pitch: .2,  dist: .86,  roll: .09,  fov: .86 },
    dutchR: { yaw: .36,   pitch: .2,  dist: .86,  roll: -.09, fov: .86 },
    highL:  { yaw: -.48,  pitch: .5,  dist: .92,  roll: 0,    fov: .9 },
    highR:  { yaw: .48,   pitch: .5,  dist: .92,  roll: 0,    fov: .9 },
    low:    { yaw: .2,    pitch: .07, dist: .72,  roll: -.04, fov: 1 },
    top:    { yaw: .25,   pitch: .78, dist: .86, roll: 0,    fov: .95 },  // a wave falls: the rig swings up, not away
    knife:  { yaw: -.6,   pitch: .05, dist: .46,  roll: .1,   fov: 1.05 }, // the blade: on the floor, close, tilted
    chaseE: { yaw: 1.18,  pitch: .16, dist: .78,  roll: .03,  fov: 1 },   // behind the hammer as it flies west
    chaseW: { yaw: -1.18, pitch: .16, dist: .78,  roll: -.03, fov: 1 },
    rev:    { yaw: -1.08, pitch: .3,  dist: .95,  roll: 0,    fov: .95 },  // BEHIND YOU: look back down the hall
  };
  const MKEYS = ['yaw', 'pitch', 'dist', 'roll', 'fov'];
  const MOCO = { cur: { ...SHOTS.side }, from: { ...SHOTS.side }, to: SHOTS.side, shot: 'side', t0: -9, dur: 1, holdUntil: 0, nextT: 0, kills: 0, killsAt: 0, punch: 0, rollKick: 0, orbit: 0, orbitDir: 1, lastT: 0, pick: 0 };
  window.__MOCO = MOCO;
  const smoother = k => k * k * k * (k * (k * 6 - 15) + 10); // smootherstep: hard acceleration, a dead-precise landing
  function moco(name, dur, hold) {
    if (!SHOTS[name]) return;
    MOCO.from = { ...MOCO.cur }; MOCO.to = SHOTS[name]; MOCO.shot = name;
    MOCO.t0 = realT; MOCO.dur = dur || .55; MOCO.holdUntil = realT + (dur || .55) + (hold || 0);
    MOCO.nextT = MOCO.holdUntil + 3.4 + Math.random() * 1.6; MOCO.killsAt = MOCO.kills;
  }
  function mocoPunch() { MOCO.punch = Math.min(.22, MOCO.punch + .15); MOCO.rollKick = (MOCO.rollKick >= 0 ? -1 : 1) * .045; } // an on-beat hit: the lens jabs in
  function mocoTick() {
    const M = MOCO, S = MS.l3, C = S && S.corr, dt = clamp(realT - M.lastT, 0, .05); M.lastT = realT;
    if (!C || C.state === 'intro') { if (M.shot !== 'side' && realT > M.holdUntil) moco('side', .9); }
    else if (state === 'playing' && realT > M.holdUntil && (realT > M.nextT || M.kills - M.killsAt >= 2)) { // the director: a new set-up every couple of kills or few seconds
      const pool = C.pile ? ['dutchR', 'side', 'highL', 'dutchL', 'low', 'side'] : ['dutchL', 'side', 'low', 'dutchR', 'side', 'highR', 'low']; // mostly eye level: a fight is read from inside it
      let n = pool[(M.pick++) % pool.length]; if (n === M.shot) n = pool[(M.pick++) % pool.length];
      moco(n, .5 + Math.random() * .2, 0);
    }
    const k = clamp((realT - M.t0) / M.dur, 0, 1), e = smoother(k);
    for (const key of MKEYS) M.cur[key] = lerp(M.from[key], M.to[key], e);
    M.punch *= Math.exp(-dt * 6); M.rollKick *= Math.exp(-dt * 5);
    if (S && S.btUntil > realT) M.orbit += dt * .5 * M.orbitDir; // bullet time: a slow orbit around him
    else { M.orbit *= Math.exp(-dt * 2.2); if (Math.abs(M.orbit) < .01) M.orbitDir = Math.random() < .5 ? -1 : 1; }
  }
  function sideCamera() {
    const E = window.EchoPrologue.engine, ke = easeInOut(SV.k), hk = easeInOut(SV.hk);
    const foc = (H / 2) / Math.tan(SIDE_FOV / 2), ze = isFinite(ZE) ? Math.max(.15, ZE) : 1;
    const h0 = foc / ze; // at the top of the move, the same scale as the 2D camera
    const zf = ze / Math.max(.2, Z);
    mocoTick();
    const M = MOCO.cur, yaw = (M.yaw + MOCO.orbit + Math.sin(realT * .45) * .025) * ke, fov = lerp(SIDE_FOV, M.fov, ke);
    let D = clamp(300 / zf, 270, 1500) * M.dist * (1 - MOCO.punch); // close enough that the fighters fill the frame
    let th = lerp(1.562, M.pitch, ke), tz = lerp(0, 44, ke);
    D = lerp(D, D * .62, hk); th = lerp(th, .1, hk * ke); tz = lerp(tz, 40, hk * ke); // the hammer cam: low, close, riding the throw
    const dist = lerp(h0, D, ke);
    let fy = lerp(isFinite(cam.y) ? cam.y : player.y, CY(), ke);
    let fx = isFinite(cam.x) ? cam.x : player.x;
    if (!S_thrown() && !player.dead && state === 'playing') { // narrow windows see less hallway: never let him slide out of frame
      const hw = D * Math.tan(fov / 2) * W / H * Math.cos(Math.min(1.2, Math.abs(yaw))), lead = player.x - (fx + hw * .5);
      if (lead > 0) fx += lead * ke;
    }
    const sw = clamp(Math.abs(yaw) / 1.1, 0, 1); // swung far round the hall, the rig frames him, not the hallway
    if (!S_thrown()) { fx = lerp(fx, player.x, sw); fy = lerp(fy, player.y, sw * .6); }
    { // in the brawl the rig frames the fight itself: him and whoever is on him, not the empty hall
      const Cc = MS.l3 && MS.l3.corr, fdt = clamp(realT - (SV.fT || realT), 0, .05); SV.fT = realT;
      let tx = player.x, ty = player.y, wsum = 2; tx *= 2; ty *= 2;
      if (Cc && Cc.state === 'fight') for (const a of CROWD.attackers) if (!a.dead && Math.hypot(a.x - player.x, a.y - player.y) < 320) { tx += a.x; ty += a.y; wsum++; }
      tx /= wsum; ty /= wsum;
      if (SV.cfx == null || !isFinite(SV.cfx)) { SV.cfx = tx; SV.cfy = ty; }
      SV.cfx += (tx - SV.cfx) * Math.min(1, fdt * 4); SV.cfy += (ty - SV.cfy) * Math.min(1, fdt * 4);
      const on = Cc && Cc.state === 'fight' && !S_thrown() && state === 'playing' ? ke : 0;
      fx = lerp(fx, SV.cfx, .75 * on); fy = lerp(fy, lerp(CY(), SV.cfy, .5), .6 * on);
    }
    const j = shake * .6, jx = (Math.random() - .5) * j, jz = (Math.random() - .5) * j, hd = dist * Math.cos(th);
    const tgt = [fx + jx, -fy, tz + jz], pos = [fx + jx + hd * Math.sin(yaw), -fy - hd * Math.cos(yaw), tz + jz + dist * Math.sin(th)];
    SV.c = E.camera(pos, tgt, fov, W, H, -camRot + (M.roll + MOCO.rollKick) * ke);
    SV.s = clamp((H / 2) / Math.tan(fov / 2) / dist * .9, .45, 1.5); SV.dist = dist; SV.fx = fx; SV.fy = fy;
  }
  const sp3 = (x, y, z) => SV.c && window.EchoPrologue.engine.P(SV.c, [x, -y, z || 0]);
  // the screen <-> world helpers follow the side camera while it's up
  { const f = worldToScreen; worldToScreen = function (x, y) {
    if (!SV.on || !SV.c) return f(x, y);
    const q = sp3(x, y, 60); return q && isFinite(q[0]) && isFinite(q[1]) ? { x: q[0], y: q[1] } : { x: -9999, y: -9999 };
  }; }
  { const f = screenToWorld; screenToWorld = function (sx, sy) { // a ray from the lens, onto the plane at chest height
    if (!SV.on || !SV.c) return f(sx, sy);
    const c = SV.c, d = [c.f[0] * c.foc + c.r[0] * (sx - W / 2) - c.u[0] * (sy - H / 2), c.f[1] * c.foc + c.r[1] * (sx - W / 2) - c.u[1] * (sy - H / 2), c.f[2] * c.foc + c.r[2] * (sx - W / 2) - c.u[2] * (sy - H / 2)];
    let t = d[2] < -1e-3 ? (40 - c.pos[2]) / d[2] : 4000 / Math.hypot(d[0], d[1]);
    t = Math.min(t, 4000 / Math.max(1e-3, Math.hypot(d[0], d[1])));
    return { x: c.pos[0] + d[0] * t, y: -(c.pos[1] + d[1] * t) };
  }; }
  function sideLight(x, y) { // the corridor is lit, not echoed: brightest around him, flaring on the beat and with every sound
    const P = player, S = MS.l3;
    let a = .22 + .5 * Math.max(0, 1 - Math.hypot(x - P.x, (y - P.y) * 1.6) / 760);
    a += .16 * Math.max(0, 1 - (realT - (S.pulseT || -9)) / .18);
    for (const w of waves) { if (w.r <= 0) continue; const dd = Math.abs(Math.hypot(x - w.x, y - w.y) - w.r); if (dd < 46) a += (1 - dd / 46) * .55 * w.s * (1 - w.r / w.max); }
    return a;
  }
  // ---- the choir, in costume: every kind reads at a glance from the side ----
  const CHOIR_SCALE = { resonant: 1.24, husher: 1.1, mirror: 1, singer: 1.03 };
  const glowOf = (c, k) => `rgb(${c.map(v => Math.round(v * k + 255 * (1 - k) * .35)).join(',')})`;
  function robe(d, o) { // a choir robe to the floor: panels with a jagged hem that keeps moving, like her cape
    const { J, fwd, up, side, add, mul, mid, poly, cap } = d, back = mul(fwd, -1), sw = o.sway || 0, ph = o.ph || 0;
    const hem = add(add(mid(J.ftL, J.ftR), mul(up, o.hemZ || 3)), mul(back, sw));
    const w = o.w || 11.5, F = o.fill || '#060508';
    const H = (sx, fx) => add(add(hem, mul(side, sx)), mul(fwd, fx));
    const jag = fx => { const pts = []; for (let i = 0; i <= 6; i++) pts.push(add(H(-w + i * w / 3, fx), mul(up, (i % 2 ? 4.5 : 0) + Math.sin(realT * 3 + i + ph) * 1.2))); return pts; };
    poly([add(J.shL, mul(back, 3.5)), add(J.shR, mul(back, 3.5)), ...jag(-8)], F);
    poly([add(J.shL, mul(fwd, 2.5)), add(J.shR, mul(fwd, 2.5)), ...jag(5.5)], F);
    poly([J.shL, H(w + 1, -7), H(w + 1, 5)], F); poly([J.shR, H(-w - 1, -7), H(-w - 1, 5)], F);
    if (o.rag) for (let i = -2; i <= 2; i++) poly([H(i * w * .4 - 2, 6), H(i * w * .4 + 2, 6), add(H(i * w * .4 + Math.sin(realT * 4 + i + ph) * 2, 6), mul(up, -6 - (i & 1) * 4))], F); // a torn hem
    if (o.mantle) { // the short shoulder cape choirs wear, here cut sharp
      const c = J.chest;
      poly([add(J.neck, mul(back, 3)), add(add(J.shL, mul(side, 4)), mul(up, 1.5)), add(add(c, mul(side, 9)), mul(up, -11)), add(add(c, mul(fwd, 6.5)), mul(up, -15)), add(add(c, mul(side, -9)), mul(up, -11)), add(add(J.shR, mul(side, -4)), mul(up, 1.5))], o.mantle);
    }
    if (o.stole) for (const k of [2.6, -2.6]) cap(add(add(J.neck, mul(fwd, 4)), mul(side, k)), add(H(k * 1.4, 6.2), mul(up, 6)), .55, o.stole); // two glowing strips down the front
  }
  function hood(d, o) { // a deep cowl over a face that isn't there: black, with two slits of light in it
    const { J, fwd, up, side, cap, add, mul, poly, ball } = d, back = mul(fwd, -1);
    cap(add(add(J.head, mul(back, 1.8)), mul(up, 1)), add(add(J.neck, mul(back, 5.5)), mul(up, -2)), 8.6);
    if (o.peak) poly([add(add(J.head, mul(up, 9.5)), mul(back, .5)), add(add(J.head, mul(up, 6)), mul(back, 12 + Math.sin(realT * 2 + (o.ph || 0)) * 1.5)), add(add(J.head, mul(back, 7)), mul(up, 1))], '#060508');
    ball(add(J.head, mul(fwd, 2.2)), 5, '#000', true); // the void
    if (o.eyes) { const ec = o.eyes, ez = o.eyeZ || .6; for (const k of [2.1, -2.1]) ball(add(add(add(J.head, mul(fwd, 6.6)), mul(side, k)), mul(up, ez)), o.eyeR || .95, ec, true); }
  }
  function wisps(d, n, ph) { // shadow curling up off the shoulders, as it does off hers
    if (QF.low) return;
    const { J, up, side, fwd, cap, add, mul } = d;
    for (let i = 0; i < n; i++) {
      const k = i % 2 ? 1 : -1, base = add(add(i % 2 ? J.shL : J.shR, mul(up, 2)), mul(fwd, -2)); let p = base;
      for (let j = 1; j <= 3; j++) {
        const q = add(add(add(p, mul(up, 5.5)), mul(side, k * (1.6 + Math.sin(realT * 2.2 + i * 1.7 + j + ph) * 2.2))), mul(fwd, Math.sin(realT * 1.6 + i + j) * 1.5));
        cap(p, q, Math.max(.35, 1.1 - j * .25), '#000'); p = q;
      }
    }
  }
  const CHOIR_DECO = {
    singer: (e, nid) => d => { // a hooded choir robe and mantle, a red stole, a void for a face; it lights up when it sings
      const { J, fwd, up, cap, add, mul, ball } = d, s = e.note ? 1 - e.note.t / e.note.t0 : 0;
      robe(d, { sway: Math.sin(realT * 2 + nid) * 1.2, ph: nid, mantle: '#0b0306', stole: glowOf(CARR[1], .85) });
      wisps(d, 2, nid);
      hood(d, { peak: true, ph: nid, eyes: s > 0 ? glowOf([255, 90, 90], 1 - s * .5) : '#fff2f0', eyeR: .95 + s * .5 });
      if (s > 0) ball(add(add(J.head, mul(fwd, 6.4)), mul(up, -2.8)), .8 + s * 1.6, glowOf([255, 90, 90], 1 - s * .6)); // the mouth opening in the dark
      ball(add(add(J.chest, mul(fwd, 6.5)), mul(up, -1)), 1.3, glowOf(CARR[1], .9)); // the fork sigil's hub
    },
    husher: (e, nid) => d => { // gaunt and tall in rags that trail like smoke; no eyes, a mouth sewn shut with violet thread
      const { J, fwd, side, up, cap, add, mul } = d;
      robe(d, { w: 9.5, rag: true, hemZ: 1, sway: Math.sin(realT * 1.4 + nid) * 2, ph: nid, fill: '#07050c' });
      wisps(d, 4, nid);
      hood(d, { peak: true, ph: nid });
      const m = add(add(J.head, mul(fwd, 6.6)), mul(up, -1.5));
      cap(add(m, mul(side, 2.8)), add(m, mul(side, -2.8)), .45, glowOf(VIO, 1));
      for (const k of [-1.9, 0, 1.9]) cap(add(add(m, mul(side, k)), mul(up, 1.6)), add(add(m, mul(side, k)), mul(up, -1.6)), .4, glowOf(VIO, 1));
      for (const k of [1, -1]) { // strips of cloth hanging off the arms
        const a0 = k > 0 ? J.elL : J.elR; let p = a0;
        for (let j = 1; j <= 3; j++) { const q = add(add(p, mul(up, -6)), mul(fwd, -2 - Math.sin(realT * 3 + j + nid) * 2)); cap(p, q, .6, '#07050c'); p = q; }
      }
    },
    resonant: (e, nid) => d => { // a brute in plate, a cracked glowing core, and a tuning fork taller than a man on his back
      const { J, fwd, side, up, cap, add, mul, ball } = d, back = mul(fwd, -1);
      const r = Math.max(0, 1 - (time - (e.ringT ?? -9)) / .8), F = r > 0 ? glowOf(CARR[2], 1 - r * .5) : '#1a1206', G = glowOf(CARR[2], .95 - r * .3);
      robe(d, { w: 12, hemZ: 18, fill: '#0b0804' }); // a heavy tabard to the knee
      ball(add(J.shL, mul(up, 2)), 6.4); ball(add(J.shR, mul(up, 2)), 6.4); // pauldrons
      cap(J.shL, J.shR, 6.2);
      const b0 = add(J.chest, mul(back, 9.5)), jt = Math.sin(realT * 40) * r * 1.4;
      cap(b0, add(J.pelvis, mul(back, 9)), 1.8, F);
      cap(add(b0, mul(side, 7.5)), add(b0, mul(side, -7.5)), 1.8, F);
      for (const k of [7.5, -7.5]) cap(add(b0, mul(side, k)), add(add(b0, mul(side, k + jt)), mul(up, 42)), 2.1, F);
      const core = add(J.chest, mul(fwd, 7)); ball(core, 2.8, G);
      for (const [a, b] of [[3, 4], [-3, 3.5], [1, -4.5]]) cap(core, add(add(core, mul(side, a)), mul(up, b)), .35, G); // cracks running out from it
      cap(add(add(J.head, mul(fwd, 6.2)), mul(up, 3)), add(add(J.head, mul(fwd, 6.2)), mul(up, -2.5)), .55, G); // one vertical slit in the helm
    },
    mirror: (e, nid) => d => { // a robe, a mirror where the face should be, and shards turning around its head
      const { J, fwd, side, up, add, mul, poly, ball } = d;
      robe(d, { w: 10, sway: Math.sin(realT * 2 + nid) * 1, ph: nid, mantle: '#05070a' });
      hood(d, { peak: false });
      const hc = add(J.head, mul(fwd, 6.2)), pts = [];
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; pts.push(add(add(hc, mul(side, Math.cos(a) * 4.8)), mul(up, Math.sin(a) * 6.4))); }
      poly(pts, `rgb(${200 + Math.round(40 * Math.sin(realT * 3 + nid))},228,248)`);
      for (let i = 0; i < 4; i++) { const a = realT * 1.4 + i * TAU / 4 + nid; ball(add(add(add(J.head, mul(side, Math.cos(a) * 13)), mul(fwd, Math.sin(a) * 13)), mul(up, 4 + Math.sin(realT * 2 + i) * 3)), 1.2, '#dcebf8'); }
    },
  };
  function choirGlow(E, g, c, e) { // drawn on the glow layer under the bodies: a pool of their colour, and their eyes blooming
    if (e.dead || e.hidden || e.type === 'cantor') return;
    if (QF.low) { E.ring3(g, c, e.x, -e.y, 1, 20, e.type === 'resonant' ? CARR[2] : e.type === 'husher' ? VIO : CARR[1], .35, 2); return; }
    const col = e.type === 'resonant' ? CARR[2] : e.type === 'mirror' ? [205, 220, 240] : e.type === 'husher' ? VIO : CARR[1];
    const sc = CHOIR_SCALE[e.type] || 1, s = e.note ? 1 - e.note.t / e.note.t0 : 0, nid = e.nid || 0;
    E.ring3(g, c, e.x, -e.y, 1, 22 * sc + Math.sin(realT * 3 + nid) * 2, col, .35 + s * .4, 2);
    const q = sp3(e.x + Math.cos(e.a) * 6 * sc, e.y + Math.sin(e.a) * 6 * sc, 73 * sc); if (!q) return;
    const R = Math.max(3, 650 / q[2]) * (1 + s * 1.5), gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], R);
    gr.addColorStop(0, rgba(e.type === 'husher' ? VIO : col, .55 + s * .4)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(q[0] - R, q[1] - R, R * 2, R * 2);
  }
  function enemyActor(E, e, g, c) {
    const nid = e.nid ?? (e.nid = [...String(e.id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 997, 7)); // ids are strings: a stable number for phases
    const col = e.type === 'resonant' ? CARR[2] : e.type === 'mirror' ? [205, 220, 240] : e.type === 'husher' ? VIO : e.type === 'clone' ? CARR[0] : CARR[1];
    const st = e.type === 'clone' ? { coat: true, hair: 'spiky', blind: true, wind: realT * 1.4 + nid } : { deco: CHOIR_DECO[e.type] ? CHOIR_DECO[e.type](e, nid) : null, scale: CHOIR_SCALE[e.type] || 1 };
    let al = 1, o = { t: realT + nid };
    const behind = e.y < 19 * T - 6 || e.y > 22 * T + 6; // in a closet: seen through the wall
    if (behind) al = .4;
    if (e.dead) { // the body goes where the blow sent it: up, round, or straight down into the floor
      const k = (time - e.dieT), dm = e.deathMove, u = clamp(k / .5, 0, 1);
      const H = { uppercut: 62, spin: 28, sweep: 18, backhand: 18, overhead: 0 }[dm] ?? 6;
      const lift = H * Math.sin(PI * u) + (k > .5 && k < .72 ? 6 * Math.sin(PI * (k - .5) / .22) * (H > 10 ? 1 : 0) : 0);
      const spinY = dm === 'spin' ? 4 * easeOut(u) : dm === 'sweep' ? 2.4 * easeOut(u) : dm === 'backhand' ? -2.4 * easeOut(u) : 0;
      o.fall = dm === 'overhead' ? 1.42 * easeOut(k / .22) : -1.42 * easeOut(k / (dm ? .45 : .35));
      al *= k < 2 ? .95 : Math.max(MS.phase === 'corridor' ? 0 : .4, .95 - (k - 2) * (MS.phase === 'corridor' ? .55 : .1)); // in the brawl they fade, so the floor stays readable
      if (al < .02) return;
      if (k > .6 && st.deco) st.deco = d => robe(d, { w: e.type === 'resonant' ? 12 : 10, hemZ: 3 }); // once they're down, just the robe: the pile stays cheap to draw
      return E.actor(g, c, { dpr: DPR, noShadow: true, lod: k > .9 || QF.low ? 'low' : null }, [e.x, -e.y, lift], -(e.corpseA ?? e.a) + spinY, col, al, o, st);
    }
    const hurt = Math.max(0, 1 - (time - (e.hurtT ?? -9)) / .15), sw = swingOf(e);
    // gait from how far he actually moved this frame, so the feet plant instead of skating
    const H = e.hm || (e.hm = { x: e.x, y: e.y, t: realT, ph: nid * 1.7, v: 0, p: {}, hk: 0, hv: { R: [10, -7, 3], L: [11, 6, 5] } });
    const rdt = clamp(realT - H.t, 1e-3, .1), dd = Math.hypot(e.x - H.x, e.y - H.y); H.t = realT; H.x = e.x; H.y = e.y;
    const slid = dd / rdt > 320; // flung by a blow: the feet don't run
    H.v += ((slid ? 0 : dd / rdt) - H.v) * Math.min(1, rdt * 9);
    const gst = clamp(H.v / 105, 0, 1.05) * (.86 + (nid % 5) * .05), sc = CHOIR_SCALE[e.type] || 1;
    const stepLen = 2 * (41 * sc) * Math.sin(.5 * Math.max(gst, .2)) * .92; // one footfall covers exactly this much floor
    if (!slid) H.ph += dd * PI / stepLen;
    o.walk = H.ph; o.stride = gst;
    if (e.state === 'hunt' && !e.note) { o.crouch = .1 + (nid % 4) * .05; o.lean = .12 + (nid % 3) * .05; } // hunting, not marching
    if (e.circling) { o.stance = clamp(1 - H.v / 45, 0, 1); o.crouch = .22 + (nid % 3) * .05; o.side = Math.sin(realT * 1.3 + nid) * .22; o.hands = { R: [10, -7, 3], L: [11, 6, 5] }; o.handK = .9; o.twist = Math.sin(realT * .8 + nid * 2) * .12; }
    o.lean = (o.lean || 0) - .35 * hurt - .3 * (e.flinch || 0);
    if (e.note) { const s = 1 - e.note.t / e.note.t0; o.aim = s; o.aimZ = 8 + s * 10; o.lean -= .12 * s; o.headDown = -.5 * s; }
    if (e.cast) { const s = 1 - e.cast.t / e.cast.t0; o.stance = 1; o.lean = (o.lean || 0) - .1; o.hands = { R: [17, -7, 8 + 4 * s], L: [17, 7, 8 + 4 * s] }; o.handK = Math.min(1, s * 2.5); o.headDown = .15; } // palms out, drawing the sigil
    if (e.state === 'stun' || e.state === 'stunned') { o.headDown = .9; o.stride = 0; o.lean = .15 + Math.sin(realT * 3 + nid) * .06; }
    const moving = H.v > 30;
    if (!moving && !e.note && e.state !== 'stun' && e.state !== 'stunned' && e.state !== 'patrol') { // squared up: a fighter's crouch, guard up, weight shifting
      o.stance = .85; o.crouch = .2 + Math.sin(realT * 3 + nid) * .04; o.lunge = .2; o.hands = { R: [10, -7, 2], L: [10, 7, 4] }; o.handK = .85;
      o.side = Math.sin(realT * 1.7 + nid) * .25; o.twist = Math.sin(realT * .9 + nid) * .1; // weight shifting, eyes never still
    }
    if (e.state === 'windup' || e.state === 'windsmash') { // the tell: rear back, arm cocked high
      const k = e.wT0 ? 1 - e.wT / e.wT0 : .5;
      o.stance = 1; o.crouch = .25; o.lean = -.25 * k; o.twist = -.45 * k; o.hands = { R: [-6, -10, 26], L: [8, 8, 6] }; o.handK = easeOut(k);
    }
    if (sw >= 0) { // and the strike: lunging through
      o.stance = 1; o.lunge = .9 * EASE.out(sw); o.lean = .42 * sw; o.twist = lerp(-.45, .45, EASE.in(sw)); o.crouch = .3;
      o.hands = { R: lerp3([-6, -10, 26], [26, 6, 2], EASE.in(sw)), L: [8, 8, 6] }; o.handK = 1;
    }
    if (e.state === 'lunge' || e.state === 'charge') { o.lean += .45; o.lunge = 1; o.stance = 1; o.crouch = .3; }
    let lift = 0, yawAdd = 0;
    const rx = e.rx, rk = rx ? time - rx.t0 : 9;
    if (rk < .6) { // hit reactions, matched to the blow that landed
      const k = rk / .6, b = Math.sin(PI * Math.min(1, rk / .35)), rel = 1 - EASE.in(k);
      if (rx.move === 'sweep' || rx.move === 'backhand') { yawAdd = rx.side * 1.15 * EASE.out(Math.min(1, rk / .16)) * rel; o.side = rx.side * .9 * rel; o.lean = (o.lean || 0) - .4 * rel; o.stance = 1; o.crouch = .3 * rel; }
      else if (rx.move === 'overhead') { o.crouch = .78 * rel; o.headDown = .9 * rel; o.lean = (o.lean || 0) + .4 * rel; o.stance = 1; }
      else if (rx.move === 'uppercut') { lift = 34 * b; o.lean = (o.lean || 0) - .65 * rel; o.headDown = -.7 * rel; }
      else if (rx.move === 'spin') { yawAdd = 2.2 * EASE.out(Math.min(1, rk / .3)) * rel; lift = 12 * b; o.lean = (o.lean || 0) - .45 * rel; }
    }
    // blend into the new pose instead of snapping to it: slow when idling, quick when a blow is coming or landing
    const fast = sw >= 0 || rk < .6 || e.state === 'windup' || e.state === 'windsmash' || e.state === 'lunge' || e.state === 'charge';
    const kb = 1 - Math.exp(-rdt * (fast ? 26 : 7));
    for (const f of ['crouch', 'lean', 'stance', 'side', 'lunge', 'twist', 'headDown', 'aim', 'aimZ']) { const v = o[f] || 0; H.p[f] = H.p[f] == null ? v : H.p[f] + (v - H.p[f]) * kb; o[f] = H.p[f]; }
    if (o.hands) for (const q of ['R', 'L']) if (o.hands[q]) H.hv[q] = lerp3(H.hv[q], o.hands[q], fast ? 1 : kb);
    H.hk += ((o.hands ? (o.handK ?? 1) : 0) - H.hk) * kb; o.hands = H.hv; o.handK = H.hk;
    if (S_bt()) al *= .95;
    E.actor(g, c, ACTOR_API(), [e.x, -e.y, lift], -e.a + yawAdd, col, al, o, st);
  }
  const S_bt = () => MS.l3.btUntil > realT, S_thrown = () => !!MS.l3.thrown;
  const ACTOR_API = () => ({ dpr: DPR, noShadow: true, lod: QF.low ? 'low' : null }); // full models unless the machine is struggling
  function playerPose(P) {
    const mv = clamp(P.moveAmt || 0, 0, 1), o = { t: realT, walk: P.stepPh || 0 };
    let f = null, u = null, a = P.a;
    if (P.hammer && P.swing) { u = (time - P.swing.t0) / P.swing.dur; if (u < 1) { f = moveFrame(P.swing.move, u); a = P.swing.a; } else u = null; }
    if (P.hammer) {
      const p = f || (mv > .25 ? CARRY : { ...GUARD, cr: GUARD.cr + Math.sin(realT * 2.6) * .03 }); // breathing in the stance
      o.hands = { R: p.hR, L: p.hL }; o.handK = 1; o.twist = p.tw; o.lean = p.ln + (P.running ? .22 : 0); o.crouch = p.cr; o.lunge = p.lg;
      o.stride = mv * (f ? .25 : P.running ? 1 : .8); o.stance = f ? 1 : clamp(1 - mv * 2.5, 0, 1);
      if (P.dashT > 0) { o.crouch = .55; o.lean = .55; o.lunge = 1; o.stance = 1; }
      if (hurtFlash > .5) o.lean -= .4 * hurtFlash;
      return { o, yaw: -a - (f ? f.yaw : 0), swingU: u };
    }
    o.stride = mv * (P.running ? 1 : .8); o.slash = P.meleeT > 0 ? 1 - P.meleeT / .22 : null; o.lean = o.slash != null ? .15 : 0;
    return { o, yaw: -P.a, swingU: null };
  }
  function hammerDeco(d, hot) { // two hands on the haft, the head out past the right fist; it leaves a smear when it moves
    const { J, up, side, cap, add, mul, sub, norm } = d;
    let dir = sub(J.haR, J.haL); const L = Math.hypot(dir[0], dir[1], dir[2]);
    dir = L > 3 ? mul(dir, 1 / L) : norm(sub(J.haR, J.elR));
    const end = add(J.haR, mul(dir, 24)), xp = [dir[1] * up[2] - dir[2] * up[1], dir[2] * up[0] - dir[0] * up[2], dir[0] * up[1] - dir[1] * up[0]];
    const pp = Math.hypot(xp[0], xp[1], xp[2]) > .15 ? norm(xp) : side;
    cap(add(J.haL, mul(dir, -6)), end, 1.4, '#cdbb8e');
    cap(add(end, mul(pp, -7)), add(end, mul(pp, 7)), 4.6, hot ? '#ffe9a8' : '#0b0e12');
    SV.head = end; SV.headHot = hot;
  }
  const TRAIL = [];
  function drawSmear(E, g, c) {
    if (SV.headHot && SV.head) TRAIL.push({ p: SV.head, t: realT }); SV.head = null;
    while (TRAIL.length && realT - TRAIL[0].t > .13) TRAIL.shift();
    for (let i = 1; i < TRAIL.length; i++) {
      const k = 1 - (realT - TRAIL[i].t) / .13;
      E.L3(g, c, TRAIL[i - 1].p, TRAIL[i].p, [255, 236, 190], .85 * k, 9 * k + 1);
      E.L3(g, c, TRAIL[i - 1].p, TRAIL[i].p, [255, 255, 255], .9 * k, 2.5 * k + .5);
    }
  }
  // the hallway is thousands of short lines: queue them by colour, brightness and weight, then stroke each group once
  const LB = new Map(), FB = new Map();
  const fogA = z => clamp(1.35 - z / 4200, .12, 1);
  function bl(c, a3, b3, col, al, w) {
    if (al < .02) return;
    const P3 = window.EchoPrologue.engine.P, p = P3(c, a3), q = P3(c, b3); if (!p || !q) return;
    const z = Math.min(p[2], q[2]), ab = Math.min(10, Math.round(Math.min(1, al * fogA(z)) * 10)); if (!ab) return;
    const lw = Math.round(clamp(w * c.foc / z * .85, .5, 4) * 2) / 2, key = col + '|' + ab + '|' + lw;
    let arr = LB.get(key); if (!arr) LB.set(key, arr = []);
    arr.push(p[0], p[1], q[0], q[1]);
  }
  function bf(c, pts, col, al) {
    if (al < .005) return;
    const P3 = window.EchoPrologue.engine.P, ps = []; for (const x of pts) { const q = P3(c, x); if (!q) return; ps.push(q); }
    const ab = Math.max(1, Math.round(Math.min(1, al * fogA(ps[0][2])) * 100)), key = col + '|' + ab;
    let arr = FB.get(key); if (!arr) FB.set(key, arr = []);
    arr.push(ps);
  }
  function flushBatches(g) {
    for (const [key, ps] of FB) { const [col, ab] = key.split('|'); g.fillStyle = `rgba(${col},${ab / 100})`; g.beginPath(); for (const poly of ps) { poly.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); } g.fill(); }
    for (const [key, a] of LB) { const [col, ab, lw] = key.split('|'); g.strokeStyle = `rgba(${col},${ab / 10})`; g.lineWidth = +lw; g.beginPath(); for (let i = 0; i < a.length; i += 4) { g.moveTo(a[i], a[i + 1]); g.lineTo(a[i + 2], a[i + 3]); } g.stroke(); }
    LB.clear(); FB.clear();
  }
  function drawSide() {
    const E = window.EchoPrologue.engine, c = SV.c, P = player, S = MS.l3, ke = easeInOut(SV.k);
    const g = wctx; ctx = wctx;
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    const fx = SV.fx, fy = SV.fy;
    const spanX = lerp(W / 2 / Math.max(.15, ZE) + 2 * T, SV.dist * 1.25 + 2 * T, ke), spanY = lerp(H / 2 / Math.max(.15, ZE) + 2 * T, 7 * T, ke);
    const tx0 = Math.max(0, Math.floor((fx - spanX) / T)), tx1 = Math.min(GW - 1, Math.ceil((fx + spanX) / T));
    const ty0 = Math.max(0, Math.floor((fy - spanY) / T)), ty1 = Math.min(GH - 1, Math.ceil((fy + spanY) / T));
    const band1 = Math.floor(LV.corr.y + 1.5) - 1; // the corridor's last row; anything nearer the lens than this lies low
    const cy = CARR[0], wc3 = '120,200,255', cyS = CARR[0].join(',');
    const nearH = lerp(WALL_H, 10, ke); // the wall nearest the lens folds away so you can see in
    const fl = Math.max(0, 1 - (realT - (S.pulseT || -9)) / .18);
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      if (tileSolid(tx, ty)) continue;
      const f = floorAt[idx(tx, ty)], x = tx * T, y = ty * T;
      if (Math.hypot(x + T / 2 - c.pos[0], y + T / 2 + c.pos[1]) < 120 && c.pos[2] < 260) continue; // nothing right against the lens
      const a = Math.min(1, Math.max(f ? alphaOf(f) : 0, sideLight(x + T / 2, y + T / 2)));
      if (a > .03) { // the floor: the game's corner crosses, now lying in perspective
        bl(c, [x - 5, -y, 0], [x + 5, -y, 0], cyS, a * .5, .9); bl(c, [x, -y + 5, 0], [x, -y - 5, 0], cyS, a * .5, .9);
      }
      const wa = Math.min(1, a * 1.1);
      if (wa < .03) continue;
      const face = (x1, y1, x2, y2, hh, al) => {
        bf(c, [[x1, -y1, 0], [x2, -y2, 0], [x2, -y2, hh], [x1, -y1, hh]], wc3, al * .05);
        bl(c, [x1, -y1, 0], [x2, -y2, 0], wc3, al * .55, 1.1);
        bl(c, [x1, -y1, hh], [x2, -y2, hh], wc3, al, 1.6);
        bl(c, [x1, -y1, 0], [x1, -y1, hh], wc3, al * .22, .9);
      };
      if (tileSolid(tx, ty - 1)) { // the back wall, facing the lens
        face(x, y, x + T, y, ty > band1 + 1 ? nearH : WALL_H, wa * (ty > band1 + 1 ? lerp(1, .5, ke) : 1));
        bl(c, [x, -y, WALL_H * .5], [x + T, -y, WALL_H * .5], wc3, wa * .12, .8);
        if (ty === 19 && tx % 3 === 0) { // the strip lights: humming on, flaring on the beat
          const fk = .55 + .45 * Math.sin(realT * 31 + tx * 7) * (rnd2(tx) < .2 ? 1 : .08) + fl * .5;
          bl(c, [x + 6, -y - 6, WALL_H - 12], [x + T - 6, -y - 6, WALL_H - 12], '255,236,200', Math.min(1, fk) * Math.max(.35, wa), 2.6);
        }
      }
      const near = ty > band1, sh = near ? nearH : WALL_H, sa = near ? lerp(1, .5, ke) : 1;
      if (tileSolid(tx, ty + 1)) face(x + T, y + T, x, y + T, nearH, wa * lerp(1, .55, ke));
      if (tileSolid(tx - 1, ty)) face(x, y + T, x, y, sh, wa * .75 * sa);
      if (tileSolid(tx + 1, ty)) face(x + T, y, x + T, y + T, sh, wa * .75 * sa);
    }
    flushBatches(g);
    drawSmear(E, g, c);
    // sound on the floor: every ping and footstep still rings out
    for (const w of waves) { if (w.r <= 0 || w.r > w.max) continue; const k = 1 - w.r / w.max; E.ring3(g, c, w.x, -w.y, 2, w.r, CARR[w.c] || cy, k * .55 * w.s, 1.6); }
    for (const s of MS.shocks || []) E.ring3(g, c, s.x, -s.y, 3, s.r, CARR[1], Math.max(0, 1 - s.r / s.max) * .9, 2.4);
    // the choir's notes: a cone on the floor, then the scream
    for (const e of enemies) {
      if (e.dead || e.hidden) continue;
      if (e.note) {
        const k = 1 - e.note.t / e.note.t0, a = -e.a, R = 320 * (.3 + .7 * k);
        E.ring3(g, c, e.x, -e.y, 3, R, CARR[1], .3 + .55 * k, 1.6, a - .42, a + .42);
        for (const s of [-.42, .42]) E.L3(g, c, [e.x, -e.y, 3], [e.x + Math.cos(a + s) * R, -e.y + Math.sin(a + s) * R, 3], CARR[1], .3 + .5 * k, 1.2);
      }
      if (e.noteFX && time - e.noteFX.t < .4) {
        const u = (time - e.noteFX.t) / .4, R = 320 * (.2 + .8 * u), a = -e.noteFX.a;
        for (let i = 0; i < 4; i++) for (const z of [8, 40, 72]) E.ring3(g, c, e.x, -e.y, z, Math.max(1, R - i * 26), CARR[1], (1 - u) * (.8 - i * .18), 2.6 - i * .5, a - .42, a + .42);
      }
      if (e.type === 'husher' && time - (e.seenT ?? -99) < 3) E.ring3(g, c, e.x, -e.y, 2, HUSH_R, VIO, .35 * (1 - (time - e.seenT) / 3), 1.2);
      if (e.cast) { // a sigil standing in the air before its palms, facing you: rings, runes, a turning hexagram
        const k = 1 - e.cast.t / e.cast.t0, A = [255, 172, 70];
        sigil3(E, g, c, e.x + Math.cos(e.a) * 30, -(e.y + Math.sin(e.a) * 30), 60, 18 + 12 * k, -e.a, realT * 2.4, .55 + .45 * k, k);
        E.ring3(g, c, e.x, -e.y, 2, 30 + 10 * k, A, .25 + .35 * k, 1.2); // its circle on the floor
      }
    }
    for (const r of MS.l3.runes || []) { // in flight at chest height, a tail behind it
      const A = [255, 172, 70];
      sigil3(E, g, c, r.x, -r.y, 52, 12, -r.a, r.rot, 1, 1);
      for (let i = 1; i <= 5; i++) E.dot3(g, c, [r.x - Math.cos(r.a) * i * 9, -(r.y - Math.sin(r.a) * i * 9), 52], A, .5 - i * .08, 2.4 - i * .3);
      E.ring3(g, c, r.x, -r.y, 1, 9, A, .3, 1); // its light on the floor
    }
    // sparks, blood and rings
    for (const p of particles) {
      const k = clamp(p.life / p.max, 0, 1), col = CARR[p.c] || cy;
      if (p.sz == null) p.sz = 18 + Math.random() * 50;
      if (p.k === 'spark') E.L3(g, c, [p.x, -p.y, p.sz], [p.x - p.vx * .025, -(p.y - p.vy * .025), p.sz + 4], col, k, 1.2);
      else if (p.k === 'ring') E.ring3(g, c, p.x, -p.y, 2, lerp(p.r0, p.r1, easeOut(1 - k)), col, k * .8, p.s * k + .5);
      else E.dot3(g, c, [p.x, -p.y, p.k === 'blood' ? p.sz * k : p.sz], col, k, p.s || 1.4);
    }
    // the hammer: on the floor, or turning end over end through the air
    for (const p of pickups) {
      if (p.taken || Math.abs(p.x - fx) > spanX) continue;
      const bob = 6 + Math.sin(realT * 3) * 3;
      if (p.type === 'hammer') { const a = realT * 2, dx = Math.cos(a) * 14, dy = Math.sin(a) * 14; E.L3(g, c, [p.x - dx, -p.y + dy, bob], [p.x + dx, -p.y - dy, bob], CARR[2], 1, 2.2); E.ring3(g, c, p.x + dx, -p.y - dy, bob, 6, CARR[2], 1, 2.4); E.ring3(g, c, p.x, -p.y, 1, 22 + Math.sin(realT * 4) * 3, CARR[2], .5, 1.2); }
      else { E.ring3(g, c, p.x, -p.y, 1, 12, CARR[2], .7, 1.4); E.dot3(g, c, [p.x, -p.y, bob + 6], CARR[2], .9, 3); }
    }
    const h = S.thrown;
    if (h) {
      const sp = Math.hypot(h.vx, h.vy) || 1, ux = h.vx / sp, uy = -h.vy / sp, ca = Math.cos(h.rot) * 16, sa = Math.sin(h.rot) * 16;
      const a = [h.x - ux * ca, -h.y - uy * ca, 46 - sa], b = [h.x + ux * ca, -h.y + uy * ca, 46 + sa];
      E.L3(g, c, a, b, [255, 240, 200], 1, 2.6); E.ring3(g, c, b[0], b[1], b[2], 7, [255, 240, 200], 1, 2.6);
      for (let i = 1; i <= 5; i++) E.ring3(g, c, h.x - h.vx * .012 * i, -h.y + h.vy * .012 * i, 46, 6, [255, 240, 200], .3 - i * .05, 1.2);
    }
    if (!P.dead) { // his lane: a faint line across the floor at his depth, so you can line up with them
      E.L3(g, c, [P.x - 170, -P.y, 1], [P.x + 170, -P.y, 1], cy, .2, 1);
      let tgt = null, td = 210; for (const e of enemies) if (!e.dead && !e.hidden && e.type !== 'cantor') { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < td) { td = d; tgt = e; } }
      if (tgt) { // and to whoever's closest: how far in, how far across
        const ok = Math.abs(tgt.y - P.y) < 30, col = ok ? CARR[2] : cy;
        E.L3(g, c, [P.x, -P.y, 1], [tgt.x, -tgt.y, 1], col, ok ? .55 : .3, 1.2);
        E.ring3(g, c, tgt.x, -tgt.y, 1, 10, col, ok ? .8 : .45, 1.6);
      }
    }
    // where you're aiming: a small mark on the floor
    if (state === 'playing' && !P.dead) {
      const mw = screenToWorld(mouse.x, mouse.y);
      E.ring3(g, c, mw.x, -mw.y, 1, 9, cy, .55, 1.2);
      E.L3(g, c, [P.x, -P.y, 1], [P.x + Math.cos(P.a) * 34, -(P.y + Math.sin(P.a) * 34), 1], cy, .45, 1.4);
    }
    const inHall = e => e.wave != null || (e.y > 17.5 * T && e.y < 23.5 * T); // the rest of the building is behind these walls: don't draw it
    for (const e of enemies) if (Math.abs(e.x - fx) < spanX && inHall(e) && !(e.dead && time - e.dieT > 1)) choirGlow(E, g, c, e);
    // the bodies: their own crisp layer, far ones first
    plx.setTransform(1, 0, 0, 1, 0, 0); plx.clearRect(0, 0, plc.width, plc.height); plx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const list = [];
    for (const e of enemies) if (!e.hidden && inHall(e) && Math.abs(e.x - fx) < spanX + 60 && Math.abs(e.y - fy) < spanY + 60) list.push({ y: e.y, e });
    list.push({ y: P.y, p: true });
    for (const ai of afterimages) { const k = 1 - (time - ai.t) / .35; if (k > 0 && !ai.enemy) list.push({ y: ai.y - .1, ai, k }); }
    for (const it of list) { const o = it.e || it.ai || P, q = sp3(o.x, o.y, 40); it.d = q ? q[2] : -1; }
    list.sort((a, b) => b.d - a.d); // far ones first, whatever angle the rig is at
    plx.save(); plx.globalCompositeOperation = 'source-over'; plx.fillStyle = 'rgba(0,0,0,.55)'; // contact shadows: where each of them actually stands
    for (const it of list) {
      if (it.ai || (it.e && it.e.dead)) continue;
      const o = it.e || P, r = it.e ? 15 * (CHOIR_SCALE[it.e.type] || 1) : 14, pts = [];
      for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, q = sp3(o.x + Math.cos(a) * r, o.y + Math.sin(a) * r, .5); if (q) pts.push(q); }
      if (pts.length > 3) { plx.beginPath(); pts.forEach((q, i) => i ? plx.lineTo(q[0], q[1]) : plx.moveTo(q[0], q[1])); plx.closePath(); plx.fill(); }
    }
    plx.restore();
    for (const it of list) {
      if (it.e) { enemyActor(E, it.e, plx, c); continue; }
      if (it.ai) { E.actor(plx, c, ACTOR_API(), [it.ai.x, -it.ai.y, 0], -it.ai.a, CARR[0], it.k * .4, { walk: it.ai.ph || 0, stride: 1, t: realT }, { coat: true, hair: 'spiky', blind: true }); continue; }
      const pp = playerPose(P), o = pp.o, swinging = pp.swingU != null && pp.swingU > .1 && pp.swingU < .7;
      if (P.dead) o.fall = -1.4 * easeOut((time - P.dieT) / .4);
      const blink = P.iframe > 0 && P.dashT <= 0 && Math.floor(realT * 20) % 2 === 0;
      E.actor(plx, c, ACTOR_API(), [P.x, -P.y, 0], pp.yaw, CARR[0], blink ? .45 : 1, o, { coat: true, wind: realT * 2, hair: 'spiky', blind: true, knife: !P.hammer, deco: P.hammer ? d => hammerDeco(d, swinging) : null });
    }
    // comic lettering and score popups, lifted to head height and drawn flat to the lens
    const s = SV.s, moved = [];
    // side-on, everything that happened near him lands at the same height: stack the words so they stay readable
    const lift = (o, dx, z) => { const q = sp3(o.x + (dx || 0), o.y, z); moved.push([o, o.x, o.y]); if (q) { o.x = q[0] / s - (dx || 0); o.y = q[1] / s; } else { o.x = -1e5; } };
    const loud = comicFx.filter(w => (w.size || 18) >= 18 || /BEAT/.test(w.text)).slice(-4); // side-on everything lands in one spot: keep the newest few, drop the footstep chatter
    comicFx.forEach((w, i) => { if (!loud.includes(w)) { moved.push([w, w.x, w.y]); w.x = -1e5; return; } lift(w, w.dx || 0, 96 + (loud.indexOf(w) % 3) * 22); });
    const recent = popups.filter(p => !p.bubble && !COMIC_POP.has(p.text) && time - p.t < 1.4).slice(-3); // side-on they all pile up: keep the newest few
    let pn = 0; for (const p of popups) { if (!p.bubble && !COMIC_POP.has(p.text) && !recent.includes(p)) { moved.push([p, p.x, p.y]); p.x = -1e5; continue; } lift(p, 0, p.bubble ? 150 : 120 + (pn++ % 3) * 22); }
    ctx = plx; plx.setTransform(DPR * s, 0, 0, DPR * s, 0, 0);
    try { plx.globalCompositeOperation = 'source-over'; plx.globalAlpha = 1; drawComic(); plx.globalCompositeOperation = 'lighter'; drawPopups(); } finally {
      for (const [o, x, y] of moved) { o.x = x; o.y = y; }
      plx.globalCompositeOperation = 'source-over'; plx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx = wctx; g.globalCompositeOperation = 'source-over';
    }
    playerLayerUsed = true;
  }
  const rnd2 = i => { const s = Math.sin(i * 91.7 + 13.1) * 43758.5; return s - Math.floor(s); };
  const QF = { ms: 16, slowFor: 0, fastFor: 0, low: false, last: 0 }; // a frame-time watch: on a struggling machine the costly extras switch off
  window.__QF = QF;
  function qualityTick() {
    if (GQ === 'low') { QF.low = true; return; }
    if (GQ === 'high') { QF.low = false; return; }
    const now = performance.now(), d = QF.last ? Math.min(200, now - QF.last) : 16; QF.last = now;
    QF.ms = QF.ms * .92 + d * .08;
    if (QF.ms > 30) { QF.slowFor += d; QF.fastFor = 0; } else if (QF.ms < 20) { QF.fastFor += d; QF.slowFor = 0; }
    if (!QF.low && QF.slowFor > 2500) QF.low = true;
    if (QF.low && QF.fastFor > 6000) QF.low = false;
  }
  { const f = drawWorld; drawWorld = function (showPlayer) {
    qualityTick();
    const dt = clamp(realT - SV.lastT, 0, .05); SV.lastT = realT;
    const allowed = sideAllowed() && window.EchoPrologue && window.EchoPrologue.engine;
    if (!allowed) { SV.k = 0; SV.hk = 0; SV.on = false; return f(showPlayer); }
    SV.k = clamp(SV.k + (sideWanted() ? dt / 2.4 : -dt / 1.3), 0, 1);
    SV.hk = clamp(SV.hk + (MS.l3.thrown ? dt / .35 : -dt / .6), 0, 1);
    if (SV.k <= .001) { SV.on = false; return f(showPlayer); }
    ZE = Z * CAMZ * (1 + zoomPunch) * (CS ? CS.z * 1.15 : 1);
    sideCamera(); SV.on = true;
    drawSide();
  }; }
  window.__SV = SV; window.__MUS = MUS;
  { const a0 = CanvasRenderingContext2D.prototype.arc; // a radius that eases a hair below zero must never cost a frame
    CanvasRenderingContext2D.prototype.arc = function (x, y, r, ...rest) { return a0.call(this, x, y, r > 0 ? r : 0, ...rest); }; }


  // ---- fixes: squads don't plan in the corridor; a little more breathing room between hits in the throne room ----
  { const f = formPlan; formPlan = function () { if (on3() && ['corridor', 'elevator', 'boss', 'silence'].includes(MS.phase)) { MS.sqCD = 2; return; } return f(); }; }
  { const f = damagePlayer; damagePlayer = function (n, sx, sy) {
    const hp = player ? player.hp : 0; f(n, sx, sy);
    if (on3() && MS.phase === 'boss' && player && !player.dead && player.hp < hp) player.iframe = Math.max(player.iframe, 1);
  }; }
  // ================= the HUD =================
  function hexAt(k) {
    const S = clamp(Math.min(W / 1500, H / 900), .72, 1.25), pad = 26 * S, by = H - pad - 30 * S, yy = by - 2 * S, bx = W / 2;
    return { x: { q: bx - 144 * S, sp: bx - 72 * S, e: bx, g: bx + 72 * S, c: bx + 144 * S }[k], y: yy, r: 24 * S, s: S };
  }
  function drawL3HUD() {
    const S = MS.l3, P = player, C = S.corr, s = clamp(Math.min(W / 1500, H / 900), .72, 1.25);
    if (C && (MS.phase === 'corridor' || MS.phase === 'elevator')) {
      const bh = H * .075; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, bh); ctx.fillRect(0, H - bh, W, bh); // the film's letterbox
      ctx.fillStyle = rgba(CARR[1], .25); ctx.fillRect(0, bh, W, 1); ctx.fillRect(0, H - bh - 1, W, 1);
      if (MS.phase === 'corridor') { // the beat: a ring closing on him
        const sp = worldToScreen(P.x, P.y), ph = beatPos() - Math.floor(beatPos()), fl = Math.max(0, 1 - (realT - S.pulseT) / .15);
        ctx.strokeStyle = rgba(CARR[2], .25 + .35 * (1 - ph)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sp.x, sp.y, 26 + 46 * (1 - ph), 0, TAU); ctx.stroke();
        if (fl > 0) { ctx.strokeStyle = rgba(CARR[2], fl * .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(sp.x, sp.y, 28, 0, TAU); ctx.stroke(); }
        text(`WAVE ${Math.min(4, C.wave)} / 4`, W / 2, bh * .5, 12 * s, CARR[1], .85, 'center', 700, `${6 * s}px`);
        if (S.combo > 1) text(`ON BEAT  x${S.combo}`, W / 2, bh + 22 * s, 16 * s, CARR[2], .9, 'center', 700, `${4 * s}px`);
        if (S.rageT > time) text('SECOND WIND', 40 * s, bh * .5, 12 * s, CARR[0], .6 + .4 * Math.sin(realT * 8), 'left', 700, `${5 * s}px`);
        if (C.lastman) text('[F] / RIGHT-CLICK  ·  THROW THE HAMMER', W / 2, H - bh - 30 * s, 15 * s, CARR[2], .7 + .3 * Math.sin(realT * 7), 'center', 700, `${4 * s}px`);
        if (S.btUntil > realT) text('· · ·  B U L L E T   T I M E  · · ·', W / 2, H - bh * .5, 11 * s, CARR[0], .8, 'center', 700, `${2 * s}px`);
      } else text('[ GET TO THE ELEVATOR — WEST END ]', W / 2, H - bh * .5, 12 * s, CARR[2], .75 + .25 * Math.sin(realT * 4), 'center', 700, `${4 * s}px`);
    }
    const B = S.boss;
    if (B && MS.phase === 'boss') {
      const w = Math.min(560 * s, W * .5), x = W / 2 - w / 2, y = 26 * s + 124 * s, h = 10 * s;
      text(S.mask ? 'THE CANTOR  ·  LENA' : 'THE CANTOR', W / 2, y - 15 * s, 13 * s, CARR[1], .95, 'center', 700, `${8 * s}px`);
      ctx.fillStyle = 'rgba(30,4,10,.75)'; ctx.fillRect(x, y, w, h);
      if (B.stage === 1) { const left = B.pipes.filter(p => !p.gone).length; for (let i = 0; i < 6; i++) { ctx.fillStyle = i < left ? rgba(CARR[2], .9) : 'rgba(80,40,30,.6)'; ctx.fillRect(x + i * w / 6 + 2, y, w / 6 - 4, h); } text('THE ORGAN', W / 2, y + 26 * s, 10 * s, CARR[2], .8, 'center', 700, `${5 * s}px`); }
      else { ctx.fillStyle = rgba(CARR[1], .95); ctx.fillRect(x, y, w * B.e.trueHp / B.e.maxHp, h); ctx.fillStyle = '#000'; ctx.fillRect(x + w * 12 / 48, y, 2, h); }
      brackets(x - 5, y - 5, w + 10, h + 10, 9, CARR[1], .75, 1.4);
      for (const k of S.stolen) { // stolen abilities: cracked, red, gone
        const p = hexAt(k); hexPath(p.x, p.y, p.r); ctx.fillStyle = 'rgba(50,4,10,.82)'; ctx.fill(); ctx.strokeStyle = rgba(CARR[1], .95); ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.x - p.r * .5, p.y - p.r * .6); ctx.lineTo(p.x + p.r * .1, p.y - p.r * .1); ctx.lineTo(p.x - p.r * .2, p.y + p.r * .2); ctx.lineTo(p.x + p.r * .5, p.y + p.r * .6); ctx.stroke();
        text('STOLEN', p.x, p.y + p.r + 24 * p.s, 8 * p.s, CARR[1], .9, 'center', 700, `${2 * p.s}px`);
      }
      if (S.giveIt) text('[ Q ]   G I V E   I T   A L L', W / 2, H * .62, 30 * s, CARR[3], .65 + .35 * Math.sin(realT * 9), 'center', 700, `${4 * s}px`);
      if (S.hushT > time) { ctx.fillStyle = `rgba(0,0,0,${.35 + .1 * Math.sin(realT * 6)})`; ctx.fillRect(0, 0, W, H); text('H U S H', W / 2, H * .34, 26 * s, CARR[1], .5 + .3 * Math.sin(realT * 4), 'center', 700, `${10 * s}px`); }
    }
    if (S.inHum && MS.phase === 'ascent') text('THE CHOIR\'S HUM  ·  ECHO MUFFLED', W / 2, H - 26 * s - 30 * s - 2 * s - 50 * s - 18 * s, 11 * s, CARR[2], .55 + .3 * Math.sin(realT * 3), 'center', 700, `${4 * s}px`);
  }
  function drawSilenceHUD() { // black. only what you hear.
    const S = MS.l3, Z = S.silence, P = player, s = clamp(Math.min(W / 1500, H / 900), .72, 1.25);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (!Z) return;
    const nk = realT - Z.noteAt;
    if (nk >= 0 && nk < 3) { // where her notes came from, the way the game always shows a sound you heard
      const a = Math.atan2(Z.dest.y - P.y, Z.dest.x - P.x), R = Math.min(W, H) * .32;
      const x = W / 2 + Math.cos(a) * R, y = H / 2 + Math.sin(a) * R, al = Math.min(1, nk * 3) * (1 - nk / 3);
      text('♪  hm · hm · hm · hmm', x, y, 17 * s, CARR[2], al * .9, 'center', 600, '2px');
    }
    const wk = realT - Z.walkHint;
    if (wk < 6) text('W A S D', W / 2, H * .82, 12 * s, CARR[3], Math.max(0, .35 * (1 - wk / 6)), 'center', 700, `${4 * s}px`);
    const r = MS.radio;
    if (r && realT - r.t < r.dur) {
      const k = realT - r.t, a = Math.max(0, Math.min(1, k / .3, (r.dur - k) / .5));
      text(WHO_LABEL[r.who] || r.who, W / 2, H * .86 - 22 * s, 10 * s, r.who === 'ECHO' ? CARR[0] : CARR[2], a * .9, 'center', 700, `${6 * s}px`);
      text(r.text, W / 2, H * .86, 17 * s, CARR[3], a * .9, 'center', 500, '0.4px');
    }
  }
  { const f = drawCursor; drawCursor = function () { if (on3() && MS.phase === 'silence') return; return f(); }; } // no crosshair in the dark: there's nothing to aim at
  { const f = drawHUD; drawHUD = function (dt) {
    if (on3() && MS.phase === 'silence') return drawSilenceHUD();
    f(dt);
    if (on3()) drawL3HUD();
  }; }

  // ================= title: the last issue, from the menu =================
  { const f = drawTitle; drawTitle = function () {
    f();
    if (ONLY_L1 || !TB.b2) return;
    const s = clamp(Math.min(W / 1400, H / 860), .62, 1.2), [b2x, byy, b2w, bh] = TB.b2, bx = b2x + b2w + 18 * s, bw = 250 * s;
    if (bx + bw > W - 10) { TB.b3 = null; return; }
    const hov = mouse.x > bx && mouse.x < bx + bw && mouse.y > byy && mouse.y < byy + bh;
    levelButton(bx, byy, bw, bh, s, 2, 'THE CHOIR', CARR[1], hov);
    TB.b3 = [bx, byy, bw, bh];
  }; }
  addEventListener('keydown', e => { if (state === 'title' && e.code === 'Digit3' && !ONLY_L1 && !e.repeat) tryLevel(2); });
  cv.addEventListener('mousedown', e => {
    if (state !== 'title' || !TB.b3) return;
    const [x, y, w, h] = TB.b3; if (e.clientX > x && e.clientX < x + w && e.clientY > y && e.clientY < y + h) { e.stopImmediatePropagation(); tryLevel(2); }
  }, true);

  window.__L3 = { startCorridor: () => startCorridor(), startBoss: f => startBoss(f), toStage2, toStage3, giveIt, triggerFinale, startSilence, nextWave: () => nextWave() }; // test hooks
})();
