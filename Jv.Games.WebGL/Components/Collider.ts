﻿///<reference path="../references.ts" />

module Jv.Games.WebGL.Components {
    export interface Reposition {
        height: boolean;
    }

    export class Collider extends Component<GameObject> {
        isTrigger = false;

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        intersects(collider: Collider, reposition?: Reposition) { }
    }

    export class AxisAlignedBoxCollider extends Collider {
        radiusWidth = 0.5;
        radiusHeight = 0.5;
        radiusDepth = 0.5;
        inverse: boolean;

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object, args);
            this.inverse = false;
            super.loadArgs(args);
        }

        intersects(collider: Collider) {
            if (collider instanceof AxisAlignedBoxCollider) {
                if (this.intersectsWithAABB(<AxisAlignedBoxCollider>collider))
                    return this.inverse === (<AxisAlignedBoxCollider>collider).inverse;
                return this.inverse !== (<AxisAlignedBoxCollider>collider).inverse;
            }
            if (collider instanceof SphereCollider)
                return this.intersectsWithSphere(<SphereCollider>collider);
        }

        intersectsWithAABB(box: AxisAlignedBoxCollider) {
            var center = this.object.globalTransform.position;
            var otherCenter = box.object.globalTransform.position;

            if (Math.abs(center.x - otherCenter.x) > (this.radiusWidth + box.radiusWidth)) return false;
            if (Math.abs(center.y - otherCenter.y) > (this.radiusHeight + box.radiusHeight)) return false;
            if (Math.abs(center.z - otherCenter.z) > (this.radiusDepth + box.radiusDepth)) return false;
            return true;
        }

        intersectsWithSphere(sphere: SphereCollider) {
            var center = this.object.globalTransform.position;
            var otherCenter = sphere.object.globalTransform.position;

            if (Math.abs(center.x - otherCenter.x) > (this.radiusWidth + sphere.radius)) return false;
            if (Math.abs(center.y - otherCenter.y) > (this.radiusHeight + sphere.radius)) return false;
            if (Math.abs(center.z - otherCenter.z) > (this.radiusDepth + sphere.radius)) return false;
            return true;
        }
    }

    export class SphereCollider extends Collider {
        radius = 0.5;

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object, args);
            super.loadArgs(args);
        }

        intersects(collider: Collider) {
            if (collider instanceof SphereCollider) {
                var distance = collider.object.transform.position.sub(this.object.transform.position);
                return distance.length() <= this.radius + (<SphereCollider>collider).radius;
            }
        }
    }
}