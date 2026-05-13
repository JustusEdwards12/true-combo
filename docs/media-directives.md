# TrueCombo Media Directives

Use markdown blockquotes with directives to insert reusable media cards in articles.

## GuideImage

```md
> guide-image: /guides/neutral/spacing-map.webp | Burst range map | Center-stage spacing lanes
```

Format:

`guide-image: src | alt | caption`

## GuideGif / GuideVideo

```md
> guide-gif: /guides/neutral/whiff-loop.mp4 | Whiff punish loop | Dash back -> punish on second beat
```

Format:

`guide-gif: src | alt(optional) | caption(optional)`

`guide-video:` also works and uses autoplay, muted, loop, playsInline.

## ComparisonPanel

```md
> comparison: Good spacing vs overcommit | Safe spacing | /guides/neutral/good.webp | Overcommit | /guides/neutral/bad.webp | Compare burst-range outcomes
```

Format:

`comparison: title | leftLabel | leftSrc | rightLabel | rightSrc | caption(optional)`

## DrillCard

```md
> drill-card: Burst range reps | Hold safe lane before pressing | Training mode dummy dash-in | 12 reps per side | Land punish 8/12 reps without losing stage
```

Format:

`drill-card: title | objective | setup | reps | successCheck`

## TipCard

```md
> tip-card: warning | Don't spend jump first | If jump is gone early, your recovery line is often forced.
```

Format:

`tip-card: tone | title | body`

Tones: `tip`, `warning`, `mistake`.
