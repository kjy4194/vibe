'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import AuthForm from '@/components/AuthForm';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import RecordModal from '@/components/RecordModal';
import ExpiryAlerts from '@/components/ExpiryAlerts';
import Statistics from '@/components/Statistics';
import { Product } from '@/types';
import { Plus, LogOut, BarChart3, Package } from 'lucide-react';

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts(user);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [activeTab, setActiveTab] = useState<'products' | 'statistics'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const productTypes = [...new Set(products.map((p) => p.type))];

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    photo?: File
  ) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data, photo);
    } else {
      await addProduct(data, photo);
    }
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">창고 물품 관리</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                환영합니다, <span className="font-semibold">{user.displayName}</span>님
              </span>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                <LogOut size={18} />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <ExpiryAlerts products={products} />
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium ${
                  activeTab === 'products'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package size={20} />
                물품 관리
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium ${
                  activeTab === 'statistics'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 size={20} />
                통계
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 flex gap-4 w-full">
                <input
                  type="text"
                  placeholder="물품 검색..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">모든 종류</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowProductForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap"
              >
                <Plus size={20} />
                물품 추가
              </button>
            </div>

            {productsLoading ? (
              <div className="text-center py-12">로딩중...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm || filterType ? '검색 결과가 없습니다.' : '등록된 물품이 없습니다.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={deleteProduct}
                    onRecordClick={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <Statistics products={products} user={user} />
        )}
      </main>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmitProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}

      {selectedProduct && (
        <RecordModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(undefined)}
        />
      )}
    </div>
  );
}
