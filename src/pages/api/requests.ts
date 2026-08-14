import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const apiUrl = 'https://radio.nismara.web.id:8443/api/station/1/requests';
  const apiKey = import.meta.env.AZURACAST_API_KEY;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch requestable songs: ${response.statusText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30'
      }
    });
  } catch (error) {
    console.error('Radio Requests API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
