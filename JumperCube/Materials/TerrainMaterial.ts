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
            uSpecularMaterial: Color;
            uSpecularPower: number;

            isClipping: boolean;
            clipPlane: Matrix4;

            uTex0: Texture;
            uTex1: Texture;
            uTex2: Texture;
            uTex3: Texture;
        };
        set texture0(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex0 = value;
        }
        set texture1(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex1 = value;
        }
        set texture2(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex2 = value;
        }
        set texture3(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uTex3 = value;
        }
        set ambient(value: Color) {
            this.uniforms.uAmbientMaterial = value;
        }
        set diffuse(value: Color) {
            this.uniforms.uDiffuseMaterial = value;
        }
        set specular(value: Color) {
            this.uniforms.uSpecularMaterial = value;
        }
        set specularPower(value: number) {
            this.uniforms.uSpecularPower = value;
        }
        set clipPane(value: Matrix4) {
            this.uniforms.clipPlane = value;
            this.uniforms.isClipping = typeof(value) !== "undefined";
        }


        get texture0(): Texture {
            return this.uniforms.uTex0;
        }
        get texture1(): Texture {
            return this.uniforms.uTex1;
        }
        get texture2(): Texture {
            return this.uniforms.uTex2;
        }
        get texture3(): Texture {
            return this.uniforms.uTex3;
        }
        get ambient() {
            return this.uniforms.uAmbientMaterial;
        }
        get diffuse() {
            return this.uniforms.uDiffuseMaterial;
        }
        get specular() {
            return this.uniforms.uSpecularMaterial;
        }
        get specularPower() {
            return this.uniforms.uSpecularPower;
        }
        get clipping() {
            return this.uniforms.isClipping;
        }
        get clipPane() {
            return this.uniforms.clipPlane;
        }

        constructor() {
            super(TerrainMaterial.materialProgram);
            this.ambient = Color.Rgb(1, 1, 1);
            this.diffuse = Color.Rgb(1, 1, 1);
            this.specular = Color.Rgb(0, 0, 0);
            this.clipping = false;
        }

        setWorld(scene: Jv.Games.WebGL.Scene, cam: Jv.Games.WebGL.Camera) {
            this.setUniform("uProjection", cam.projection);
            this.setUniform("uView", cam.view);
            this.setUniform("uEyePos", cam.globalTransform.position);

            if (typeof scene.ambientLight !== "undefined")
                this.setUniform("uAmbientLight", scene.ambientLight);

            if (typeof scene.mainLight !== "undefined") {
                this.setUniform("uDiffuseLight", scene.mainLight.color);
                this.setUniform("uLightDir", scene.mainLight.direction);
            }

            if (typeof scene.specularLight !== "undefined")
                this.setUniform("uSpecularLight", scene.specularLight);
        }

        setModel(object: Jv.Games.WebGL.GameObject) {
            this.setUniform("uModel", object.globalTransform);
            super.setModel(object);
        }
    }
}
