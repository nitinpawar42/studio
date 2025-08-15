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

const ADMIN_EMAIL = 'nitinpawar41@gmail.com';

export async function registerReseller(
  data: Omit<UserProfile, 'uid' | 'role' | 'approved'> & { password: string }
) {
  const { email, password, displayName, ...rest } = data;
  try {
    // Admins cannot be registered through this form
    if (email === ADMIN_EMAIL) {
        return { user: null, error: { message: 'This email is reserved for the admin account.' } };
    }

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

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    // If sign-in fails because the user is not found, and it's the admin email, create the admin account.
    if (error.code === 'auth/user-not-found' && email === ADMIN_EMAIL) {
      try {
        const { user, error: creationError } = await createUserWithEmailAndPassword(auth, email, 'Nirved@12345');
        
        if (creationError || !user) {
          // This could happen if there's a different issue, like network error.
          return { user: null, error: creationError || new Error('Failed to create admin user.') };
        }
        
        // Set the display name and create the Firestore profile.
        await updateProfile(user, { displayName: 'Admin' });
        const adminProfileData: Omit<UserProfile, 'uid'> = {
          displayName: 'Admin',
          email: user.email,
          role: 'admin',
          approved: true,
        };
        await createUserProfile(user.uid, adminProfileData);
        
        // Return the newly created and signed-in user.
        return { user, error: null };

      } catch (creationError: any) {
        // This inner catch handles errors from the creation attempt itself.
        return { user: null, error: creationError };
      }
    }
    // For all other errors, return them directly.
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
