'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { toast } from '@/components/ui/toast/use-toast';

// Define TradingSignal type since it's missing in lib/types
type TradingSignal = {
  id: string;
  title: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  entry: string;
  takeProfit: string;
  stopLoss: string;
  confidence: 'High' | 'Medium' | 'Low';
  description?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  // Optional image property
  imageUrl?: string;
};

export default function SignalsManagementPage() {
  const { data: session, status } = useSession();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<TradingSignal>>({
    title: '',
    symbol: '',
    action: 'BUY',
    entry: '',
    takeProfit: '',
    stopLoss: '',
    confidence: 'Medium',
    description: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login');
    }
    
    if (session?.user && (session.user.role === 'ADMIN_L1' || session.user.role === 'ADMIN_L2' || session.user.role === 'OWNER')) {
      fetchSignals();
    } else {
      redirect('/');
    }
  }, [session, status]);

  const fetchSignals = async () => {
    try {
      const response = await fetch('/api/admin/signals');
      if (!response.ok) throw new Error('Failed to fetch signals');
      const data = await response.json();
      setSignals(data);
    } catch (error) {
      console.error('Error fetching signals:', error);
      setError('Failed to load signals');
      toast({ title: 'Error', description: 'Failed to load signals', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) formPayload.append(key, value.toString());
      });
      if (selectedFile) formPayload.append('image', selectedFile);

      const response = await fetch('/api/admin/signals', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Failed to save signal');

      toast({ title: 'Success', description: 'Signal saved successfully' });
      setFormData({
        title: '',
        symbol: '',
        action: 'BUY',
        entry: '',
        takeProfit: '',
        stopLoss: '',
        confidence: 'Medium',
        description: '',
        content: '',
      });
      setSelectedFile(null);
      fetchSignals();
    } catch (error) {
      console.error('Error saving signal:', error);
      setError('Failed to save signal');
      toast({ title: 'Error', description: 'Failed to save signal', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Trading Signals Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Signal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Symbol</label>
                  <Input
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Action</label>
<Select 
  value={formData.action}
  onValueChange={value => setFormData(prev => ({ ...prev, action: value as 'BUY' | 'SELL' | 'HOLD' }))}
>
  <Select.Trigger>
    <Select.Value placeholder="Select action" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="BUY">Buy</Select.Item>
    <Select.Item value="SELL">Sell</Select.Item>
    <Select.Item value="HOLD">Hold</Select.Item>
  </Select.Content>
</Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Entry</label>
                  <Input
                    name="entry"
                    value={formData.entry}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Take Profit</label>
                  <Input
                    name="takeProfit"
                    value={formData.takeProfit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Stop Loss</label>
                  <Input
                    name="stopLoss"
                    value={formData.stopLoss}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1">Confidence</label>
<Select 
  value={formData.confidence}
  onValueChange={value => setFormData(prev => ({ ...prev, confidence: value as 'High' | 'Medium' | 'Low' }))}
>
  <Select.Trigger>
    <Select.Value placeholder="Select confidence" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="High">High</Select.Item>
    <Select.Item value="Medium">Medium</Select.Item>
    <Select.Item value="Low">Low</Select.Item>
  </Select.Content>
</Select>
              </div>
              
              <div>
                <label className="block mb-1">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block mb-1">Detailed Content</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Image (Optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Create Signal'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Signals</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                {error}
              </div>
            )}
            {signals.length === 0 ? (
              <p>No signals found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-left">Symbol</th>
                      <th className="p-2 text-left">Action</th>
                      <th className="p-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map(signal => (
                      <tr key={signal.id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{signal.title}</td>
                        <td className="p-2">{signal.symbol}</td>
                        <td className="p-2">{signal.action}</td>
                        <td className="p-2">{new Date(signal.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
