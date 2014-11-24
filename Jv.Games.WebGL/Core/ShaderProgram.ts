///<reference path="../references.ts" />

module Jv.Games.WebGL.Core {

    export enum ShaderType {
        Vertex,
        Fragment
    }

    export class ShaderProgram {
        program: WebGLProgram;

        constructor(public context: WebGLRenderingContext) {
            this.program = context.createProgram();
        }

        addShader(type: ShaderType, source: {}[]);
        addShader(type: ShaderType, source: string);
        addShader(type: ShaderType, source) {
            var gl = this.context;

            var shader = this.createShader(type, ShaderProgram.ReadSource(source));
            gl.attachShader(this.program, shader);
        }

        link() {
            var gl = this.context;
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                throw new Error("ShaderProgram could not be linked");
        }

        use() {
            var gl = this.context;
            gl.useProgram(this.program);
        }

        //////////
        // Attributes
        enableVertexAttribute(name: string) {
            var attribute = this.getVertexAttribute(name);
            if(typeof attribute !== "undefined")
                attribute.enable();
        }

        getVertexAttribute(name: string): VertexAttribute {
            var gl = this.context;

            var index = this.getAttribLocation(name);
            if (index >= 0) {
                var vertexAttribute = new VertexAttribute(this, index);
                return vertexAttribute;
            }
        }

        getAttribLocation(name: string) {
            var gl = this.context;
            return gl.getAttribLocation(this.program, name);
        }

        //////////
        // Uniforms
        getUniform(name: string): Uniform {
            var gl = this.context;
            var location = this.getUniformLocation(name);
            if (typeof location === "undefined")
                throw new Error("Uniform location not found: " + name);

            return new Uniform(this, location);
        }

        setUniform(name: string, value: Matrix4) {
            var gl = this.context;
            var uniformLocation = gl.getUniformLocation(this.program, name);
            if (typeof uniformLocation !== "undefined")
                gl.uniformMatrix4fv(uniformLocation, false, value.data);
        }

        getUniformLocation(name: string) {
            var gl = this.context;
            return gl.getUniformLocation(this.program, name);
        }

        //////////
        // Private
        private createShader(type: ShaderType, source: string): WebGLShader {
            var gl = this.context;

            var glShaderType = this.getShaderTypeId(type);
            var shader = gl.createShader(glShaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw new Error(ShaderType[type] + "Shader could not be compiled: " + gl.getShaderInfoLog(shader));

            return shader;
        }

        private getShaderTypeId(type: ShaderType) {
            var gl = this.context;
            switch (type) {
                case ShaderType.Vertex:
                    return gl.VERTEX_SHADER;
                case ShaderType.Fragment:
                    return gl.FRAGMENT_SHADER;
                default:
                    throw new Error("Unknown shader type " + type);
            }
        }

        static ReadSource(source, ident = -1): string {
            if (source instanceof Array) {
                var content = (<Array<any>>source).map(i => ShaderProgram.ReadSource(i, ident + 1)).join("\n");
                if (ident < 0)
                    return content;
                return ShaderProgram.Ident("{\n", ident) + content + "\n" + ShaderProgram.Ident("}", ident);
            }
            return ShaderProgram.Ident(source, ident);
        }

        static Ident(line: string, size: number) {
            if (size < 0)
                return line;
            return new Array(size * 4 + 1).join(" ") + line;
        }
    }
}
