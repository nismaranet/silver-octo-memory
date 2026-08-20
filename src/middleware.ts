import { defineMiddleware } from 'astro:middleware';
import TurndownService from 'turndown';

export const onRequest = defineMiddleware(async (context, next) => {
  // Execute the request and get the standard HTML (or other) response
  const response = await next();
  
  // Clone headers because original response headers might be immutable
  const headers = new Headers(response.headers);
  
  // Inject Link headers for Agent Discovery (RFC 8288 / RFC 9727) on the homepage
  if (context.url.pathname === '/') {
    headers.append('Link', '</.well-known/api-catalog>; rel="api-catalog"');
    headers.append('Link', '</llms.txt>; rel="describedby"');
  }

  // Check if the agent is requesting markdown via Content Negotiation
  const acceptHeader = context.request.headers.get('accept');
  if (acceptHeader && acceptHeader.includes('text/markdown')) {
    
    // Only attempt to convert HTML responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      
      // Extract the raw HTML content
      const html = await response.text();
      
      // Configure Turndown for clean Markdown output
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });
      
      // Convert HTML to Markdown
      const markdown = turndownService.turndown(html);
      
      // Update specific headers for Markdown
      headers.set('Content-Type', 'text/markdown');
      if (!headers.has('Cache-Control')) {
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }
      
      // Return the new Markdown response
      return new Response(markdown, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
    }
  }
  
  // Return the response for regular browsers, with the injected headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
});
