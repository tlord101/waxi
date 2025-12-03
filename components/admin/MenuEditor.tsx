import React, { useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';

const MenuEditor: React.FC = () => {
  const { content, saveSiteContent, refreshContent } = useSiteContent();
  const [text, setText] = useState(() => JSON.stringify(content?.menu || [], null, 2));
  const example = '[{"id":"home","label":"Home","route":"Home"}]';
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    let parsed;
    try {
      parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Menu must be an array');
    } catch (err: any) {
      alert('Invalid JSON: ' + err.message);
      return;
    }
    if (!saveSiteContent) return;
    setIsSaving(true);
    try {
      await saveSiteContent('menu', { items: parsed });
      await refreshContent();
      alert('Menu saved.');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-form max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Menu Editor</h2>
      <p className="text-sm text-gray-600 mb-3">Edit the site menu as JSON. Example: <code className="bg-gray-100 px-1 py-0.5 rounded">{example}</code></p>
      <textarea className="w-full h-64 border rounded p-3 mb-4 font-mono text-sm text-black dark:text-white" value={text} onChange={e => setText(e.target.value)} />
      <div className="flex gap-3">
        <button onClick={handleSave} className="px-4 py-2 bg-byd-red text-white rounded" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Menu'}</button>
      </div>
    </div>
  );
};

export default MenuEditor;
