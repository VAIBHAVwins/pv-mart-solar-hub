
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerRequirementFormData, installationTypes, systemTypes } from '@/types/customerRequirement';

interface SystemRequirementsSectionProps {
  formData: CustomerRequirementFormData;
  setFormData: (data: CustomerRequirementFormData) => void;
}

export const SystemRequirementsSection = ({ formData, setFormData }: SystemRequirementsSectionProps) => {
  return (
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
  );
};
