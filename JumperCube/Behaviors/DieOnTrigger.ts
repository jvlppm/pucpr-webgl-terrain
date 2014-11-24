///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import Component = Jv.Games.WebGL.Components.Component;

    export class DieOnTrigger extends Component<Jv.Games.WebGL.GameObject> {
        dying: boolean;
        scaleY = 1;
        tags: string[];

        constructor(object: Jv.Games.WebGL.GameObject, args) {
            super(object);
            super.loadArgs(args);
            this.dying = false;
        }

        onTrigger(collider: Jv.Games.WebGL.Components.Collider) {
            if (typeof this.tags === "undefined" || this.tags.indexOf(collider.object.tag) >= 0 && !this.dying)
                this.dying = true;
        }

        update() {
            if (this.dying) {
                this.object.transform = this.object.transform.multiply(Jv.Games.WebGL.Matrix4.Scale(1, this.scaleY, 1));
                this.scaleY *= 0.8;

                if (this.scaleY < 0.1) {
                    this.object.destroy();
                }
            }
        }
    }
}
