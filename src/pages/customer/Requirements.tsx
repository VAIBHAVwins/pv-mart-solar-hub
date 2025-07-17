import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Calendar, MapPin, Zap, DollarSign, Clock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface CustomerRequirement {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  property_type: string;
  roof_type: string;
  rooftop_area: string | null;
  monthly_bill: number | null;
  installation_type: string;
  system_type: string;
  budget_range: string | null;
  timeline: string | null;
  additional_requirements: string | null;
  status: string | null;
  created_at: string;
}

const CustomerRequirements = () => {
  const [requirements, setRequirements] = useState<CustomerRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ full_name?: string }>({});
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserProfile(userData);
        }

        // Fetch customer requirements
        const { data, error } = await supabase
          .from('customer_requirements')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequirements(data || []);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please log in to view your requirements.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile.full_name || 'Customer'}!
          </h1>
          <p className="text-gray-600">Track and manage your solar system requirements</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : requirements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't submitted any solar system requirements yet.
              </p>
              <Button asChild>
                <a href="/customer/requirement-form">Submit Your First Requirement</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requirements.map((requirement) => (
              <Card key={requirement.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {requirement.installation_type} Solar System
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted on {new Date(requirement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(requirement.status)}>
                      {requirement.status || 'pending'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Location Info */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Installation Location</h4>
                      <p className="text-gray-600 text-sm">
                        {requirement.address}, {requirement.city}, {requirement.state} - {requirement.pincode}
                      </p>
                    </div>
                  </div>

                  {/* System Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">System Type</p>
                        <p className="text-sm text-gray-600">{requirement.system_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Monthly Bill</p>
                        <p className="text-sm text-gray-600">
                          {requirement.monthly_bill ? `₹${requirement.monthly_bill}` : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {requirement.budget_range && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Budget Range</p>
                          <p className="text-sm text-gray-600">{requirement.budget_range}</p>
                        </div>
                      </div>
                    )}

                    {requirement.timeline && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Timeline</p>
                          <p className="text-sm text-gray-600">{requirement.timeline}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Property Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Property Type</p>
                        <p className="text-gray-900">{requirement.property_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Roof Type</p>
                        <p className="text-gray-900">{requirement.roof_type}</p>
                      </div>
                      {requirement.rooftop_area && (
                        <div>
                          <p className="text-gray-500">Rooftop Area</p>
                          <p className="text-gray-900">{requirement.rooftop_area}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  {requirement.additional_requirements && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Requirements</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                        {requirement.additional_requirements}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>ID: {requirement.id.slice(0, 8)}...</span>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        View Quotations
                      </Button>
                      <Button size="sm">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerRequirements;
