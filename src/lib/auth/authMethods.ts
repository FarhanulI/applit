import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth'
import { auth } from '@/config/firebase-config'

export interface AuthError {
  code: string
  message: string
}

export interface SignInData {
  email: string
  password: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any


export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    return userCredential
  } catch (error) {
    throw error
  }
}

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential
  } catch (error) {
    throw error
  }
}


