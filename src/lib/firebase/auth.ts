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
    // If the admin user already exists in auth, this might fail.
    // We check if it's the admin email and if so, we create the profile.
    if (error.code === 'auth/email-already-in-use' && email === ADMIN_EMAIL) {
       try {
           const { user: signedInUser } = await signInWithEmailAndPassword(auth, email, data.password);
            let profileResult = await getUserProfile(signedInUser.uid);
            if (profileResult.error && (profileResult.error as any).code === 'not-found') {
                 const adminProfileData: Omit<UserProfile, 'uid'> = {
                    email: signedInUser.email,
                    displayName: 'Admin',
                    role: 'admin',
                    approved: true,
                };
                await createUserProfile(signedInUser.uid, adminProfileData);
            }
           return { user: signedInUser, error: null };
       } catch (signInError: any) {
            return { user: null, error: signInError };
       }
    }
    return { user: null, error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    // If sign in fails and it's the admin email, try to create the account.
    if (error.code === 'auth/user-not-found' && email === ADMIN_EMAIL) {
        try {
            const adminData = {
                email: ADMIN_EMAIL,
                password: 'Nirved@12345', // As per your instruction
                displayName: 'Admin'
            };
            const { user, error: creationError } = await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
            if(creationError || !user) {
                return { user: null, error: creationError || 'Failed to create admin user.'};
            }
            await updateProfile(user, { displayName: adminData.displayName });

            const adminProfileData: Omit<UserProfile, 'uid'> = {
                displayName: adminData.displayName,
                email: user.email,
                role: 'admin',
                approved: true
            };
            await createUserProfile(user.uid, adminProfileData);
            
            // Return the newly created user
            return { user, error: null };

        } catch (creationError) {
             return { user: null, error: creationError as any };
        }
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
