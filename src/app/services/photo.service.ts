import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = "photo";
  private plateform: Platform;

  constructor(plateform: Platform) {
    this.plateform = plateform;
  }
  
  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if(this.plateform.is("hybrid")) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      })

      return file.data;
    }
    else { // Web
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => { resolve(reader.result) }
    reader.readAsDataURL(blob);
  })

  // Save picture to file on device
  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    if(this.plateform.is("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      }
    }
    else { // Web
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath!
      }
    }
  }

  public async addNewToGallery(){
    // Take photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    })

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto)
    // unshift ajoute de nouveaux elts au début du tableau
    this.photos.unshift(savedImageFile)

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    })
  } 

  public async loadSaved(){
    // Retrieve cached photo array data
    const photoList = await Preferences.get({ key:this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value!) || [];

    /**
     * On mobile, we can directly set the source of an image tag - <img src="x" /> - to each photo file on the Filesystem, displaying them automatically. 
     * On the web, however, we must read each image from the Filesystem into base64 format, using a new base64 property on the Photo object. 
     * This is because the Filesystem API uses IndexedDB under the hood. 
     */
    if(!this.plateform.is("hybrid")) { // Web
      for(let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        })
  
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg:base64,${readFile.data}`
      }
    }
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    })

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1)
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    })
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
