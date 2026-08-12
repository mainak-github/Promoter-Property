const db = require('../../config/db');

// Helper to generate URL-safe slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
};

// Ensure LandingPages table exists
const ensureTableExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS LandingPages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      pageType VARCHAR(50) DEFAULT 'single-page',
      status VARCHAR(50) DEFAULT 'draft',
      gjsComponents LONGTEXT,
      gjsStyles LONGTEXT,
      gjsProject LONGTEXT,
      htmlContent LONGTEXT,
      cssContent LONGTEXT,
      jsContent LONGTEXT,
      metaTitle VARCHAR(255),
      metaDescription TEXT,
      metaKeywords TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(sql);
  } catch (err) {
    console.error('Error ensuring LandingPages table:', err);
  }
};

// Initialize table on module load
ensureTableExists();

// Get all landing pages (Admin)
exports.getAllLandingPages = async (req, res) => {
  try {
    await ensureTableExists();
    const [pages] = await db.query('SELECT * FROM LandingPages ORDER BY updatedAt DESC');
    res.status(200).json({ success: true, pages });
  } catch (err) {
    console.error('Error fetching landing pages:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single landing page by ID (Admin)
exports.getLandingPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }
    res.status(200).json({ success: true, page: rows[0] });
  } catch (err) {
    console.error('Error fetching landing page by ID:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new landing page (Admin)
exports.createLandingPage = async (req, res) => {
  try {
    await ensureTableExists();
    const { title, slug: customSlug, pageType = 'single-page', template = 'default' } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    let slug = customSlug ? slugify(customSlug) : slugify(title);
    
    // Check if slug exists, add timestamp if collision
    const [existing] = await db.query('SELECT id FROM LandingPages WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const defaultHtml = `
<!-- ============================================================
     PROMOTER PROPERTY — LUXURY REAL ESTATE LANDING PAGE
     Style inspired by top Chennai property landing pages
     jQuery + Bootstrap + Animate.css included via CDN
     ============================================================ -->

<!-- HEADER / STICKY NAVIGATION -->
<header id="main-header" style="position:sticky;top:0;z-index:9999;background:#0f172a;box-shadow:0 2px 20px rgba(0,0,0,0.3);">
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 40px;max-width:1400px;margin:0 auto;">
    <div style="font-size:1.6rem;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
      <span style="color:#8ab300;">${title}</span>
    </div>
    <div style="display:flex;gap:30px;align-items:center;">
      <a href="#overview" style="color:#e2e8f0;text-decoration:none;font-weight:500;font-size:14px;transition:color 0.2s;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#e2e8f0'">Overview</a>
      <a href="#amenities" style="color:#e2e8f0;text-decoration:none;font-weight:500;font-size:14px;transition:color 0.2s;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#e2e8f0'">Amenities</a>
      <a href="#gallery" style="color:#e2e8f0;text-decoration:none;font-weight:500;font-size:14px;transition:color 0.2s;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#e2e8f0'">Gallery</a>
      <a href="#floorplan" style="color:#e2e8f0;text-decoration:none;font-weight:500;font-size:14px;transition:color 0.2s;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#e2e8f0'">Floor Plans</a>
      <a href="#location" style="color:#e2e8f0;text-decoration:none;font-weight:500;font-size:14px;transition:color 0.2s;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#e2e8f0'">Location</a>
      <a href="#enquire" style="background:#8ab300;color:#ffffff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;transition:background 0.2s;" onmouseover="this.style.background='#6d8f00'" onmouseout="this.style.background='#8ab300'">Enquire Now</a>
    </div>
  </nav>
</header>

<!-- HERO SECTION — Full-screen with image slider overlay -->
<section id="hero" style="position:relative;min-height:100vh;background:linear-gradient(135deg,#0f172a 0%,#1a2744 50%,#0f2d1a 100%);overflow:hidden;display:flex;align-items:center;">
  <!-- Animated background grid -->
  <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(138,179,0,0.05) 50px),repeating-linear-gradient(90deg,transparent,transparent 49px,rgba(138,179,0,0.05) 50px);opacity:0.5;"></div>

  <!-- Hero Content -->
  <div style="max-width:1400px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%;position:relative;z-index:2;">
    <!-- Left: Text Content -->
    <div>
      <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;background:rgba(138,179,0,0.15);border:1px solid rgba(138,179,0,0.3);border-radius:50px;margin-bottom:24px;">
        <span style="width:6px;height:6px;background:#8ab300;border-radius:50%;display:inline-block;"></span>
        <span style="color:#8ab300;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Exclusive New Launch</span>
      </div>
      <h1 style="font-size:3.8rem;font-weight:800;color:#ffffff;line-height:1.15;margin:0 0 20px 0;">
        ${title}<br>
        <span style="color:#8ab300;">Premium Living</span>
      </h1>
      <p style="font-size:1.15rem;color:#94a3b8;line-height:1.7;margin-bottom:32px;max-width:520px;">
        Experience the pinnacle of luxury living with ultra-modern 2, 3 &amp; 4 BHK apartments featuring world-class amenities, panoramic views, and prime connectivity.
      </p>

      <!-- Quick Specs Pills -->
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:36px;">
        <div style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50px;color:#e2e8f0;font-size:14px;font-weight:500;">📍 Prime Location</div>
        <div style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50px;color:#e2e8f0;font-size:14px;font-weight:500;">🏢 2, 3 &amp; 4 BHK</div>
        <div style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50px;color:#e2e8f0;font-size:14px;font-weight:500;">💰 ₹75L - ₹2.2Cr</div>
        <div style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:50px;color:#e2e8f0;font-size:14px;font-weight:500;">🏊 30+ Amenities</div>
      </div>

      <!-- CTA Buttons -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <a href="#enquire" style="display:inline-flex;align-items:center;gap:8px;padding:16px 36px;background:#8ab300;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;box-shadow:0 10px 30px rgba(138,179,0,0.4);transition:all 0.3s;" onmouseover="this.style.background='#6d8f00';this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#8ab300';this.style.transform='translateY(0)'">
          🗓️ Book Site Visit
        </a>
        <a href="#gallery" style="display:inline-flex;align-items:center;gap:8px;padding:16px 36px;background:rgba(255,255,255,0.08);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(10px);transition:all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
          🖼️ View Gallery
        </a>
      </div>
    </div>

    <!-- Right: Property Card / Image with Slideshow effect -->
    <div style="position:relative;">
      <div style="position:relative;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.4);aspect-ratio:4/3;background:linear-gradient(135deg,#1e293b,#0f2d1a);">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" alt="Luxury Apartment" style="width:100%;height:100%;object-fit:cover;opacity:0.7;" />
        <!-- Glassmorphism overlay card -->
        <div style="position:absolute;bottom:24px;left:24px;right:24px;background:rgba(15,23,42,0.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="color:#8ab300;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Starting From</div>
              <div style="color:#ffffff;font-size:2rem;font-weight:800;">₹75 Lakhs*</div>
              <div style="color:#94a3b8;font-size:13px;margin-top:2px;">All-inclusive price</div>
            </div>
            <div style="text-align:right;">
              <div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">RERA Approved</div>
              <div style="color:#8ab300;font-weight:700;font-size:14px;">✓ Verified</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Floating badge -->
      <div style="position:absolute;top:-16px;right:-16px;background:#8ab300;color:#ffffff;padding:12px 20px;border-radius:12px;font-weight:800;font-size:14px;box-shadow:0 8px 20px rgba(138,179,0,0.4);transform:rotate(3deg);">
        🏆 RERA Approved
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);text-align:center;color:#64748b;font-size:13px;">
    <div style="width:1px;height:40px;background:linear-gradient(to bottom,rgba(138,179,0,0.6),transparent);margin:0 auto 8px;"></div>
    Scroll to explore
  </div>
</section>

<!-- OVERVIEW / QUICK STATS BAR -->
<section id="overview" style="background:#8ab300;padding:30px 40px;">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center;">
    <div>
      <div style="font-size:2.4rem;font-weight:800;color:#ffffff;" class="counter-num">850</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;margin-top:4px;">Sq. Ft. Starting</div>
    </div>
    <div style="border-left:1px solid rgba(255,255,255,0.3);">
      <div style="font-size:2.4rem;font-weight:800;color:#ffffff;" class="counter-num">30+</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;margin-top:4px;">Luxury Amenities</div>
    </div>
    <div style="border-left:1px solid rgba(255,255,255,0.3);">
      <div style="font-size:2.4rem;font-weight:800;color:#ffffff;" class="counter-num">500+</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;margin-top:4px;">Happy Families</div>
    </div>
    <div style="border-left:1px solid rgba(255,255,255,0.3);">
      <div style="font-size:2.4rem;font-weight:800;color:#ffffff;" class="counter-num">15</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;margin-top:4px;">Years of Excellence</div>
    </div>
  </div>
</section>

<!-- PROJECT HIGHLIGHTS / SPECIFICATIONS -->
<section style="padding:80px 40px;background:#f8fafc;">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:50px;">
      <span style="color:#8ab300;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Project Details</span>
      <h2 style="font-size:2.8rem;color:#0f172a;font-weight:800;margin:12px 0 16px;">Highlights &amp; Specifications</h2>
      <p style="color:#64748b;font-size:1.05rem;max-width:600px;margin:0 auto;">Designed to offer unmatched comfort, privacy, and prestige in the heart of the city.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">🏢</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">Configurations</h3>
        <p style="color:#8ab300;font-size:1.3rem;font-weight:800;margin:0 0 8px;">2, 3 &amp; 4 BHK</p>
        <p style="color:#64748b;font-size:14px;margin:0;">Luxury Residences with modern interiors</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">📐</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">Carpet Area</h3>
        <p style="color:#8ab300;font-size:1.3rem;font-weight:800;margin:0 0 8px;">850 – 2,400 Sq. Ft.</p>
        <p style="color:#64748b;font-size:14px;margin:0;">Spacious layouts with panoramic views</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">💰</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">Price Range</h3>
        <p style="color:#8ab300;font-size:1.3rem;font-weight:800;margin:0 0 8px;">₹75L – ₹2.2Cr*</p>
        <p style="color:#64748b;font-size:14px;margin:0;">EMI options from ₹45,000/month</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">🗓️</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">Possession</h3>
        <p style="color:#8ab300;font-size:1.3rem;font-weight:800;margin:0 0 8px;">December 2026</p>
        <p style="color:#64748b;font-size:14px;margin:0;">On-time delivery guaranteed</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">🏗️</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">Total Towers</h3>
        <p style="color:#8ab300;font-size:1.3rem;font-weight:800;margin:0 0 8px;">4 Towers, G+30</p>
        <p style="color:#64748b;font-size:14px;margin:0;">350 premium exclusive units</p>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;transition:transform 0.3s,box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
        <div style="width:56px;height:56px;background:rgba(138,179,0,0.1);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:16px;">✅</div>
        <h3 style="font-size:1.15rem;color:#0f172a;font-weight:700;margin:0 0 8px;">RERA No.</h3>
        <p style="color:#8ab300;font-size:1rem;font-weight:800;margin:0 0 8px;">TNRERA / TN / 2023/001</p>
        <p style="color:#64748b;font-size:14px;margin:0;">Fully RERA compliant &amp; transparent</p>
      </div>
    </div>
  </div>
</section>

<!-- AMENITIES SECTION -->
<section id="amenities" style="padding:80px 40px;background:#0f172a;">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:50px;">
      <span style="color:#8ab300;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Lifestyle Features</span>
      <h2 style="font-size:2.8rem;color:#ffffff;font-weight:800;margin:12px 0 16px;">World-Class Amenities</h2>
      <p style="color:#94a3b8;font-size:1.05rem;max-width:600px;margin:0 auto;">30+ premium lifestyle features designed for a life of convenience and luxury.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🏊</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Infinity Pool</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🏋️</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Modern Gymnasium</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🌳</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Landscaped Gardens</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🏸</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Sports Courts</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🛡️</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">24/7 Security</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🧒</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Kids' Play Zone</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🎉</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Party &amp; Banquet Hall</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;transition:all 0.3s;" onmouseover="this.style.background='rgba(138,179,0,0.1)';this.style.borderColor='rgba(138,179,0,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='rgba(255,255,255,0.08)'">
        <div style="font-size:2.5rem;margin-bottom:12px;">🧘</div>
        <div style="color:#e2e8f0;font-weight:600;font-size:15px;">Yoga &amp; Meditation</div>
      </div>
    </div>
  </div>
</section>

<!-- IMAGE GALLERY -->
<section id="gallery" style="padding:80px 40px;background:#ffffff;">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:50px;">
      <span style="color:#8ab300;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Visual Tour</span>
      <h2 style="font-size:2.8rem;color:#0f172a;font-weight:800;margin:12px 0 16px;">Gallery</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/3;grid-column:span 2;grid-row:span 2;">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" alt="Living Room" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
      </div>
      <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/3;">
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" alt="Bedroom" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
      </div>
      <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/3;">
        <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80" alt="Kitchen" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
      </div>
      <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/3;">
        <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80" alt="Pool" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
      </div>
      <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/3;">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80" alt="Gym" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
      </div>
    </div>
  </div>
</section>

<!-- FLOOR PLANS -->
<section id="floorplan" style="padding:80px 40px;background:#f8fafc;">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:50px;">
      <span style="color:#8ab300;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Space Planning</span>
      <h2 style="font-size:2.8rem;color:#0f172a;font-weight:800;margin:12px 0 16px;">Floor Plans</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
        <div style="background:#0f172a;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#ffffff;font-weight:700;font-size:18px;">2 BHK</span>
          <span style="background:#8ab300;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">850 Sq. Ft.</span>
        </div>
        <div style="padding:24px;background:#f8fafc;min-height:200px;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;color:#64748b;">
            <div style="font-size:3rem;margin-bottom:12px;">🏠</div>
            <div style="font-weight:600;">2 Bedrooms · 2 Bathrooms</div>
            <div style="font-size:13px;margin-top:6px;">Living · Dining · Kitchen · Balcony</div>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #e2e8f0;">
          <div style="font-size:1.4rem;font-weight:800;color:#8ab300;">₹75L – ₹90L*</div>
          <a href="#enquire" style="display:block;text-align:center;margin-top:12px;padding:10px;background:#8ab300;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Enquire for Details</a>
        </div>
      </div>
      <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:2px solid #8ab300;">
        <div style="background:#8ab300;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#ffffff;font-weight:700;font-size:18px;">3 BHK ⭐ Popular</span>
          <span style="background:#ffffff;color:#8ab300;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">1,450 Sq. Ft.</span>
        </div>
        <div style="padding:24px;background:#f8fafc;min-height:200px;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;color:#64748b;">
            <div style="font-size:3rem;margin-bottom:12px;">🏡</div>
            <div style="font-weight:600;">3 Bedrooms · 3 Bathrooms</div>
            <div style="font-size:13px;margin-top:6px;">Living · Dining · Modular Kitchen · 2 Balconies</div>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #e2e8f0;">
          <div style="font-size:1.4rem;font-weight:800;color:#8ab300;">₹1.2Cr – ₹1.6Cr*</div>
          <a href="#enquire" style="display:block;text-align:center;margin-top:12px;padding:10px;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Enquire for Details</a>
        </div>
      </div>
      <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
        <div style="background:#0f172a;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#ffffff;font-weight:700;font-size:18px;">4 BHK Penthouse</span>
          <span style="background:#8ab300;color:#ffffff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;">2,400 Sq. Ft.</span>
        </div>
        <div style="padding:24px;background:#f8fafc;min-height:200px;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;color:#64748b;">
            <div style="font-size:3rem;margin-bottom:12px;">🌆</div>
            <div style="font-weight:600;">4 Bedrooms · 4 Bathrooms</div>
            <div style="font-size:13px;margin-top:6px;">Terrace · Private Garden · Home Theatre</div>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #e2e8f0;">
          <div style="font-size:1.4rem;font-weight:800;color:#8ab300;">₹1.8Cr – ₹2.2Cr*</div>
          <a href="#enquire" style="display:block;text-align:center;margin-top:12px;padding:10px;background:#8ab300;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Enquire for Details</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- LOCATION -->
<section id="location" style="padding:80px 40px;background:#0f172a;">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
    <div>
      <span style="color:#8ab300;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Strategic Location</span>
      <h2 style="font-size:2.8rem;color:#ffffff;font-weight:800;margin:12px 0 24px;">Prime Connectivity</h2>
      <div style="space-y:16px;">
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.06);">
          <div style="width:44px;height:44px;background:#8ab300;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">✈️</div>
          <div><div style="color:#ffffff;font-weight:600;font-size:15px;">Airport</div><div style="color:#94a3b8;font-size:13px;">25 min drive · 20 km</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.06);">
          <div style="width:44px;height:44px;background:#8ab300;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">🏙️</div>
          <div><div style="color:#ffffff;font-weight:600;font-size:15px;">City Centre / CBD</div><div style="color:#94a3b8;font-size:13px;">15 min drive · 10 km</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;margin-bottom:14px;border:1px solid rgba(255,255,255,0.06);">
          <div style="width:44px;height:44px;background:#8ab300;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">🏥</div>
          <div><div style="color:#ffffff;font-weight:600;font-size:15px;">Leading Hospitals</div><div style="color:#94a3b8;font-size:13px;">5 min drive · 3 km</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.06);">
          <div style="width:44px;height:44px;background:#8ab300;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">🎓</div>
          <div><div style="color:#ffffff;font-weight:600;font-size:15px;">Top Schools &amp; Colleges</div><div style="color:#94a3b8;font-size:13px;">2 min walk · 800 m</div></div>
        </div>
      </div>
    </div>
    <div style="border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916294548!2d80.00017470000001!3d13.0473243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="380" style="border:0;display:block;" allowfullscreen loading="lazy"></iframe>
    </div>
  </div>
</section>

<!-- ENQUIRY FORM — Split layout (like vishwak/TVS Emerald popup) -->
<section id="enquire" style="padding:80px 40px;background:#f8fafc;">
  <div style="max-width:1000px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.1);display:grid;grid-template-columns:1fr 1fr;">
    <!-- Left: Form -->
    <div style="padding:50px 40px;">
      <h2 style="font-size:2rem;color:#0f172a;font-weight:800;margin:0 0 8px;">Get Exclusive Price</h2>
      <p style="color:#64748b;margin:0 0 32px;font-size:15px;">Fill in your details &amp; get instant callback, best price, and VIP site visit invite.</p>
      <form class="landing-lead-form">
        <div style="margin-bottom:16px;">
          <input type="text" name="name" placeholder="Full Name *" required style="width:100%;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;transition:border 0.2s;outline:none;" onfocus="this.style.borderColor='#8ab300'" onblur="this.style.borderColor='#e2e8f0'" />
        </div>
        <div style="margin-bottom:16px;">
          <input type="tel" name="phone" placeholder="Phone Number *" required style="width:100%;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;transition:border 0.2s;outline:none;" onfocus="this.style.borderColor='#8ab300'" onblur="this.style.borderColor='#e2e8f0'" />
        </div>
        <div style="margin-bottom:16px;">
          <input type="email" name="email" placeholder="Email Address" style="width:100%;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;transition:border 0.2s;outline:none;" onfocus="this.style.borderColor='#8ab300'" onblur="this.style.borderColor='#e2e8f0'" />
        </div>
        <div style="margin-bottom:24px;">
          <select name="message" style="width:100%;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;outline:none;background:white;appearance:none;">
            <option value="">Preferred Configuration</option>
            <option value="Interested in 2 BHK">2 BHK Luxury Apartment</option>
            <option value="Interested in 3 BHK">3 BHK Premium Apartment</option>
            <option value="Interested in 4 BHK Penthouse">4 BHK Penthouse</option>
          </select>
        </div>
        <button type="submit" style="width:100%;padding:16px;background:#8ab300;color:#ffffff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;transition:background 0.2s,transform 0.2s;" onmouseover="this.style.background='#6d8f00';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#8ab300';this.style.transform='translateY(0)'">
          Submit &amp; Get Callback ➤
        </button>
      </form>
    </div>
    <!-- Right: Promises panel (green like TVS Emerald) -->
    <div style="background:#8ab300;padding:50px 40px;display:flex;flex-direction:column;justify-content:center;">
      <h3 style="font-size:1.8rem;font-weight:800;color:#ffffff;margin:0 0 30px;">We Promise You</h3>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;flex-shrink:0;">✓</div>
          <div><div style="color:#ffffff;font-weight:700;font-size:16px;">Instant Callback</div><div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Our expert will call you within 30 minutes</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;flex-shrink:0;">✓</div>
          <div><div style="color:#ffffff;font-weight:700;font-size:16px;">Best Price Guarantee</div><div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Special launch offers &amp; no hidden charges</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;flex-shrink:0;">✓</div>
          <div><div style="color:#ffffff;font-weight:700;font-size:16px;">Best Loan Deals</div><div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Tie-ups with 10+ banks, lowest rates</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;flex-shrink:0;">✓</div>
          <div><div style="color:#ffffff;font-weight:700;font-size:16px;">Free Legal Check</div><div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Complete legal verification at no cost</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;flex-shrink:0;">✓</div>
          <div><div style="color:#ffffff;font-weight:700;font-size:16px;">VIP Site Visit</div><div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:2px;">Exclusive guided tour with our expert</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:#0a0f1a;padding:50px 40px 30px;color:#94a3b8;">
  <div style="max-width:1200px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;margin-bottom:40px;">
      <div>
        <div style="font-size:1.8rem;font-weight:800;color:#ffffff;margin-bottom:16px;">${title}</div>
        <p style="color:#64748b;font-size:14px;line-height:1.7;max-width:340px;">A landmark luxury residential project offering world-class amenities, stunning views, and a premium lifestyle at an unbeatable location.</p>
        <div style="display:flex;gap:12px;margin-top:20px;">
          <a href="https://wa.me/" style="width:36px;height:36px;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;">📱</a>
          <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;">📘</a>
          <a href="#" style="width:36px;height:36px;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:16px;">📸</a>
        </div>
      </div>
      <div>
        <h4 style="color:#ffffff;font-weight:700;margin:0 0 16px;">Quick Links</h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <a href="#overview" style="color:#64748b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#64748b'">Project Overview</a>
          <a href="#amenities" style="color:#64748b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#64748b'">Amenities</a>
          <a href="#floorplan" style="color:#64748b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#64748b'">Floor Plans</a>
          <a href="#gallery" style="color:#64748b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#64748b'">Gallery</a>
          <a href="#location" style="color:#64748b;text-decoration:none;font-size:14px;" onmouseover="this.style.color='#8ab300'" onmouseout="this.style.color='#64748b'">Location</a>
        </div>
      </div>
      <div>
        <h4 style="color:#ffffff;font-weight:700;margin:0 0 16px;">Contact Us</h4>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;gap:8px;align-items:flex-start;font-size:14px;">
            <span>📞</span>
            <a href="tel:+918939000065" style="color:#8ab300;text-decoration:none;font-weight:600;">+91 89390 00065</a>
          </div>
          <div style="display:flex;gap:8px;align-items:flex-start;font-size:14px;">
            <span>📧</span>
            <a href="mailto:info@example.com" style="color:#64748b;text-decoration:none;">info@example.com</a>
          </div>
          <div style="display:flex;gap:8px;align-items:flex-start;font-size:14px;">
            <span>📍</span>
            <span style="color:#64748b;">Update the project address here, City, State - PIN</span>
          </div>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="font-size:13px;color:#475569;">© 2025 ${title}. All rights reserved. | RERA Approved | *T&amp;C Apply</div>
      <div style="font-size:13px;color:#475569;">Designed by <span style="color:#8ab300;font-weight:600;">Promoter Property</span></div>
    </div>
  </div>
</footer>

<!-- WhatsApp Floating Button -->
<a href="https://wa.me/+918939000065" target="_blank" style="position:fixed;bottom:24px;left:24px;width:60px;height:60px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.4);text-decoration:none;z-index:9999;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
`;

    const defaultCss = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif; 
  line-height: 1.6; 
  color: #1e293b; 
  overflow-x: hidden;
}

html { scroll-behavior: smooth; }

/* Smooth hover transitions */
a, button, div[onmouseover] { transition: all 0.25s ease; }

/* Lead form focus states */
.landing-lead-form input:focus, 
.landing-lead-form select:focus,
.landing-lead-form textarea:focus { 
  outline: none; 
  border-color: #8ab300 !important; 
  box-shadow: 0 0 0 3px rgba(138,179,0,0.12); 
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  #hero > div > div { grid-template-columns: 1fr !important; gap: 40px !important; padding: 60px 20px !important; }
  #location > div { grid-template-columns: 1fr !important; padding: 0 20px !important; }
  #enquire > div > div { grid-template-columns: 1fr !important; }
  footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
}

@media (max-width: 768px) {
  h1 { font-size: 2.4rem !important; }
  h2 { font-size: 2rem !important; }
  nav > div:last-child { display: none !important; }
  #hero > div > div > div:last-child { display: none; }
  section { padding: 50px 20px !important; }
  #overview > div { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
  section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
  section > div > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr !important; }
  footer > div > div:first-child { grid-template-columns: 1fr !important; }
}
`;

    const defaultJs = `
$(document).ready(function() {
  console.log('Landing page initialized: ${title}');
  
  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function(e) {
    var target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 600, 'swing');
    }
  });

  // Sticky header shadow on scroll
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 50) {
      $('#main-header').css('box-shadow', '0 4px 30px rgba(0,0,0,0.4)');
    } else {
      $('#main-header').css('box-shadow', '0 2px 20px rgba(0,0,0,0.3)');
    }
  });

  // Counter animation (simple vanilla)
  function animateCounter(el, target, duration) {
    var start = 0;
    var step = target / (duration / 16);
    var timer = setInterval(function() {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      var display = Math.floor(start);
      var text = $(el).text();
      $(el).text(text.includes('+') ? display + '+' : display);
    }, 16);
  }

  // Trigger counters when in view
  var countersAnimated = false;
  $(window).on('scroll', function() {
    if (!countersAnimated) {
      var stats = $('#overview');
      if (stats.length && stats.offset().top < $(window).scrollTop() + $(window).height() - 100) {
        countersAnimated = true;
        $('.counter-num').each(function() {
          var text = $(this).text().replace('+','');
          var num = parseInt(text) || 0;
          animateCounter(this, num, 1500);
        });
      }
    }
  });
});
`;



    const [result] = await db.query(
      `INSERT INTO LandingPages 
      (title, slug, pageType, status, htmlContent, cssContent, jsContent, metaTitle, metaDescription) 
      VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        pageType,
        defaultHtml,
        defaultCss,
        defaultJs,
        title,
        `Explore details for ${title}`
      ]
    );

    const [rows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, page: rows[0] });
  } catch (err) {
    console.error('Error creating landing page:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update landing page (Admin)
exports.updateLandingPage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      pageType,
      status,
      gjsComponents,
      gjsStyles,
      gjsProject,
      htmlContent,
      cssContent,
      jsContent,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    const [rows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    let slug = customSlug ? slugify(customSlug) : rows[0].slug;

    // Check slug duplication if updated
    if (slug !== rows[0].slug) {
      const [existing] = await db.query('SELECT id FROM LandingPages WHERE slug = ? AND id != ?', [slug, id]);
      if (existing.length > 0) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    await db.query(
      `UPDATE LandingPages SET 
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        pageType = COALESCE(?, pageType),
        status = COALESCE(?, status),
        gjsComponents = COALESCE(?, gjsComponents),
        gjsStyles = COALESCE(?, gjsStyles),
        gjsProject = COALESCE(?, gjsProject),
        htmlContent = COALESCE(?, htmlContent),
        cssContent = COALESCE(?, cssContent),
        jsContent = COALESCE(?, jsContent),
        metaTitle = COALESCE(?, metaTitle),
        metaDescription = COALESCE(?, metaDescription),
        metaKeywords = COALESCE(?, metaKeywords),
        updatedAt = NOW()
      WHERE id = ?`,
      [
        title,
        slug,
        pageType,
        status,
        typeof gjsComponents === 'object' ? JSON.stringify(gjsComponents) : gjsComponents,
        typeof gjsStyles === 'object' ? JSON.stringify(gjsStyles) : gjsStyles,
        typeof gjsProject === 'object' ? JSON.stringify(gjsProject) : gjsProject,
        htmlContent,
        cssContent,
        jsContent,
        metaTitle,
        metaDescription,
        metaKeywords,
        id
      ]
    );

    const [updatedRows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [id]);
    res.status(200).json({ success: true, page: updatedRows[0] });
  } catch (err) {
    console.error('Error updating landing page:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete landing page (Admin)
exports.deleteLandingPage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM LandingPages WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Landing page deleted successfully' });
  } catch (err) {
    console.error('Error deleting landing page:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Duplicate landing page (Admin)
exports.duplicateLandingPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    const orig = rows[0];
    const newTitle = `${orig.title} (Copy)`;
    const newSlug = `${orig.slug}-copy-${Date.now()}`;

    const [result] = await db.query(
      `INSERT INTO LandingPages 
      (title, slug, pageType, status, gjsComponents, gjsStyles, gjsProject, htmlContent, cssContent, jsContent, metaTitle, metaDescription, metaKeywords) 
      VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newTitle,
        newSlug,
        orig.pageType,
        orig.gjsComponents,
        orig.gjsStyles,
        orig.gjsProject,
        orig.htmlContent,
        orig.cssContent,
        orig.jsContent,
        orig.metaTitle,
        orig.metaDescription,
        orig.metaKeywords
      ]
    );

    const [newRows] = await db.query('SELECT * FROM LandingPages WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, page: newRows[0] });
  } catch (err) {
    console.error('Error duplicating landing page:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Public landing page by slug
exports.getPublicLandingPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query('SELECT * FROM LandingPages WHERE slug = ?', [slug]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Landing page not found' });
    }

    const page = rows[0];
    // Check if published or admin preview
    if (page.status !== 'published' && req.query.preview !== 'true') {
      return res.status(403).json({ success: false, message: 'This landing page is currently in draft mode.' });
    }

    res.status(200).json({ success: true, page });
  } catch (err) {
    console.error('Error fetching public landing page:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Submit Lead from Landing Page Form
exports.submitLandingPageLead = async (req, res) => {
  try {
    const { name, phone, email, message, propertyId, brokerId, landingPageSlug } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are required' });
    }

    const noteMessage = landingPageSlug 
      ? `[Landing Page Lead: /landing/${landingPageSlug}] ${message || ''}`.trim()
      : message;

    const [result] = await db.query(
      `INSERT INTO leads (name, phone, email, message, propertyId, brokerId) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, email || null, noteMessage || null, propertyId || null, brokerId || null]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been submitted successfully.',
      leadId: result.insertId
    });
  } catch (err) {
    console.error('Error submitting landing page lead:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
