import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const apiUrl = 'https://radio.nismara.web.id:8443/api/station/1/schedule';
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
      return new Response(JSON.stringify({ error: `Failed to fetch schedule data: ${response.statusText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache schedule for 1 minute
      }
    });
  } catch (error) {
    console.error('Radio Schedule API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
