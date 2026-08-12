/**
 * Generates an SEO-friendly slug from a title string.
 * e.g., "Luxury 3BHK Flat in Salt Lake!" -> "luxury-3bhk-flat-in-salt-lake"
 */
export const slugifyTitle = (title) => {
  if (!title) return '';
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-')  // replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens
};

/**
 * Returns the slug or identifier for a property.
 */
export const getPropertySlug = (property) => {
  if (!property) return '';
  if (property.slug && property.slug.trim() !== '') {
    return property.slug;
  }
  if (property.title) {
    return slugifyTitle(property.title) || String(property.id);
  }
  return String(property.id);
};

/**
 * Returns the full relative URL for property details.
 */
export const getPropertyDetailsUrl = (property) => {
  if (!property) return '/property';
  const slug = getPropertySlug(property);
  return `/property/details/${slug}`;
};
