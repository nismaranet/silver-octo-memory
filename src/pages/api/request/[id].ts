import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Request ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiUrl = `https://radio.nismara.web.id:8443/api/station/1/request/${id}`;
  const apiKey = import.meta.env.AZURACAST_API_KEY;

  // AzuraCast blocks requests without a valid User-Agent to prevent spam.
  // We forward the client's User-Agent and IP address for proper rate limiting and bot protection.
  const clientUserAgent = request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NismaraRadioApp/1.0';
  const clientIp = request.headers.get('X-Forwarded-For') || request.headers.get('CF-Connecting-IP') || '127.0.0.1';

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'User-Agent': clientUserAgent,
      'X-Forwarded-For': clientIp
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(apiUrl, { 
      method: 'POST',
      headers 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new Response(JSON.stringify({ 
        error: `Failed to submit request: ${response.statusText}`,
        message: errorData.message || 'Unknown error'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Radio Request Submission Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
