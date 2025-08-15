// lib/firebase/auth.ts
'use server';
import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from './firestore';

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  role: 'customer' | 'reseller'
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    const isApproved = role !== 'reseller';

    // Create user profile in Firestore
    const profileResult = await createUserProfile(user.uid, {
      displayName: name,
      email: user.email,
      role: role,
      approved: isApproved,
    });

    if ('error' in profileResult) {
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
    const user = userCredential.user;

    const profileResult = await getUserProfile(user.uid);
    if ('error' in profileResult) {
        // Allow login if profile doesn't exist yet, it might be a legacy user
    } else if (profileResult.profile) {
        const profile = profileResult.profile;
        if (profile.role === 'reseller' && !profile.approved) {
            await firebaseSignOut(auth);
            return { user: null, error: { message: "Your reseller account is pending approval. You'll be notified once it's approved." } };
        }
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

export async function signInWithGoogle(role: 'customer' | 'reseller' | 'admin' = 'customer') {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const existingProfileResult = await getUserProfile(user.uid);
     if ('error' in existingProfileResult && (existingProfileResult.error as any)?.code !== 'not-found') {
        return { user: null, error: existingProfileResult.error };
    }

    const existingProfile = 'profile' in existingProfileResult ? existingProfileResult.profile : null;

    if (existingProfile) {
        // User exists, check for approval if they are a reseller
        if (existingProfile.role === 'reseller' && !existingProfile.approved) {
            await firebaseSignOut(auth);
            return { user: null, error: { message: "Your reseller account is pending approval." } };
        }
    } else {
      // Profile doesn't exist, create a new one
      const isApproved = role !== 'reseller';
      const profileResult = await createUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        role: role,
        approved: isApproved,
      });

      if ('error' in profileResult) {
        return { user: null, error: profileResult.error };
      }
    }

    return { user, error: null };
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
