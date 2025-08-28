
'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';
import Checkbox from '@/components/ui/Checkbox';

interface SitemapSettings {
  enable: boolean;
  splitSize: number;
  pingSearchEngines: boolean;
}

export default function SitemapSettingsPage() {
  const [settings, setSettings] = useState<SitemapSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/seo/sitemap-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch sitemap settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    toast.info('Updating sitemap settings...');

    try {
      const response = await fetch('/api/admin/seo/sitemap-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Successfully updated sitemap settings!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      if(settings){
          setSettings({
              ...settings,
              [name]: type === 'checkbox' ? checked : value,
          });
      }
  }

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><Spinner /></div>;
  }

  if (!settings) {
    return <div className="p-6 text-red-500">Could not load sitemap settings.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sitemap Settings</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-6">
           <div className="flex items-center space-x-2">
            <Checkbox
                id="enable"
                name="enable"
                checked={settings.enable}
                onChange={(checked) => setSettings({...settings, enable: checked})}
            />
            <Label htmlFor="enable">Enable Sitemap Generation</Label>
          </div>

          <div>
            <Label htmlFor="splitSize">Split Size</Label>
            <Input
              id="splitSize"
              name="splitSize"
              type="number"
              value={settings.splitSize}
              onChange={handleInputChange}
              disabled={!settings.enable}
            />
            <p className="text-sm text-muted-foreground mt-1">
              The maximum number of URLs per sitemap file. Google recommends 50,000.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
                id="pingSearchEngines"
                name="pingSearchEngines"
                checked={settings.pingSearchEngines}
                onChange={(checked) => setSettings({...settings, pingSearchEngines: checked})}
                disabled={!settings.enable}
            />
            <Label htmlFor="pingSearchEngines">Ping Search Engines</Label>
          </div>
           <p className="text-sm text-muted-foreground -mt-4">
              Automatically ping Google, Bing, etc. after the sitemap is regenerated.
            </p>


          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !settings.enable}>
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
