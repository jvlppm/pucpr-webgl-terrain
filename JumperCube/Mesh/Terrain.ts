///<reference path="../references.ts" />

module JumperCube.Mesh {
    import WebGL = Jv.Games.WebGL;
    import DataBuffer = Jv.Games.WebGL.Core.DataBuffer;
    import DataType = Jv.Games.WebGL.Core.DataType;

    export class Terrain extends WebGL.Mesh {
        constructor(context: WebGLRenderingContext, heightMap?: ImageData, scale = 1, width?: number, height?: number) {
            super(context, WebGL.MeshRenderMode.Triangles);

            var width = width || heightMap.width;
            var depth = height || heightMap.height;

            // Data
            var data = this.setupVertices(depth, width, data, scale);
            // Indices
            var indices = this.setupIndices(depth, width);
            // Normals
            this.setupNormals(depth, width, indices, data);
        }

        private setupVertices(depth, width, heightMap?: ImageData, scale = 1) {
            var hw = (width - 1) / 2;
            var hd = (depth - 1) / 2;

            var xRatio: number;
            var yRatio: number;
            if(typeof heightMap !== "undefined") {
                xRatio = heightMap.width / width;
                yRatio = heightMap.height / depth;
            }

            var data:number[] = [];
            for (var z = 0; z < depth; z++) {
                for (var x = 0; x < width; x++) {
                    var posV = (x + z * width) * 5;
                    data[posV + 0] = x - hw;
                    data[posV + 1] = (typeof heightMap === "undefined"? 0 : imp.getRGB(heightMap, x * xRatio, z * yRatio))[0] * scale;
                    data[posV + 2] = z - hd;

                    data[posV + 3] = x / width;
                    data[posV + 4] = z / depth;
                }
            }

            this.addBuffer(data, DataType.Float, 5)
                .attrib("position", 3, false, 0)
                .attrib("textureCoord", 2, false, 3);

            return data;
        }

        private setupIndices(depth, width) {
            var indices: number[] = [];
            for (var z = 0; z < depth - 1; z++) {
                for (var x = 0; x < width - 1; x++) {
                    var zero = x + z * width;
                    var one = (x + 1) + z * width;
                    var two = x + (z + 1) * width;
                    var three = (x + 1) + (z + 1) * width;

                    indices.push(one);
                    indices.push(zero);
                    indices.push(three);

                    indices.push(three);
                    indices.push(zero);
                    indices.push(two);
                }
            }
            this.index = indices;
            return indices;
        }

        private setupNormals(depth, width, indices, data) {
            var normals:vec3[] = [];

            for (var z = 0; z < depth; z++)
                for (var x = 0; x < width; x++)
                    normals[x + z * width] = vec3.create();

            for (var i = 0; i < indices.length / 3; i++) {
                var i1 = indices[i * 3 + 0];
                var i2 = indices[i * 3 + 1];
                var i3 = indices[i * 3 + 2];

                var v1 = vec3.fromValues(
                    data[i1 * 5 + 0],
                    data[i1 * 5 + 1],
                    data[i1 * 5 + 2]);
                var v2 = vec3.fromValues(
                    data[i2 * 5 + 0],
                    data[i2 * 5 + 1],
                    data[i2 * 5 + 2]);
                var v3 = vec3.fromValues(
                    data[i3 * 5 + 0],
                    data[i3 * 5 + 1],
                    data[i3 * 5 + 2]);

                var side1 = vec3.subtract(vec3.create(), v2, v1);
                var side2 = vec3.subtract(vec3.create(), v3, v1);

                var normal = vec3.cross(vec3.create(), side1, side2);

                //Inverte a normal caso tenha saído para o lado errado
                vec3.add(normals[i1], normals[i1], normal);
                vec3.add(normals[i2], normals[i2], normal);
                vec3.add(normals[i3], normals[i3], normal);
            }

            //Normalizamos tudo para obter a média das normais
            for (i = 0; i < width * depth; i++)
                vec3.normalize(normals[i], normals[i]);

            //Copiamos as normais para o array data.normals
            var normalsBuffer = [];
            for (i = 0; i < width * depth; i++) {
                normalsBuffer[i * 3 + 0] = normals[i][0];
                normalsBuffer[i * 3 + 1] = normals[i][1];
                normalsBuffer[i * 3 + 2] = normals[i][2];
            }

            this.addBuffer(normalsBuffer, DataType.Float, 3)
                .attrib("normal", 3, false, 0);
        }
    }
}