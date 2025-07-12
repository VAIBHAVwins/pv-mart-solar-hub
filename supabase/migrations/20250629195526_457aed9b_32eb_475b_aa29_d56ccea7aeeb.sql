
-- Create enum for installation types
CREATE TYPE installation_type AS ENUM ('1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', 'custom');

-- Create enum for system types
CREATE TYPE system_type AS ENUM ('on-grid', 'off-grid', 'hybrid');

-- Create enum for component types
CREATE TYPE component_type AS ENUM ('solar_panel', 'inverter', 'battery', 'cable_ac', 'cable_dc', 'mounting_structure', 'earthing', 'lightning_arrestor', 'mc4_connector', 'junction_box', 'other');

-- Create table for vendor quotations
CREATE TABLE public.vendor_quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_email TEXT NOT NULL,
  vendor_phone TEXT,
  installation_type installation_type NOT NULL,
  system_type system_type NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  installation_charge DECIMAL(10,2),
  warranty_years INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for quotation components
CREATE TABLE public.quotation_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES public.vendor_quotations(id) ON DELETE CASCADE NOT NULL,
  component_type component_type NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  specifications TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  included_length_meters INTEGER, -- for cables
  warranty_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for customer requirements
CREATE TABLE public.customer_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  installation_type installation_type NOT NULL,
  system_type system_type NOT NULL,
  property_type TEXT NOT NULL,
  roof_type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  monthly_bill DECIMAL(10,2),
  timeline TEXT,
  budget_range TEXT,
  additional_requirements TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requirements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_quotations
CREATE POLICY "Vendors can view their own quotations" 
  ON public.vendor_quotations 
  FOR SELECT 
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can create their own quotations" 
  ON public.vendor_quotations 
  FOR INSERT 
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own quotations" 
  ON public.vendor_quotations 
  FOR UPDATE 
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own quotations" 
  ON public.vendor_quotations 
  FOR DELETE 
  USING (auth.uid() = vendor_id);

-- RLS Policies for quotation_components
CREATE POLICY "Vendors can view their quotation components" 
  ON public.quotation_components 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.vendor_quotations 
    WHERE id = quotation_components.quotation_id 
    AND vendor_id = auth.uid()
  ));

CREATE POLICY "Vendors can create quotation components" 
  ON public.quotation_components 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vendor_quotations 
    WHERE id = quotation_components.quotation_id 
    AND vendor_id = auth.uid()
  ));

CREATE POLICY "Vendors can update their quotation components" 
  ON public.quotation_components 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.vendor_quotations 
    WHERE id = quotation_components.quotation_id 
    AND vendor_id = auth.uid()
  ));

CREATE POLICY "Vendors can delete their quotation components" 
  ON public.quotation_components 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.vendor_quotations 
    WHERE id = quotation_components.quotation_id 
    AND vendor_id = auth.uid()
  ));

-- RLS Policies for customer_requirements
CREATE POLICY "Customers can view their own requirements" 
  ON public.customer_requirements 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create their own requirements" 
  ON public.customer_requirements 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own requirements" 
  ON public.customer_requirements 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can delete their own requirements" 
  ON public.customer_requirements 
  FOR DELETE 
  USING (auth.uid() = customer_id);

-- Allow vendors to view customer requirements (for matching purposes)
CREATE POLICY "Vendors can view customer requirements" 
  ON public.customer_requirements 
  FOR SELECT 
  TO authenticated
  USING (true);
