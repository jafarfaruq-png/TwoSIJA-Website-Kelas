"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"

/* =========================
   CONTEXT
========================= */

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within <Carousel />")
  }
  return context
}

/* =========================
   CAROUSEL ROOT
========================= */

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )

  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => api.off("select", onSelect)
  }, [api, onSelect])

  React.useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

/* =========================
   CONTENT
========================= */

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

/* =========================
   ITEM (16:9)
========================= */

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel()

  return (
    <div
      className={cn(
        "shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

/* =========================
   PREV / NEXT
========================= */

function CarouselPrevious({ className, ...props }) {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
        className
      )}
      {...props}
    >
      <ArrowLeft />
    </Button>
  )
}

function CarouselNext({ className, ...props }) {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full",
        className
      )}
      {...props}
    >
      <ArrowRight />
    </Button>
  )
}

/* =========================
   IMAGE CARD + PREVIEW
========================= */

function ImageCard({ src }) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [open])

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer overflow-hidden rounded-xl bg-black"
      >
        <div className="aspect-video w-full">
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* MODAL VIA PORTAL */}
      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* MODAL BOX */}
            <div className="relative z-10 w-[90vw] max-w-5xl rounded-2xl bg-white p-4 shadow-2xl">
              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-black" />
              </button>

              {/* IMAGE */}
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  )
}



/* =========================
   EXPORT
========================= */

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  ImageCard,
}
