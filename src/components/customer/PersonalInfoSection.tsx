
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerRequirementFormData } from '@/types/customerRequirement';

interface PersonalInfoSectionProps {
  formData: CustomerRequirementFormData;
  setFormData: (data: CustomerRequirementFormData) => void;
}

export const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="customer_name">Full Name *</Label>
        <Input
          id="customer_name"
          value={formData.customer_name}
          onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="customer_phone">Phone Number *</Label>
        <Input
          id="customer_phone"
          value={formData.customer_phone}
          onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
          required
        />
      </div>
    </div>
  );
};
