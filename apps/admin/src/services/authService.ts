import { auth } from '@ecommerce/shared'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)
