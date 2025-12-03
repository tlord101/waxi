import React, { useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { uploadImage } from '../../services/imageUploadService';

const AdminSiteSettings: React.FC = () => {
  const { content, isLoading, saveSiteContent, refreshContent } = useSiteContent();
  const initialLogo = content?.logo_url || '';
  const initialSiteName = content?.site_name || '';
  const homepage = content?.homepage || {} as any;

  const [logoUrl, setLogoUrl] = useState(initialLogo);
  const [siteName, setSiteName] = useState(initialSiteName);
  const [heroBg, setHeroBg] = useState(homepage.giveaway_bg_image_url || '');
  const [headline, setHeadline] = useState(homepage.giveaway_title || '');
  const [subheadline, setSubheadline] = useState(homepage.giveaway_description || '');
  const [buttonText, setButtonText] = useState(homepage.giveaway_button_text || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (error) {
      alert('Logo upload failed. Check console for details.');
    }
  };

  const handleHeroFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      setHeroBg(url);
    } catch (error) {
      alert('Background upload failed. Check console for details.');
    }
  };

  const handleSave = async () => {
    if (!saveSiteContent) return;
    setIsSaving(true);
    try {
      // Save logo and site name
      await saveSiteContent('logo_url', { url: logoUrl });
      await saveSiteContent('site_name', { name: siteName });

      // Merge homepage giveaway-related fields
      await saveSiteContent('homepage', {
        ...content?.homepage,
        giveaway_bg_image_url: heroBg,
        giveaway_title: headline,
        giveaway_description: subheadline,
        giveaway_button_text: buttonText,
      });

      await refreshContent();
      alert('Site settings saved.');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading site settings...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Logo URL / Upload</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-2"
          value={logoUrl}
          onChange={e => setLogoUrl(e.target.value)}
          placeholder="Paste image URL or upload below"
        />
        <input type="file" accept="image/*" onChange={handleLogoFile} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Site Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={siteName}
          onChange={e => setSiteName(e.target.value)}
        />
      </div>
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-4">Hero / Giveaway Section</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Hero Background Image</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-2"
          value={heroBg}
          onChange={e => setHeroBg(e.target.value)}
          placeholder="Paste image URL or upload below"
        />
        <input type="file" accept="image/*" onChange={handleHeroFile} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Headline</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Subheadline</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={subheadline}
          onChange={e => setSubheadline(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Button Text</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={buttonText}
          onChange={e => setButtonText(e.target.value)}
        />
      </div>
      <button
        className="mt-4 px-6 py-2 bg-byd-red text-white rounded font-bold hover:bg-byd-red-dark disabled:opacity-60"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default AdminSiteSettings;
