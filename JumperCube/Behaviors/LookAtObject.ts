///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Keyboard = Jv.Games.WebGL.Keyboard;
    import Component = Jv.Games.WebGL.Components.Component;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class LookAtObject extends Component<Jv.Games.WebGL.Camera> {
        public target: GameObject;

        constructor(public object: Jv.Games.WebGL.Camera, args) {
            super(object);
            this.loadArgs(args);
        }

        update(deltaTime: number) {
            var eye = this.object.globalTransform.position;
            var center = this.target.globalTransform.position;
            var up = new Vector3(0, 1, 0);

            this.object.view = Matrix4.LookAt(eye, center, up);
        }
    }
}
