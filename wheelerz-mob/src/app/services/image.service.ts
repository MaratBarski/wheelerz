import { Injectable } from '@angular/core'
import { FileImage } from '../models/fileImage'

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  async getPreview(imgfile: any): Promise<FileImage> {
    const res = await this.getImages(imgfile, [200, 500])
    return {
      small: res[0],
      big: res[1]
    }
  }

  async getImages(imgfile: any, width: number[]): Promise<string[]> {
    const res = []
    for (let i = 0; i < width.length; i++)
      res.push(await this.imageChange(imgfile, width[i]))

    return res
  }

  imageChange(imgfile: any, width = 200): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imgfile);
      reader.onload = async () => {
        await this.resizeImage(reader.result as string, width).then((res: any) => {
          resolve(res)
        });
      };
    })
  }

  resizeImage(imageURL: any, width = 200): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image()
      image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(width, image.width)
        const dw = image.width / width
        canvas.height = image.height / dw
        const ctx = canvas.getContext('2d')
        if (ctx != null)
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        var data = canvas.toDataURL('image/jpeg', 1)
        resolve(data);
      };
      image.src = imageURL
    });
  }
}
