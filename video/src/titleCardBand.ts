/**
 * Title/outro full-screen bands use `grid-template-rows: 1fr 3fr 1fr` in video.css —
 * top and bottom "peek" rows are 1/5 of frame height each; the middle carries copy on black.
 */

/** Height fraction for each peek row (top and bottom). */
export const TITLE_CARD_PEEK_HEIGHT_FRAC = 1 / 5

/** ffmpeg -vf chain: scale to width, then fill peek rows with black (for title-card thumbnails). */
export function titleCardBandMaskFilter(scaleWidth: number): string {
  const scale = `scale=${scaleWidth}:-2:flags=lanczos`
  const top =
    'drawbox=x=0:y=0:w=iw:h=ih/5:color=black@1:t=fill'
  const bottom =
    'drawbox=x=0:y=4*ih/5:w=iw:h=ih/5:color=black@1:t=fill'
  return `${scale},${top},${bottom}`
}
