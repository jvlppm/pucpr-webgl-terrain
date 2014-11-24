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

        setUniforms() {
            for (var name in this.uniforms)
                this.setUniform(name, this.uniforms[name]);
        }

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

            throw new Error("Uniform type not supported");
        }

        static initAll(context: WebGLRenderingContext) {
            return Promise.all([
                Material.initShader(context, SolidColorMaterial),
                Material.initShader(context, VertexColorMaterial),
                Material.initShader(context, TextureMaterial)
            ]);
        }

        static initShader<Type extends Material>(context: WebGLRenderingContext, material: { materialProgram: Core.ShaderProgram; new (...args: any[]): Type }) {
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

    export class SolidColorMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        uniforms: { vColor: Color };

        set color(value: Color) {
            this.uniforms.vColor = value;
        }

        get color() {
            return this.uniforms.vColor;
        }

        constructor(color: Color) {
            super(SolidColorMaterial.materialProgram);
            this.color = color;
        }
    }

    export class VertexColorMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        constructor() {
            super(VertexColorMaterial.materialProgram);
        }
    }

    export class TextureMaterial extends Material {
        static materialProgram: Core.ShaderProgram;

        uniforms: { uSampler: Texture };

        constructor(texture: Texture) {
            super(TextureMaterial.materialProgram);
            this.texture = texture;
        }

        get texture() {
            return this.uniforms.uSampler;
        }

        set texture(value: Texture) {
            if (typeof value === "undefined")
                throw new Error("Texture cannot be undefined");
            this.uniforms.uSampler = value;
        }
    }
}