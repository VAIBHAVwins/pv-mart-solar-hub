-- Create blogs table for blog management system
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category VARCHAR(100),
  tags TEXT[], -- Array of tags
  author VARCHAR(100) DEFAULT 'PV Mart Team',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_pinned ON blogs(is_pinned);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for blogs table to allow admin operations
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Insert existing static blogs
INSERT INTO blogs (title, slug, excerpt, content, featured_image_url, category, tags, author, status, is_pinned, published_at) VALUES
(
  'Understanding Solar Panel Efficiency: What You Need to Know',
  'understanding-solar-panel-efficiency',
  'Learn about solar panel efficiency and how to maximize your solar investment.',
  '<h2>What is Solar Panel Efficiency?</h2>
<p>Solar panel efficiency refers to the percentage of sunlight that a solar panel can convert into usable electricity. Modern solar panels typically have efficiency ratings between 15% and 22%, with premium panels reaching even higher efficiencies.</p>

<h2>Factors Affecting Solar Panel Efficiency</h2>
<p>Several factors influence the efficiency of solar panels:</p>
<ul>
  <li><strong>Temperature:</strong> High temperatures can reduce panel efficiency</li>
  <li><strong>Shading:</strong> Even partial shading can significantly impact performance</li>
  <li><strong>Angle and Orientation:</strong> Proper positioning maximizes energy capture</li>
  <li><strong>Panel Quality:</strong> Higher-grade materials typically offer better efficiency</li>
</ul>

<h2>How to Maximize Your Solar Panel Efficiency</h2>
<p>To get the most out of your solar installation, consider these best practices:</p>
<ol>
  <li>Regular cleaning and maintenance</li>
  <li>Proper installation angle (typically 30-45 degrees)</li>
  <li>Avoiding shading from trees or buildings</li>
  <li>Using high-quality inverters and components</li>
</ol>',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop',
  'Technology',
  ARRAY['efficiency', 'solar panels', 'technology'],
  'PV Mart Team',
  'published',
  false,
  '2024-01-15 00:00:00+00'
),
(
  'Government Subsidies for Solar Installation in India 2024',
  'government-subsidies-solar-installation-india-2024',
  'Complete guide to available government subsidies and incentives for solar installations.',
  '<h2>Overview of Solar Subsidies in India</h2>
<p>The Indian government offers various subsidies and incentives to promote solar energy adoption across residential, commercial, and industrial sectors.</p>

<h2>Key Subsidy Programs</h2>
<ul>
  <li><strong>PM-KUSUM:</strong> Subsidy for solar pumps and grid-connected solar power plants</li>
  <li><strong>Rooftop Solar:</strong> Central Financial Assistance (CFA) for residential installations</li>
  <li><strong>Solar Cities:</strong> Support for developing solar cities</li>
</ul>

<h2>Eligibility Criteria</h2>
<p>To qualify for solar subsidies:</p>
<ol>
  <li>Must be an Indian citizen</li>
  <li>Property should be owned by the applicant</li>
  <li>Should meet technical specifications</li>
  <li>Must use approved vendors and equipment</li>
</ol>',
  'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=250&fit=crop',
  'Policy',
  ARRAY['subsidies', 'government', 'policy', 'india'],
  'PV Mart Team',
  'published',
  false,
  '2024-01-10 00:00:00+00'
),
(
  'Maintenance Tips for Your Solar Power System',
  'maintenance-tips-solar-power-system',
  'Essential maintenance practices to keep your solar panels running at peak efficiency.',
  '<h2>Regular Cleaning Schedule</h2>
<p>Keeping your solar panels clean is crucial for optimal performance. Dust, dirt, and bird droppings can significantly reduce efficiency.</p>

<h2>Professional Inspection</h2>
<p>Schedule annual professional inspections to:</p>
<ul>
  <li>Check for physical damage</li>
  <li>Verify electrical connections</li>
  <li>Monitor system performance</li>
  <li>Update firmware if needed</li>
</ul>

<h2>DIY Maintenance Tasks</h2>
<p>Homeowners can perform these maintenance tasks:</p>
<ol>
  <li>Visual inspection for damage</li>
  <li>Basic cleaning with water and soft brush</li>
  <li>Monitoring system output</li>
  <li>Keeping vegetation trimmed</li>
</ol>',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop',
  'Maintenance',
  ARRAY['maintenance', 'cleaning', 'inspection', 'care'],
  'PV Mart Team',
  'published',
  false,
  '2024-01-05 00:00:00+00'
),
(
  'ROI Analysis: How Long Does It Take to Recover Solar Investment?',
  'roi-analysis-solar-investment-recovery',
  'Detailed analysis of return on investment for different types of solar installations.',
  '<h2>Understanding Solar ROI</h2>
<p>Return on Investment (ROI) for solar installations typically ranges from 3-8 years, depending on various factors.</p>

<h2>Factors Affecting ROI</h2>
<ul>
  <li><strong>Installation Cost:</strong> Initial investment amount</li>
  <li><strong>Energy Savings:</strong> Monthly electricity bill reduction</li>
  <li><strong>Government Incentives:</strong> Subsidies and tax benefits</li>
  <li><strong>System Efficiency:</strong> Energy production capacity</li>
</ul>

<h2>ROI Calculation Example</h2>
<p>For a typical residential installation:</p>
<ol>
  <li>Installation Cost: ₹3,00,000</li>
  <li>Annual Savings: ₹45,000</li>
  <li>Subsidy: ₹60,000</li>
  <li>Net Investment: ₹2,40,000</li>
  <li>ROI Period: 5.3 years</li>
</ol>',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop',
  'Finance',
  ARRAY['roi', 'investment', 'finance', 'savings'],
  'PV Mart Team',
  'published',
  false,
  '2023-12-28 00:00:00+00'
),
(
  'Choosing the Right Solar Installer: A Complete Guide',
  'choosing-right-solar-installer-complete-guide',
  'Key factors to consider when selecting a solar installation company for your project.',
  '<h2>Essential Criteria for Selection</h2>
<p>Choosing the right solar installer is crucial for a successful installation and long-term performance.</p>

<h2>What to Look For</h2>
<ul>
  <li><strong>Certifications:</strong> BIS, MNRE, and industry certifications</li>
  <li><strong>Experience:</strong> Years in business and number of installations</li>
  <li><strong>Warranty:</strong> Product and workmanship warranties</li>
  <li><strong>References:</strong> Customer testimonials and reviews</li>
</ul>

<h2>Questions to Ask</h2>
<p>Before hiring an installer, ask:</p>
<ol>
  <li>What certifications do you hold?</li>
  <li>How many installations have you completed?</li>
  <li>What warranty do you provide?</li>
  <li>Can you provide references?</li>
  <li>What is your maintenance policy?</li>
</ol>',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
  'Guide',
  ARRAY['installer', 'selection', 'guide', 'certification'],
  'PV Mart Team',
  'published',
  false,
  '2023-12-20 00:00:00+00'
),
(
  'Net Metering Explained: How to Sell Solar Power Back to Grid',
  'net-metering-explained-sell-solar-power-grid',
  'Understanding net metering policies and how to maximize your solar investment benefits.',
  '<h2>What is Net Metering?</h2>
<p>Net metering allows solar system owners to sell excess electricity back to the grid, earning credits on their electricity bills.</p>

<h2>How Net Metering Works</h2>
<ul>
  <li><strong>Excess Generation:</strong> Solar panels produce more than needed</li>
  <li><strong>Grid Export:</strong> Excess power goes to the grid</li>
  <li><strong>Credit System:</strong> Earn credits for exported power</li>
  <li><strong>Bill Reduction:</strong> Credits offset future electricity bills</li>
</ul>

<h2>Benefits of Net Metering</h2>
<p>Net metering provides several advantages:</p>
<ol>
  <li>Reduces electricity bills</li>
  <li>Maximizes solar investment returns</li>
  <li>Supports grid stability</li>
  <li>Promotes renewable energy adoption</li>
</ol>',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=250&fit=crop',
  'Policy',
  ARRAY['net metering', 'grid', 'policy', 'credits'],
  'PV Mart Team',
  'published',
  false,
  '2023-12-15 00:00:00+00'
); 