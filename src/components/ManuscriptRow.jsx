import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * ManuscriptRow
 *
 * Renders a single piece (poem or essay) as a <details>/<summary> accordion row.
 * Pieces with alwaysOpen:true render as static rows — no toggle, always visible.
 *
 * CSS class anatomy:
 *   .manuscript-row           — base row
 *   .type-poem / .type-essay  — piece type
 *   .layout-pullquote         — essay: closed state shows a pull quote
 *   .layout-description       — essay: closed state shows a short description
 *   .layout-image             — essay: closed state shows an image
 *   .is-open                  — applied while the row is expanded
 *   .always-open              — applied to permanently open rows
 */
export function ManuscriptRow({ piece, openSeq, closeSeq }) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => { if (openSeq > 0) setIsOpen(true) }, [openSeq])
  useEffect(() => { if (closeSeq > 0) setIsOpen(false) }, [closeSeq])

  // For expand-up rows: as the content-wrapper grows/shrinks, scroll by the same
  // delta so the title stays locked at the same viewport position.
  useEffect(() => {
    if (piece.expandDirection !== 'up' || !contentRef.current) return
    let prevHeight = contentRef.current.offsetHeight
    const observer = new ResizeObserver(entries => {
      const newHeight = entries[0].borderBoxSize?.[0]?.blockSize
        ?? entries[0].contentRect.height
      const delta = newHeight - prevHeight
      prevHeight = newHeight
      if (delta !== 0) window.scrollBy({ top: delta, behavior: 'instant' })
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [piece.expandDirection])

  const toggle = useCallback(
    (e) => {
      e.preventDefault()
      setIsOpen(o => !o)
    },
    []
  )

  if (piece.alwaysOpen) {
    return (
      <div className={`manuscript-row type-${piece.type} is-open always-open`}>
        <div
          className={[piece.type === 'poem' ? 'poem-body' : 'essay-body', piece.className].filter(Boolean).join(' ')}
          // content.js is the only source; this is not user input.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: piece.content }}
        />
      </div>
    )
  }

  const cls = [
    'manuscript-row',
    `type-${piece.type}`,
    piece.layout && `layout-${piece.layout}`,
    piece.expandDirection === 'up' && 'expand-up',
    isOpen && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <details className={cls} open={isOpen}>
      {/* ── Summary (always visible) ──────────────────────────────────────── */}
      <summary className="row-summary" onClick={toggle}>
        <span className="row-title">{piece.title}</span>
        {piece.type === 'essay' && (
          <span className="row-type-label" aria-hidden="true">
            Essay
          </span>
        )}
        <span className="row-toggle" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" className="toggle-vertical" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>

        {/* Essay closed-state preview — lives inside summary so it's always rendered */}
        {piece.type === 'essay' && (
          <div className="essay-preview" aria-hidden="true">
            {piece.layout === 'pullquote' && (
              <blockquote className="preview-pullquote">{piece.pullquote}</blockquote>
            )}
            {piece.layout === 'description' && (
              <p className="preview-description">{piece.description}</p>
            )}
            {piece.layout === 'image' && piece.image && (
              <img
                className="preview-image"
                src={piece.image.src}
                alt={piece.image.alt}
                loading="lazy"
              />
            )}
          </div>
        )}
      </summary>

      {/* ── Expandable content ────────────────────────────────────────────── */}
      <div className="content-wrapper" ref={contentRef} aria-hidden={!isOpen}>
        <div className="content-inner">
          <div
            className={[piece.type === 'poem' ? 'poem-body' : 'essay-body', piece.className].filter(Boolean).join(' ')}
            // content.js is the only source; this is not user input.
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: piece.content }}
          />
        </div>
      </div>
    </details>
  )
}
