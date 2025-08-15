// lib/firebase/auth.ts
'use server';
import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from './firestore';
import type { UserProfile } from '@/types';

const ADMIN_EMAIL = 'nitinpawar41@gmail.com';
const ADMIN_PASSWORD = 'Nirved@12345';

export async function registerReseller(
  data: Omit<UserProfile, 'uid' | 'role'> & { password: string }
) {
  const { email, password, displayName, ...rest } = data;
  try {
    // Handle the initial, one-time creation of the admin user.
    // This part of the function will only run if the admin account does not yet exist in Firebase Auth.
    if (email === ADMIN_EMAIL) {
        // You might want to add an extra layer of security here, 
        // perhaps a secret key passed in the data object, to prevent just anyone
        // from triggering this. For now, it's based on the email.
        if (password !== ADMIN_PASSWORD) {
            return { user: null, error: { message: 'Invalid credentials for admin setup.'}};
        }
        
        try {
            const adminCredential = await createUserWithEmailAndPassword(auth, email, password);
            const adminUser = adminCredential.user;
            await updateProfile(adminUser, { displayName: 'Admin' });

            const adminProfileData: Omit<UserProfile, 'uid'> = {
                displayName: 'Admin',
                email: adminUser.email,
                role: 'admin',
            };
            await createUserProfile(adminUser.uid, adminProfileData);
            
            // Note: This is for one-time setup. Subsequent registrations with this email will fail
            // because the user will already exist, which is the intended behavior.
            return { user: adminUser, error: null };
        } catch (creationError: any) {
            // If it fails because the user already exists, that's fine. We can ignore that.
            if (creationError.code === 'auth/email-already-in-use') {
                return { user: null, error: { message: 'Admin account already exists.'}};
            }
            // For other errors during creation, report them.
            return { user: null, error: creationError };
        }
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
        ...rest,
    };

    const profileResult = await createUserProfile(user.uid, profileData);

    if ('error' in profileResult) {
      // Potentially delete the auth user if profile creation fails
      return { user: null, error: profileResult.error };
    }

    return { user, error: null };
  } catch (error: any) {
     // This will catch attempts to register the admin email if it already exists.
    if (error.code === 'auth/email-already-in-use' && email === ADMIN_EMAIL) {
        return { user: null, error: { message: 'This email is reserved for the admin account.' } };
    }
    return { user: null, error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
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

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}
