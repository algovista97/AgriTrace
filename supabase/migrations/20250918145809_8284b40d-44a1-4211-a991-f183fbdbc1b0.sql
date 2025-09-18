-- Fix security issues by setting proper search_path for functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;