///<reference path="../references.ts" />

module JumperCube.Materials {
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Color = Jv.Games.WebGL.Color;
    import Material = Jv.Games.WebGL.Materials.Material;
    import Texture = Jv.Games.WebGL.Materials.Texture;

    export class TerrainMaterial extends Material {
        static materialProgram: Jv.Games.WebGL.Core.ShaderProgram;

        uniforms: {
            uAmbientMaterial: Color;
            uDiffuseMaterial: Color;
            uSpecularPower: number;
            isClipping: boolean;
            clipPlane: Matrix4;

            uTex0: Texture;
            uTex1: Texture;
            uTex2: Texture;
            uTex3: Texture;
        };

        get texture0(): Texture {
            return this.uniforms.uTex0;
        }

        set texture0(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex0 = value;
        }

        get texture1(): Texture {
            return this.uniforms.uTex1;
        }

        set texture1(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex1 = value;
        }

        get texture2(): Texture {
            return this.uniforms.uTex2;
        }

        set texture2(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex2 = value;
        }

        get texture3(): Texture {
            return this.uniforms.uTex3;
        }

        set texture3(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex3 = value;
        }

        set color(value: Color) {
            this.uniforms.uDiffuseMaterial = value;
        }

        get color() {
            return this.uniforms.uDiffuseMaterial;
        }

        set ambient(value: Color) {
            this.uniforms.uAmbientMaterial = value;
        }

        get ambient() {
            return this.uniforms.uAmbientMaterial;
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

        constructor() {
            super(TerrainMaterial.materialProgram);
            this.ambient = Color.Rgb(1, 1, 1);
            this.clipping = false;
        }

        setWorld(scene: Jv.Games.WebGL.Scene, cam: Jv.Games.WebGL.Camera) {
            this.setUniform("uProjection", cam.projection);
            this.setUniform("uView", cam.view);
            this.setUniform("uEyePos", cam.globalTransform.position);

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
