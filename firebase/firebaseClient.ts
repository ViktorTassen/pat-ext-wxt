import { getApps, initializeApp } from "firebase/app"
import { getAuth, signInWithCustomToken, setPersistence, indexedDBLocalPersistence } from "firebase/auth/web-extension"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"

export const clientCredentials = {
  apiKey: import.meta.env.VITE_FIREBASE_PUBLIC_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL // Add this for Realtime Database
}

let firebase_app = getApps().length ? getApps()[0] : initializeApp(clientCredentials)

export const auth = getAuth(firebase_app)
export const db = getFirestore(firebase_app)
export const rtdb = getDatabase(firebase_app)

setPersistence(auth, indexedDBLocalPersistence)

// Function to authenticate with Firebase using custom token
export const authenticateWithFirebase = async (uid: string) => {
  try {
    // Exchange UID for a custom token
    const response = await fetch('https://raptor3-web.vercel.app/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get custom token')
    }

    const { customToken } = await response.json()
    if (!customToken) {
      throw new Error('No custom token received')
    }
    
    // Sign in with the custom token
    return signInWithCustomToken(auth, customToken)
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export default firebase_app