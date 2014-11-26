///<reference path="references.ts" />

module Jv.Games.WebGL {
    import DataBuffer = Jv.Games.WebGL.Core.DataBuffer;
    import Core = Jv.Games.WebGL.Core;

    export enum MeshRenderMode {
        Triangles,
        TriangleStrip
    }

    export class Mesh {
        buffers: DataBuffer[];

        indexBuffer: WebGLBuffer;
        private elementCount: number;
        private renderModeId: number;

        constructor(public context: WebGLRenderingContext, private mode: MeshRenderMode = MeshRenderMode.Triangles) {
            this.renderModeId = this.getModeTypeId(mode);
            this.buffers = [];
        }

        addBuffer(values: number[], dataType: Core.DataType, stride: number) {
            var dataBuffer = new DataBuffer(this.context, Core.sizeof(dataType) * stride, dataType);
            dataBuffer.data = values;
            this.buffers.push(dataBuffer);
            return dataBuffer;
        }

        set index(data: number[]) {
            var gl = this.context;
            this.indexBuffer = this.context.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, <any>new Uint16Array(data), gl.STATIC_DRAW);
            this.elementCount = data.length;
        }

        private getModeTypeId(mode: MeshRenderMode) {
            var gl = this.context;
            switch (mode) {
                case MeshRenderMode.Triangles:
                    return gl.TRIANGLES;
                case MeshRenderMode.TriangleStrip:
                    return gl.TRIANGLE_STRIP;

                default:
                    throw new Error("Unknown render mode " + mode);
            }
        }

        draw(material: Materials.Material) {
            material.program.use();
            var gl = this.context;
            for (var i = 0; i < this.buffers.length; i++)
                this.buffers[i].setAttributes(material);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(this.renderModeId, this.elementCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}