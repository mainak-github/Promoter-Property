import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import url from '../url';
import Swal from 'sweetalert2';

const PublishedLandingPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${url.API_URL}/public/landing-pages/${slug}${isPreview ? '?preview=true' : ''}`
        );
        if (res.data.success && res.data.page) {
          setPage(res.data.page);
        } else {
          setError('Landing page not found or is in draft mode.');
        }
      } catch (err) {
        console.error('Error fetching landing page:', err);
        setError(err.response?.data?.message || 'Failed to load landing page.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLandingPage();
    }
  }, [slug, isPreview]);

  // Execute custom JavaScript / jQuery and attach lead form submit listeners after DOM injection
  useEffect(() => {
    if (!page || !containerRef.current) return;

    // Load jQuery if not already present on window
    const ensureJQuery = () => {
      return new Promise((resolve) => {
        if (window.jQuery) {
          resolve(window.jQuery);
        } else {
          const script = document.createElement('script');
          script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
          script.onload = () => resolve(window.jQuery);
          script.onerror = () => resolve(null);
          document.head.appendChild(script);
        }
      });
    };

    ensureJQuery().then(() => {
      // Execute custom JS if present
      if (page.jsContent) {
        try {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = page.jsContent;
          containerRef.current.appendChild(script);
        } catch (jsErr) {
          console.error('Error executing landing page script:', jsErr);
        }
      }

      // Attach dynamic form submit handling for lead capture
      const forms = containerRef.current.querySelectorAll('form');
      forms.forEach((form) => {
        form.onsubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const name = formData.get('name') || formData.get('fullName') || formData.get('your-name') || '';
          const phone = formData.get('phone') || formData.get('mobile') || formData.get('contact') || '';
          const email = formData.get('email') || '';
          const message = formData.get('message') || formData.get('comments') || '';

          if (!name || !phone) {
            Swal.fire({
              icon: 'warning',
              title: 'Required Fields Missing',
              text: 'Please provide both Full Name and Phone Number.',
              confirmButtonColor: '#8ab300'
            });
            return;
          }

          try {
            const res = await axios.post(`${url.API_URL}/public/landing-leads`, {
              name,
              phone,
              email,
              message,
              landingPageSlug: slug
            });

            if (res.data.success) {
              Swal.fire({
                icon: 'success',
                title: '🎉 Enquiry Submitted!',
                text: res.data.message || 'Thank you! Our expert will call you within 30 minutes.',
                confirmButtonColor: '#8ab300'
              });
              form.reset();
            }
          } catch (submitErr) {
            console.error('Error submitting landing page lead:', submitErr);
            Swal.fire({
              icon: 'error',
              title: 'Submission Failed',
              text: submitErr.response?.data?.message || 'Could not submit your inquiry. Please try again.',
              confirmButtonColor: '#8ab300'
            });
          }
        };
      });
    });
  }, [page, slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a', color: '#fff', gap: '20px' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(138,179,0,0.2)', borderTopColor: '#8ab300', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', fontWeight: '600', margin: 0 }}>Loading Property Page...</p>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Landing Page Unavailable</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{error || 'The requested landing page could not be found.'}</p>
          <a href="/" style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page.metaTitle || page.title || 'Promoter Property Landing Page'}</title>
        <meta name="description" content={page.metaDescription || page.title || ''} />
        {page.metaKeywords && <meta name="keywords" content={page.metaKeywords} />}
      </Helmet>

      {/* Embedded Landing Page CSS Styles */}
      {page.cssContent && <style dangerouslySetInnerHTML={{ __html: page.cssContent }} />}

      {/* Preview banner if in draft/preview mode */}
      {isPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999, background: '#f59e0b', color: '#000', padding: '8px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
          ⚡ PREVIEW MODE — This landing page is currently in Draft.
        </div>
      )}

      {/* Render Landing Page HTML */}
      <div
        ref={containerRef}
        className="published-landing-page-wrapper"
        style={{ paddingTop: isPreview ? '36px' : '0px', width: '100%', minHeight: '100vh' }}
        dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }}
      />
    </>
  );
};

export default PublishedLandingPage;
