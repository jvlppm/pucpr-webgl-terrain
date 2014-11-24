///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Key = Jv.Games.WebGL.Key;
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class DebugPosition extends Component<Jv.Games.WebGL.GameObject> {
        speed = 1;

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        update(deltaTime: number) {
            var toMove = new Vector3(0, 0, 0);

            if (Keyboard.isKeyDown(Key.E))
                toMove._add(new Vector3(0, this.speed, 0));

            if (Keyboard.isKeyDown(Key.Q))
                toMove._add(new Vector3(0, -this.speed, 0));

            if (Keyboard.isKeyDown(Key.D))
                toMove._add(new Vector3(this.speed, 0, 0));

            if (Keyboard.isKeyDown(Key.A))
                toMove._add(new Vector3(-this.speed, 0, 0));

            if (Keyboard.isKeyDown(Key.W))
                toMove._add(new Vector3(0, 0, this.speed));

            if (Keyboard.isKeyDown(Key.S))
                toMove._add(new Vector3(0, 0, -this.speed));

            if (toMove.length() != 0)
                document.title = "x: " + this.object.transform.x + ", y: " + this.object.transform.y + ", z: " + this.object.transform.z;

            this.object.transform._translate(toMove.scale(deltaTime));
        }
    }
}
