import { defineMiddleware } from 'astro:middleware';
import TurndownService from 'turndown';

export const onRequest = defineMiddleware(async (context, next) => {
  // Execute the request and get the standard HTML (or other) response
  const response = await next();
  
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
      
      // Return the new Markdown response
      return new Response(markdown, {
        status: response.status,
        headers: {
          'Content-Type': 'text/markdown',
          'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=0, must-revalidate'
        }
      });
    }
  }
  
  // Return the default response (HTML) for regular browsers
  return response;
});
