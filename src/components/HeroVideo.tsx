import Image from "next/image";

/**
 * A short, silent, looping clip behind a page hero, with a still as the
 * fallback.
 *
 * WHY VIDEO
 *
 * The owner asked on 16 September 2026 for video on the service pages
 * because it reads as premium in a way a photograph does not. Each clip is
 * ten to twelve seconds of Pexels footage, transcoded to 720p at a low bit
 * rate with no audio track, so the largest is under three megabytes and most
 * are near one.
 *
 * WHY THE STILL MATTERS AS MUCH AS THE CLIP
 *
 * The poster is the first frame the visitor sees, it is what a slow
 * connection shows for the first second or two, and it is what stays when
 * the browser refuses autoplay or the visitor has asked for reduced motion.
 * So the poster is extracted from the clip itself and rendered through
 * next/image as a real element rather than only as the video's poster
 * attribute, which means it is sized, lazy loaded and cached like every
 * other image on the site. The video sits on top and fades in only once it
 * can actually play.
 *
 * REDUCED MOTION
 *
 * Under prefers-reduced-motion the video element is not rendered at all
 * (globals.css hides .hv-video), leaving the still. Motion on a hero is
 * decoration; nobody loses information when it is off.
 */
export function HeroVideo({
  src,
  poster,
  alt,
  priority = true,
}: {
  src: string;
  poster: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <video
        className="hv-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
