///<reference path="../references.ts" />

module Jv.Games.WebGL.Core {
    export class BufferAttribute {
        vertexAttribute: VertexAttribute;

        constructor(public name: string, public size: number, public type: Jv.Games.WebGL.Core.DataType, public normalized: boolean, public stride: number, public offset: number) {
        }
    }

    export class DataBuffer {
        buffer: WebGLBuffer;
        attributes: BufferAttribute[];
        size: number;

        constructor(public context: WebGLRenderingContext, public stride: number, public dataType: DataType) {
            this.attributes = [];
            this.buffer = context.createBuffer();
        }

        set data(data: number[]) {
            this.size = data.length;
            var bufferContent;
            switch (this.dataType) {
                case Core.DataType.Float:
                    bufferContent = new Float32Array(data);
                    break;
                case Core.DataType.UnsignedShort:
                    bufferContent = new Uint16Array(data);
                    break;
                default:
                    throw new Error("Data type of " + this.dataType + " is not supported yet");
            }

            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferContent, gl.STATIC_DRAW);
        }

        attrib(name: string);
        attrib(name: string, size: number, normalized: boolean, offset: number);
        attrib(name: string, size?: number, normalized?: boolean, offset?: number)
        {
            this.attributes.push(new BufferAttribute(name, size || this.size, null, normalized || false, null, offset || 0));
            return this;
        }

        setAttributes(material: Materials.Material) {
            var gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

            for (var index in this.attributes) {
                var bufferAttribute = this.attributes[index];
                var materialAttribute = bufferAttribute.vertexAttribute || (bufferAttribute.vertexAttribute = material.program.getVertexAttribute(bufferAttribute.name));

                if (typeof materialAttribute === "undefined")
                    bufferAttribute.vertexAttribute = null;

                if (typeof materialAttribute !== "undefined") {
                    materialAttribute.enable();
                    var stride = bufferAttribute.stride || this.stride;
                    var type = bufferAttribute.type || this.dataType;
                    materialAttribute.setPointer(bufferAttribute.size, type, bufferAttribute.normalized, stride, bufferAttribute.offset);
                }
            }
        }
    }
}