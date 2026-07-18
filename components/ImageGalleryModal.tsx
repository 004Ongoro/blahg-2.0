'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function ImageGalleryModal() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  // Scan the document/article for images
  useEffect(() => {
    // We target image-frame img to only include content images
    const imgElements = document.querySelectorAll('.image-frame img')
    const imgList: { src: string; alt: string }[] = []

    imgElements.forEach((imgEl) => {
      const src = imgEl.getAttribute('src')
      if (src) {
        imgList.push({
          src,
          alt: imgEl.getAttribute('alt') || '',
        })
      }
    })

    setImages(imgList)

    // Handler to open modal on click
    const handleImgClick = (e: Event) => {
      const target = e.currentTarget as HTMLImageElement
      const src = target.getAttribute('src')
      if (!src) return

      const idx = imgList.findIndex((img) => img.src === src)
      if (idx !== -1) {
        setCurrentIndex(idx)
      }
    }

    imgElements.forEach((imgEl) => {
      imgEl.addEventListener('click', handleImgClick)
    })

    return () => {
      imgElements.forEach((imgEl) => {
        imgEl.removeEventListener('click', handleImgClick)
      })
    }
  }, [])

  // Navigation handlers
  const handleClose = useCallback(() => {
    setCurrentIndex(null)
  }, [])

  const handleNext = useCallback(() => {
    if (currentIndex === null || images.length === 0) return
    setCurrentIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
  }, [currentIndex, images.length])

  const handlePrev = useCallback(() => {
    if (currentIndex === null || images.length === 0) return
    setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
  }, [currentIndex, images.length])

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent scrolling behind modal
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [currentIndex, handleClose, handleNext, handlePrev])

  if (currentIndex === null || images.length === 0) return null

  const activeImage = images[currentIndex]

  return (
    <div 
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Top Bar */}
      <div 
        className="w-full flex items-center justify-between p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[10px] font-black font-mono bg-foreground/5 text-muted-foreground/80 px-3 py-1.5 rounded-full uppercase tracking-[0.25em]">
          Image {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={handleClose}
          className="h-10 w-10 rounded-full border border-foreground/10 hover:border-foreground/20 bg-foreground/[0.02] hover:bg-foreground/5 text-foreground flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 duration-100"
          title="Close full-screen (Esc)"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Image Area with controls */}
      <div className="flex-1 flex items-center justify-between px-4 md:px-8 relative max-h-[75vh]">
        {/* Left Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-6 md:left-8 z-10 h-12 w-12 rounded-full border border-foreground/10 hover:border-foreground/20 bg-background/80 hover:bg-background text-foreground flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* The Image */}
        <div 
          className="flex-1 h-full w-full flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-foreground/5 transition-all duration-300 animate-in zoom-in-95 duration-200 select-text"
          />
        </div>

        {/* Right Arrow Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-6 md:right-8 z-10 h-12 w-12 rounded-full border border-foreground/10 hover:border-foreground/20 bg-background/80 hover:bg-background text-foreground flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md"
            title="Next (Arrow Right)"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Bar / Caption */}
      <div 
        className="w-full text-center p-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {activeImage.alt ? (
          <p className="text-xs font-mono font-black uppercase tracking-widest text-muted-foreground/80 max-w-2xl mx-auto border-t border-foreground/5 pt-4">
            📷 {activeImage.alt}
          </p>
        ) : (
          <p className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/40 max-w-2xl mx-auto border-t border-foreground/5 pt-4">
            (No description provided)
          </p>
        )}
      </div>
    </div>
  )
}
