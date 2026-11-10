# Vellum

Vellum is an architectural lighting-design practice. The website is read by architects, developers and interior designers deciding whether to bring Vellum onto a project, so everything here serves one idea: light is drawn and detailed before it is built.

Brand line: **The room has another life.**

This system holds the three things the website is built from: **colour**, **type** and **imagery** (photography direction, the icon set and the logo). Tokens are in `tokens.json`; logos, icons and image studies are in the asset groups.

## Voice

Write like a lighting designer talking to an architect: plain, specific and calm.

- Use real units. "2700K wall graze at 40%" beats "warm, atmospheric lighting".
- Say "we". Vellum is a team that stays to the end of the job.
- Keep sentences short. One idea each.
- Name the fitting, the beam and the scene, then stop. No superlatives, no "stunning", no "elevate".
- Captions are data: `G01 LINEAR GRAZE · 2700K · 40%`.

| Write | Not |
| --- | --- |
| We draw where the light falls before we choose what makes it. | We craft breathtaking lighting experiences. |
| Focus night, 23:40. Wall graze at 40%. | Magical evening ambience. |
| Coastal hotel, 120 keys | A truly unique luxury destination |

## Colour

Two grounds, one light.

- **Day** is the website: `surface` white, `ink` black, `ink-muted` grey, `rule` hairlines, one `surface-dark` band per page. This is the Airloom-derived structure the site already uses.
- **Night** is the brand board: `brand-navy` and `brand-navy-deep` grounds with `brand-cream` type. Use it for print, signage, proposals and any after-dark page.
- **`lamp` is light, never decoration.** It marks lit areas in icons and drawings, the lit half of the moon, and the active state. It never colours text on day surfaces (2.0:1). On navy it reads at 8.6:1.
- Headlines run two-tone: the lead phrase in `ink`, the rest in `ink-muted` (on photography: `on-dark` and `on-dark-muted`).
- No gradients except the dark scrim under hero text. No coloured buttons.

Contrast: every text pair in this system passes 4.5:1 in both themes. `ink-muted` on `surface-wash` is the tightest at 4.65:1.

## Typography

Three faces, each with one job.

- **Geist** (`--font-sans`) for the whole website: headings, body, navigation. Regular 400 almost everywhere; 500 only for the logo subline. Vellum emphasises with tone (ink against ink-muted), not with weight.
- **Cormorant Garamond** (`--font-display`) for brand lines only: the tagline, print spreads, signage, proposal covers. Light 300. It is the closest open-licence match to the serif on the brand board; swap in the board's licensed face if there is one.
- **Geist Mono** (`--font-mono`) for technical labels: luminaire references, colour temperature, beam angles, dim levels, card meta. Always uppercase with 0.08em tracking.

Headlines are set tight (`-0.03em` to `-0.035em`) with leading close to 1. The statement style indents its first line by one grid column, the way 333 South Wabash does.

## Imagery

### Photography

- **Night first.** Shoot after dark or with the space blacked out. The dark is part of the picture.
- **One light idea per frame:** a graze, a pool, a line under a step.
- **Warm and true:** 2700K to 3000K, white balance to the fittings, no orange grading.
- **No flares, no HDR, no wide-angle distortion.** Verticals straight.
- **Drawing, then photo.** Show the concept sketch before the finished installation wherever both exist.
- Caption every image in the `label` style: fitting reference, colour temperature, dim level.

The five images in **Imagery** are rendered light studies standing in for project photography. Replace them before launch.

### Icons

The **Icons** group is a lighting set drawn from luminaire schedules: downlight, wall washer, grazer, linear, pendant, uplight, step light, spotlight, track, cove, dimmer, scene, sensor, daylight, colour temperature, beam angle.

- 24px grid, 1.5px stroke, round caps and joins.
- Two colours only: `brand-navy-deep` for the fitting and the surfaces, `lamp` for the light. The lit area is always a fill, never a stroke.
- Use them where they carry information (schedules, service lists, filters), never as decoration beside headings.
- Show at 24px or 48px.

### Logo

The wordmark with its moon: a line drops into a circle, and the right side is lit.

- **Ink** version on day surfaces, **cream** version on navy and over photography. On cream or navy the moon is lit in `lamp`.
- Clear space: the height of the moon on every side.
- Minimum width: 72px on screen (`logo-min`).
- Do not redraw, stretch, outline or recolour the letters. The moon may be lit in `lamp` or match the letters, nothing else.
- These files were traced from the brand board image. Replace them with the master vector before print.

## Layout

From the website:

- 24px gutters (`gutter`), 18px on phones (`gutter-phone`); a 7-column grid for the statement and drifting images.
- A 56px header bar (`bar-height`) that sits under the hero and docks to the top on scroll.
- Hairline rules (`rule`) above list rows and cards, no boxes or shadows.
- Corners are square except image tiles (`radius-tile`), tags (`radius-tag`) and buttons (`radius-button`).
