<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>RSS Feed | <xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          :root {
            --bg: #ffffff;
            --fg: #1a1a1a;
            --accent: #000000;
            --muted: #666666;
            --border: #e5e5e5;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0a0a0a;
              --fg: #ededed;
              --accent: #ffffff;
              --muted: #a0a0a0;
              --border: #262626;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: var(--fg);
            background: var(--bg);
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          .header {
            border-bottom: 2px solid var(--accent);
            padding-bottom: 2rem;
            margin-bottom: 3rem;
          }
          .header h1 {
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.02em;
          }
          .header p {
            color: var(--muted);
            font-size: 1.1rem;
            margin: 0;
          }
          .info-box {
            background: var(--fg);
            color: var(--bg);
            padding: 1rem;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            display: inline-block;
            border-radius: 4px;
          }
          .info-box a {
            color: inherit;
            text-decoration: underline;
            font-weight: 600;
          }
          .item {
            margin-bottom: 4rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
          }
          .item:last-child {
            border-bottom: none;
          }
          .item h2 {
            font-size: 1.8rem;
            margin: 0 0 0.5rem 0;
          }
          .item h2 a {
            color: var(--fg);
            text-decoration: none;
          }
          .item h2 a:hover {
            text-decoration: underline;
          }
          .meta {
            color: var(--muted);
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
            display: block;
          }
          .content {
            font-size: 1.1rem;
          }
          .content img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }
          .content pre {
            background: var(--border);
            padding: 1rem;
            overflow-x: auto;
            border-radius: 4px;
            font-size: 0.9rem;
          }
          .content blockquote {
            border-left: 4px solid var(--accent);
            margin: 0;
            padding-left: 1.5rem;
            color: var(--muted);
            font-style: italic;
          }
          a {
            color: var(--accent);
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <div class="info-box">
            This is an RSS feed. Subscribe by copying the URL into your news reader. 
            <a href="{/rss/channel/link}">Visit Website →</a>
          </div>
        </div>
        
        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h2>
              <a href="{link}"><xsl:value-of select="title"/></a>
            </h2>
            <span class="meta">
              Published on <xsl:value-of select="pubDate"/>
            </span>
            <div class="content">
              <xsl:choose>
                <xsl:when test="content:encoded">
                  <xsl:value-of select="content:encoded" disable-output-escaping="yes"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="description" disable-output-escaping="yes"/>
                </xsl:otherwise>
              </xsl:choose>
            </div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
