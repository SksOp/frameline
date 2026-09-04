type JsonLdValue = Record<string, unknown> | readonly Record<string, unknown>[];

export function StructuredData({ value }: { value: JsonLdValue }) {
  const json = JSON.stringify(value).replaceAll("<", "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

