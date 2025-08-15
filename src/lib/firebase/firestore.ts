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
  query,
  where,
} from 'firebase/firestore';
import { app } from './config';
import type { Product, UserProfile, ResellerCustomer } from '@/types';

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

export async function getUserProfile(userId: string): Promise<{ profile: UserProfile | null } | { error: any }> {
    try {
        const docRef = doc(usersCollection, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { profile: { uid: docSnap.id, ...docSnap.data() } as UserProfile };
        } else {
            // To handle cases where a user might exist in Auth but not in Firestore
            return { profile: null, error: { code: 'not-found', message: 'User profile not found in Firestore.'} };
        }
    } catch (error) {
        return { error };
    }
}

export async function getAllUsers(): Promise<{ users: UserProfile[] } | { error: any }> {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserProfile[];
    return { users };
  } catch (error) {
    return { error };
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<{ success: boolean } | { error: any }> {
  try {
    const docRef = doc(usersCollection, userId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { error };
  }
}


// PRODUCTS
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

// RESELLER CUSTOMERS
export async function addResellerCustomer(
  resellerId: string,
  customerData: Omit<ResellerCustomer, 'id' | 'resellerId'>
): Promise<{ customer: ResellerCustomer } | { error: any }> {
  try {
    const customersCollection = collection(db, 'users', resellerId, 'customers');
    const docRef = await addDoc(customersCollection, { ...customerData, resellerId });
    const newCustomer = { id: docRef.id, resellerId, ...customerData };
    return { customer: newCustomer };
  } catch (error) {
    return { error };
  }
}

export async function updateResellerCustomer(
    resellerId: string,
    customerId: string,
    customerData: Partial<Omit<ResellerCustomer, 'id' | 'resellerId'>>
): Promise<{ success: boolean } | { error: any }> {
    try {
        const docRef = doc(db, 'users', resellerId, 'customers', customerId);
        await updateDoc(docRef, customerData);
        return { success: true };
    } catch (error) {
        return { error };
    }
}


export async function getResellerCustomers(resellerId: string): Promise<{ customers?: ResellerCustomer[], error?: any }> {
  try {
    const customersCollection = collection(db, 'users', resellerId, 'customers');
    const q = query(customersCollection, where('resellerId', '==', resellerId));
    const querySnapshot = await getDocs(q);
    const customers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ResellerCustomer[];
    return { customers };
  } catch (error) {
    return { error };
  }
}

export async function deleteResellerCustomer(resellerId: string, customerId: string): Promise<{ success: boolean } | { error: any }> {
  try {
    const docRef = doc(db, 'users', resellerId, 'customers', customerId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { error };
  }
}
