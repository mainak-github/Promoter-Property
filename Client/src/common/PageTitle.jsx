import React from 'react';
import SEOHead from './SEOHead';

const PageTitle = ({ title, description, keywords, canonicalPath, ogImage, schemaJson, robots }) => {
  const cleanTitle = title ? title.replace(/^Promoter Property\s*-\s*/i, '') : '';
  return (
    <SEOHead
      title={cleanTitle}
      description={description}
      keywords={keywords}
      canonicalPath={canonicalPath}
      ogImage={ogImage}
      schemaJson={schemaJson}
      robots={robots}
    />
  );
};

export default PageTitle;
