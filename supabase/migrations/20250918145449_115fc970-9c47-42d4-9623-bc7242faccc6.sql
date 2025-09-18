-- Create user profiles table for stakeholder management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'distributor', 'retailer', 'consumer')),
  organization TEXT,
  location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create products table for agricultural produce
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id TEXT NOT NULL UNIQUE,
  qr_code TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  variety TEXT,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  farmer_id UUID NOT NULL,
  farm_location TEXT NOT NULL,
  harvest_date DATE NOT NULL,
  quality_grade TEXT,
  certifications JSONB DEFAULT '[]',
  blockchain_hash TEXT,
  status TEXT NOT NULL DEFAULT 'harvested' CHECK (status IN ('harvested', 'in_transit', 'at_distributor', 'at_retailer', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Everyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Farmers can create products" ON public.products
  FOR INSERT WITH CHECK (
    auth.uid()::text = farmer_id::text AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'farmer')
  );

CREATE POLICY "Farmers can update their products" ON public.products
  FOR UPDATE USING (
    auth.uid()::text = farmer_id::text AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'farmer')
  );

-- Create supply chain transactions table
CREATE TABLE public.supply_chain_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  from_stakeholder_id UUID,
  to_stakeholder_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('harvest', 'transfer', 'quality_check', 'storage', 'transport', 'sale')),
  location TEXT NOT NULL,
  temperature DECIMAL,
  humidity DECIMAL,
  storage_conditions TEXT,
  quality_notes TEXT,
  blockchain_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified BOOLEAN DEFAULT false,
  verification_signature TEXT
);

-- Enable RLS
ALTER TABLE public.supply_chain_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Everyone can view transactions" ON public.supply_chain_transactions
  FOR SELECT USING (true);

CREATE POLICY "Stakeholders can create transactions" ON public.supply_chain_transactions
  FOR INSERT WITH CHECK (
    auth.uid()::text = to_stakeholder_id::text OR 
    auth.uid()::text = from_stakeholder_id::text
  );

-- Create function to update product status based on transactions
CREATE OR REPLACE FUNCTION public.update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product status based on transaction type
  UPDATE public.products 
  SET status = CASE 
    WHEN NEW.transaction_type = 'transfer' AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id::text = NEW.to_stakeholder_id::text AND role = 'distributor'
    ) THEN 'at_distributor'
    WHEN NEW.transaction_type = 'transfer' AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id::text = NEW.to_stakeholder_id::text AND role = 'retailer'
    ) THEN 'at_retailer'
    WHEN NEW.transaction_type = 'transport' THEN 'in_transit'
    WHEN NEW.transaction_type = 'sale' THEN 'sold'
    ELSE status
  END,
  updated_at = now()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status updates
CREATE TRIGGER update_product_status_trigger
  AFTER INSERT ON public.supply_chain_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_status();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();