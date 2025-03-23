
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface DrugData {
  id: string;
  name: string;
  price: string;
  Is_discontinued: string;
  manufacturer_name: string;
  type: string;
  pack_size_label: string;
  short_composition1: string;
  short_composition2: string;
}

interface DrugItemProps {
  drug: DrugData;
  index: number;
}

const DrugItem: React.FC<DrugItemProps> = ({ drug, index }) => {
  // Use intersection observer for lazy loading cards
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-300",
        inView ? "opacity-100" : "opacity-0"
      )}
      style={{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
    >
      {inView ? (
        <Card
          className="overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-lg text-slate-900">{drug.name}</h3>
                <div className="text-slate-600 text-sm mt-1">{drug.short_composition1}</div>
                {drug.short_composition2 && (
                  <div className="text-slate-600 text-sm">{drug.short_composition2}</div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {drug.manufacturer_name}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {drug.type}
                  </span>
                  {drug.Is_discontinued === "TRUE" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Discontinued
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 md:mt-0 text-right">
                <div className="text-lg font-semibold">₹{drug.price}</div>
                <div className="text-xs text-slate-500">{drug.pack_size_label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
      )}
    </div>
  );
};

export default DrugItem;
