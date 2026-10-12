# Matific intro animations

Short animated scenes that introduce what Matific does for kids. It's one self-contained
HTML file with no build step and no dependencies (the Fredoka font loads from Google Fonts,
with a system font as fallback).

Open `index.html` in a browser. It autoplays through six scenes, about 30 seconds in total:

| # | Scene | What it shows |
|---|-------|---------------|
| 1 | Math becomes play | A character counts apples as they fall: 1, 2, 3, 4, 5 |
| 2 | Learn by doing | 3 blue blocks and 4 orange blocks slide together into 3 + 4 = 7 |
| 3 | Just the right challenge | The character hops up skill steps: Count → Add → Multiply → Fractions → Puzzles |
| 4 | Instant, friendly feedback | A tap on the right answer to 6 × 2 sets off a check mark and a burst of stars |
| 5 | Progress you can see | A weekly progress chart grows, then a "Level up!" badge appears |
| 6 | Outro | Matific wordmark and tagline |

Controls: play/pause, previous/next, scene dots, ←/→ arrow keys and the space bar.
Light and dark mode follow the system setting. With "reduce motion" turned on, autoplay is
off and each scene shows its final frame.

To change a scene, edit its `<section class="scene">`. Timing comes from inline
`animation: <name> <duration> <delay>` styles, and `DURATIONS` in the script sets how long
each scene stays on screen.
