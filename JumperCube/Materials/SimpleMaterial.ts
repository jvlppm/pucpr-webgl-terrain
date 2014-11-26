///<reference path="../references.ts" />

module JumperCube.Materials {
    import Material = Jv.Games.WebGL.Materials.Material;

    export class SimpleMaterial extends Material {
        setWorld(scene: Jv.Games.WebGL.Scene, cam: Jv.Games.WebGL.Camera) {
            this.setUniform("Pmatrix", cam.projection);
            this.setUniform("Vmatrix", cam.view);

            if (typeof scene.ambientLight !== "undefined")
                this.setUniform("ambientLight", scene.ambientLight);

            if (typeof scene.mainLight !== "undefined") {
                this.setUniform("directionalLightColor", scene.mainLight.color);
                this.setUniform("directionalVector", scene.mainLight.direction);
            }
        }

        setModel(object: Jv.Games.WebGL.GameObject) {
            this.setUniform("Mmatrix", object.globalTransform);
            this.setUniform("Nmatrix", object.globalTransform.invert().transpose());
            super.setModel(object);
        }
    }
}