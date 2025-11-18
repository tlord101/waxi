import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { updateSiteContent } from '../../services/dbService';
import { uploadImage } from '../../services/imageUploadService';
import { SiteContent, HomePageContent, FooterContent, AboutPageContent } from '../../types';

// Reusable component for image upload fields
const ImageUploadField: React.FC<{
  label: string;
  currentImageUrl: string;
  onImageChange: (file: File) => void;
}> = ({ label, currentImageUrl, onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <img 
            src={preview || currentImageUrl} 
            alt="Current" 
            className="w-24 h-16 object-cover rounded-md bg-gray-200 dark:bg-gray-700"
        />
        <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-byd-red/10 file:text-byd-red hover:file:bg-byd-red/20"
        />
      </div>
    </div>
  );
};

const ContentTab: React.FC = () => {
  const { content, isLoading, refreshContent } = useSiteContent();
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [newImages, setNewImages] = useState<Record<string, File>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(JSON.parse(JSON.stringify(content))); // Deep copy
    }
  }, [content]);

  const handleInputChange = (section: keyof SiteContent, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handleImageChange = (field: string, file: File) => {
    setNewImages(prev => ({ ...prev, [field]: file }));
  };

  // FIX: Refactored the `handleSave` function to improve clarity and avoid potential race conditions.
  // The original implementation mutated a closed-over variable within a `.map()` callback, which is an anti-pattern.
  // This new version separates the async image uploading from data manipulation, making the logic more robust.
  const handleSave = async (section: keyof SiteContent) => {
    if (!formData) return;
    setIsSaving(true);
    
    // Create a mutable copy of the data for the specific section being saved.
    const dataToUpdate = { ...formData[section] };

    try {
      // Identify which image fields in the current section have new files staged for upload.
      const imageFieldsToUpdate = Object.entries(newImages)
        .filter(([key]) => key.startsWith(section));

      // Upload all new images in parallel and get their new URLs.
      const uploadedImageUrls = await Promise.all(
        imageFieldsToUpdate.map(async ([key, file]) => {
          // FIX: Add type assertion for 'file'. TypeScript is incorrectly inferring
          // its type as 'unknown' here, but the logic guarantees it is a File object
          // from the 'newImages' state.
          const imageUrl = await uploadImage(file as File);
          // The fieldName corresponds to a key in HomePageContent, FooterContent, etc.
          const fieldName = key.replace(`${section}_`, '');
          return { fieldName, imageUrl };
        })
      );

      // Update the data copy with the new URLs from the uploaded images.
      for (const { fieldName, imageUrl } of uploadedImageUrls) {
        (dataToUpdate as any)[fieldName] = imageUrl;
      }
      
      // Save the final, updated data object to the database.
      await updateSiteContent(section, dataToUpdate);
      
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} content saved successfully!`);
      refreshContent(); // Refresh global content state after saving.
      setNewImages({}); // Clear staged images as they have been processed.
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("An error occurred while saving. Please check the console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="text-center p-8">Loading content...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Site Logo Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Site Logo</h3>
        <div className="space-y-4">
          <ImageUploadField 
            label="Site Logo" 
            currentImageUrl={formData.logo_url} 
            onImageChange={(file) => handleImageChange('logo_url', file)} 
          />
          <div className="text-right">
            <button 
              onClick={async () => {
                if (!formData) return;
                setIsSaving(true);
                try {
                  let logoUrl = formData.logo_url;
                  if (newImages['logo_url']) {
                    logoUrl = await uploadImage(newImages['logo_url']);
                  }
                  await updateSiteContent('logo_url', logoUrl);
                  alert('Site logo saved successfully!');
                  refreshContent();
                  setNewImages({});
                } catch (error) {
                  console.error("Failed to save logo:", error);
                  alert("An error occurred while saving. Please check the console.");
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving} 
              className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors disabled:bg-gray-500"
            >
              {isSaving ? 'Saving...' : 'Save Logo'}
            </button>
          </div>
        </div>
      </div>

      {/* Home Page Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Home Page Content</h3>
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">Giveaway Section</h4>
          <ImageUploadField label="Giveaway Background Image" currentImageUrl={formData.homepage.giveaway_bg_image_url} onImageChange={(file) => handleImageChange('homepage_giveaway_bg_image_url', file)} />
          <input type="text" placeholder="Giveaway Title" value={formData.homepage.giveaway_title} onChange={e => handleInputChange('homepage', 'giveaway_title', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
          <textarea placeholder="Giveaway Description" value={formData.homepage.giveaway_description} onChange={e => handleInputChange('homepage', 'giveaway_description', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md" rows={3}></textarea>
          <input type="text" placeholder="Giveaway Button Text" value={formData.homepage.giveaway_button_text} onChange={e => handleInputChange('homepage', 'giveaway_button_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>

          <h4 className="font-semibold pt-4 border-t dark:border-gray-700 text-gray-600 dark:text-gray-300">About Section</h4>
          <ImageUploadField label="About Section Image" currentImageUrl={formData.homepage.about_image_url} onImageChange={(file) => handleImageChange('homepage_about_image_url', file)} />
          <input type="text" placeholder="About Title" value={formData.homepage.about_title} onChange={e => handleInputChange('homepage', 'about_title', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
          <textarea placeholder="About Text" value={formData.homepage.about_text} onChange={e => handleInputChange('homepage', 'about_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md" rows={4}></textarea>
          <input type="text" placeholder="About Button Link Text" value={formData.homepage.about_button_link_text} onChange={e => handleInputChange('homepage', 'about_button_link_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>

          <div className="text-right">
            <button onClick={() => handleSave('homepage')} disabled={isSaving} className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                {isSaving ? 'Saving...' : 'Save Home Page'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Form */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Footer Content</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Privacy Link Text" value={formData.footer.privacy_link_text} onChange={e => handleInputChange('footer', 'privacy_link_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Cookie Link Text" value={formData.footer.cookie_link_text} onChange={e => handleInputChange('footer', 'cookie_link_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Contact Link Text" value={formData.footer.contact_link_text} onChange={e => handleInputChange('footer', 'contact_link_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Follow Us Text" value={formData.footer.follow_us_text} onChange={e => handleInputChange('footer', 'follow_us_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Facebook URL" value={formData.footer.facebook_url} onChange={e => handleInputChange('footer', 'facebook_url', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Twitter URL" value={formData.footer.twitter_url} onChange={e => handleInputChange('footer', 'twitter_url', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Instagram URL" value={formData.footer.instagram_url} onChange={e => handleInputChange('footer', 'instagram_url', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="TikTok URL" value={formData.footer.tiktok_url} onChange={e => handleInputChange('footer', 'tiktok_url', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="YouTube URL" value={formData.footer.youtube_url} onChange={e => handleInputChange('footer', 'youtube_url', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Copyright Text" value={formData.footer.copyright_text} onChange={e => handleInputChange('footer', 'copyright_text', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
         </div>
         <div className="text-right mt-4">
            <button onClick={() => handleSave('footer')} disabled={isSaving} className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                {isSaving ? 'Saving...' : 'Save Footer'}
            </button>
          </div>
      </div>
      
       {/* About Page Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">About Page Content</h3>
        <div className="space-y-4">
            <ImageUploadField label="Banner Image" currentImageUrl={formData.aboutpage.banner_image_url} onImageChange={(file) => handleImageChange('aboutpage_banner_image_url', file)} />
            <input type="text" placeholder="Banner Title" value={formData.aboutpage.banner_title} onChange={e => handleInputChange('aboutpage', 'banner_title', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Banner Subtitle" value={formData.aboutpage.banner_subtitle} onChange={e => handleInputChange('aboutpage', 'banner_subtitle', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Main Title" value={formData.aboutpage.main_title} onChange={e => handleInputChange('aboutpage', 'main_title', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <textarea placeholder="Main Content" value={formData.aboutpage.main_content} onChange={e => handleInputChange('aboutpage', 'main_content', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md" rows={12}></textarea>
            
            <h4 className="font-semibold pt-4 border-t dark:border-gray-700 text-gray-600 dark:text-gray-300">Contact Block</h4>
            <input type="text" placeholder="Contact Title" value={formData.aboutpage.contact_title} onChange={e => handleInputChange('aboutpage', 'contact_title', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Contact Address" value={formData.aboutpage.contact_address} onChange={e => handleInputChange('aboutpage', 'contact_address', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Contact Email" value={formData.aboutpage.contact_email} onChange={e => handleInputChange('aboutpage', 'contact_email', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
            <input type="text" placeholder="Contact Phone" value={formData.aboutpage.contact_phone} onChange={e => handleInputChange('aboutpage', 'contact_phone', e.target.value)} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>

          <div className="text-right">
            <button onClick={() => handleSave('aboutpage')} disabled={isSaving} className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
                {isSaving ? 'Saving...' : 'Save About Page'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTab;