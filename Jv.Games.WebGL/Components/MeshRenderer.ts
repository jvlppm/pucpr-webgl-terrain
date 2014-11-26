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
            if (typeof this.material === "undefined")
                throw new Error("No material specified for MeshRenderer");
        }

        draw() {
            this.mesh.draw(this.material);
        }
    }
}