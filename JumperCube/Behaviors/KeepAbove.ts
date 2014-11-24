///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class KeepAbove extends Component<Jv.Games.WebGL.Camera> {
        target: GameObject;
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
        }

        update(deltaTime: number) {
            var target = -this.object.globalTransform.invert().multiply(this.target.globalTransform).position.y;

            if (target - this.maxDistance > 0.001) {
                this.rigidBody.push(new Vector3(0, -this.speed, 0));
            }
            else if (target - this.minDistance < -0.001) {
                this.rigidBody.push(new Vector3(0, this.speed, 0));
            }
            else {
                var mid = (this.minDistance + this.maxDistance) / 2;
                var dir = (target < mid)? 1 : -1;

                if (Math.abs(target - mid) > 0.5) {
                    this.rigidBody.push(new Vector3(0, Math.abs(target) * this.speed * dir, 0));
                }
                else {
                    this.rigidBody.momentum._multiply(new Vector3(1, this.stopSpeed, 1));
                }
            }
        }
    }
}
