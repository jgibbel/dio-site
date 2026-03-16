import { useState } from 'react'
import { meta, pieces } from './content'
import { ManuscriptRow } from './components/ManuscriptRow'
import { PdfButton } from './components/PdfButton'

export default function App() {
  const [openSeq, setOpenSeq] = useState(0)
  const [closeSeq, setCloseSeq] = useState(0)

  return (
    <div className="site-wrapper">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="site-header">
        <div className="header-inner">
          <div className="header-text">
            <h1 className="manuscript-title">{meta.title}</h1>
            <p className="manuscript-author">{meta.author}</p>
          </div>
          <div className="header-controls">
            <div className="expand-controls">
              <button className="expand-btn" onClick={() => setOpenSeq(s => s + 1)}>Open All</button>
              <button className="expand-btn" onClick={() => setCloseSeq(s => s + 1)}>Close All</button>
            </div>
            <PdfButton href={meta.pdfUrl} label={meta.pdfLabel} />
          </div>
        </div>
      </header>

      {/* ── Manuscript accordion ───────────────────────────────────────────── */}
      <main className="manuscript-list" aria-label="Manuscript contents">
        {pieces.map((piece) => (
          <ManuscriptRow key={piece.id} piece={piece} openSeq={openSeq} closeSeq={closeSeq} />
        ))}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <PdfButton href={meta.pdfUrl} label={meta.pdfLabel} />
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} {meta.author}
        </p>
      </footer>
    </div>
  )
}
