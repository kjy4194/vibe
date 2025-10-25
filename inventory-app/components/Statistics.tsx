'use client';

import { Product, User } from '@/types';
import { useRecords } from '@/hooks/useRecords';
import { differenceInDays } from 'date-fns';
import { Package, TrendingDown, AlertTriangle, ArrowDownCircle, ArrowUpCircle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StatisticsProps {
  products: Product[];
  user: User | null;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function Statistics({ products, user }: StatisticsProps) {
  const { records } = useRecords(user);

  const stats = {
    totalProducts: products.length,
    expiredProducts: products.filter((p) => differenceInDays(p.expiryDate, new Date()) < 0).length,
    expiringProducts: products.filter((p) => {
      const days = differenceInDays(p.expiryDate, new Date());
      return days >= 0 && days <= 7;
    }).length,
    totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
    totalEntries: records.filter((r) => r.type === 'entry').length,
    totalExits: records.filter((r) => r.type === 'exit').length,
  };

  const productsByType = products.reduce((acc, product) => {
    acc[product.type] = (acc[product.type] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const typeChartData = Object.entries(productsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const userActivity = records.reduce((acc, record) => {
    acc[record.userName] = (acc[record.userName] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const userChartData = Object.entries(userActivity)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Package className="text-indigo-600" size={24} />}
          title="전체 물품"
          value={stats.totalProducts}
          subtitle={`총 ${stats.totalQuantity}개`}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<TrendingDown className="text-red-600" size={24} />}
          title="만료된 물품"
          value={stats.expiredProducts}
          color="bg-red-50"
        />
        <StatCard
          icon={<AlertTriangle className="text-orange-600" size={24} />}
          title="곧 만료 예정"
          value={stats.expiringProducts}
          subtitle="7일 이내"
          color="bg-orange-50"
        />
        <StatCard
          icon={<ArrowDownCircle className="text-green-600" size={24} />}
          title="총 입고"
          value={stats.totalEntries}
          subtitle="건"
          color="bg-green-50"
        />
        <StatCard
          icon={<ArrowUpCircle className="text-blue-600" size={24} />}
          title="총 출고"
          value={stats.totalExits}
          subtitle="건"
          color="bg-blue-50"
        />
        <StatCard
          icon={<Users className="text-purple-600" size={24} />}
          title="활동 사용자"
          value={Object.keys(userActivity).length}
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">물품 종류별 분포</h3>
          {typeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">데이터가 없습니다</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">사용자별 활동 (상위 10명)</h3>
          {userChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="활동 수" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">데이터가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div className={`${color} p-6 rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-700 mt-1">{subtitle}</p>}
    </div>
  );
}
