/**
 * PdfButton
 *
 * A persistent download button for the manuscript PDF.
 * Rendered at both the top and bottom of the page.
 * Hidden automatically if meta.pdfUrl is null.
 */
export function PdfButton({ href, label }) {
  if (!href) return null

  return (
    <a href={href} download className="pdf-button" aria-label={label}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="pdf-icon"
      >
        <path
          d="M7 1v10M2 6l5 6 5-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      PDF
    </a>
  )
}
