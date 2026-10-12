# The Underwater Transfer

A 30-second animation of an underwater rescue scene: a figure in white robes sinks through
dark, churning water and is caught by a rescuer in crimson. When their lips meet, spiritual
power passes between them as silver-blue light.

The characters are original designs, not based on any existing artwork. The scene is
inspired by an underwater moment in a fantasy story.

The live version, with playback, sound and video export, is the Motion artifact:
https://claude.ai/artifact/J16Ad3chGKEXFi14aCgC9o

This folder is a copy of its source. The Motion player (not included here) loads these files
and runs them. Edits made here do not update the artifact.

| # | Scene | Length | What happens |
|---|-------|--------|--------------|
| 1 | Sinking | 5 s | The white-robed figure drifts down, robes billowing. Air escapes and their eyes flutter shut |
| 2 | Crimson streak | 5 s | A crimson trail cuts through the dark, butterflies scatter, and the rescuer catches the sinking figure by the waist |
| 3 | Held close | 5 s | Close-up: their eyes snap open as the rescuer pulls them flush |
| 4 | The transfer | 7 s | A kiss, and silver-blue light blooms from it in rings |
| 5 | Rising spiral | 5 s | Bubbles and silver butterflies spiral up around the pair, and the dark pulls back |
| 6 | One butterfly | 3 s | Hands rest on shoulders, then a fade to black as one silver butterfly crosses the screen |

## Files

- `film.json`: the title.
- `cut.js`: the timeline entry point (`window.CUT = kit.scenes();`).
- `modules/scenes.json`: scene order and lengths, palette, fonts and stage size (1920×1080, 60 fps).
- `modules/base.css`: colors (ocean blue `#061A33`, crimson `#C8243A`, silver `#CFE3F5`,
  silver-blue `#8FD3FF`) and the shared classes.
- `modules/shared.js`: the shared drawing code: the two figures (silk-ribbon robes and hair
  that follow the current), butterflies and the water.
- `modules/scene-*.js`: one file per scene. Each frame is calculated from the scene's time `t`.
- `modules/score.js`: the generated score and sound effects, with no lyrics or vocals.
