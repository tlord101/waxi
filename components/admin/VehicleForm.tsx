import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { getVehicleDetailsWithAI } from '../../services/geminiService';
import { uploadImage } from '../../services/imageUploadService';

interface VehicleFormProps {
  initialVehicle: Vehicle | null;
  onSubmit: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void;
  onCancel: () => void;
}

const defaultVehicle: Omit<Vehicle, 'id'> = {
  name: '',
  type: 'Sedan',
  price: 0,
  description: '',
  imageUrl: 'https://picsum.photos/seed/newcar/800/600',
  specs: [{ icon: 'flash-outline', name: 'Range', value: '' }],
};

const VehicleForm: React.FC<VehicleFormProps> = ({ initialVehicle, onSubmit, onCancel }) => {
  const [vehicle, setVehicle] = useState(initialVehicle || defaultVehicle);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialVehicle?.imageUrl || defaultVehicle.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleSpecChange = (index: number, field: 'icon' | 'name' | 'value', value: string) => {
    const newSpecs = [...vehicle.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setVehicle(prev => ({ ...prev, specs: newSpecs }));
  };
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const addSpec = () => {
    setVehicle(prev => ({
      ...prev,
      specs: [...prev.specs, { icon: 'cog-outline', name: '', value: '' }],
    }));
  };

  const removeSpec = (index: number) => {
    setVehicle(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };
  
  const handleAutofill = async () => {
    if (!vehicle.name.trim()) {
      alert('Please enter a vehicle name first.');
      return;
    }

    setIsAutofilling(true);
    try {
      const jsonString = await getVehicleDetailsWithAI(vehicle.name);
      const aiData = JSON.parse(jsonString);

      if (aiData.price && aiData.description && aiData.specs) {
        setVehicle(prev => ({
          ...prev,
          type: aiData.type || prev.type,
          price: aiData.price || prev.price,
          description: aiData.description || prev.description,
          specs: aiData.specs || prev.specs,
        }));
      } else {
        throw new Error("AI response was not in the expected format.");
      }

    } catch (error) {
      console.error("Failed to auto-fill vehicle data:", error);
      alert(`Could not fetch AI data. Please check the vehicle name or try again. Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      let finalImageUrl = vehicle.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      
      onSubmit({
        ...vehicle,
        imageUrl: finalImageUrl,
      });

    } catch (error) {
        console.error("Error saving vehicle:", error);
        alert(`Error saving vehicle: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
        setIsSaving(false);
    }
  };
  
  const vehicleTypes: Vehicle['type'][] = ['Sedan', 'SUV', 'Hatchback', 'Commercial', 'Special'];

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">{initialVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Name</label>
                        <button 
                            type="button" 
                            onClick={handleAutofill} 
                            disabled={!vehicle.name || isAutofilling || isSaving}
                            className="flex items-center gap-1 text-xs font-semibold bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isAutofilling ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                   <span>Filling...</span>
                                </>
                            ) : (
                               <>
                                  {/* FIX: Corrected ion-icon usage to ensure proper rendering and type compatibility. */}
                                  <ion-icon name="sparkles-outline" className="text-sm"></ion-icon>
                                  <span>Auto-fill with AI</span>
                               </>
                            )}
                        </button>
                    </div>
                    <input type="text" name="name" id="name" value={vehicle.name} onChange={handleChange} required className="block w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red"/>
                </div>
                {/* Type */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select name="type" id="type" value={vehicle.type} onChange={handleChange} className="mt-1 block w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red">
                        {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                 {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (¥)</label>
                    <input type="number" name="price" id="price" value={vehicle.price} onChange={handleChange} required className="mt-1 block w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red"/>
                </div>
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Image</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <img src={imagePreview} alt="Vehicle Preview" className="w-24 h-16 object-cover rounded-md bg-gray-200 dark:bg-gray-700"/>
                        <label htmlFor="image-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <span>Upload Image</span>
                            <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageFileChange}/>
                        </label>
                    </div>
                </div>
            </div>
             {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description" id="description" value={vehicle.description} onChange={handleChange} rows={3} required className="mt-1 block w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-byd-red focus:border-byd-red"></textarea>
            </div>

            {/* Specs */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Specifications</h3>
                <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                {vehicle.specs.map((spec, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        <input type="text" value={spec.icon} onChange={e => handleSpecChange(index, 'icon', e.target.value)} placeholder="Icon Name (e.g., flash-outline)" className="md:col-span-1 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
                        <input type="text" value={spec.name} onChange={e => handleSpecChange(index, 'name', e.target.value)} placeholder="Spec Name (e.g., Range)" className="md:col-span-1 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
                        <input type="text" value={spec.value} onChange={e => handleSpecChange(index, 'value', e.target.value)} placeholder="Spec Value (e.g., 700km)" className="md:col-span-1 p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
                        <button type="button" onClick={() => removeSpec(index)} className="md:col-span-1 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 text-sm">Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addSpec} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">+ Add Spec</button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={onCancel} disabled={isSaving} className="bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-byd-red-dark transition-colors disabled:bg-byd-red/50">
                    {isSaving ? 'Saving...' : (initialVehicle ? 'Save Changes' : 'Add Vehicle')}
                </button>
            </div>
        </form>
    </div>
  );
};

export default VehicleForm;