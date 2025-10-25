'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { X } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    photo?: File
  ) => Promise<void>;
  onClose: () => void;
}

export default function ProductForm({ product, onSubmit, onClose }: ProductFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(product?.name || '');
  const [type, setType] = useState(product?.type || '');
  const [description, setDescription] = useState(product?.description || '');
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [expiryDate, setExpiryDate] = useState(
    product?.expiryDate ? product.expiryDate.toISOString().split('T')[0] : ''
  );
  const [photo, setPhoto] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await onSubmit(
        {
          name,
          type,
          description,
          quantity,
          expiryDate: new Date(expiryDate),
          userId: user.id,
          userName: user.displayName,
          photoUrl: product?.photoUrl,
        },
        photo
      );
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-600">
              {product ? '물품 수정' : '물품 추가'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                물품명
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종류
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수량
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유통기한
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            {/* 사진 업로드 기능은 Storage 활성화 후 사용 가능합니다 */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사진
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setPhoto(e.target.files?.[0])}
              />
            </div> */}

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? '처리중...' : product ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
