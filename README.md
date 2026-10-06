ECHO

ECHO is a browser-based, top-down stealth-action game about a blind hitman who uses sound to see. Every footstep, shot, and sonar ping briefly reveals the darkness around you—and can give away your position.

## Play

[Search for ECHO on itch.io](https://itch.io/search?q=ECHO) · Replace this with the direct game page URL when it is available.

## Setup and run

The game is a static HTML, CSS, and JavaScript project. It has no build step or package installation. Run it from a local web server so the browser can load its scripts and assets.

1. Clone the repository and enter its folder:

   ```sh
   git clone https://github.com/DoesntMatterICare/echo.git
   cd echo
   ```

2. Start a local server:

   ```sh
   # Windows
   py -m http.server 8000

   # macOS or Linux
   python3 -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in a recent desktop browser. Chrome or Edge is recommended. Headphones help with the positional audio.

Stop the server with **Ctrl+C** in the terminal.

## Controls

| Input | Action |
| --- | --- |
| `WASD` or arrow keys | Move |
| Mouse | Aim |
| Left-click | Fire |
| `F` or right-click | Use knife silently |
| `Q` | Sonar ping; reveals the area and marks enemies |
| `Shift` | Sprint; faster but louder |
| `Space` | Dash; use on a marked enemy for an Echo Strike |
| `E` | Throw a decoy |
| `G` | Send a phantom; press `G` again to shatter it |
| `H` | Use a medkit |
| `R` | Reload |
| `1`–`4` or mouse wheel | Switch weapons |
| `M` | Toggle sound |
| `Esc` or `P` | Pause and open the full controls/settings menu |

## Team

- **Mohammed Abdur Rehman Baig** — [Indieconnect profile](https://www.indieconnect.in/@arbaig) · [abdrahmaan786@gmail.com](mailto:abdrahmaan786@gmail.com)
- **Mohammed Rehan** — [Indieconnect profile](https://www.indieconnect.in/@rehanstudy4) · [rehanstudy4@gmail.com](mailto:rehanstudy4@gmail.com)

## AI tools and disclosure

AI tools are allowed. Disclose every AI tool used and what it contributed, including LLMs for code or text and generators for images, sound or music, and 3D assets.

- **Claude Opus 5.5** — used to create the game project and its content, including code, writing, visuals, audio, and 3D assets.
- **OpenAI Codex (GPT-6)** — used to draft this README, including the setup instructions, controls, team details, and disclosure.

