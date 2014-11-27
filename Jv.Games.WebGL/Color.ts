///<reference path="references.ts" />

module Jv.Games.WebGL {
    export class Color {
        hasAlphaChannel: boolean;

        constructor(public data: Float32Array, public startIndex: number = 0) {
            if (data.length == 3)
                this.hasAlphaChannel = false;
            else if (data.length == 4)
                this.hasAlphaChannel = true;
            else
                throw new Error("Invalid color data");
        }

        static Rgb(red: number, green: number, blue: number, alpha?: number) {
            if (typeof alpha === "undefined") {
                return new Color(new Float32Array([red, green, blue]));
            }

            return new Color(new Float32Array([red, green, blue, alpha]));
        }

        get red(): number {
            return this.data[this.startIndex];
        }

        set red(value: number) {
            this.data[this.startIndex] = value;
        }

        get green(): number {
            return this.data[this.startIndex + 1];
        }

        set green(value: number) {
            this.data[this.startIndex + 1] = value;
        }

        get blue(): number {
            return this.data[this.startIndex + 2];
        }

        set blue(value: number) {
            this.data[this.startIndex + 2] = value;
        }

        get alpha(): number {
            if (this.hasAlphaChannel)
                return this.data[this.startIndex + 3];
        }

        set alpha(value: number) {
            if (!this.hasAlphaChannel)
                throw new Error("Trying to set alpha on non transparent color");

            var hasAlpha = true;
            if (typeof value === "undefined") {
                hasAlpha = false;
                value = 1;
            }

            this.data[this.startIndex + 3] = value;
            this.hasAlphaChannel = hasAlpha;
        }
    }
}