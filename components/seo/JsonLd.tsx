type JsonLdProps = {
  data: unknown;
};

/** Server-rendered JSON-LD for crawlers and View Source. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
