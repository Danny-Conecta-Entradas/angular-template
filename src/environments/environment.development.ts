// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// const analytics = getAnalytics(firebaseApp)

const firebaseStorage = getStorage(firebaseApp)


const environment = {

  // Booleans to identify the current environment

  isLocal: false as boolean,

  isDevelopment: true as boolean,

  isTest: false as boolean,

  isProduction: false as boolean,

  // General environment settings

  apiURL: '',

  firebaseConfig,

  firebaseApp,

  firebaseStorage,

} as const

export default environment
