///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;

    export class HitOnTrigger extends Component<Jv.Games.WebGL.GameObject> {
        tags: string[];

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            if (typeof this.tags === "undefined" || this.tags.indexOf(collider.object.tag) >= 0) {
                collider.object.sendMessage("onHit");
            }
        }
    }
}
