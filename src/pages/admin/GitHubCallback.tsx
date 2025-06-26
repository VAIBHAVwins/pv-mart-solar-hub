import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GITHUB_CLIENT_ID = 'Ov23liCGBSSR8oe8qMtZ';
const REDIRECT_URI = 'http://localhost:5173/admin/github-callback';

export default function AdminGitHubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleOAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = localStorage.getItem('github_oauth_state');
      if (!code || !state || state !== storedState) {
        alert('OAuth state mismatch or missing code.');
        navigate('/admin');
        return;
      }
      // Exchange code for access token using our backend API
      try {
        const res = await fetch('/api/github-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('github_access_token', data.access_token);
          navigate('/admin');
        } else {
          alert('Failed to get GitHub access token.');
          navigate('/admin');
        }
      } catch (err) {
        alert('OAuth error: ' + err);
        navigate('/admin');
      }
    }
    handleOAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Completing GitHub Login...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
} 