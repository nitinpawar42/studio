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

export async function signInWithGoogleAsAdmin() {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    if (user.email !== ADMIN_EMAIL) {
      await firebaseSignOut(auth);
      return { user: null, error: { message: 'This account is not authorized for admin access.' } };
    }

    // Check if user profile exists, if not, create it
    let profileResult = await getUserProfile(user.uid);

    if (profileResult.error && (profileResult.error as any).code === 'not-found') {
      const adminProfileData: Omit<UserProfile, 'uid'> = {
        email: user.email,
        displayName: user.displayName || 'Admin',
        role: 'admin',
        approved: true,
      };
      await createUserProfile(user.uid, adminProfileData);
      profileResult = await getUserProfile(user.uid);
    }

    if (profileResult.error) {
      await firebaseSignOut(auth);
      return { user: null, error: profileResult.error };
    }
    
    const profile = (profileResult as { profile: UserProfile | null }).profile;

    if (profile?.role !== 'admin') {
       await firebaseSignOut(auth);
       return { user: null, error: { message: 'This account does not have admin privileges.' } };
    }
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}


export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const { profile, error: profileError } = await getUserProfile(user.uid);
    
    if (profileError || !profile) {
         await firebaseSignOut(auth);
         return { user: null, error: { message: "Could not find a user profile for this account." } };
    }
    
    // Check if the role matches
    if(profile.role !== 'reseller') {
        await firebaseSignOut(auth);
        return { user: null, error: { message: `You are not authorized to log in as a reseller.` } };
    }

    if (profile.role === 'reseller' && !profile.approved) {
        await firebaseSignOut(auth);
        return { user: null, error: { message: "Your reseller account is pending approval. You'll be notified once it's approved." } };
    }
    
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
