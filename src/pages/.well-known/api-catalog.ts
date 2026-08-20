import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const catalog = {
    linkset: [
      {
        anchor: "https://nismara.web.id/api",
        "service-desc": [
          {
            href: "https://nismara.web.id/api/openapi.json",
            type: "application/vnd.oai.openapi+json;version=3.0"
          }
        ],
        "service-doc": [
          {
            href: "https://nismara.web.id/api/docs",
            type: "text/html"
          }
        ],
        "status": [
          {
            href: "https://nismara.web.id/api/health",
            type: "application/health+json"
          }
        ]
      }
    ]
  };

  return new Response(JSON.stringify(catalog), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400"
    }
  });
};
