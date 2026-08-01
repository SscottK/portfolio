import { useState } from 'react'
import './ProjectGallery.css'

function GalleryMain({ item, projectName }) {
  if (!item) return null

  if (item.media_type === 'video') {
    const embed = item.video_embed

    if (embed?.kind === 'embed') {
      return (
        <div className="gallery-main gallery-main--video">
          <iframe
            src={embed.src}
            title={item.caption || `${projectName} video demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    if (embed?.kind === 'file') {
      return (
        <div className="gallery-main gallery-main--video">
          <video controls playsInline preload="metadata" src={embed.src}>
            Your browser does not support embedded video.
          </video>
        </div>
      )
    }

    return (
      <div className="gallery-main gallery-main--video">
        <a href={item.video_url} target="_blank" rel="noreferrer" className="gallery-video-link">
          Open video demo
        </a>
      </div>
    )
  }

  return (
    <div className="gallery-main">
      <img src={item.image} alt={item.caption || projectName} />
    </div>
  )
}

function GalleryThumb({ item, projectName, isActive, onSelect }) {
  const label = item.caption || (item.media_type === 'video' ? 'Video' : 'Image')

  return (
    <button
      type="button"
      className={`gallery-thumb ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      aria-label={`Show ${label}`}
    >
      {item.media_type === 'video' ? (
        <span className="gallery-thumb-video">
          <span className="gallery-thumb-play" aria-hidden="true">
            ▶
          </span>
          Video
        </span>
      ) : (
        <img src={item.image} alt="" />
      )}
    </button>
  )
}

export default function ProjectGallery({ gallery, projectName, heroImage = null }) {
  const items =
    gallery?.length > 0
      ? gallery
      : heroImage
        ? [
            {
              id: 'hero',
              media_type: 'image',
              image: heroImage,
              caption: '',
            },
          ]
        : []

  const heroIndex = items.findIndex((item) => item.is_hero && item.media_type === 'image')
  const defaultIndex = heroIndex >= 0 ? heroIndex : 0

  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  if (!items.length) return null

  const activeItem = items[activeIndex] ?? items[0]

  return (
    <>
      <div className="gallery-panel-top">
        <GalleryMain item={activeItem} projectName={projectName} />
        {activeItem.caption && <p className="gallery-caption">{activeItem.caption}</p>}
      </div>

      <div className="gallery-thumbs-bridge">
        <div className="gallery-thumbs" role="tablist" aria-label="Gallery thumbnails">
          {items.map((item, index) => (
            <GalleryThumb
              key={item.id}
              item={item}
              projectName={projectName}
              isActive={index === activeIndex}
              onSelect={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
