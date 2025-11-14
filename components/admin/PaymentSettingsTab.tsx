import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { updateSiteContent } from '../../services/dbService';
import { PaymentSettings } from '../../types';

const PaymentSettingsTab: React.FC = () => {
  const { content, isLoading, refreshContent } = useSiteContent();
  const [formData, setFormData] = useState<PaymentSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const defaultSettings: PaymentSettings = {
      car_purchase: { wallet_enabled: false, agent_enabled: false },
      giveaway: { wallet_enabled: false, agent_enabled: false, fee_cny: 0 },
      investment: { wallet_enabled: false, agent_enabled: false },
    };

    if (content) {
      // FIX: The `paymentSettings` object from Firestore might be missing or incomplete.
      // Casting to `Partial<PaymentSettings>` correctly types the `settings` object,
      // preventing "property does not exist on type '{}'" errors during the merge.
      const settings = (content.paymentSettings || {}) as Partial<PaymentSettings>;
      
      // Create a complete settings object with defaults to prevent crashes from partial data.
      // This merges existing settings over a complete default structure.
      const fullSettings: PaymentSettings = {
        car_purchase: { ...defaultSettings.car_purchase, ...settings.car_purchase },
        giveaway: { ...defaultSettings.giveaway, ...settings.giveaway },
        investment: { ...defaultSettings.investment, ...settings.investment },
      };
      setFormData(fullSettings);
    }
  }, [content]);

  const handleCheckboxChange = (section: keyof PaymentSettings, field: string, checked: boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: checked
        }
      };
    });
  };
  
  const handleFeeChange = (value: string) => {
      const fee = parseInt(value, 10);
      setFormData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              giveaway: {
                  ...prev.giveaway,
                  fee_cny: isNaN(fee) ? 0 : fee,
              }
          }
      })
  }

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await updateSiteContent('paymentSettings', formData);
      alert('Payment settings saved successfully!');
      refreshContent();
    } catch (error) {
      console.error("Failed to save payment settings:", error);
      alert("An error occurred while saving. Please check the console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="text-center p-8">Loading payment settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Car Purchase Payments</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.car_purchase.wallet_enabled} onChange={e => handleCheckboxChange('car_purchase', 'wallet_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Wallet Payments</span>
          </label>
           <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.car_purchase.agent_enabled} onChange={e => handleCheckboxChange('car_purchase', 'agent_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Agent Payments (Bank/Crypto)</span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Investment Payments</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.investment.wallet_enabled} onChange={e => handleCheckboxChange('investment', 'wallet_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Wallet Investments</span>
          </label>
           <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.investment.agent_enabled} onChange={e => handleCheckboxChange('investment', 'agent_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Agent Investments (Bank/Crypto)</span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-700 text-black dark:text-white">Giveaway Entry Payments</h3>
        <div className="space-y-4">
          <div>
              <label htmlFor="giveaway-fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry Fee (CNY)</label>
              <input type="number" id="giveaway-fee" value={formData.giveaway.fee_cny} onChange={e => handleFeeChange(e.target.value)} className="w-full max-w-xs p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"/>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.giveaway.wallet_enabled} onChange={e => handleCheckboxChange('giveaway', 'wallet_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Wallet Payments</span>
          </label>
           <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.giveaway.agent_enabled} onChange={e => handleCheckboxChange('giveaway', 'agent_enabled', e.target.checked)} className="h-5 w-5 rounded text-byd-red focus:ring-byd-red"/>
            <span className="text-gray-700 dark:text-gray-300">Enable Agent Payments (Bank/Crypto)</span>
          </label>
        </div>
      </div>
      
      <div className="text-right">
        <button onClick={handleSave} disabled={isSaving} className="bg-byd-red text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-byd-red-dark transition-colors disabled:bg-gray-500">
            {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default PaymentSettingsTab;