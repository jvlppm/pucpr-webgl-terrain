///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class Follow extends Component<Jv.Games.WebGL.Camera> {
        target: GameObject;
        targetPosition: Vector3;
        speed = 10;
        stopSpeed = 0.9;
        minDistance = 5;
        maxDistance = 10;
        viewDistance: number;
        rigidBody: RigidBody;
        private lastRandomTargetTime: number;
        private originalPosition: Vector3;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
            this.rigidBody.maxSpeed = this.speed;
            this.lastRandomTargetTime = 0;
        }

        update(deltaTime: number) {
            if (typeof this.originalPosition === "undefined")
                this.originalPosition = this.object.transform.position;

            var target;
            if(typeof this.target !== "undefined")
                target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;

            this.lastRandomTargetTime -= deltaTime;

            if (typeof this.viewDistance === "number" || typeof target === "undefined") {
                if (typeof target === "undefined" || target.length() > this.viewDistance) {
                    var distFromOrig = this.object.transform.position.sub(this.originalPosition);
                    if (distFromOrig.length() > (this.maxDistance + this.viewDistance) / 2) {
                        this.lastRandomTargetTime = 1;
                        this.targetPosition = new Vector3(-distFromOrig.x, 0, -distFromOrig.z);
                    }
                    if (this.lastRandomTargetTime <= 0) {
                        this.lastRandomTargetTime = 1;
                        this.targetPosition = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
                    }
                    this.rigidBody.push(this.targetPosition.normalize().scale(this.speed));
                    return;
                }
            }

            this.targetPosition = target;

            var targetXZ = new Vector3(this.targetPosition.x, 0, this.targetPosition.z);

            if (targetXZ.length() - this.maxDistance > 0.001) {
                var moveMomentum = targetXZ.normalize().scale(this.speed * Math.min((targetXZ.length() - this.maxDistance), 1));
                this.rigidBody.momentum = new Vector3(moveMomentum.x, this.rigidBody.momentum.y, moveMomentum.z);
            }
            else if (targetXZ.length() - this.minDistance < -0.001) {
                var moveMomentum = targetXZ.normalize().scale(-this.speed * Math.min((this.minDistance - targetXZ.length()), 1));
                this.rigidBody.momentum = new Vector3(moveMomentum.x, this.rigidBody.momentum.y, moveMomentum.z);
            }
            else {
                var mid = (this.minDistance + this.maxDistance) / 2;
                var dir = (targetXZ.length() > mid)? 1 : -1;

                if (Math.abs(targetXZ.length() - mid) > 0.5)
                    this.rigidBody.push(targetXZ.normalize().scale(this.speed * dir));
                else
                    this.rigidBody.momentum = this.rigidBody.momentum.scale(this.stopSpeed);
            }
        }
    }
}
