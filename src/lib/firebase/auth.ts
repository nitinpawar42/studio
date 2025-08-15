// lib/firebase/auth.ts
'use server';
import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from './firestore';
import type { UserProfile } from '@/types';

const DEFAULT_ADMIN_EMAIL = 'nitinpawar41@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'Nirved@12345';

export async function registerReseller(
  data: Omit<UserProfile, 'uid' | 'role' | 'approved'> & { password: string }
) {
  const { email, password, displayName, ...rest } = data;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if(displayName) {
        await updateProfile(user, { displayName });
    }

    const profileData: Omit<UserProfile, 'uid'> = {
        displayName,
        email: user.email,
        role: 'reseller',
        approved: false, // Resellers are not approved by default
        ...rest,
    };

    const profileResult = await createUserProfile(user.uid, profileData);

    if ('error' in profileResult) {
      // Potentially delete the auth user if profile creation fails
      return { user: null, error: profileResult.error };
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

async function createDefaultAdminIfNeeded() {
    // This is a simplified check. In a real-world scenario, you might query
    // Firestore to see if an admin user document exists.
    try {
        await signInWithEmailAndPassword(auth, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
    } catch(error: any) {
        if (error.code === 'auth/user-not-found') {
             try {
                const userCredential = await createUserWithEmailAndPassword(auth, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
                const user = userCredential.user;
                await updateProfile(user, { displayName: 'Admin' });

                await createUserProfile(user.uid, {
                    displayName: 'Admin',
                    email: user.email,
                    role: 'admin',
                    approved: true,
                });
                console.log('Default admin created');
             } catch(createError) {
                 console.error("Failed to create default admin", createError);
             }
        }
    }
}


export async function signInWithEmail(email: string, password: string, role: 'admin' | 'reseller') {
  
  if(email.toLowerCase() === DEFAULT_ADMIN_EMAIL) {
      await createDefaultAdminIfNeeded();
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const { profile, error: profileError } = await getUserProfile(user.uid);
    
    if (profileError || !profile) {
         await firebaseSignOut(auth);
         return { user: null, error: { message: "Could not find a user profile for this account." } };
    }
    
    // Check if the role matches
    if(profile.role !== role) {
        await firebaseSignOut(auth);
        return { user: null, error: { message: `You are not authorized to log in as a ${role}.` } };
    }

    if (profile.role === 'reseller' && !profile.approved) {
        await firebaseSignOut(auth);
        return { user: null, error: { message: "Your reseller account is pending approval. You'll be notified once it's approved." } };
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if(error.code === 'auth/user-not-found' && email.toLowerCase() === DEFAULT_ADMIN_EMAIL) {
         return { user: null, error: { message: "Admin account not found. It will be created on next attempt." } };
    }
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}
