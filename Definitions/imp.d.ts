/**
 * Created by joao on 25/11/14.
 */
declare class imp {
    static getImageData(img: HTMLImageElement): ImageData;
    static requestImage(url: string): Promise<HTMLImageElement>;
    static requestImageData(url: string): Promise<ImageData>;
    static getRGB(pixels: ImageData, x: number, y: number);
}