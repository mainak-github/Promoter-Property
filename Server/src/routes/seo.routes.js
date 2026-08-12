const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'https://promoterproperty.com';
    const now = new Date().toISOString().split('T')[0];

    // Static pages (only primary canonical URLs)
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/property', priority: '0.9', changefreq: 'daily' },
      { url: '/project', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.7', changefreq: 'weekly' },
      { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'monthly' },
      { url: '/services', priority: '0.7', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
      { url: '/terms', priority: '0.4', changefreq: 'yearly' }
    ];

    // Query approved properties
    let properties = [];
    try {
      const [rows] = await db.query(
        "SELECT id, title, slug, canonicalUrl, updatedAt, createdAt FROM Properties WHERE approvalStatus = 'approved' ORDER BY updatedAt DESC"
      );
      properties = rows || [];
    } catch (dbErr) {
      console.warn('Sitemap db query warning:', dbErr.message);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

    // Static URL nodes
    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${p.url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Property URL nodes (single canonical node per property)
    properties.forEach(prop => {
      const lastModDate = prop.updatedAt || prop.createdAt ? new Date(prop.updatedAt || prop.createdAt).toISOString().split('T')[0] : now;
      const propIdentifier = prop.slug || prop.id;
      const propPath = prop.canonicalUrl || `/property/details/${propIdentifier}`;
      const fullUrl = propPath.startsWith('http') ? propPath : `${baseUrl}${propPath.startsWith('/') ? '' : '/'}${propPath}`;

      xml += `  <url>\n`;
      xml += `    <loc>${fullUrl}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'https://promoterproperty.com';
  const robotsText = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /broker/
Disallow: /user/
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /login
Disallow: /register
Disallow: /add-new-listing

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  return res.send(robotsText);
});

module.exports = router;
