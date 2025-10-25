'use client';

import { Product } from '@/types';
import { differenceInDays } from 'date-fns';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface ExpiryAlertsProps {
  products: Product[];
}

export default function ExpiryAlerts({ products }: ExpiryAlertsProps) {
  const expiredProducts = products.filter(
    (p) => differenceInDays(p.expiryDate, new Date()) < 0
  );

  const expiringProducts = products.filter((p) => {
    const days = differenceInDays(p.expiryDate, new Date());
    return days >= 0 && days <= 7;
  });

  if (expiredProducts.length === 0 && expiringProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {expiredProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-2">
                유통기한 만료 ({expiredProducts.length}개)
              </h3>
              <ul className="space-y-1">
                {expiredProducts.map((product) => (
                  <li key={product.id} className="text-red-700 text-sm">
                    {product.name} - {Math.abs(differenceInDays(product.expiryDate, new Date()))}일 경과
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {expiringProducts.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-start">
            <AlertTriangle className="text-orange-500 mr-3 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-orange-800 font-semibold mb-2">
                곧 만료 예정 ({expiringProducts.length}개)
              </h3>
              <ul className="space-y-1">
                {expiringProducts.map((product) => (
                  <li key={product.id} className="text-orange-700 text-sm">
                    {product.name} - {differenceInDays(product.expiryDate, new Date())}일 남음
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
