
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateRequirementId } from '@/lib/id-generators';
import { indianStates, getDistrictsByState, electricityProviders } from '@/data/indian-locations';
import { toast } from 'sonner';
import { Upload, CheckCircle } from 'lucide-react';

interface RequirementFormData {
  requirementId: string;
  installationAddress: string;
  latitude: string;
  longitude: string;
  state: string;
  district: string;
  rooftopArea: number;
  electricityProvider: string;
  consumerId: string;
  highestMonthlyBill: number;
  billFile: File | null;
}

const CustomerRequirementForm: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState<RequirementFormData>({
    requirementId: '',
    installationAddress: '',
    latitude: '',
    longitude: '',
    state: '',
    district: '',
    rooftopArea: 0,
    electricityProvider: '',
    consumerId: '',
    highestMonthlyBill: 0,
    billFile: null
  });

  const [userProfile, setUserProfile] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requirementId: generateRequirementId()
    }));

    // Fetch user profile
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsByState(formData.state);
      setDistricts(stateDistricts);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  }, [formData.state]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, billFile: file }));
      setFileUploaded(true);
      toast.success('PDF uploaded successfully!');
    }
  };

  const uploadBillFile = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('customer-bills')
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) {
      toast.error('You must be logged in to submit a requirement');
      return;
    }

    setLoading(true);
    try {
      let billPdfPath: string | null = null;

      // Upload file if provided
      if (formData.billFile) {
        billPdfPath = await uploadBillFile(formData.billFile, user.id);
        if (!billPdfPath) {
          toast.error('Failed to upload bill file');
          setLoading(false);
          return;
        }
      }

      // Insert requirement
      const { error } = await supabase
        .from('customer_requirements_new')
        .insert({
          requirement_id: formData.requirementId,
          customer_id: user.id,
          customer_name: userProfile.full_name,
          customer_email: userProfile.email,
          customer_phone: userProfile.phone,
          installation_address: formData.installationAddress,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          state: formData.state,
          district: formData.district,
          rooftop_area: formData.rooftopArea || null,
          electricity_provider: formData.electricityProvider,
          consumer_id: formData.consumerId,
          highest_monthly_bill: formData.highestMonthlyBill,
          bill_pdf_path: billPdfPath
        });

      if (error) throw error;

      toast.success(`Requirement ${formData.requirementId} submitted successfully!`);
      
      // Reset form
      setFormData({
        requirementId: generateRequirementId(),
        installationAddress: '',
        latitude: '',
        longitude: '',
        state: '',
        district: '',
        rooftopArea: 0,
        electricityProvider: '',
        consumerId: '',
        highestMonthlyBill: 0,
        billFile: null
      });
      setFileUploaded(false);
      setDistricts([]);

      // Reset file input
      const fileInput = document.getElementById('billUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error submitting requirement:', error);
      toast.error('Failed to submit requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p>Please log in to access the requirement form.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center bg-blue-600 text-white">
            <CardTitle className="text-2xl">Customer Requirement Form</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Information */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Form Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requirementId">Requirement Form ID</Label>
                    <Input
                      id="requirementId"
                      value={formData.requirementId}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerName">Full Name</Label>
                    <Input
                      id="customerName"
                      value={userProfile.full_name || ''}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email Address</Label>
                    <Input
                      id="customerEmail"
                      value={userProfile.email || ''}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Mobile Number</Label>
                    <Input
                      id="customerPhone"
                      value={userProfile.phone || ''}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="installationAddress">Full Installation Address *</Label>
                    <Textarea
                      id="installationAddress"
                      value={formData.installationAddress}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        installationAddress: e.target.value
                      }))}
                      placeholder="Enter complete installation address..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude (Optional)</Label>
                      <Input
                        id="latitude"
                        value={formData.latitude}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          latitude: e.target.value
                        }))}
                        placeholder="e.g., 25.6103"
                      />
                    </div>

                    <div>
                      <Label htmlFor="longitude">Longitude (Optional)</Label>
                      <Input
                        id="longitude"
                        value={formData.longitude}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          longitude: e.target.value
                        }))}
                        placeholder="e.g., 85.1414"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={formData.state}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          state: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map(state => (
                            <SelectItem key={state.code} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Select 
                        value={formData.district}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          district: value
                        }))}
                        disabled={!formData.state}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(district => (
                            <SelectItem key={district.name} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Site Information */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Site Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rooftopArea">Available Rooftop Area (sq. ft.) (Optional)</Label>
                    <Input
                      id="rooftopArea"
                      type="number"
                      min="0"
                      value={formData.rooftopArea || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rooftopArea: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="electricityProvider">Electricity Board / Provider *</Label>
                    <Select 
                      value={formData.electricityProvider}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        electricityProvider: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {electricityProviders.map(provider => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consumerId">Electricity Consumer ID Number *</Label>
                      <Input
                        id="consumerId"
                        value={formData.consumerId}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          consumerId: e.target.value
                        }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="highestMonthlyBill">Highest Monthly Electricity Bill Paid (₹) *</Label>
                      <Input
                        id="highestMonthlyBill"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.highestMonthlyBill || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          highestMonthlyBill: parseFloat(e.target.value) || 0
                        }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billUpload">Upload Most Recent Electricity Bill (PDF ≤ 5MB)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="billUpload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {fileUploaded && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {fileUploaded && (
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        PDF uploaded successfully!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Submitting...' : 'Submit Requirement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerRequirementForm;
