import React from 'react';
import { Vehicle } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import TranslatedText from './TranslatedText';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onSelectForDetail: (vehicle: Vehicle) => void;
  onToggleCompare?: (vehicle: Vehicle) => void;
  isSelectedForCompare?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelectForInstallment, onSelectForPurchase, onSelectForDetail, onToggleCompare, isSelectedForCompare = false }) => {
  const { t } = useTranslation();

  // Show first 2 key specs for a cleaner look
  const keySpecs = vehicle.specs.slice(0, 2);

  return (
    <div className={`bg-black text-white rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-800/50 transition-all duration-300 hover:shadow-byd-red/30 hover:border-byd-red/50 ${isSelectedForCompare ? 'ring-2 ring-byd-red' : ''}`}>
      {/* Image with overlay */}
      <div className="relative">
        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-4xl font-extrabold text-white drop-shadow-lg">
                <TranslatedText>{vehicle.name}</TranslatedText>
            </h3>
            <p className="text-gray-300 mt-1 max-w-md text-sm">
                <TranslatedText>{vehicle.description}</TranslatedText>
            </p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-black">
        {/* Price and Specs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
                <p className="text-gray-400 text-sm">Starting From</p>
                <p className="text-4xl font-bold">
                    ¥{vehicle.price.toLocaleString()}
                    <span className="text-lg font-normal text-gray-500"> est.</span>
                </p>
            </div>
            <div className="w-full md:w-auto flex justify-around items-center gap-4 text-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
                {keySpecs.map(spec => (
                    <div key={spec.name} className="flex flex-col items-center justify-start w-20">
                        <ion-icon name={spec.icon} className="text-byd-red text-3xl mb-1"></ion-icon>
                        <p className="text-xs text-gray-400 leading-tight"><TranslatedText>{spec.name}</TranslatedText></p>
                        <p className="font-bold text-sm leading-tight"><TranslatedText>{spec.value}</TranslatedText></p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Buttons */}
        <div className="mt-auto space-y-3">
            <button
                onClick={() => onSelectForDetail(vehicle)}
                className="w-full bg-byd-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-byd-red-dark transition-colors duration-300 text-base flex items-center justify-center gap-2"
            >
                {t('explore')}
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
            <div className="flex space-x-3">
                <button 
                    onClick={() => onSelectForPurchase(vehicle)}
                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 text-sm"
                >
                    {t('buy_now')}
                </button>
                <button 
                    onClick={() => onSelectForInstallment(vehicle)}
                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 text-sm"
                >
                    {t('pay_in_installments')}
                </button>
            </div>
           {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(vehicle)}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-sm flex items-center justify-center gap-2 ${isSelectedForCompare ? 'text-byd-red bg-byd-red/10' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              >
                 <ion-icon name={isSelectedForCompare ? 'checkmark-circle' : 'add-circle-outline'}></ion-icon>
                {isSelectedForCompare ? t('selected_for_compare') : t('compare')}
              </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;