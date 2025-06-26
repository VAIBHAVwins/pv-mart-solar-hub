export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { code } = req.body;
  const client_id = 'Ov23liCGBSSR8oe8qMtZ'; // Your GitHub OAuth Client ID
  const client_secret = 'YOUR_CLIENT_SECRET'; // TODO: Fill in your GitHub OAuth Client Secret

  if (!code) {
    res.status(400).json({ error: 'Missing code' });
    return;
  }

  const params = new URLSearchParams({
    client_id,
    client_secret,
    code,
  });

  const githubRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: params,
  });

  const data = await githubRes.json();
  res.status(200).json(data);
} 