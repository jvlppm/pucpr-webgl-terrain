///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class RotateWhileJumping extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        speed = 1;
        private resetTransform = false;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            if (this.rigidBody.momentum.y !== 0) {
                this.object.transform._rotateByAxis(this.object.transform.transform(new Vector3(1, 0, 0)), this.speed * deltaTime);
                this.resetTransform = true;
            }
            else if (this.resetTransform) {
                this.object.transform = Matrix4.Translate(this.object.transform.position);
                this.resetTransform = false;
            }
        }
    }
}
