import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  canonical: string;
  robotsMeta: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    images: { url: string }[];
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
}

export default function SeoHead({
  title,
  description,
  canonical,
  robotsMeta,
  openGraph,
  twitter
}: SeoHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robotsMeta} />

      {/* OpenGraph Meta */}
      <meta property="og:title" content={openGraph.title} />
      <meta property="og:description" content={openGraph.description} />
      <meta property="og:url" content={openGraph.url} />
      {openGraph.images.map((image, index) => (
        <meta key={index} property="og:image" content={image.url} />
      ))}
      <meta property="og:site_name" content={openGraph.siteName} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitter.card} />
      <meta name="twitter:title" content={twitter.title} />
      <meta name="twitter:description" content={twitter.description} />
      {twitter.images.map((image, index) => (
        <meta key={index} name="twitter:image" content={image} />
      ))}
    </Head>
  );
}
