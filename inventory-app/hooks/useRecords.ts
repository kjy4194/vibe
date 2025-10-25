'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EntryExitRecord, User } from '@/types';

export function useRecords(user: User | null, productId?: string, limitCount: number = 100) {
  const [records, setRecords] = useState<EntryExitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // user가 없으면 조기 반환 (Firestore 접근 안 함)
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    // user가 있을 때만 Firestore 접근
    let q;

    if (productId) {
      q = query(
        collection(db, 'records'),
        where('productId', '==', productId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, 'records'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as EntryExitRecord[];

      setRecords(recordsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, productId, limitCount]); // user가 변경될 때마다 재실행

  const addRecord = async (recordData: Omit<EntryExitRecord, 'id' | 'timestamp'>) => {
    await addDoc(collection(db, 'records'), {
      ...recordData,
      timestamp: Timestamp.now(),
    });
  };

  return { records, loading, addRecord };
}
