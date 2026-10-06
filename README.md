# ECHO #1: Lights On

> A blind hitman sees the world through sound. Then someone turns the lights on.

A top-down stealth-action game that runs in any web browser. You play Elias "Echo" Calder, a former hitman blinded by the syndicate that killed his wife, Lena. The screen is dark. The only way to see is sound: every footstep, sonar ping and gunshot sends out a ripple that briefly reveals the walls around it. The guards are blind too, but they hear everything. Halfway through the level, the boss turns the power back on, and you have to shoot out the lights to get your darkness back.

## ▶ Play it

**itch.io:** https://YOUR-ITCH-USERNAME.itch.io/echo-lights-on  <!-- TODO: replace with the real itch.io page URL -->

Headphones are recommended. Every sound is positioned in 3D, so you can hear where it came from.

## Setup & run locally

There's nothing to install or build. The game is plain HTML5 Canvas and Web Audio with no dependencies.

**Requirements**
- A modern desktop browser (Chrome, Edge or Firefox)
- An internet connection on first load, for the Google Fonts (the game falls back to system fonts without it)
- Python 3, or any static file server

**Steps**

1. Get the project folder (clone the repository or download and unzip it).
2. Start a local web server in the project folder:

   ```bash
   python -m http.server 8765
   ```

3. Open http://localhost:8765 in your browser.
4. Click or press any key on the cover screen. The browser needs this first click before it will play audio.

Opening `index.html` directly from disk may also work, but a local server is the reliable option.

### Uploading to itch.io

1. Zip `index.html` and `game.js`, with both files at the root of the zip.
2. On itch.io, create a new project and set **Kind of project** to **HTML**.
3. Upload the zip and tick **This file will be played in the browser**.
4. Set the viewport to **1280 × 720** and enable the **Fullscreen button**.

## Controls

| Input | Action |
|---|---|
| **W A S D** / Arrow keys | Move (quiet) |
| **Shift** (hold) | Run (faster, but louder) |
| **Q** | Sonar ping: lights up the room and marks enemies, but they hear it too |
| **Space** | Dash / silent strike |
| **F** | Knife (silent takedown at close range) |
| **Left click** | Shoot (aim with the mouse) |
| **Esc** / **P** | Pause |
| **M** | Mute |
| **H** | Show / hide the controls hint |
| **Click / Space / Enter** | Advance cutscenes |
| **Esc** (in a cutscene) | Skip cutscene |
| **R** / **Enter** (end screen) | Play again |

**Tips**
- Standing still is silent. Walking is quiet, while running, shooting and sonar are loud.
- The red circle around a guard shows how close you can get before your footsteps are heard.
- Running into a closed door slams it (**WHAM!**) and knocks out the guard behind it.
- Lost? Follow Lena's song (♪): it plays from your current objective, and the compass points the way.

## How to win

1. **Find the ledger** in Vargas' north-east office.
2. **The power comes back on.** Guards can now see you in the light. Shoot out every lamp.
3. **Take down Vargas** once it's dark again.
4. **Grab the evidence** he drops.
5. **Escape** to the exit before the 8-minute timer runs out.

## Team

| Name | Contact | Profile |
|---|---|---|
| **Mohammed Abdur Rehman Baig** | abdrahmaan786@gmail.com | [indieconnect.in/@arbaig](https://indieconnect.in/@arbaig) |
| **Mohammed Rehan** | rehanstudy4@gmail.com | [indieconnect.in/@rehanstudy4](https://indieconnect.in/@rehanstudy4) |

## Project structure

```
index.html   page shell and font loading
game.js      the whole game: rendering, audio, AI, cutscenes
README.md    this file
```

## Tech

HTML5 Canvas 2D · Web Audio API (HRTF 3D sound) · no frameworks, no build step.
