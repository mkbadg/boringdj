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

      const emailBody = [
        `New lead from boringdj.com`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Event Date: ${date || 'Not specified'}`,
        `Details: ${details || 'None provided'}`,
      ].join('\n');

      await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: 'michael.badgett@gmail.com' }] }],
          from: { email: 'noreply@boringdj.com', name: 'Mesa Sound Leads' },
          subject: `New lead: ${name}`,
          content: [{ type: 'text/plain', value: emailBody }],
        }),
      });

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
