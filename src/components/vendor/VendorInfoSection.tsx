
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VendorQuotationFormData, installationTypes, systemTypes } from '@/types/vendorQuotation';

interface VendorInfoSectionProps {
  formData: VendorQuotationFormData;
  setFormData: (data: VendorQuotationFormData) => void;
}

export const VendorInfoSection = ({ formData, setFormData }: VendorInfoSectionProps) => {
  return (
    <>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vendor_name">Vendor Name *</Label>
          <Input
            id="vendor_name"
            value={formData.vendor_name}
            onChange={(e) => setFormData({...formData, vendor_name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="vendor_phone">Phone Number</Label>
          <Input
            id="vendor_phone"
            value={formData.vendor_phone}
            onChange={(e) => setFormData({...formData, vendor_phone: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="installation_type">Installation Type *</Label>
          <Select value={formData.installation_type} onValueChange={(value) => setFormData({...formData, installation_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select installation type" />
            </SelectTrigger>
            <SelectContent>
              {installationTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="system_type">System Type *</Label>
          <Select value={formData.system_type} onValueChange={(value) => setFormData({...formData, system_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select system type" />
            </SelectTrigger>
            <SelectContent>
              {systemTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="installation_charge">Installation Charge (₹)</Label>
          <Input
            id="installation_charge"
            type="number"
            value={formData.installation_charge}
            onChange={(e) => setFormData({...formData, installation_charge: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="warranty_years">Warranty (Years)</Label>
          <Input
            id="warranty_years"
            type="number"
            value={formData.warranty_years}
            onChange={(e) => setFormData({...formData, warranty_years: e.target.value})}
          />
        </div>
      </div>
    </>
  );
};
