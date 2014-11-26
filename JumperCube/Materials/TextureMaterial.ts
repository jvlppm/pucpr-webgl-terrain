///<reference path="../references.ts" />

module JumperCube.Materials {
    import Texture = Jv.Games.WebGL.Materials.Texture;

    export class TextureMaterial extends SimpleMaterial {
        static materialProgram: Jv.Games.WebGL.Core.ShaderProgram;

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
