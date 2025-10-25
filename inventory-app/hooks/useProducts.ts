'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, User } from '@/types';

export function useProducts(user: User | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // user가 없으면 조기 반환 (Firestore 접근 안 함)
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // user가 있을 때만 Firestore 접근
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiryDate: doc.data().expiryDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];

      setProducts(productsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]); // user가 변경될 때마다 재실행

  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    photo?: File
  ) => {
    // Storage 비활성화로 사진 업로드 기능 임시 제거
    const photoUrl = '';

    await addDoc(collection(db, 'products'), {
      ...productData,
      photoUrl,
      expiryDate: Timestamp.fromDate(productData.expiryDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  const updateProduct = async (
    id: string,
    productData: Partial<Omit<Product, 'id' | 'createdAt'>>,
    photo?: File
  ) => {
    // Storage 비활성화로 사진 업로드 기능 임시 제거
    const photoUrl = productData.photoUrl || '';

    const updateData: any = {
      ...productData,
      photoUrl,
      updatedAt: Timestamp.now(),
    };

    if (productData.expiryDate) {
      updateData.expiryDate = Timestamp.fromDate(productData.expiryDate);
    }

    await updateDoc(doc(db, 'products', id), updateData);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
}
