///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class SwingWhileMoving extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        speed = 16;
        inverse = false;
        axis: Vector3;
        maxSwing = 0.4;
        private moveTime = 0;
        private baseRotation = Matrix4.Identity();
        private rotation = 0;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
            if (typeof this.axis === "undefined")
                throw new Error("A rotation axis must be defined");
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            var momentum = this.rigidBody.momentum.length();

            if (momentum > 0.001) {
                this.moveTime += deltaTime * this.speed;

                var sin = Math.sin(this.moveTime) * this.maxSwing;
                if (this.inverse)
                    sin = -sin;

                this.object.transform._extractRotation(this.baseRotation);
                var toSwing = sin * momentum;
                this.object.transform._rotateByAxis(this.axis, toSwing);
                this.rotation = toSwing;
            }
            else if (Math.abs(this.rotation) > 0.001) {
                this.moveTime = 0;
                this.object.transform._extractRotation(this.baseRotation);
                this.rotation -= this.rotation * deltaTime * 5;
                this.object.transform._rotateByAxis(this.axis, this.rotation);
            }
            else {
                this.moveTime = 0;
                this.object.transform._extractRotation(this.baseRotation);
                this.rotation = 0;
            }
        }
    }
}
