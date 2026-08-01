import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCertifications } from '../api'
import './Certifications.css'

function groupByIssuer(certifications) {
  const groups = new Map()

  certifications.forEach((cert) => {
    const issuer = cert.issuer || 'Other'
    if (!groups.has(issuer)) {
      groups.set(issuer, [])
    }
    groups.get(issuer).push(cert)
  })

  return Array.from(groups.entries()).map(([issuer, items]) => ({ issuer, items }))
}

function normalizeDescriptionText(description) {
  return description?.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim() ?? ''
}

function splitCertDescription(description) {
  const text = normalizeDescriptionText(description)
  if (!text) {
    return { headline: null, paragraphs: [] }
  }

  const blocks = text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    return { headline: null, paragraphs: [] }
  }

  if (blocks.length === 1) {
    const lines = blocks[0]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length <= 1) {
      return { headline: null, paragraphs: lines }
    }

    return {
      headline: lines[0],
      paragraphs: lines.slice(1),
    }
  }

  const [firstBlock, ...restBlocks] = blocks
  const firstLines = firstBlock
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    headline: firstLines[0] ?? null,
    paragraphs: [...firstLines.slice(1), ...restBlocks].filter(Boolean),
  }
}

function getCertDisplayTitle(cert) {
  const { headline } = splitCertDescription(cert.description)
  return headline || cert.name
}

function sectionHeading(issuer, count) {
  const label = issuer === 'boot.dev' ? 'Course' : 'Certificate'
  const plural = count === 1 ? label : `${label}s`
  return `${count} ${plural} Completed`
}

function CertificationCopy({ cert, titleClassName, descriptionClassName, metaClassName }) {
  const { headline, paragraphs } = splitCertDescription(cert.description)
  const title = headline || cert.name

  return (
    <>
      <h3 className={titleClassName}>{title}</h3>
      {cert.completed_date && (
        <p className={metaClassName}>Completed {cert.completed_date}</p>
      )}
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={descriptionClassName}>
          {paragraph}
        </p>
      ))}
    </>
  )
}

function CertificationShowcase({ cert }) {
  return (
    <article className="certification-showcase">
      {cert.badge && (
        <div className="certification-showcase-image-wrap">
          <img
            src={cert.badge}
            alt={`${getCertDisplayTitle(cert)} certificate`}
            className="certification-showcase-image"
          />
        </div>
      )}
      <div className="certification-showcase-content">
        <CertificationCopy
          cert={cert}
          titleClassName="certification-showcase-title"
          metaClassName="certification-showcase-meta"
          descriptionClassName="certification-showcase-description"
        />
        {cert.credential_url && (
          <a
            href={cert.credential_url}
            target="_blank"
            rel="noreferrer"
            className="certification-showcase-link"
          >
            View credential
          </a>
        )}
      </div>
    </article>
  )
}

function CertificationThumb({ cert, onSelect }) {
  const title = getCertDisplayTitle(cert)

  if (cert.badge) {
    return (
      <button
        type="button"
        className="certification-thumb"
        onClick={() => onSelect(cert)}
        aria-label={`View ${title} certificate`}
      >
        <img src={cert.badge} alt="" className="certification-thumb-image" />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="certification-thumb certification-thumb--text"
      onClick={() => onSelect(cert)}
      aria-label={`View ${title} certificate`}
    >
      <span className="certification-thumb-issuer">{cert.issuer}</span>
      <span className="certification-thumb-title">{title}</span>
      {cert.completed_date && (
        <span className="certification-thumb-date">{cert.completed_date}</span>
      )}
    </button>
  )
}

function CertificationModal({ cert, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="certification-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="certification-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certification-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="certification-modal-close"
          onClick={onClose}
          aria-label="Close certificate details"
        >
          ×
        </button>
        <div id="certification-modal-title" className="visually-hidden">
          {getCertDisplayTitle(cert)}
        </div>
        <CertificationShowcase cert={cert} />
      </div>
    </div>
  )
}

export default function Certifications() {
  const [certifications, setCertifications] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState(null)

  const closeModal = useCallback(() => {
    setSelectedCert(null)
  }, [])

  useEffect(() => {
    getCertifications()
      .then(setCertifications)
      .catch(() => setError('Could not load certifications.'))
      .finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => groupByIssuer(certifications), [certifications])

  if (loading) return <p className="status">Loading...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <div className="certifications-page">
      <header className="page-header">
        <span className="section-label">Credentials</span>
        <h1>Certifications</h1>
        <p className="page-lead">
          Bootcamp completion and self-paced certificates from General Assembly and boot.dev.
        </p>
      </header>

      {grouped.length === 0 ? (
        <p className="status empty-message">No certifications yet. Add some in Django Admin.</p>
      ) : (
        grouped.map(({ issuer, items }) => (
          <section key={issuer} className="certifications-section">
            <div className="certifications-section-header">
              <h2>{sectionHeading(issuer, items.length)}</h2>
              <p className="certifications-section-issuer">{issuer}</p>
            </div>
            <div className="certifications-grid">
              {items.map((cert) => (
                <CertificationThumb
                  key={cert.id}
                  cert={cert}
                  onSelect={setSelectedCert}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {selectedCert && (
        <CertificationModal cert={selectedCert} onClose={closeModal} />
      )}
    </div>
  )
}
