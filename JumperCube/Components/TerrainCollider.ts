///<reference path="../references.ts" />

module JumperCube.Components {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Collider = Jv.Games.WebGL.Components.Collider;
    import BoxCollider = Jv.Games.WebGL.Components.AxisAlignedBoxCollider;
    import Terrain = JumperCube.Mesh.Terrain;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class TerrainCollider extends Collider {
        radiusX = 0;
        radiusZ = 0;
        terrain: Terrain;
        tmpVector: Vector3;

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object, args);
            super.loadArgs(args);
            this.tmpVector = new Vector3();
        }

        intersects(collider: Collider, allowsReposition?: boolean) {
            if (collider instanceof BoxCollider) {
                var box = <BoxCollider>collider;
                var distance = collider.object.globalTransform.position.sub(this.object.globalTransform.position);
                distance.y -= this.terrain.getHeight(distance.x, distance.z);

                var outsideArea = box.radiusWidth + this.radiusX < Math.abs(distance.x) ||
                               box.radiusDepth + this.radiusZ < Math.abs(distance.z);

                if (allowsReposition && !outsideArea && distance.y < box.radiusHeight) {
                    this.tmpVector.y = box.radiusHeight - distance.y;
                    box.object.transform._translate(this.tmpVector);
                    distance.y = box.radiusHeight;
                }

                if (outsideArea || box.radiusHeight < Math.abs(distance.y)) {
                    return false;
                }

                return true;
            }
        }
    }
}