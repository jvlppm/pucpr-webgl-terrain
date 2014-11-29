///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class CameraFollow extends Component<Jv.Games.WebGL.Camera> {
        target: GameObject;
        targetPosition: Vector3;
        speed = 10;
        stopSpeed = 0.9;
        minDistance = 5;
        maxDistance = 10;
        viewDistance: number;
        rigidBody: RigidBody;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
            this.rigidBody = this.rigidBody || <RigidBody>object.searchComponent(RigidBody);
            this.rigidBody.maxSpeed = this.speed;
        }

        update(deltaTime: number) {
            var target;
            if(typeof this.target !== "undefined")
                target = this.object.globalTransform.invert().multiply(this.target.globalTransform).position;

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
