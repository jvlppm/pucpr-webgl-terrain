///<reference path="../references.ts" />

module Jv.Games.WebGL.Materials {
    export class TextureMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        uniforms: { uSampler: Texture };

        constructor(texture: Texture) {
            super(TextureMaterial.materialProgram);
            this.texture = texture;
        }

        get texture() {
            return this.uniforms.uSampler;
        }

        set texture(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uSampler = value;
        }
    }
}
