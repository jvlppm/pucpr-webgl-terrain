///<reference path="../references.ts" />

module Jv.Games.WebGL.Core {
    export class BufferAttribute {
        vertexAttribute: VertexAttribute;

        constructor(public name: string, public size: number, public normalized: boolean, public offset: number) {
        }
    }

    export class DataBuffer {
        private attributeOffset = 0;
        private stride: number;
        buffer: WebGLBuffer;
        attributes: BufferAttribute[];

        constructor(public context: WebGLRenderingContext, private size: number, public dataType: DataType) {
            this.attributes = [];
            this.buffer = context.createBuffer();
            this.stride = size * sizeof(dataType);
        }

        set data(data: number[]) {
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

        /**
         * Append a sequential attribute definition to this buffer.
         *
         * @param name attribute name
         * @param size number of components in the attribute. Must be 1,2,3, or 4.
         * @param normalized True if values are normalized when accessed.
         */
        addAttrib(name: string, size = this.size, normalized = false)
        {
            if (this.attributeOffset + size > this.size)
                throw new Error("Attribute outside vertex data");

            this.attributes.push(new BufferAttribute(name, size, normalized, this.attributeOffset * sizeof(this.dataType)));
            this.attributeOffset += size;
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
                    materialAttribute.setPointer(bufferAttribute.size, this.dataType, bufferAttribute.normalized, this.stride, bufferAttribute.offset);
                }
            }
        }
    }
}