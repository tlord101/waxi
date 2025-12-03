import React, { useState } from 'react';
import { requestAiDesign } from '../../services/aiService';
import { uploadImage } from '../../services/imageUploadService';
import { useSiteContent } from '../../contexts/SiteContentContext';

const AVAILABLE_PAGES = ['Home', 'Giveaway', 'About'];

const AiPageBuilder: React.FC = () => {
  const { content, saveSiteContent, refreshContent } = useSiteContent();
  const [pageId, setPageId] = useState<string>('Giveaway');
  const [prompt, setPrompt] = useState('Create a modern hero section aligned with the site theme.');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [spec, setSpec] = useState<any>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList) as File[];
    setImages(files);
    const urls: string[] = [];
    for (const f of files) {
      try {
        const url = await uploadImage(f);
        urls.push(url);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    setImageUrls(urls);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resp = await requestAiDesign({ pageId, prompt, imageUrls, siteTheme: content?.paymentSettings ? 'light' : 'dark' });
      // Expect resp.spec
      setSpec(resp.spec || resp);
    } catch (error) {
      console.error('AI design failed:', error);
      alert('AI design failed. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!saveSiteContent || !spec) return;
    try {
      await saveSiteContent('pages', { ...(content?.pages || {}), [pageId]: spec });
      await refreshContent();
      alert('Page design saved.');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed.');
    }
  };

  return (
    <div className="admin-form max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">AI Page Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1">Page</label>
          <select value={pageId} onChange={e => setPageId(e.target.value)} className="w-full border rounded px-3 py-2 text-black dark:text-white">
            {AVAILABLE_PAGES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Prompt</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="w-full border rounded px-3 py-2 text-black dark:text-white" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Reference Images (optional)</label>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
        <div className="mt-3 flex gap-3">
          {imageUrls.map(u => <img key={u} src={u} className="h-20 w-auto object-cover rounded" alt="ref" />)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleGenerate} className="px-4 py-2 bg-byd-red text-white rounded" disabled={isGenerating}>{isGenerating ? 'Generating...' : 'Generate Design'}</button>
        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded" disabled={!spec}>Accept & Save</button>
      </div>

      {spec && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-3">Preview (Spec)</h3>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">{JSON.stringify(spec, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AiPageBuilder;
