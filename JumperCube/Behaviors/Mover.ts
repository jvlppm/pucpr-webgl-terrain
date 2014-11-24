///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class Mover extends Jv.Games.WebGL.Components.Component<GameObject> {
        private apply: boolean = true;
        private rigidBody: RigidBody;
        direction: Vector3;
        acceleration = false;
        continuous = true;

        constructor(object: GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
            super.init();
        }

        update(deltaTime: number) {
            if (this.apply || this.continuous) {
                this.rigidBody.push(this.direction, !this.continuous, this.acceleration);
                this.apply = false;
            }
        }
    }
} 