import { getBaseUrl } from '@/lib/utils'

export async function GET() {
  const baseUrl = getBaseUrl()
  let domain = 'code.geohack.top'
  try {
    domain = new URL(baseUrl).hostname
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>George Ongoro Blog</ShortName>
  <Description>Search posts on George Ongoro's Tech &amp; Coding Blog</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">${baseUrl}/favicon.ico</Image>
  <Url type="text/html" template="https://www.google.com/search?q=site%3A${encodeURIComponent(domain)}+{searchTerms}"/>
</OpenSearchDescription>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
