// src/lib/firebase/firestore.ts
'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { app } from './config';
import type { Product, UserProfile } from '@/types';

const db = getFirestore(app);
const productsCollection = collection(db, 'products');
const usersCollection = collection(db, 'users');

// USER PROFILE
export async function createUserProfile(
  userId: string,
  data: Omit<UserProfile, 'uid'>
) {
  try {
    await setDoc(doc(usersCollection, userId), { ...data, uid: userId });
    return { success: true };
  } catch (error) {
    return { error };
  }
}

// CREATE
export async function addProduct(
  product: Omit<Product, 'id'>
): Promise<{ id: string } | { error: any }> {
  try {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id };
  } catch (error) {
    return { error };
  }
}

// READ (all)
export async function getProducts(): Promise<{ products: Product[] } | { error: any }> {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    return { products };
  } catch (error) {
    return { error };
  }
}

// READ (one)
export async function getProduct(id: string): Promise<{ product: Product | null } | { error: any }> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { product: { id: docSnap.id, ...docSnap.data() } as Product };
    } else {
      return { product: null };
    }
  } catch (error) {
    return { error };
  }
}

// UPDATE
export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<{ success: boolean } | { error: any }> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, product);
    return { success: true };
  } catch (error) {
    return { error };
  }
}

// DELETE
export async function deleteProduct(
  id: string
): Promise<{ success: boolean } | { error: any }> {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { error };
  }
}