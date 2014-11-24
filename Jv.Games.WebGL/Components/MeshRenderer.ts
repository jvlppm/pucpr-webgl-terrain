///<reference path="../references.ts" />

module Jv.Games.WebGL.Components {
    export class MeshRenderer extends Component<GameObject> implements IDrawable {
        mesh: Mesh;
        material: Jv.Games.WebGL.Materials.Material;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);

            if (typeof this.mesh === "undefined")
                throw new Error("No mesh specified for MeshRenderer");
            this.material = this.material || new Jv.Games.WebGL.Materials.VertexColorMaterial();
        }

        draw() {
            this.material.program.use();
            this.material.setUniform("Mmatrix", this.object.globalTransform);
            this.material.setUniform("Nmatrix", this.object.globalTransform.invert().transpose());
            this.material.setUniforms();
            this.mesh.draw(this.material);
        }
    }
}