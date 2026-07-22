import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="w-full rounded-xl object-cover"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-2xl text-brand-indigo">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2.5 text-xl text-brand-indigo">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg text-brand-indigo">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-brass pl-5 font-display text-lg italic text-brand-indigo">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-relaxed text-ink/85">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-1.5 pl-6 text-ink/85">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1.5 pl-6 text-ink/85">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-blue underline underline-offset-2 hover:text-brand-indigo"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
  },
};

export function PortableTextBody({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
