'use client';

import { Product } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Edit, Trash2, Package } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRecordClick: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onRecordClick }: ProductCardProps) {
  const daysUntilExpiry = differenceInDays(product.expiryDate, new Date());

  const getExpiryStatus = () => {
    if (daysUntilExpiry < 0) {
      return { label: '만료됨', color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' };
    } else if (daysUntilExpiry <= 7) {
      return { label: `${daysUntilExpiry}일 남음`, color: 'bg-orange-100 text-orange-800', borderColor: 'border-orange-300' };
    } else if (daysUntilExpiry <= 30) {
      return { label: `${daysUntilExpiry}일 남음`, color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-300' };
    }
    return { label: '정상', color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' };
  };

  const status = getExpiryStatus();

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${status.borderColor} hover:shadow-lg transition-shadow`}>
      <div className="relative h-48 bg-gray-200">
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package size={64} className="text-gray-400" />
          </div>
        )}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
          {status.label}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            {product.type}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">수량:</span>
            <span className="font-semibold">{product.quantity}개</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">유통기한:</span>
            <span className="font-semibold">
              {format(product.expiryDate, 'yyyy년 MM월 dd일', { locale: ko })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">등록자:</span>
            <span className="font-semibold">{product.userName}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRecordClick(product)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            출입 기록
          </button>
          <button
            onClick={() => onEdit(product)}
            className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm('정말 삭제하시겠습니까?')) {
                onDelete(product.id);
              }
            }}
            className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
