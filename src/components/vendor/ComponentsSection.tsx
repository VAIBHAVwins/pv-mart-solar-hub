import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { Component, componentTypes } from '@/types/vendorQuotation';

interface ComponentsSectionProps {
  components: Component[];
  addComponent: () => void;
  removeComponent: (index: number) => void;
  updateComponent: (index: number, field: string, value: any) => void;
}

export const ComponentsSection = ({ 
  components, 
  addComponent, 
  removeComponent, 
  updateComponent 
}: ComponentsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#797a83]">Components</h3>
        <Button type="button" onClick={addComponent} className="bg-[#b07e66] hover:bg-[#797a83]">
          <Plus className="w-4 h-4 mr-2" /> Add Component
        </Button>
      </div>
      
      {components.map((component, index) => (
        <Card key={index} className="border-[#b07e66]">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Component Type *</Label>
                <Select value={component.component_type} onValueChange={(value) => updateComponent(index, 'component_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand *</Label>
                <Input
                  value={component.brand}
                  onChange={(e) => updateComponent(index, 'brand', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={component.model}
                  onChange={(e) => updateComponent(index, 'model', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={component.quantity}
                  onChange={(e) => updateComponent(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label>Unit Price (₹) *</Label>
                <Input
                  type="number"
                  value={component.unit_price}
                  onChange={(e) => updateComponent(index, 'unit_price', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label>Length (meters)</Label>
                <Input
                  type="number"
                  value={component.included_length_meters || ''}
                  onChange={(e) => updateComponent(index, 'included_length_meters', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              <div>
                <Label>Warranty (Years)</Label>
                <Input
                  type="number"
                  value={component.warranty_years || ''}
                  onChange={(e) => updateComponent(index, 'warranty_years', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Specifications</Label>
              <Textarea
                value={component.specifications}
                onChange={(e) => updateComponent(index, 'specifications', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#797a83]">
                Total: ₹{(component.unit_price * component.quantity).toFixed(2)}
              </span>
              {components.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeComponent(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
