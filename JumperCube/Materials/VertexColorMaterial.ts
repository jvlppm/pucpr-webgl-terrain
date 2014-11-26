///<reference path="../references.ts" />

module JumperCube.Materials {
    export class VertexColorMaterial extends SimpleMaterial {
        static materialProgram: Jv.Games.WebGL.Core.ShaderProgram;

        constructor() {
            super(VertexColorMaterial.materialProgram);
        }
    }
}
