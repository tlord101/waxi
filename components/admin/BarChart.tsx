
import React from 'react';

interface ChartData {
  name: string;
  sales: number;
}

interface BarChartProps {
  data: ChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.sales));

  return (
    <div className="w-full h-64 flex items-end justify-around space-x-2 pt-4">
      {data.map((item, index) => {
        const barHeight = (item.sales / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-byd-red rounded-t-md hover:bg-byd-red-dark transition-colors"
              style={{ height: `${barHeight}%` }}
              title={`Sales: ¥${item.sales.toLocaleString()}`}
            ></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;