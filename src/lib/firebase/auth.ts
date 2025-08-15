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

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  role: 'reseller' | 'admin'
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    // Admins are approved by default, resellers are not.
    const isApproved = role === 'admin';

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

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}
