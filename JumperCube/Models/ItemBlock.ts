///<reference path="../references.ts" />

module JumperCube.Models {
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Texture = Jv.Games.WebGL.Materials.Texture;
    import TextureMaterial = Jv.Games.WebGL.Materials.TextureMaterial;
    import AxisAlignedBoxCollider = Jv.Games.WebGL.Components.AxisAlignedBoxCollider;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class ItemBlock extends GameObject {
        static UV = [0, 0, 1, 0, 1, 1, 0, 1];
        collider: AxisAlignedBoxCollider;
        renderer: MeshRenderer;
        private _item: GameObject;
        private toMove: number;
        get item() {
            return this._item;
        }

        set item(value: GameObject) {
            this._item = value;
            if (typeof value !== "undefined") {
                value.enabled = false;
                value.visible = false;
            }
        }

        constructor(context: WebGLRenderingContext, public activeTexture: Texture, public usedTexture: Texture) {
            super();

            this.renderer = new MeshRenderer(this, {
                mesh: new JumperCube.Mesh.Cube(1, 1, 1, context, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV, ItemBlock.UV),
                material: new TextureMaterial(activeTexture)
            });
            this.collider = new AxisAlignedBoxCollider(this, { radiusWidth: 0.5, radiusHeight: 0.5, radiusDepth: 0.5 });

            this.add(new Trigger(c => this.onTrigger(c), 1, 0.5, 1, new Vector3(0, -0.5, 0)));

            this.add(this.renderer);
            this.add(this.collider);
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            var body = <RigidBody>collider.object.searchComponent(RigidBody);
            if (body.momentum.y < 0)
                return;

            (<TextureMaterial>this.renderer.material).texture = this.usedTexture;

            if (typeof this.item !== "undefined" && typeof this.toMove === "undefined") {
                this.item.visible = true;
                this.toMove = 1;
                this.item.transform.x = this.transform.x;
                this.item.transform.y = this.transform.y;
                this.item.transform.z = this.transform.z;
                this.parent.add(this._item);
                this.item.init();
            }
        }

        update(deltaTime: number) {
            if (typeof this._item === "undefined" || typeof this.toMove === "undefined")
                return;

            this.item.transform._translate(new Vector3(0, deltaTime, 0));
            this.toMove -= deltaTime;

            if (this.toMove < 0) {
                delete this.toMove;
                this.item.enabled = true;
                delete this._item;
            }
        }
    }
}