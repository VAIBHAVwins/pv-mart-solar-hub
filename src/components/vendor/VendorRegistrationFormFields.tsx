
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export function VendorRegistrationFormFields({ 
  formData, 
  loading, 
  onChange, 
  onSelectChange 
}: VendorRegistrationFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyName" className="text-[#171a21]">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Your company name"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="contactPerson" className="text-[#171a21]">Contact Person</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Primary contact name"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="text-[#171a21]">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Business email"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-[#171a21]">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Business phone"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-[#171a21]">Business Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          className="mt-1 border-[#b07e66] focus:border-[#797a83]"
          placeholder="Complete business address"
          required
          disabled={loading}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      <div>
        <Label htmlFor="pmSuryaGharRegistered" className="text-[#171a21]">Are you Registered under PM Surya Ghar Yojna?</Label>
        <Select 
          value={formData.pmSuryaGharRegistered} 
          onValueChange={(value) => onSelectChange('pmSuryaGharRegistered', value)}
          disabled={loading}
        >
          <SelectTrigger className="mt-1 border-[#b07e66] focus:border-[#797a83]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="YES">YES</SelectItem>
            <SelectItem value="NO">NO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="licenseNumber" className="text-[#171a21]">License Number</Label>
        <Input
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={onChange}
          className="mt-1 border-[#b07e66] focus:border-[#797a83]"
          placeholder="Solar installation license number"
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="password" className="text-[#171a21]">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Create a password"
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-[#171a21]">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="Confirm password"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="serviceAreas" className="text-[#171a21]">Service Areas</Label>
          <Input
            id="serviceAreas"
            name="serviceAreas"
            value={formData.serviceAreas}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="e.g. Delhi, Mumbai, etc."
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="specializations" className="text-[#171a21]">Specializations</Label>
          <Input
            id="specializations"
            name="specializations"
            value={formData.specializations}
            onChange={onChange}
            className="mt-1 border-[#b07e66] focus:border-[#797a83]"
            placeholder="e.g. Rooftop, Commercial, etc."
            required
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}
