
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CustomerRequirementFormData, timelines, budgetRanges } from '@/types/customerRequirement';

interface AdditionalInfoSectionProps {
  formData: CustomerRequirementFormData;
  setFormData: (data: CustomerRequirementFormData) => void;
}

export const AdditionalInfoSection = ({ formData, setFormData }: AdditionalInfoSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthly_bill">Current Monthly Electricity Bill (₹)</Label>
          <Input
            id="monthly_bill"
            type="number"
            value={formData.monthly_bill}
            onChange={(e) => setFormData({...formData, monthly_bill: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="timeline">Preferred Timeline</Label>
          <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map(timeline => (
                <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="budget_range">Budget Range</Label>
        <Select value={formData.budget_range} onValueChange={(value) => setFormData({...formData, budget_range: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="additional_requirements">Additional Requirements</Label>
        <Textarea
          id="additional_requirements"
          value={formData.additional_requirements}
          onChange={(e) => setFormData({...formData, additional_requirements: e.target.value})}
          rows={3}
          placeholder="Any specific requirements, preferences, or questions..."
        />
      </div>
    </>
  );
};
