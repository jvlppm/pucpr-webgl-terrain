///<reference path="references.ts" />

module Jv.Games.WebGL {
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export interface IDrawable {
        draw();
    }

    export class Scene extends GameObject {
        cameras: Camera[];
        clearColor: Color;
        drawables: GameObject[];
        ambientLight = Color.Rgb(1, 1, 1);
        mainLight: Materials.DirectionalLight;

        directionalLight: Materials.DirectionalLight;

        constructor(public webgl: Jv.Games.WebGL.Core.WebGL) {
            super();
            this.cameras = [];
            this.drawables = [];
            this.clearColor = Color.Rgb(0, 0, 0);
        }

        update(deltaTime: number) {
            super.update(deltaTime);

            this.cameras.forEach(c => {
                c.update(deltaTime);
            });
        }

        add<Type extends GameObject>(child: Type): Type;
        add(camera: Camera): Camera;
        add<Type extends Components.Component<GameObject>, Arguments>(behaviorType: { new (object: GameObject, args?: Arguments): Type }, args?: Arguments);
        add(item, args?) {
            if (item instanceof Camera) {
                this.cameras.push(item);
                (<Camera>item).parent = this;
                return item;
            }
            else {
                var res = super.add(item);
                if (item instanceof GameObject)
                    this.registerDrawable(<GameObject>item);
                return res;
            }
        }

        registerDrawable(item: GameObject) {
            if (this.drawables.indexOf(item) < 0) {
                var components = item.getComponents(Components.Component, false);
                for (var i in components) {
                    if (typeof (<any>components[i]).draw === "function")
                        this.drawables.push(item);
                }
            }
            item.children.forEach(c => this.registerDrawable(c));
        }

        unregisterDrawable(item: GameObject) {
            var idx = this.drawables.indexOf(item);
            if (idx >= 0)
                this.drawables.splice(idx, 1);
            item.children.forEach(c => this.unregisterDrawable(c));
        }

        init() {
            var gl = this.webgl.context;
            gl.clearColor(this.clearColor.red, this.clearColor.green, this.clearColor.blue, this.clearColor.alpha);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);

            this.children.forEach(c => c.init());
            this.cameras.forEach(c => c.init());
        }

        draw() {
            var gl = this.webgl.context;
            var canvas = this.webgl.canvas;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            for (var ic = 0; ic < this.cameras.length; ic++) {
                var cam = this.cameras[ic];
                gl.viewport(canvas.width * cam.viewport.left, canvas.height * cam.viewport.top, canvas.width * cam.viewport.width, canvas.height * cam.viewport.height);

                var materials = [];

                for (var id = 0; id < this.drawables.length; id++) {
                    var obj = this.drawables[id];
                    var viewCheck = obj;
                    while (typeof viewCheck !== "undefined") {
                        if (!viewCheck.visible)
                            break;
                        viewCheck = viewCheck.parent;
                    }
                    if (typeof viewCheck !== "undefined")
                        continue;

                    var components = obj.getComponents(Components.Component, false);
                    for (var i = 0; i < components.length; i++) {

                        if (typeof (<any>components[i]).draw === "function") {

                            var material = (<MeshRenderer>components[i]).material;
                            if (typeof material !== "undefined" && materials.indexOf(material) < 0) {

                                material.setUniform("Pmatrix", cam.projection);
                                material.setUniform("Vmatrix", cam.view);

                                if (typeof this.ambientLight !== "undefined")
                                    material.setUniform("ambientLight", this.ambientLight);
                                if (typeof this.mainLight !== "undefined") {
                                    material.setUniform("directionalLightColor", this.mainLight.color);
                                    material.setUniform("directionalVector", this.mainLight.direction);
                                }

                                materials.push(material);
                            }

                            (<any>components[i]).draw();
                        }
                    }
                };
            };

            gl.flush();
        }

        private static contains<T>(a: T[], v) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === v) return true;
            }
            return false;
        }

        private static unique<T>(a: T[]) {
            var arr: T[] = [];
            for (var i = 0; i < a.length; i++) {
                if (!Scene.contains(arr, a[i])) {
                    arr.push(a[i]);
                }
            }
            return arr;
        }
    }
}