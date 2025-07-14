
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { locationData } from '@/lib/locationData';

interface VendorRegistrationFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  pmSuryaGharRegistered: string;
  licenseNumber: string;
  serviceAreas: string;
  specializations: string;
  password: string;
  confirmPassword: string;
}

interface VendorRegistrationFormFieldsProps {
  formData: VendorRegistrationFormData;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
}

const VendorRegistrationFormFields = ({ formData, loading, onChange, onSelectChange }: VendorRegistrationFormFieldsProps) => {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    setStates(Object.keys(locationData));
  }, []);

  useEffect(() => {
    if (selectedState && locationData[selectedState]) {
      setDistricts(locationData[selectedState]);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Create a synthetic input event for the parent handler
    const syntheticEvent = {
      target: { name, value }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <>
      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Company Name *
          </label>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            placeholder="Enter your company name"
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Contact Person *
          </label>
          <Input
            name="contactPerson"
            value={formData.contactPerson}
            onChange={onChange}
            placeholder="Enter contact person name"
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Email Address *
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Enter your email"
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Phone Number *
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="Enter your phone number"
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>

      {/* Business Address */}
      <div>
        <label className="block text-sm font-medium text-[#4f4f56] mb-2">
          Business Address *
        </label>
        <Textarea
          name="address"
          value={formData.address}
          onChange={handleTextareaChange}
          placeholder="Enter your complete business address"
          disabled={loading}
          className="w-full min-h-[100px] resize-none"
          style={{ whiteSpace: 'pre-wrap' }}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation();
            }
          }}
        />
      </div>

      {/* PM Surya Ghar Registration */}
      <div>
        <label className="block text-sm font-medium text-[#4f4f56] mb-2">
          Are you Registered under PM Surya Ghar Yojna? *
        </label>
        <Select 
          value={formData.pmSuryaGharRegistered} 
          onValueChange={(value) => onSelectChange('pmSuryaGharRegistered', value)}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">YES</SelectItem>
            <SelectItem value="no">NO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* License Number */}
      <div>
        <label className="block text-sm font-medium text-[#4f4f56] mb-2">
          License Number
        </label>
        <Input
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={onChange}
          placeholder="Enter your license number (if any)"
          disabled={loading}
          className="w-full"
        />
      </div>

      {/* Service Areas */}
      <div>
        <label className="block text-sm font-medium text-[#4f4f56] mb-2">
          Service Areas *
        </label>
        <Textarea
          name="serviceAreas"
          value={formData.serviceAreas}
          onChange={handleTextareaChange}
          placeholder="List the areas where you provide services (cities, districts, states)"
          disabled={loading}
          className="w-full min-h-[100px] resize-none"
        />
      </div>

      {/* Specializations */}
      <div>
        <label className="block text-sm font-medium text-[#4f4f56] mb-2">
          Specializations *
        </label>
        <Textarea
          name="specializations"
          value={formData.specializations}
          onChange={handleTextareaChange}
          placeholder="Describe your specializations and services"
          disabled={loading}
          className="w-full min-h-[100px] resize-none"
        />
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Password *
          </label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Create a password"
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4f4f56] mb-2">
            Confirm Password *
          </label>
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="Confirm your password"
            disabled={loading}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default VendorRegistrationFormFields;
