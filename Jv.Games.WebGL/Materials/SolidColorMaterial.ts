///<reference path="../references.ts" />

module Jv.Games.WebGL.Materials {
    export class SolidColorMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        uniforms: { vColor: Color };

        set color(value: Color) {
            this.uniforms.vColor = value;
        }

        get color() {
            return this.uniforms.vColor;
        }

        constructor(color: Color) {
            super(SolidColorMaterial.materialProgram);
            this.color = color;
        }
    }
}
