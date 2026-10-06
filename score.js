// =====================================================================
//  ECHO — THE SCORE
//  One adaptive score for the whole game, synthesized live. It listens to the same
//  things the player does and moves between four states:
//    CALM     pads and Lena's four notes (A C E D), far away, with a lot of room around them
//    TENSE    a low pulse creeps in under the pads, its filter opening as they search
//    COMBAT   drums and a driving bass; a hit when it starts, a resolving chord when it ends
//    BOSS     the whole band, heavier
//  Every Issue has its own key and colour: the Archive is cold glass, the Foundry is
//  metal and thunder, the Choir is voices. The Choir corridor keeps its own track
//  (level3.js) and this score steps aside for it, for the prologue and for the endings.
// =====================================================================
(function () {
  'use strict';
  const BPM = 92, ST = 60 / BPM / 4; // one sixteenth
  // Lena's song: the motif everything is built from
  const LENA = [440, 523.25, 659.25, 587.33];
  // per Issue: a four-chord loop (root, then the chord tones an octave up), and a colour
  const KEYS = {
    0: { name: 'title', prog: [[55, 220, 261.63, 329.63], [43.65, 174.61, 220, 261.63], [36.71, 146.83, 174.61, 220], [41.2, 164.81, 207.65, 246.94]], motif: 1 },    // A minor: Am F Dm E
    1: { name: 'archive', prog: [[55, 220, 261.63, 329.63], [43.65, 174.61, 220, 261.63], [36.71, 146.83, 174.61, 220], [41.2, 164.81, 207.65, 246.94]], glass: 1 }, // the Archive: A minor, cold glass
    2: { name: 'foundry', prog: [[41.2, 164.81, 196, 246.94], [32.7, 130.81, 164.81, 196], [55, 220, 261.63, 329.63], [61.74, 246.94, 293.66, 369.99]], metal: 1 }, // the Foundry: E minor, Em C Am B
    3: { name: 'choir', prog: [[36.71, 146.83, 174.61, 220], [29.14, 116.54, 146.83, 174.61], [49, 196, 233.08, 293.66], [55, 220, 277.18, 329.63]], voice: 1 },  // the Choir: D minor, Dm Bb Gm A
  };
  const SC = window.__SCORE = { on: false, step: 0, next: 0, mode: 'off', lvl: 0, tense: 0, fight: 0, boss: 0, lastFight: -99, lastStates: null, prevState: null, prevHp: null, prevShots: 0, prevDmg: 0, bus: null };
  let L = null; // layer gains

  // ---------- the bus: its own lowpass (pause muffles it), into the music slider ----------
  function bus() {
    const A = AU.ctx;
    if (SC.bus && SC.ctx === A) return true;
    if (!A || !AU.musVol) return false;
    const out = A.createGain(); out.gain.value = 0;
    const lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 18000; lp.Q.value = .4;
    const comp = A.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .25;
    out.connect(lp); lp.connect(comp); comp.connect(AU.musVol);
    const rv = A.createGain(); rv.gain.value = .45; comp.connect(rv); rv.connect(AU.echo); // the same room as everything else
    const mk = () => { const g = A.createGain(); g.gain.value = 0; g.connect(out); return g; };
    L = { pad: mk(), motif: mk(), pulse: mk(), drums: mk(), lead: mk(), color: mk(), sting: mk() };
    L.sting.gain.value = 1;
    SC.bus = out; SC.lp = lp; SC.ctx = A;
    return true;
  }
  // ---------- instruments ----------
  function env(g, t, att, peak, dur) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + att); g.gain.setTargetAtTime(0, t + att, Math.max(.01, dur / 3)); }
  function out(to, t, peak, att, dur, pan) {
    const A = AU.ctx, g = A.createGain(); env(g, t, att, peak, dur);
    if (pan && A.createStereoPanner) { const p = A.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(to); } else g.connect(to);
    return g;
  }
  function osc(type, f, t, end, to, det) { const o = AU.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (det) o.detune.value = det; o.connect(to); o.start(t); o.stop(end); return o; }
  function nz(t, dur, type, fq, q, to) { const A = AU.ctx, n = A.createBufferSource(); n.buffer = AU.noise; const f = A.createBiquadFilter(); f.type = type; f.frequency.value = fq; if (q) f.Q.value = q; n.connect(f); f.connect(to); n.start(t, Math.random()); n.stop(t + dur); }
  const I = {
    pad(t, freqs, dur, v, warm) { // a slow string pad: detuned saws through a soft lowpass, long attack
      const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = warm ? 1300 : 900; lp.Q.value = .6;
      lp.connect(out(L.pad, t, v, dur * .35, dur * 1.1));
      for (const f of freqs) for (const d of [-8, 8]) osc('sawtooth', f, t, t + dur * 2, lp, d);
    },
    voice(t, freqs, dur, v) { // the choir's "ah": saws through vowel formants
      const A = AU.ctx, sum = A.createGain(); sum.connect(out(L.color, t, v, dur * .4, dur));
      const fs = [[730, 7, 1], [1090, 9, .5], [2440, 10, .2]].map(([fq, q, k]) => { const b = A.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = fq; b.Q.value = q; const g = A.createGain(); g.gain.value = k * 3; b.connect(g); g.connect(sum); return b; });
      for (const f of freqs) for (const d of [-7, 7]) { const o = A.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; for (const b of fs) o.connect(b); o.start(t); o.stop(t + dur * 2); }
    },
    glass(t, f, v, pan) { // the Archive: a cold struck glass, a pure partial and a bright inharmonic one
      osc('sine', f, t, t + 2.4, out(L.color, t, v, .004, 1.6, pan)); osc('sine', f * 2.76, t, t + 1.2, out(L.color, t, v * .3, .002, .5, pan));
    },
    clank(t, v, pan) { // the Foundry: metal on metal, far off
      nz(t, .5, 'bandpass', 2100 + Math.random() * 900, 12, out(L.color, t, v, .001, .35, pan));
      osc('square', 180 + Math.random() * 60, t, t + .3, out(L.color, t, v * .25, .001, .12, pan));
    },
    bell(t, f, v, pan) { // the motif's voice: a soft electric-piano bell
      osc('sine', f, t, t + 2.6, out(L.motif, t, v, .006, 1.8, pan)); osc('sine', f * 2, t, t + 1.2, out(L.motif, t, v * .22, .004, .6, pan)); osc('triangle', f * .5, t, t + 1.4, out(L.motif, t, v * .3, .01, 1, pan));
    },
    bass(t, f, dur, v, bright) {
      const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 4; lp.frequency.setValueAtTime(bright, t); lp.frequency.exponentialRampToValueAtTime(Math.max(120, bright * .35), t + dur);
      lp.connect(out(L.pulse, t, v, .006, dur * .8));
      osc('sawtooth', f, t, t + dur * 2, lp); osc('sine', f, t, t + dur * 2, out(L.pulse, t, v * .9, .006, dur));
    },
    kick(t, v) { const o = osc('sine', 120, t, t + .45, out(L.drums, t, v, .003, .3)); o.frequency.exponentialRampToValueAtTime(42, t + .12); },
    snare(t, v) { nz(t, .3, 'bandpass', 1800, .8, out(L.drums, t, v, .002, .13)); osc('triangle', 185, t, t + .12, out(L.drums, t, v * .45, .002, .06)); },
    hat(t, v, pan) { nz(t, .12, 'highpass', 7500, 0, out(L.drums, t, v, .001, .035, pan)); },
    tom(t, v, f) { const o = osc('sine', f || 95, t, t + .7, out(L.drums, t, v, .004, .45)); o.frequency.exponentialRampToValueAtTime((f || 95) * .55, t + .25); nz(t, .3, 'lowpass', 300, 0, out(L.drums, t, v * .5, .002, .12)); },
    lead(t, f, dur, v) { const A = AU.ctx, lp = A.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2800; lp.connect(out(L.lead, t, v, .03, dur, .12)); osc('sawtooth', f, t, t + dur * 3, lp, -5); osc('triangle', f, t, t + dur * 3, lp, 5); },
    swell(t, dur, v) { nz(t, dur + .1, 'bandpass', 900, .6, (() => { const g = AU.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + .05); g.connect(L.sting); return g; })()); },
  };
  // ---------- stingers: the score answering what just happened ----------
  function key() { return KEYS[SC.lvl] || KEYS[1]; }
  function chordNow() { const P = key().prog; return P[Math.floor(SC.step / 16) % P.length]; }
  const sting = {
    spotted() { // a low hit and a rising swell: they know you're here
      if (!bus()) return; const t = AU.ctx.currentTime + .02, c = chordNow();
      I.swell(t - .01, .35, .12);
      osc('sawtooth', c[0], t + .35, t + 2.4, out(L.sting, t + .35, .16, .01, 1.4)); osc('sine', c[0] / 2, t + .35, t + 2.4, out(L.sting, t + .35, .22, .01, 1.2));
      for (const f of c.slice(1)) osc('sawtooth', f, t + .35, t + 1.6, out(L.sting, t + .35, .035, .01, .9), 6);
    },
    clear() { // the fight's over: the last chord resolves up, the motif's last note answered
      if (!bus()) return; const t = AU.ctx.currentTime + .05, c = chordNow();
      for (const f of c.slice(1)) osc('triangle', f, t, t + 3.5, out(L.sting, t, .03, .3, 2.6));
      I.bell(t + .4, LENA[3], .05, .2);
    },
    death() { // everything sinks: a falling drone and one last, out-of-tune note of her song
      if (!bus()) return; const t = AU.ctx.currentTime + .02;
      for (const [f, d] of [[110, 0], [164.8, 6]]) { const o = osc('sawtooth', f, t, t + 3.6, out(L.sting, t, .09, .05, 2.4), d); o.frequency.exponentialRampToValueAtTime(f * .5, t + 3.2); }
      const o = osc('sine', LENA[3], t + .6, t + 3.5, out(L.sting, t + .6, .07, .02, 2.2)); o.frequency.exponentialRampToValueAtTime(LENA[3] * .94, t + 3);
    },
    win() { // her four notes, finally in tune and harmonized, over the tonic
      if (!bus()) return; const t = AU.ctx.currentTime + .25, c = key().prog[0];
      osc('sine', c[0], t, t + 4.5, out(L.sting, t, .14, .2, 3.4));
      for (const f of c.slice(1)) for (const d of [-6, 6]) osc('sawtooth', f, t, t + 4.5, (() => { const lp = AU.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.connect(out(L.sting, t, .022, .5, 3.2)); return lp; })(), d);
      LENA.forEach((f, i) => { osc('sine', f, t + i * .34, t + i * .34 + 2.6, out(L.sting, t + i * .34, .085, .005, 1.8)); osc('sine', f * 2, t + i * .34, t + i * .34 + 1.2, out(L.sting, t + i * .34, .02, .004, .6)); });
    },
  };
  // ---------- the composer: one sixteenth at a time, layered by state ----------
  function compose(s, t) {
    const K = key(), P = K.prog, c = P[Math.floor(s / 16) % P.length], i = s % 16, bar = Math.floor(s / 16);
    const tense = SC.tense, fight = SC.fight, boss = SC.boss;
    // pads: a new chord each bar, always there underneath
    if (i === 0) {
      I.pad(t, c.slice(1), ST * 16, .03 + .02 * fight, fight > .5);
      if (K.voice && i === 0) I.voice(t, c.slice(1, 3), ST * 16, .022 + .02 * boss);
    }
    // the motif: Lena's four notes, slow and far away when it's quiet; every other phrase, one note goes astray
    if (fight < .5 && (bar % 4 === 1 || bar % 4 === 3) && i % 4 === 0) {
      const n = i / 4, f = LENA[n] * (bar % 8 === 7 && n === 3 ? .94 : 1); // the last note slips flat sometimes: she's wrong now
      I.bell(t, f * (SC.lvl === 2 ? .5 : 1), .045, n % 2 ? .3 : -.3);
    }
    // Issue colours
    if (K.glass && i % 8 === 6 && Math.random() < .5 - .3 * fight) I.glass(t, c[1 + (bar + i) % 3] * 2, .03, Math.random() * 1.2 - .6);
    if (K.metal && (i === 3 || i === 11) && Math.random() < .25 + .4 * fight) I.clank(t, .05 + .05 * fight, Math.random() * 1.2 - .6);
    // the pulse: eighths of the root, the filter opens as tension rises
    if (tense > .05 && i % 2 === 0) {
      const f = [c[0], c[0], c[0] * 2, c[0], c[0], c[0] * 1.5, c[0] * 2, c[0]][i / 2];
      I.bass(t, f, ST * 1.8, .1 + .06 * fight, 300 + 1700 * Math.max(tense, fight));
    }
    // drums: in combat
    if (fight > .05) {
      if (i === 0 || i === 8 || (i === 10 && fight > .6) || (boss > .3 && i === 6)) I.kick(t, .32 + .12 * boss);
      if (i === 4 || i === 12) I.snare(t, .14 + .06 * boss);
      if (i % 2 === 1) I.hat(t, .02 + .015 * fight, i % 4 === 1 ? .25 : -.25);
      if (boss > .3 && (i === 14 || i === 15)) I.tom(t, .22, i === 14 ? 110 : 82);
      if (K.metal && i === 2 && fight > .5) I.clank(t, .07, -.4);
    }
    // the lead: in a full fight, Lena's notes turned into a battle line
    if ((fight > .7 || boss > .3) && bar % 2 === 1 && i % 4 === 0) {
      const n = i / 4; I.lead(t, LENA[(n + bar) % 4] * (boss > .3 ? 1 : .5), ST * 3.6, .028 + .02 * boss);
    }
  }
  // ---------- listening to the game ----------
  const FIGHT = new Set(['hunt', 'charge', 'aim', 'burst', 'windup', 'windsmash', 'lunge', 'volley', 'windslam', 'windscream', 'windnote', 'windfan', 'windcharge']);
  const TENSE = new Set(['search', 'return', 'crouch', 'stalk']);
  function listen() {
    if (window.__scoreForce) return window.__scoreForce; // test hook
    const P = player, out = { tense: 0, fight: 0, boss: 0 };
    if (!P || !MS) return out;
    let near = 0, hunting = 0;
    for (const e of enemies) {
      if (e.dead || e.hidden) continue;
      const d = Math.hypot(e.x - P.x, e.y - P.y);
      if (FIGHT.has(e.state) && d < 1000) hunting++;
      else if (TENSE.has(e.state) && d < 1200) near++;
    }
    if (near) out.tense = Math.min(1, .45 + near * .15);
    if (hunting) { out.fight = Math.min(1, .55 + hunting * .15); out.tense = 1; }
    if (stats && (stats.shots !== SC.prevShots || stats.dmg !== SC.prevDmg)) { SC.lastFight = realT; SC.prevShots = stats.shots; SC.prevDmg = stats.dmg; }
    if (realT - SC.lastFight < 4) { out.fight = Math.max(out.fight, .6); out.tense = 1; }
    const ph = MS.phase;
    if (ph === 'lights') { out.fight = Math.max(out.fight, .7); out.tense = 1; }
    if (ph === 'escape') { out.fight = Math.max(out.fight, .8); out.tense = 1; }
    if (ph === 'boss') { out.boss = 1; out.fight = 1; out.tense = 1; }
    if (P.disgT > 0) out.tense = Math.max(out.tense, .5);
    return out;
  }
  // ---------- the clock ----------
  function tick() {
    try {
      if (!AU.ctx || AU.muted) return;
      const A = AU.ctx;
      const st = state, corrMusic = window.__MUS && window.__MUS.on;
      // where are we?
      let mode = 'off';
      if (st === 'title') mode = 'title';
      else if (st === 'playing' || st === 'paused' || st === 'cutscene' || st === 'dead' || st === 'win' || st === 'briefing') mode = 'game';
      if (st === 'prologue' || corrMusic || (MS && MS.phase === 'silence') || (MS && MS.phase === 'corridor')) mode = 'off'; // others have the floor
      if (!bus()) return;
      // transitions the score answers
      if (SC.prevState !== st) {
        if (st === 'dead' && SC.prevState === 'playing') sting.death();
        if (st === 'win' && SC.prevState === 'playing') sting.win();
        SC.prevState = st;
      }
      const lvl = mode === 'title' ? 0 : (LV && LV.id) || 1;
      if (lvl !== SC.lvl) { SC.lvl = lvl; SC.step = Math.floor(SC.step / 64) * 64; } // a new key starts on a phrase
      // intensity
      let tgt = { tense: 0, fight: 0, boss: 0 };
      if (mode === 'game' && st === 'playing') tgt = listen();
      else if (mode === 'game' && (st === 'paused' || st === 'cutscene')) tgt = { tense: SC.tense * .6, fight: 0, boss: 0 };
      const wasFight = SC.fight > .5;
      const k = 1 - Math.exp(-.05 * (tgt.fight > SC.fight ? 6 : 1.2)); // in fast, out slow
      SC.tense += (tgt.tense - SC.tense) * (1 - Math.exp(-.05 * 2));
      SC.fight += (tgt.fight - SC.fight) * k;
      SC.boss += (tgt.boss - SC.boss) * (1 - Math.exp(-.05 * 2));
      if (!wasFight && SC.fight > .5 && st === 'playing' && realT - (SC.spotT || -99) > 12) { SC.spotT = realT; sting.spotted(); }
      if (wasFight && SC.fight <= .5 && st === 'playing' && SC.boss < .3) sting.clear();
      // the mix: layer levels follow the state; pause and death muffle it, dialogue already ducks it
      const n = A.currentTime, on = mode === 'off' ? 0 : 1, quiet = st === 'dead' || st === 'win' ? .35 : st === 'cutscene' ? .6 : 1;
      SC.bus.gain.setTargetAtTime(on * quiet, n, mode === 'off' ? .6 : 1.2);
      SC.lp.frequency.setTargetAtTime(st === 'paused' ? 700 : st === 'dead' ? 500 : 18000, n, .25);
      L.pad.gain.setTargetAtTime(1, n, .8);
      L.motif.gain.setTargetAtTime(1 - SC.fight * .8, n, .8);
      L.color.gain.setTargetAtTime(.8 + .4 * SC.fight, n, .8);
      L.pulse.gain.setTargetAtTime(Math.min(1, SC.tense * 1.2), n, .5);
      L.drums.gain.setTargetAtTime(SC.fight, n, .35);
      L.lead.gain.setTargetAtTime(Math.max(SC.fight - .5, SC.boss) * 1.6, n, .6);
      // schedule ahead
      if (mode === 'off') { SC.next = n + .1; return; }
      if (SC.next < n) SC.next = n + .05;
      while (SC.next < n + .25) { compose(SC.step, SC.next); SC.step++; SC.next += ST; }
    } catch (e) { /* the score must never stop the game */ }
  }
  setInterval(tick, 50);
})();
