-- Fix RLS issues step by step

-- Step 1: Drop all policies that reference user_id column in profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Farmers can create products" ON public.products;
DROP POLICY IF EXISTS "Farmers can update their products" ON public.products;
DROP POLICY IF EXISTS "Stakeholders can create transactions" ON public.supply_chain_transactions;

-- Step 2: Update profiles table structure to use id as foreign key to auth.users
ALTER TABLE public.profiles DROP COLUMN user_id;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 3: Create new RLS policies for profiles using id instead of user_id
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Step 4: Recreate products table policies with correct reference
CREATE POLICY "Farmers can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  auth.uid() = farmer_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'farmer'
  )
);

CREATE POLICY "Farmers can update their products" 
ON public.products 
FOR UPDATE 
USING (
  auth.uid() = farmer_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'farmer'
  )
);

-- Step 5: Add policy for distributors and retailers to update product status
CREATE POLICY "Distributors and retailers can update product status" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('distributor', 'retailer')
  )
);

-- Step 6: Recreate supply chain transaction policies
CREATE POLICY "Authenticated users can create transactions" 
ON public.supply_chain_transactions 
FOR INSERT 
WITH CHECK (
  auth.uid() = to_stakeholder_id OR 
  auth.uid() = from_stakeholder_id OR
  -- Allow farmers to create harvest transactions
  (transaction_type = 'harvest' AND EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.profiles pr ON p.farmer_id = pr.id
    WHERE p.id = product_id AND pr.id = auth.uid() AND pr.role = 'farmer'
  ))
);

-- Step 7: Add UPDATE policy for supply chain transactions
CREATE POLICY "Stakeholders can update their transactions" 
ON public.supply_chain_transactions 
FOR UPDATE 
USING (
  auth.uid() = to_stakeholder_id OR 
  auth.uid() = from_stakeholder_id
);

-- Step 8: Create trigger to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'consumer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();