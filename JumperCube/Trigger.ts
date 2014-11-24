///<reference path="references.ts" />

module JumperCube {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Collider = Jv.Games.WebGL.Components.Collider;
    import AxisAlignedBoxCollider = Jv.Games.WebGL.Components.AxisAlignedBoxCollider;
    import Vector3 = Jv.Games.WebGL.Vector3;


    export class Trigger extends GameObject {
        collider: Collider;

        constructor(public onTriggerAction: (collider: Collider) => void, width: number, height: number, depth: number, position: Vector3) {
            super();
            this.transform = this.transform.translate(position);
            this.collider = new AxisAlignedBoxCollider(this, { isTrigger: true, radiusWidth: width / 2, radiusHeight: height / 2, radiusDepth: depth / 2 });
            this.add(this.collider);
        }

        onTrigger(collider: Collider) {
            if (typeof this.onTriggerAction !== "undefined")
                this.onTriggerAction(collider);
        }
    }
}