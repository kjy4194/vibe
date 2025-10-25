'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecords } from '@/hooks/useRecords';
import { Product } from '@/types';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RecordModalProps {
  product: Product;
  onClose: () => void;
}

export default function RecordModal({ product, onClose }: RecordModalProps) {
  const { user } = useAuth();
  const { records, addRecord } = useRecords(user, product.id);
  const [type, setType] = useState<'entry' | 'exit'>('entry');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addRecord({
        productId: product.id,
        productName: product.name,
        type,
        quantity,
        userId: user.id,
        userName: user.displayName,
        note: note || undefined,
      });
      setQuantity(1);
      setNote('');
    } catch (error) {
      console.error('Error adding record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{product.name} - 출입 기록</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-gray-900">새 출입 기록 추가</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    유형
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'entry' | 'exit')}
                  >
                    <option value="entry">입고</option>
                    <option value="exit">출고</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수량
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메모
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="선택사항"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? '처리중...' : '기록 추가'}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">기록 내역</h3>
              {records.length === 0 ? (
                <p className="text-gray-500 text-center py-8">기록이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                    >
                      {record.type === 'entry' ? (
                        <ArrowDownCircle className="text-green-600 flex-shrink-0" size={24} />
                      ) : (
                        <ArrowUpCircle className="text-red-600 flex-shrink-0" size={24} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold ${record.type === 'entry' ? 'text-green-600' : 'text-red-600'}`}>
                            {record.type === 'entry' ? '입고' : '출고'}
                          </span>
                          <span className="font-semibold text-gray-900">{record.quantity}개</span>
                          <span className="text-sm text-gray-700">by {record.userName}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {format(record.timestamp, 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                        </div>
                        {record.note && (
                          <div className="text-sm text-gray-700 mt-1">{record.note}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
