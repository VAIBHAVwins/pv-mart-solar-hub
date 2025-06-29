
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerRequirementFormData, propertyTypes, roofTypes } from '@/types/customerRequirement';

interface PropertyInfoSectionProps {
  formData: CustomerRequirementFormData;
  setFormData: (data: CustomerRequirementFormData) => void;
}

export const PropertyInfoSection = ({ formData, setFormData }: PropertyInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="property_type">Property Type *</Label>
        <Select value={formData.property_type} onValueChange={(value) => setFormData({...formData, property_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="roof_type">Roof Type *</Label>
        <Select value={formData.roof_type} onValueChange={(value) => setFormData({...formData, roof_type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select roof type" />
          </SelectTrigger>
          <SelectContent>
            {roofTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
