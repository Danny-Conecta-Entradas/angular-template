// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

import dev_environment from './environment.development'
import test_environment from './environment.test'
import production_environment from './environment.production'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// const analytics = getAnalytics(firebaseApp)

const firebaseStorage = getStorage(firebaseApp)


const environment = {

  // Booleans to identify the current environment

  isLocal: true as boolean,

  isDevelopment: false as boolean,

  isTest: false as boolean,

  isProduction: false as boolean,

  // General environment settings

  apiURL: '' as string,

  firebaseConfig,

  firebaseApp,

  firebaseStorage,

} as const

export default environment

/*
  Uncomment depending on the environment of interest to check.
  (Must comment the firebaseApp and firebaseStorage variables to avoid conflicts)
*/

// export default dev_environment
// export default test_environment
// export default production_environment
