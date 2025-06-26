import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GITHUB_CLIENT_ID = 'Ov23liCGBSSR8oe8qMtZ';
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const REDIRECT_URI = 'http://localhost:5173/admin/github-callback';
const GITHUB_REPO = 'VAIBHAVwins/pv-mart-solar-hub';
const BLOGS_PATH = 'content/blogs';
const HERO_JSON_PATH = 'content/hero.json';
const HERO_IMAGE_PATH = 'public/hero-images/';
const BLOG_IMAGE_PATH = 'public/blog-images/';

function startGitHubLogin() {
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('github_oauth_state', state);
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'repo user',
    state,
    allow_signup: 'true',
  });
  window.location.href = `${GITHUB_AUTH_URL}?${params.toString()}`;
}

function githubLogout() {
  localStorage.removeItem('github_access_token');
  window.location.reload();
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats] = useState({
    totalUsers: 156,
    totalQuotes: 89,
    totalVendors: 34,
    totalCustomers: 122
  });
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState('');
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [heroEditMode, setHeroEditMode] = useState(false);
  const [heroForm, setHeroForm] = useState({ title: '', imageUrl: '', link: '' });
  const [heroActionLoading, setHeroActionLoading] = useState(false);
  const [heroActionError, setHeroActionError] = useState('');
  const [heroEditIdx, setHeroEditIdx] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState({ title: '', date: '', content: '' });
  const [blogActionLoading, setBlogActionLoading] = useState(false);
  const [blogActionError, setBlogActionError] = useState('');
  const [blogEditIdx, setBlogEditIdx] = useState<number | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageUploadLoading, setHeroImageUploadLoading] = useState(false);
  const [heroImageUploadError, setHeroImageUploadError] = useState('');
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImageUploadLoading, setBlogImageUploadLoading] = useState(false);
  const [blogImageUploadError, setBlogImageUploadError] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');

  useEffect(() => {
    setGithubToken(localStorage.getItem('github_access_token'));
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      if (!githubToken) return;
      setBlogsLoading(true);
      setBlogsError('');
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_PATH}`, {
          headers: { Authorization: `token ${githubToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const files = await res.json();
        const blogList = [];
        for (const file of files) {
          if (file.type === 'file' && file.name.endsWith('.md')) {
            const blogRes = await fetch(file.download_url);
            const content = await blogRes.text();
            // Simple frontmatter extraction (YAML between ---)
            const match = content.match(/^---([\s\S]*?)---/);
            let meta = {};
            if (match) {
              const yaml = match[1];
              meta = Object.fromEntries(yaml.split('\n').map(line => line.split(':').map(s => s.trim())).filter(arr => arr.length === 2));
            }
            blogList.push({
              name: file.name,
              ...meta,
              content,
            });
          }
        }
        setBlogs(blogList);
      } catch (err: any) {
        setBlogsError(err.message || 'Error loading blogs');
      } finally {
        setBlogsLoading(false);
      }
    }
    if (githubToken) fetchBlogs();
  }, [githubToken]);

  // Helper to update hero.json in GitHub
  async function updateHeroJson(newHeroImages: any[]) {
    setHeroActionLoading(true);
    setHeroActionError('');
    try {
      // Get current file SHA
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${HERO_JSON_PATH}`, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const data = await res.json();
      const sha = data.sha;
      // Commit new content
      const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${HERO_JSON_PATH}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Update hero images from dashboard',
          content: btoa(JSON.stringify(newHeroImages, null, 2)),
          sha,
        }),
      });
      if (!commitRes.ok) throw new Error('Failed to update hero.json');
      setHeroImages(newHeroImages);
      setHeroEditMode(false);
      setHeroForm({ title: '', imageUrl: '', link: '' });
    } catch (err: any) {
      setHeroActionError(err.message || 'Error updating hero images');
    } finally {
      setHeroActionLoading(false);
    }
  }

  // Add hero
  function handleAddHero() {
    updateHeroJson([...heroImages, { ...heroForm }]);
  }
  // Edit hero
  function handleEditHero(idx: number) {
    setHeroEditMode(true);
    setHeroForm(heroImages[idx]);
    setHeroEditIdx(idx);
  }
  function handleSaveEditHero() {
    if (heroEditIdx === null) return;
    const updated = [...heroImages];
    updated[heroEditIdx] = { ...heroForm };
    updateHeroJson(updated);
    setHeroEditIdx(null);
  }
  // Delete hero
  function handleDeleteHero(idx: number) {
    const updated = heroImages.filter((_, i) => i !== idx);
    updateHeroJson(updated);
  }
  // Reorder hero
  function handleMoveHero(idx: number, dir: -1 | 1) {
    const updated = [...heroImages];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updateHeroJson(updated);
  }

  // Helper to create or update a blog post
  async function saveBlogPost(isEdit: boolean, filename?: string) {
    setBlogActionLoading(true);
    setBlogActionError('');
    try {
      const mdContent = `---\ntitle: ${blogForm.title}\ndate: ${blogForm.date}\n---\n\n${blogForm.content}`;
      const fileName = filename || `${blogForm.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.md`;
      let sha = undefined;
      if (isEdit) {
        // Get SHA for update
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_PATH}/${fileName}`, {
          headers: { Authorization: `token ${githubToken}` },
        });
        const data = await res.json();
        sha = data.sha;
      }
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_PATH}/${fileName}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: isEdit ? 'Edit blog post from dashboard' : 'Add blog post from dashboard',
          content: btoa(mdContent),
          ...(sha ? { sha } : {}),
        }),
      });
      if (!res.ok) throw new Error('Failed to save blog post');
      setBlogForm({ title: '', date: '', content: '' });
      setBlogEditIdx(null);
      // Refetch blogs
      setBlogsLoading(true);
      setTimeout(() => setBlogsLoading(false), 1000);
    } catch (err: any) {
      setBlogActionError(err.message || 'Error saving blog post');
    } finally {
      setBlogActionLoading(false);
    }
  }
  // Delete blog post
  async function deleteBlogPost(filename: string) {
    setBlogActionLoading(true);
    setBlogActionError('');
    try {
      // Get SHA
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_PATH}/${filename}`, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const data = await res.json();
      const sha = data.sha;
      const delRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOGS_PATH}/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Delete blog post from dashboard',
          sha,
        }),
      });
      if (!delRes.ok) throw new Error('Failed to delete blog post');
      // Refetch blogs
      setBlogsLoading(true);
      setTimeout(() => setBlogsLoading(false), 1000);
    } catch (err: any) {
      setBlogActionError(err.message || 'Error deleting blog post');
    } finally {
      setBlogActionLoading(false);
    }
  }
  // Edit blog
  function handleEditBlog(idx: number) {
    setBlogEditIdx(idx);
    setBlogForm({
      title: blogs[idx].title || '',
      date: blogs[idx].date || '',
      content: blogs[idx].content.replace(/^---([\s\S]*?)---/, '').trim(),
    });
  }

  async function handleHeroImageUpload() {
    if (!heroImageFile) return;
    setHeroImageUploadLoading(true);
    setHeroImageUploadError('');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const fileName = heroImageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        // Check if file already exists to get SHA (for overwrite)
        let sha = undefined;
        const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${HERO_IMAGE_PATH}${fileName}`, {
          headers: { Authorization: `token ${githubToken}` },
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          sha = checkData.sha;
        }
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${HERO_IMAGE_PATH}${fileName}`, {
          method: 'PUT',
          headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Upload hero image from dashboard',
            content: base64,
            ...(sha ? { sha } : {}),
          }),
        });
        if (!res.ok) throw new Error('Failed to upload image');
        // Use the relative path for imageUrl
        setHeroForm(f => ({ ...f, imageUrl: `/public/hero-images/${fileName}` }));
        setHeroImageFile(null);
      };
      reader.readAsDataURL(heroImageFile);
    } catch (err: any) {
      setHeroImageUploadError(err.message || 'Error uploading image');
    } finally {
      setHeroImageUploadLoading(false);
    }
  }

  async function handleBlogImageUpload() {
    if (!blogImageFile) return;
    setBlogImageUploadLoading(true);
    setBlogImageUploadError('');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const fileName = blogImageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        // Check if file already exists to get SHA (for overwrite)
        let sha = undefined;
        const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOG_IMAGE_PATH}${fileName}`, {
          headers: { Authorization: `token ${githubToken}` },
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          sha = checkData.sha;
        }
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOG_IMAGE_PATH}${fileName}`, {
          method: 'PUT',
          headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Upload blog image from dashboard',
            content: base64,
            ...(sha ? { sha } : {}),
          }),
        });
        if (!res.ok) throw new Error('Failed to upload image');
        // Use the relative path for imageUrl
        setBlogImageUrl(`/public/blog-images/${fileName}`);
        setBlogImageFile(null);
      };
      reader.readAsDataURL(blogImageFile);
    } catch (err: any) {
      setBlogImageUploadError(err.message || 'Error uploading image');
    } finally {
      setBlogImageUploadLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuotes}</div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="quotes">Quote Management</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Recent Users</h3>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-600">User management functionality will be implemented here.</p>
                      <p className="text-sm text-gray-500 mt-2">Features: View users, verify vendors, manage accounts, user analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Quote Requests</h3>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-600">Quote management system will be implemented here.</p>
                      <p className="text-sm text-gray-500 mt-2">Features: Assign quotes to vendors, track progress, quality control</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!githubToken ? (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">GitHub Content Management Login</h3>
                        <button
                          onClick={startGitHubLogin}
                          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold"
                        >
                          Login with GitHub
                        </button>
                        <p className="text-gray-600 mt-2 text-sm">Login with GitHub to manage hero images and blog posts directly from this dashboard.</p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">GitHub Connected</h3>
                          <button
                            onClick={githubLogout}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Logout from GitHub
                          </button>
                        </div>
                        {/* Hero and Blog Management UI will go here */}
                        <div className="border rounded-lg p-4 mb-6">
                          <h4 className="font-semibold mb-2">Hero Section Management</h4>
                          <p className="text-gray-600 mb-2">(Coming next: Add, edit, delete, reorder hero images using GitHub API)</p>
                          <div className="mb-4">
                            <input className="border rounded px-2 py-1 mr-2" placeholder="Title" value={heroForm.title} onChange={e => setHeroForm(f => ({ ...f, title: e.target.value }))} />
                            <input className="border rounded px-2 py-1 mr-2" placeholder="Image URL" value={heroForm.imageUrl} onChange={e => setHeroForm(f => ({ ...f, imageUrl: e.target.value }))} />
                            <input className="border rounded px-2 py-1 mr-2" placeholder="Link (optional)" value={heroForm.link} onChange={e => setHeroForm(f => ({ ...f, link: e.target.value }))} />
                            <div className="mb-2 flex items-center">
                              <input type="file" accept="image/*" onChange={e => setHeroImageFile(e.target.files?.[0] || null)} />
                              <button onClick={handleHeroImageUpload} disabled={!heroImageFile || heroImageUploadLoading} className="bg-blue-500 text-white px-2 py-1 rounded ml-2 text-xs">{heroImageUploadLoading ? 'Uploading...' : 'Upload Image'}</button>
                              {heroImageUploadError && <span className="text-red-600 ml-2 text-xs">{heroImageUploadError}</span>}
                            </div>
                            {heroEditMode ? (
                              <button onClick={handleSaveEditHero} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Save</button>
                            ) : (
                              <button onClick={handleAddHero} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Add</button>
                            )}
                            {heroEditMode && <button onClick={() => { setHeroEditMode(false); setHeroEditIdx(null); setHeroForm({ title: '', imageUrl: '', link: '' }); }} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>}
                          </div>
                          {heroActionError && <p className="text-red-600">{heroActionError}</p>}
                          {heroActionLoading && <p>Saving...</p>}
                          <ul>
                            {heroImages.map((img, idx) => (
                              <li key={idx} className="mb-2 flex items-center gap-3">
                                <img src={img.imageUrl} alt={img.title} className="h-12 w-24 object-cover rounded" />
                                <span>{img.title}</span>
                                {img.link && <a href={img.link} className="text-blue-500 underline ml-2" target="_blank" rel="noopener noreferrer">Link</a>}
                                <button onClick={() => handleEditHero(idx)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs ml-2">Edit</button>
                                <button onClick={() => handleDeleteHero(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">Delete</button>
                                <button onClick={() => handleMoveHero(idx, -1)} className="bg-gray-300 px-2 py-1 rounded text-xs ml-2">↑</button>
                                <button onClick={() => handleMoveHero(idx, 1)} className="bg-gray-300 px-2 py-1 rounded text-xs ml-2">↓</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Blog Management</h4>
                          <div className="mb-4">
                            <input className="border rounded px-2 py-1 mr-2" placeholder="Title" value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} />
                            <input className="border rounded px-2 py-1 mr-2" placeholder="Date (YYYY-MM-DD)" value={blogForm.date} onChange={e => setBlogForm(f => ({ ...f, date: e.target.value }))} />
                            <textarea className="border rounded px-2 py-1 mr-2" placeholder="Content" value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} rows={3} />
                            <div className="mb-2 flex items-center">
                              <input type="file" accept="image/*" onChange={e => setBlogImageFile(e.target.files?.[0] || null)} />
                              <button onClick={handleBlogImageUpload} disabled={!blogImageFile || blogImageUploadLoading} className="bg-blue-500 text-white px-2 py-1 rounded ml-2 text-xs">{blogImageUploadLoading ? 'Uploading...' : 'Upload Image'}</button>
                              {blogImageUploadError && <span className="text-red-600 ml-2 text-xs">{blogImageUploadError}</span>}
                              {blogImageUrl && <span className="ml-2 text-xs">Image URL: <code className="bg-gray-100 px-1">{blogImageUrl}</code></span>}
                            </div>
                            {blogEditIdx !== null ? (
                              <button onClick={() => saveBlogPost(true, blogs[blogEditIdx].name)} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Save</button>
                            ) : (
                              <button onClick={() => saveBlogPost(false)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Add</button>
                            )}
                            {blogEditIdx !== null && <button onClick={() => { setBlogEditIdx(null); setBlogForm({ title: '', date: '', content: '' }); }} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>}
                          </div>
                          {blogActionError && <p className="text-red-600">{blogActionError}</p>}
                          {blogActionLoading && <p>Saving...</p>}
                          <ul>
                            {blogs.map((blog, idx) => (
                              <li key={idx} className="mb-2">
                                <span className="font-semibold">{blog.title || blog.name}</span>
                                {blog.date && <span className="ml-2 text-xs text-gray-500">{blog.date}</span>}
                                <button onClick={() => handleEditBlog(idx)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs ml-2">Edit</button>
                                <button onClick={() => deleteBlogPost(blog.name)} className="bg-red-500 text-white px-2 py-1 rounded text-xs ml-2">Delete</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages & Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600">Message management system will be implemented here.</p>
                    <p className="text-sm text-gray-500 mt-2">Features: View all messages, moderate communications, send announcements</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Platform Settings</h3>
                      <div className="border rounded-lg p-4">
                        <p className="text-gray-600">System configuration and settings.</p>
                        <p className="text-sm text-gray-500 mt-2">Features: Email settings, platform fees, vendor verification criteria</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
