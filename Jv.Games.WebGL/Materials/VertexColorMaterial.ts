///<reference path="../references.ts" />

module Jv.Games.WebGL.Materials {
    export class VertexColorMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        constructor() {
            super(VertexColorMaterial.materialProgram);
        }
    }
}
