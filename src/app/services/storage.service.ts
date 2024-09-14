import { Injectable } from '@angular/core'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import environment from 'src/environments/environment'

// https://github.com/angular/angularfire/blob/main/docs/storage.md
// https://firebase.google.com/docs/storage/web/download-files

@Injectable({
  providedIn: 'root',
})
export default class StorageService {

  readonly storage = environment.firebaseStorage

  /**
   * Uploads file to Google Cloud Storage and returns download URL
   */
  async uploadFile(file: File) {
    const fileStoragePath = `${Date.now()}_${file.name}`

    const storageRef = ref(this.storage, fileStoragePath)

    const uploadTask = uploadBytesResumable(storageRef, file)

    await uploadTask.then()

    const fileURL = await getDownloadURL(storageRef)

    return fileURL
  }

}
