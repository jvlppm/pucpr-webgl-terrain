///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import Matrix4 = Jv.Games.WebGL.Matrix4;

    export class ViewModel extends Component<Jv.Games.WebGL.GameObject> {
        speedX = 0;
        speedY = 1;
        speedZ = 0;

        constructor(object: Jv.Games.WebGL.GameObject, args: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        update(deltaTime: number) {
            this.object.transform._rotateX(this.speedX * deltaTime);
            this.object.transform._rotateY(this.speedY * deltaTime);
            this.object.transform._rotateZ(this.speedZ * deltaTime);
        }
    }
}