///<reference path="../references.ts" />

module Jv.Games.WebGL.Materials {
    export class Material {
        constructor(public program: Core.ShaderProgram) {
            if (typeof program === "undefined") {
                throw new Error("Material not initialized");
            }
            this.uniforms = {};
        }

        uniforms: {};

        setWorld(scene: Jv.Games.WebGL.Scene, cam: Jv.Games.WebGL.Camera) {
        }

        setModel(object: Jv.Games.WebGL.GameObject) {
            this.setUniforms();
        }

        setUniforms() {
            for (var name in this.uniforms)
                this.setUniform(name, this.uniforms[name]);
        }

        setUniform(name: string, value: boolean);
        setUniform(name: string, value: Color);
        setUniform(name: string, value: Matrix4);
        setUniform(name: string, value: Texture);
        setUniform(name: string, value: Vector3);
        setUniform(name: string, value) {
            this.program.use();
            if (value instanceof Matrix4) {
                this.program.getUniform(name).setMatrix4(value);
                return;
            }
            if (value instanceof Color) {
                this.program.getUniform(name).setColor(value);
                return;
            }
            if (value instanceof Texture) {
                this.program.getUniform(name).setTexture(value);
                return;
            }
            if (value instanceof Vector3) {
                this.program.getUniform(name).setVector(value);
                return;
            }

            switch (typeof value) {
                case "boolean":
                    this.program.getUniform(name).setInt(value? 1 : 0);
                    return;
                case "number":
                    this.program.getUniform(name).setFloat(value);
                    return;
                default:
                    throw new Error("Uniform type not supported");
            }
        }

        static initAll(context: WebGLRenderingContext, materials: { materialProgram: Core.ShaderProgram; new (...args: any[]) }[]) {
            return Promise.all(materials.map(m => Material.initShader(context, m)));
        }

        static initShader<Type extends Material>(context: WebGLRenderingContext, material: { materialProgram: Core.ShaderProgram; new (...args: any[]) }) {
            var name = Material.GetName(material);

            var program: Core.ShaderProgram = new Core.ShaderProgram(context);

            var loadFile = (type: Core.ShaderType, extension: string) => {
                return new Promise((resolve, reject) => {
                    $.get("Shaders/" + name + extension, { dataType: "text" })
                        .then(content => {
                            program.addShader(type, content);
                            resolve();
                        })
                        .fail(reject);
                });
            };

            var loadAllFiles: Promise<any>[] = [
                loadFile(Core.ShaderType.Vertex, ".vs"),
                loadFile(Core.ShaderType.Fragment, ".fs") ];

            return Promise.all(loadAllFiles).then(() => {
                program.link();
                material.materialProgram = program;
            });
        }

        static GetName<Type extends Material>(type: { new (...args: any[]): Type }) {
            var ret = type.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }
    }
}