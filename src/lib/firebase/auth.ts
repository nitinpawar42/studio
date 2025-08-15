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
  role: 'customer' | 'reseller' | 'admin'
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    const profileResult = await createUserProfile(user.uid, {
      displayName: name,
      email: user.email,
      role: role,
    });

    if ('error' in profileResult) {
      // Handle error creating profile, maybe delete the auth user
      // For now, we'll just return the error
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
    return { user: null, error };
  }
}

export async function signInWithGoogle(role: 'customer' | 'reseller' | 'admin' = 'customer') {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);
    if ('error' in existingProfile) {
        // If it's a 'not-found' error, we can proceed to create the profile
        if ((existingProfile.error as any)?.code !== 'not-found') {
            return { user: null, error: existingProfile.error };
        }
    }
    
    if (!existingProfile.profile) {
        // Create user profile in Firestore if it doesn't exist
        const profileResult = await createUserProfile(user.uid, {
            displayName: user.displayName,
            email: user.email,
            role: role,
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
