
-- Create appliances table for load calculation tool
CREATE TABLE IF NOT EXISTS public.appliances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  wattage INTEGER NOT NULL CHECK (wattage > 0),
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on appliances table
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active appliances
CREATE POLICY "Anyone can view active appliances" ON public.appliances
  FOR SELECT USING (is_active = true);

-- Policy for admin full access
CREATE POLICY "Admins can manage appliances" ON public.appliances
  FOR ALL USING (is_admin());

-- Insert initial appliance data
INSERT INTO public.appliances (name, wattage, type) VALUES
-- Lighting
('CFL Light - 15W', 15, 'Lighting'),
('CFL Light - 20W', 20, 'Lighting'),
('LED Light - 9W', 9, 'Lighting'),
('LED Light - 12W', 12, 'Lighting'),
('Tube Light - 40W', 40, 'Lighting'),
('Fan Light - 60W', 60, 'Lighting'),

-- Fans
('Ceiling Fan', 75, 'Fans'),
('Table Fan', 50, 'Fans'),
('Exhaust Fan', 30, 'Fans'),
('Pedestal Fan', 55, 'Fans'),

-- Kitchen Appliances
('Refrigerator - 165 Litres', 300, 'Kitchen'),
('Refrigerator - 286 Litres', 500, 'Kitchen'),
('Microwave Oven', 1500, 'Kitchen'),
('Electric Kettle', 1500, 'Kitchen'),
('Induction Cooktop', 2000, 'Kitchen'),
('Mixer Grinder', 500, 'Kitchen'),
('Food Processor', 750, 'Kitchen'),
('Rice Cooker', 700, 'Kitchen'),
('Toaster', 800, 'Kitchen'),
('Coffee Maker', 1000, 'Kitchen'),

-- Major Appliances
('Washing Machine - Front Load', 2000, 'Major Appliances'),
('Washing Machine - Top Load', 500, 'Major Appliances'),
('Air Conditioner - 1 Ton', 1500, 'Major Appliances'),
('Air Conditioner - 1.5 Ton', 2200, 'Major Appliances'),
('Air Conditioner - 2 Ton', 3000, 'Major Appliances'),
('Water Heater - 15L', 2000, 'Major Appliances'),
('Water Heater - 25L', 3000, 'Major Appliances'),
('Room Heater', 2000, 'Major Appliances'),

-- Entertainment
('Television - 32 inch LED', 60, 'Entertainment'),
('Television - 42 inch LED', 120, 'Entertainment'),
('Television - 55 inch LED', 200, 'Entertainment'),
('Home Theater System', 300, 'Entertainment'),
('Set Top Box', 15, 'Entertainment'),
('Gaming Console', 150, 'Entertainment'),

-- Computing
('Desktop Computer', 300, 'Computing'),
('Laptop', 65, 'Computing'),
('Printer', 50, 'Computing'),
('Wi-Fi Router', 10, 'Computing'),

-- Others
('Iron', 1000, 'Others'),
('Hair Dryer', 1500, 'Others'),
('Vacuum Cleaner', 1400, 'Others'),
('Water Pump - 0.5 HP', 500, 'Others'),
('Water Pump - 1 HP', 1000, 'Others'),
('Inverter Battery Charger', 100, 'Others'),
('Electric Geyser - Instant', 3000, 'Others'),
('UPS/Inverter', 50, 'Others');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at on appliances table
CREATE TRIGGER update_appliances_updated_at 
    BEFORE UPDATE ON public.appliances 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
