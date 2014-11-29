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

            uTex0: (Uniform) => void;
            uTex1: (Uniform) => void;
            uTex2: (Uniform) => void;
            uTex3: (Uniform) => void;
        };
        set texture0(value: Texture) {
            this.uniforms.uTex0 = (u) => u.setTexture(value, 0);
        }
        set texture1(value: Texture) {
            this.uniforms.uTex1 = (u) => u.setTexture(value, 1);
        }
        set texture2(value: Texture) {
            this.uniforms.uTex2 = (u) => u.setTexture(value, 2);
        }
        set texture3(value: Texture) {
            this.uniforms.uTex3 = (u) => u.setTexture(value, 3);
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
