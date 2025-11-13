import React from 'react';
import { Vehicle } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import TranslatedText from './TranslatedText';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelectForInstallment: (vehicle: Vehicle) => void;
  onSelectForPurchase: (vehicle: Vehicle) => void;
  onToggleCompare?: (vehicle: Vehicle) => void;
  isSelectedForCompare?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelectForInstallment, onSelectForPurchase, onToggleCompare, isSelectedForCompare = false }) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300 group border dark:border-gray-800 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700 flex flex-col ${isSelectedForCompare ? 'border-byd-red ring-2 ring-byd-red' : 'border-gray-200'}`}>
      <div className="relative">
        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-0 right-0 bg-byd-red text-white text-xs font-bold px-3 py-1 m-3 rounded-full">{vehicle.type}</div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">
          <TranslatedText>{vehicle.name}</TranslatedText>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm h-10">
          <TranslatedText>{vehicle.description}</TranslatedText>
        </p>
        
        <div className="mb-4">
          <p className="text-2xl font-extrabold text-black dark:text-white">
            ¥{vehicle.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-500"> est.</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 my-6 text-sm">
          {vehicle.specs.map(spec => (
            <div key={spec.name} className="flex items-center space-x-2">
              {/* Fix: Replaced 'class' with 'className' for the ion-icon custom element to align with React standards. */}
              <ion-icon name={spec.icon} className="text-byd-red text-xl"></ion-icon>
              <div>
                <p className="text-gray-500 dark:text-gray-400"><TranslatedText>{spec.name}</TranslatedText></p>
                <p className="font-bold text-black dark:text-white"><TranslatedText>{spec.value}</TranslatedText></p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2">
           {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(vehicle)}
                className={`w-full py-2 px-4 rounded-full font-semibold transition-colors duration-300 border ${isSelectedForCompare ? 'bg-byd-red/10 border-byd-red text-byd-red' : 'bg-gray-200 dark:bg-gray-700 border-transparent text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {isSelectedForCompare ? t('selected_for_compare') : t('compare')}
              </button>
           )}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={() => onSelectForPurchase(vehicle)}
              className="w-full bg-byd-red text-white py-2 px-4 rounded-full font-semibold hover:bg-byd-red-dark transition-colors duration-300"
            >
              {t('buy_now')}
            </button>
            <button 
              onClick={() => onSelectForInstallment(vehicle)}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-full font-semibold hover:bg-gray-600 transition-colors duration-300"
            >
              {t('pay_in_installments')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;