import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { QrCode, Leaf } from 'lucide-react';

const ProductRegistration = () => {
  const { user, profile } = useAuth();
  const { registerProduct } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    farmLocation: '',
    harvestDate: '',
    qualityGrade: 'A',
    certifications: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateBatchId = () => {
    const prefix = profile?.organization?.slice(0, 3).toUpperCase() || 'AGR';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
  };

  const generateQRCode = (batchId: string) => {
    return `AGRI-${batchId}-${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile?.role !== 'farmer') {
      toast({
        title: "Access Denied",
        description: "Only farmers can register products",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const batchId = generateBatchId();
      const qrCode = generateQRCode(batchId);
      
      // Create blockchain transaction first - for demo, we'll skip this and just create a hash
      const blockchainHash = `0x${Math.random().toString(16).substr(2, 8)}`;

      // Insert product into database
      const { error: productError } = await supabase
        .from('products')
        .insert({
          batch_id: batchId,
          qr_code: qrCode,
          product_name: formData.productName,
          variety: formData.variety,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          farmer_id: user!.id,
          farm_location: formData.farmLocation,
          harvest_date: formData.harvestDate,
          quality_grade: formData.qualityGrade,
          certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()) : [],
          blockchain_hash: blockchainHash
        });

      if (productError) {
        toast({
          title: "Registration Failed",
          description: productError.message,
          variant: "destructive",
        });
        return;
      }

      // Create initial harvest transaction record
      const { error: transactionError } = await supabase
        .from('supply_chain_transactions')
        .insert({
          product_id: (await supabase.from('products').select('id').eq('batch_id', batchId).single()).data?.id,
          to_stakeholder_id: user!.id,
          transaction_type: 'harvest',
          location: formData.farmLocation,
          quality_notes: `Quality Grade: ${formData.qualityGrade}`,
          blockchain_hash: blockchainHash,
          verified: true
        });

      if (transactionError) {
        console.error('Transaction record error:', transactionError);
        // Don't fail the entire operation for this
      }

      toast({
        title: "Success!",
        description: `Product registered with batch ID: ${batchId}`,
      });

      // Reset form
      setFormData({
        productName: '',
        variety: '',
        quantity: '',
        unit: 'kg',
        farmLocation: '',
        harvestDate: '',
        qualityGrade: 'A',
        certifications: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'farmer') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Farmer Access Required</h3>
          <p className="text-muted-foreground">
            Only registered farmers can register new agricultural products.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <QrCode className="h-5 w-5 text-forest mr-2" />
          <div>
            <CardTitle>Register New Product</CardTitle>
            <CardDescription>
              Add a new agricultural product to the blockchain supply chain
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="e.g., Organic Tomatoes"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input
                id="variety"
                value={formData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
                placeholder="e.g., Cherry Tomatoes"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="100"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmLocation">Farm Location *</Label>
            <Input
              id="farmLocation"
              value={formData.farmLocation}
              onChange={(e) => handleInputChange('farmLocation', e.target.value)}
              placeholder="Farm address or GPS coordinates"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date *</Label>
              <Input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qualityGrade">Quality Grade</Label>
              <Select value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">Grade A+ (Premium)</SelectItem>
                  <SelectItem value="A">Grade A (High Quality)</SelectItem>
                  <SelectItem value="B">Grade B (Good Quality)</SelectItem>
                  <SelectItem value="C">Grade C (Standard Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications (Optional)</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              placeholder="Organic, Fair Trade, Non-GMO (comma separated)"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering Product...' : 'Register Product & Generate QR Code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductRegistration;