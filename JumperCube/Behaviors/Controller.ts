///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Key = Jv.Games.WebGL.Key;
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class Controller extends Component<Jv.Games.WebGL.GameObject> {
        rigidBody: RigidBody;
        camera: Jv.Games.WebGL.Camera;
        minJumpForce = 1;
        maxJumpForce = 1;
        moveForce = 1;
        private spareJumpForce = 0;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        init() {
            this.rigidBody = this.rigidBody || <RigidBody>this.object.searchComponent(RigidBody);
        }

        update(deltaTime: number) {
            if (Math.abs(this.rigidBody.momentum.y) < 0.001 && this.spareJumpForce === 0) {
                if (Keyboard.isKeyDown(Key.Space)) {
                    this.rigidBody.push(new Vector3(0, this.minJumpForce, 0), true, true);
                    //document.title = "x: " + this.object.globalTransform.x + " z: " + this.object.globalTransform.z + " y: " + this.object.globalTransform.y;
                    if (this.maxJumpForce > this.minJumpForce)
                        this.spareJumpForce = this.maxJumpForce - this.minJumpForce;
                }
            }
            else if (Keyboard.isKeyDown(Key.Space)) {
                if (this.spareJumpForce > 0 && this.rigidBody.momentum.y > 0) {
                    var addToJump = this.minJumpForce * 20 * deltaTime;
                    this.spareJumpForce -= addToJump;
                    if (this.spareJumpForce < 0) {
                        addToJump += this.spareJumpForce;
                        this.spareJumpForce = 0;
                    }
                    this.rigidBody.push(new Vector3(0, addToJump, 0), true, true);
                }
            }
            else this.spareJumpForce = 0;

            var objt = this.object.globalTransform;

            var forward = this.camera.view.multiply(this.camera.globalTransform).invert()
                .multiply(objt.invert())
                .transform(new Vector3(0, 0, -1));
            forward._multiply(new Vector3(1, 0, 1));

            var right = forward.cross(new Vector3(0, -1, 0));

            var toMove = new Vector3(0, 0, 0);

            if (Keyboard.isKeyDown(Key.Up))
                toMove._add(forward);

            if (Keyboard.isKeyDown(Key.Down))
                toMove._add(forward.scale(-1));

            if (Keyboard.isKeyDown(Key.Right))
                toMove._add(right.scale(-1));

            if (Keyboard.isKeyDown(Key.Left))
                toMove._add(right);

            if (toMove.x !== 0 || toMove.y !== 0 || toMove.z !== 0)
                toMove = toMove.normalize().scale(this.moveForce);

            this.rigidBody.push(toMove);
        }
    }
}
