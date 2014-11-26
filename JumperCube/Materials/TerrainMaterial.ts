///<reference path="../references.ts" />

module JumperCube.Materials {
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Color = Jv.Games.WebGL.Color;
    import Material = Jv.Games.WebGL.Materials.Material;

    export class TerrainMaterial extends Material {
        static materialProgram: Jv.Games.WebGL.Core.ShaderProgram;

        uniforms: {
            uDiffuseMaterial: Color;
            uSpecularPower: number;
            isClipping: boolean;
            clipPlane: Matrix4;
        };

        set color(value: Color) {
            this.uniforms.uDiffuseMaterial = value;
        }

        get color() {
            return this.uniforms.uDiffuseMaterial;
        }

        set specularPower(value: number) {
            this.uniforms.uSpecularPower = value;
        }

        get specularPower() {
            return this.uniforms.uSpecularPower;
        }

        set clipping(value: boolean) {
            this.uniforms.isClipping = value;
        }

        get clipping() {
            return this.uniforms.isClipping;
        }

        set clipPane(value: Matrix4) {
            this.uniforms.clipPlane = value;
        }

        get clipPane() {
            return this.uniforms.clipPlane;
        }

        constructor(color: Color) {
            super(SolidColorMaterial.materialProgram);
            this.color = color;
        }

        setWorld(scene: Jv.Games.WebGL.Scene, cam: Jv.Games.WebGL.Camera) {
            this.setUniform("uProjection", cam.projection);
            this.setUniform("uView", cam.view);

            if (typeof scene.ambientLight !== "undefined")
                this.setUniform("uAmbientLight", scene.ambientLight);

            if (typeof scene.mainLight !== "undefined") {
                this.setUniform("uSpecularLight", scene.mainLight.color);
                this.setUniform("uLightDir", scene.mainLight.direction);
            }
        }

        setModel(object: Jv.Games.WebGL.GameObject) {
            this.setUniform("uModel", object.globalTransform);
            super.setModel(object);
        }
    }
}
