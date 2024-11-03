import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoResizerService {

  constructor() { }

  resize(currentWidth: number, 
    currentHeight: number, 
    widthLimit: number, 
    heightLimit: number
  ): { width: number, height: number } {
    let resultWidth = currentWidth;
    let resultHeight = currentHeight;

    const photoRatio = currentWidth / currentHeight;

    if (photoRatio < 1) {
      while ((resultWidth + 1 <= widthLimit) && ((resultWidth + 1) / photoRatio < heightLimit)){
        resultWidth++;
        resultHeight = resultWidth / photoRatio;
      }
    } else {
      while ((resultHeight + 1 <= heightLimit) && ((resultHeight + 1) * photoRatio < widthLimit)){
        resultHeight++;
        resultWidth = resultHeight * photoRatio;
      }
    }

    return { width: resultWidth, height: resultHeight };
  }
}
