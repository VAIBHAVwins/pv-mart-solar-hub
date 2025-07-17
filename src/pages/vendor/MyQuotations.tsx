import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Quotation {
  id: string;
  installation_type: string;
  system_type: string;
}

const MyQuotations = () => {
  const { user } = useSupabaseAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('vendor_quotations')
      .select('id, installation_type, system_type')
      .eq('vendor_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setQuotations(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>My Quotations</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>KW</th>
              <th>Grid Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, idx) => (
              <tr key={q.id}>
                <td>{idx + 1}</td>
                <td>{q.installation_type}</td>
                <td>{q.system_type}</td>
                <td>
                  <Button size="sm" onClick={() => navigate(`/vendor/my-quotations/${q.id}`)}>View</Button>
                </td>
              </tr>
            ))}
            {(!loading && quotations.length === 0) && (
              <tr><td colSpan={4} className="text-center py-4">No quotations found.</td></tr>
            )}
          </tbody>
        </table>
        {loading && <div className="text-center py-4">Loading...</div>}
      </CardContent>
    </Card>
  );
};

export default MyQuotations; 