///<reference path="../references.ts" />

module Jv.Games.WebGL.Core {
    export enum DataType {
        Byte,
        UnsignedByte,
        Short,
        UnsignedShort,
        Fixed,
		Float
    }

    export function sizeof(dataType: DataType) {
        switch (dataType) {
            case Core.DataType.UnsignedByte:
            case Core.DataType.Byte:
                return 1;
            case Core.DataType.Short:
            case Core.DataType.UnsignedShort:
                return 2;
            case Core.DataType.Fixed:
            case Core.DataType.Float:
                return 4;

            default:
                throw new Error("Buffer of " + Core.DataType[dataType] + " is not supported yet.");
        }
    }

    export class VertexAttribute {
        context: WebGLRenderingContext;
        program: WebGLProgram;

        constructor(shaderProgram: ShaderProgram, public index: number) {
            this.context = shaderProgram.context;
            this.program = shaderProgram.program;
        }

        setPointer(size: number, type: DataType, normalized: boolean, stride: number, offset: number) {
            var typeId = this.getDataTypeId(type);
            this.context.vertexAttribPointer(this.index, size, typeId, normalized, stride, offset);
        }

        enable() {
            this.context.enableVertexAttribArray(this.index);
        }

        disable() {
            this.context.disableVertexAttribArray(this.index);
        }

        private getDataTypeId(type: DataType) {
            var gl = this.context;
            switch (type) {
                case DataType.Byte:
                    return gl.BYTE;
                case DataType.UnsignedByte:
                    return gl.UNSIGNED_BYTE;
                case DataType.Short:
                    return gl.SHORT;
                case DataType.UnsignedShort:
                    return gl.UNSIGNED_SHORT;
                //case DataType.Fixed:
                //    return gl.FIXED;
                case DataType.Float:
                    return gl.FLOAT;
                default:
                    throw new Error("Unknown attribute type " + type);
            }
        }
    }
}
