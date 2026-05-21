import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { productSchema } from '../types/product'
import type { Product, ProductInput } from '../types/product'

const COLLECTION = 'products'

export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export const addProduct = async (input: ProductInput) => {
  const data = productSchema.parse(input)
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id))
}
