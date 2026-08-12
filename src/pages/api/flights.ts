import type { APIRoute } from 'astro';

export const prerender = false; // Opt-out of static rendering (SSR only)

export const GET: APIRoute = async () => {
  const token = import.meta.env.FSHUB_PILOT_TOKEN;
  
  if (!token) {
    return new Response(JSON.stringify({ error: "FSHub Token is missing" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-Pilot-Token': token,
        "User-Agent": "NismaraAirlines/1.0",
        "Referer": "https://nismara.web.id",
        "Origin": "https://nismara.web.id",
      }
    };
    
    // Fetch Stats
    let stats = null;
    const statsRes = await fetch('https://fshub.io/api/v3/airline/6445/stats', fetchOptions);
    if (statsRes.ok) {
      const statsJson = await statsRes.json();
      stats = statsJson.data;
    }

    // Fetch Flights
    let allFlights: any[] = [];
    let nextCursor = '';
    let pageCount = 0;
    
    while (pageCount < 10) {
      const url = nextCursor ? `https://fshub.io/api/v3/airline/6445/flight?limit=100&cursor=${nextCursor}` : 'https://fshub.io/api/v3/airline/6445/flight?limit=100';
      const flightsRes = await fetch(url, fetchOptions);
      
      if (flightsRes.ok) {
        const flightsJson = await flightsRes.json();
        if (flightsJson.data && flightsJson.data.length > 0) {
          allFlights = allFlights.concat(flightsJson.data);
        }
        
        if (flightsJson.meta && flightsJson.meta.cursor && flightsJson.meta.cursor.next) {
          nextCursor = flightsJson.meta.cursor.next;
          pageCount++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    const recentFlights = allFlights.reverse().slice(0, 5);

    return new Response(JSON.stringify({ stats, flights: recentFlights }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache this response on the CDN (Vercel Edge) for 1 hour, allowing stale requests up to a day
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
