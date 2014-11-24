///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;

    export class Bouncy extends Component<Jv.Games.WebGL.GameObject> {
        force = new Jv.Games.WebGL.Vector3(0, 2, 0);
        tags: string[];

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            if (typeof this.force !== "undefined" && this.tags.indexOf(collider.object.tag) >= 0) {
                var body = <RigidBody>collider.object.searchComponent(RigidBody);
                for (var i = 0; i < 3; i++) {
                    //if (body.momentum.getData(i) < 0 != this.force.getData(i) < 0)
                    //    body.momentum.setData(i, 0);
                    if (this.force.getData(i) != 0)
                        body.momentum.setData(i, 0);
                }
                body.push(this.force, true);
            }
        }
    }
}
