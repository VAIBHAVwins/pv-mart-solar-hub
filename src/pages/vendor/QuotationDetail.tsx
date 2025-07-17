import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Quotation {
  id: string;
  installation_type: string;
  system_type: string;
  total_price: number;
  installation_charge: number;
  warranty_years: number;
  description: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
}

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Quotation>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('vendor_quotations')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setQuotation(data);
        setForm(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    await supabase.from('vendor_quotations').update(form).eq('id', id);
    setEditMode(false);
    setLoading(false);
    // Optionally refetch
    supabase
      .from('vendor_quotations')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setQuotation(data);
        setForm(data);
      });
  };

  if (loading || !quotation) return <div className="text-center py-20">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Quotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input name="vendor_name" value={form.vendor_name || ''} onChange={handleChange} disabled={!editMode} placeholder="Vendor Name" />
          <Input name="vendor_email" value={form.vendor_email || ''} onChange={handleChange} disabled={!editMode} placeholder="Email" />
          <Input name="vendor_phone" value={form.vendor_phone || ''} onChange={handleChange} disabled={!editMode} placeholder="Phone" />
          <Input name="installation_type" value={form.installation_type || ''} onChange={handleChange} disabled={!editMode} placeholder="KW" />
          <Input name="system_type" value={form.system_type || ''} onChange={handleChange} disabled={!editMode} placeholder="Grid Type" />
          <Input name="total_price" value={form.total_price || ''} onChange={handleChange} disabled={!editMode} placeholder="Total Price" />
          <Input name="installation_charge" value={form.installation_charge || ''} onChange={handleChange} disabled={!editMode} placeholder="Installation Charge" />
          <Input name="warranty_years" value={form.warranty_years || ''} onChange={handleChange} disabled={!editMode} placeholder="Warranty Years" />
          <Input name="description" value={form.description || ''} onChange={handleChange} disabled={!editMode} placeholder="Description" />
        </form>
        <div className="flex gap-2 mt-4">
          {!editMode && <Button onClick={() => setEditMode(true)}>Edit</Button>}
          {editMode && <Button onClick={handleSave}>Save</Button>}
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationDetail; 