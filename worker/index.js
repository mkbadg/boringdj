export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
    }

    try {
      const { name, email, date, details } = await request.json();

      if (!name || !email) {
        return new Response('Name and email required', { status: 400, headers: corsHeaders() });
      }

      const res = await fetch('https://script.google.com/macros/s/AKfycbxvbHMAGq8hEtCx0ujZRmKulWm1KwZvXbdXWrXy4ZbTpo3k2SmmAcaGhH8nkWHh2S91/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date, details }),
      });

      if (!res.ok) throw new Error();

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    } catch {
      return new Response('Server error', { status: 500, headers: corsHeaders() });
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
