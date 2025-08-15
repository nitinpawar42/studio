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
const ADMIN_PASSWORD = 'Nirved@12345';

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
    // Special handling for initial admin creation
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        try {
            // Try to sign in first
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            // If the user doesn't exist, create it
            if (error.code === 'auth/user-not-found') {
                try {
                    const adminCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const adminUser = adminCredential.user;
                    await updateProfile(adminUser, { displayName: 'Admin' });

                    const adminProfileData: Omit<UserProfile, 'uid'> = {
                        displayName: 'Admin',
                        email: adminUser.email,
                        role: 'admin',
                        approved: true,
                    };
                    await createUserProfile(adminUser.uid, adminProfileData);
                    
                    return { user: adminUser, error: null };
                } catch (creationError: any) {
                    // This could happen if there's a different issue, like network error during creation.
                    return { user: null, error: creationError };
                }
            }
             // For other sign-in errors (like wrong password), return the error
            return { user: null, error };
        }
    }

    // Standard sign-in for resellers
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };

  } catch (error: any) {
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
