///<reference path="../references.ts" />

module JumperCube.Materials {
    import Color = Jv.Games.WebGL.Color;

    export class SolidColorMaterial extends SimpleMaterial {
        static materialProgram: Jv.Games.WebGL.Core.ShaderProgram;

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
