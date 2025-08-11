
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Zap, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appliance {
  id: string;
  name: string;
  wattage: number;
  type: string;
  quantity: number;
  hoursPerDay: number;
  monthlyUnits: number;
}

const LoadCalculation = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalLoad, setTotalLoad] = useState(0);
  const { toast } = useToast();

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Check for leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    
    if (month === 2 && isLeapYear) {
      return 29;
    }
    
    return daysInMonth[month - 1];
  };

  const calculateMonthlyUnits = (wattage: number, quantity: number, hoursPerDay: number) => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    return (wattage * quantity * hoursPerDay * daysInMonth) / 1000;
  };

  const fetchAppliances = async () => {
    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      const appliancesWithDefaults = data.map(appliance => ({
        ...appliance,
        quantity: 0,
        hoursPerDay: 0,
        monthlyUnits: 0
      }));

      setAppliances(appliancesWithDefaults);
    } catch (error) {
      console.error('Error fetching appliances:', error);
      toast({
        title: "Error",
        description: "Failed to load appliances. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppliance = (id: string, field: 'quantity' | 'hoursPerDay', value: number) => {
    setAppliances(prev => prev.map(appliance => {
      if (appliance.id === id) {
        const updated = { ...appliance, [field]: value };
        updated.monthlyUnits = calculateMonthlyUnits(
          updated.wattage,
          updated.quantity,
          updated.hoursPerDay
        );
        return updated;
      }
      return appliance;
    }));
  };

  // Recalculate all when month/year changes
  useEffect(() => {
    setAppliances(prev => prev.map(appliance => ({
      ...appliance,
      monthlyUnits: calculateMonthlyUnits(
        appliance.wattage,
        appliance.quantity,
        appliance.hoursPerDay
      )
    })));
  }, [selectedMonth, selectedYear]);

  // Calculate total load
  useEffect(() => {
    const total = appliances.reduce((sum, appliance) => sum + appliance.monthlyUnits, 0);
    setTotalLoad(total);
  }, [appliances]);

  useEffect(() => {
    fetchAppliances();
  }, []);

  // Group appliances by type
  const groupedAppliances = appliances.reduce((groups, appliance) => {
    const type = appliance.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(appliance);
    return groups;
  }, {} as Record<string, Appliance[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appliances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Electrical Load Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Calculate your monthly electricity consumption based on your appliances usage.
        </p>
      </div>

      {/* Month/Year Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Calculation Period
          </CardTitle>
          <CardDescription>
            Choose the month and year for calculation. Days in month will be calculated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="p-3 bg-blue-50 rounded-lg w-full">
                <p className="text-sm text-gray-600">Days in Month</p>
                <p className="text-xl font-bold text-blue-600">
                  {getDaysInMonth(selectedMonth, selectedYear)} days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appliances by Category */}
      <div className="space-y-6 mb-6">
        {Object.entries(groupedAppliances).map(([type, typeAppliances]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Appliance</th>
                      <th className="text-left py-2 pr-4">Wattage</th>
                      <th className="text-left py-2 pr-4">Quantity</th>
                      <th className="text-left py-2 pr-4">Hours per Day</th>
                      <th className="text-left py-2">Monthly Units (kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeAppliances.map(appliance => (
                      <tr key={appliance.id} className="border-b">
                        <td className="py-3 pr-4 font-medium">{appliance.name}</td>
                        <td className="py-3 pr-4 text-gray-600">{appliance.wattage}W</td>
                        <td className="py-3 pr-4">
                          <Input
                            type="number"
                            min="0"
                            max="999"
                            value={appliance.quantity}
                            onChange={(e) => updateAppliance(appliance.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <Input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={appliance.hoursPerDay}
                            onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                        </td>
                        <td className="py-3 font-semibold text-green-600">
                          {appliance.monthlyUnits.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Load Display */}
      <Card className="sticky bottom-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Total Monthly Consumption</h3>
                <p className="text-gray-600">
                  For {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">{totalLoad.toFixed(2)} kWh</p>
              <p className="text-xl font-bold text-blue-600">{totalLoad.toFixed(2)} Units</p>
              <p className="text-sm text-gray-500">1 kWh = 1 Unit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadCalculation;
