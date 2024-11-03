export function normalizeUrl(url: string): string {
  try {
    let normalizedUrl = url.trim().toLowerCase();
    
    // Handle special cases first
    if (normalizedUrl.startsWith('feed://')) {
      normalizedUrl = 'http://' + normalizedUrl.slice(7);
    }
    
    // Add protocol if missing
    if (!normalizedUrl.match(/^[a-z]+:\/\//)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Parse URL to validate and normalize
    const urlObject = new URL(normalizedUrl);
    
    // Clean up hostname
    let hostname = urlObject.hostname
      .replace(/^www\.www\./i, 'www.')
      .replace(/\.+/g, '.')
      .replace(/\.$/, '');
    
    // Validate hostname parts
    const domainParts = hostname.split('.');
    if (domainParts.length < 2) {
      throw new Error('Invalid domain format: Domain must have at least two parts');
    }
    
    // Validate each domain part
    for (const part of domainParts) {
      if (!part || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part)) {
        throw new Error(`Invalid domain part: ${part}`);
      }
    }
    
    // Ensure TLD is valid
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      throw new Error('Invalid TLD: Must be at least 2 characters');
    }
    
    // Update hostname
    urlObject.hostname = hostname;
    
    // Remove default ports
    if ((urlObject.protocol === 'http:' && urlObject.port === '80') ||
        (urlObject.protocol === 'https:' && urlObject.port === '443')) {
      urlObject.port = '';
    }
    
    // Remove trailing slashes
    let finalUrl = urlObject.toString();
    return finalUrl.replace(/\/+$/, '');
  } catch (error) {
    throw new Error(`Invalid URL format: ${error.message}`);
  }
}

export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    let testUrl = url.trim();
    
    // Check for common invalid characters
    if (/[\s<>\"{}|\\^`]/.test(testUrl)) {
      return false;
    }
    
    // Handle special protocols
    if (testUrl.startsWith('feed://')) {
      testUrl = 'http://' + testUrl.slice(7);
    }
    
    // Add protocol if missing
    if (!testUrl.match(/^[a-z]+:\/\//i)) {
      testUrl = 'https://' + testUrl;
    }
    
    const urlObject = new URL(testUrl);
    
    // Basic domain validation
    const domain = urlObject.hostname;
    const domainParts = domain.split('.');
    
    // Remove www prefix for validation
    const domainWithoutWww = domain.replace(/^www\./i, '');
    const mainDomainParts = domainWithoutWww.split('.');
    
    // Validate domain structure
    if (mainDomainParts.length < 2) return false;
    
    // Validate each domain part
    for (const part of mainDomainParts) {
      if (!part || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part)) {
        return false;
      }
      if (part.length > 63) return false; // Max length per DNS label
    }
    
    // Validate TLD
    const tld = mainDomainParts[mainDomainParts.length - 1];
    if (tld.length < 2) return false;
    
    // Check total domain length
    if (domainWithoutWww.length > 255) return false;
    
    // Check protocol
    const protocol = urlObject.protocol.toLowerCase();
    if (!['http:', 'https:'].includes(protocol)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    const normalizedUrl = normalizeUrl(url);
    const urlObject = new URL(normalizedUrl);
    return urlObject.hostname.replace(/^www\./i, '');
  } catch {
    throw new Error('Invalid URL: Cannot extract domain');
  }
}