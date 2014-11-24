///<reference path="../references.ts" />

module JumperCube.Behaviors {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export class Blink extends Jv.Games.WebGL.Components.Component<GameObject> {
        blinkDuration: number = 2;
        blinkInterval: number = 0.1;
        private currentBlinkDuration: number;
        private currentBlinkInterval: number;
        private originalVisibility: boolean;

        get isActive() {
            return this.currentBlinkDuration > 0;
        }

        constructor(object: GameObject, args?: { [prop: string]: any }) {
            super(object);
            super.loadArgs(args);
        }

        update(deltaTime: number) {
            if (this.currentBlinkDuration > 0) {
                this.currentBlinkDuration -= deltaTime;
                this.currentBlinkInterval -= deltaTime;
                if (this.currentBlinkInterval <= 0) {
                    this.currentBlinkInterval = this.blinkInterval;
                    this.object.visible = !this.object.visible;
                }
                if (this.currentBlinkDuration <= 0) {
                    this.object.visible = this.originalVisibility;
                    delete this.originalVisibility;
                }
            }
        }

        onHit() {
            if (this.isActive)
                return;
            this.originalVisibility = this.object.visible;
            this.currentBlinkDuration = this.blinkDuration;
            this.currentBlinkInterval = 0;
        }
    }
} 