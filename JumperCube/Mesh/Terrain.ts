///<reference path="../references.ts" />

module JumperCube.Mesh {
    import WebGL = Jv.Games.WebGL;
    import DataBuffer = Jv.Games.WebGL.Core.DataBuffer;
    import DataType = Jv.Games.WebGL.Core.DataType;

    interface TerrainData {
        vertices: number[];
        maxHeight: number;
        texCoord: number[];
        texWeights: number[];
        normals: number[];
        indices: number[];
    }

    export class Terrain extends WebGL.Mesh {
        constructor(context: WebGLRenderingContext, heightMap?: ImageData, scale = 1) {
            super(context, WebGL.MeshRenderMode.Triangles);

            var data = Terrain.createData(heightMap, scale);

            this.addBuffer(data.vertices, DataType.Float, 3)
                .addAttrib("aVertexPosition");
            this.addBuffer(data.normals, DataType.Float, 3)
                .addAttrib("aVertexNormal");
            this.addBuffer(data.texCoord, DataType.Float, 2)
                .addAttrib("aTexCoord");
            this.addBuffer(data.texWeights, DataType.Float, 4)
                .addAttrib("aTexWeight");

            this.index = data.indices;
        }

        //region Helpers
        private static calcLinear(min: number, max: number, value: number, inverse: boolean) {
            var range = max - min;
            var result = (value - min) / range;
            result = result < 0 ? 0 : (result > 1 ? 1 : result);
            return inverse ? 1 - result : result;
        }

        private static calcPiramid(min: number, max: number, value: number) {
            var mid = (min + max) / 2;
            return value <= mid ?
                Terrain.calcLinear(min, mid, value, false) :
                Terrain.calcLinear(mid, max, value, true);
        }

        private static smooth(data: TerrainData, width, depth) {
            data.maxHeight = 0;
            for (var z = 0; z < depth; z++) {
                for (var x = 0; x < width; x++) {
                    var sum = 0;
                    var count = 0;

                    for (var j = -1; j < 2; j++) {
                        for (var i = -1; i < 2; i++) {
                            var px = x - i;
                            var pz = z - j;
                            if (px < 0 || px > width ||
                                pz < 0 || pz > depth) {
                                continue;
                            }
                            var posPy = ((px + pz * width)*3)+1;
                            sum += data.vertices[posPy];
                            count++;
                        }
                    }

                    //Soma os dois resultados
                    var posVy = ((x + z * width)*3)+1;
                    var height = sum / count;
                    data.vertices[posVy] = height;
                    if (height > data.maxHeight) {
                        data.maxHeight = height;
                    }
                }
            }
        }

        private static createData(img: ImageData, scale?: number, smoothness?: number): TerrainData {
            var data: TerrainData = {
                maxHeight: 0,
                vertices: [],
                texCoord: [],
                texWeights: [],
                normals: [],
                indices: []
            };

            var normals: vec3[] = [];

            //***** Criação do vértices *****
            scale = scale || 0.5;
            smoothness = smoothness || 1;

            var width = img.width;
            var depth = img.height;

            var hw = (width-1) / 2;
            var hd = (depth-1) / 2;

            for (var z = 0; z < depth; z++) {
                for (var x = 0; x < width; x++) {
                    var posV = (x + z * width)*3;
                    data.vertices[posV+0] = x - hw;
                    data.vertices[posV+1] = imp.getRGB(img, x, z)[0] * scale;
                    data.vertices[posV+2] = z - hd;

                    normals[x + z * width] = vec3.create();

                    var posT = (x + z * width)*2;
                    data.texCoord[posT+0] = x / width;
                    data.texCoord[posT+1] = z / depth;
                }
            }

            for (var s = 0; s < smoothness; s++) {
                Terrain.smooth(data, width, depth);
            }

            //***** Criação dos pesos *****/
            for (z = 0; z < depth; z++) {
                for (x = 0; x < width; x++) {
                    var height = data.vertices[(x + z * width)*3+1];
                    var posV = (x + z * width)*4;

                    //Calcula de acordo com a altura
                    var hPercent = height / data.maxHeight;
                    data.texWeights[posV+0] = Terrain.calcLinear(0.85, 1.00, hPercent, false);
                    data.texWeights[posV+1] = Terrain.calcPiramid(0.60, 0.90, hPercent);
                    data.texWeights[posV+2] = Terrain.calcPiramid(0.20, 0.70, hPercent);
                    data.texWeights[posV+3] = Terrain.calcLinear(0.00, 0.25, hPercent, true);
                }
            }
            //***** Criação dos índices *****
            data.indices = [];

            for (z = 0; z < depth - 1; z++) {
                for (x = 0; x < width - 1; x++) {
                    var zero = x + z * width;
                    var one = (x + 1) + z * width;
                    var two = x + (z + 1) * width;
                    var three = (x + 1) + (z + 1) * width;

                    data.indices.push(one);
                    data.indices.push(zero);
                    data.indices.push(three);

                    data.indices.push(three);
                    data.indices.push(zero);
                    data.indices.push(two);
                }
            }

            //***** Criação das normais *****
            for (var i = 0; i < data.indices.length / 3; i++) {
                var i1 = data.indices[i * 3 + 0];
                var i2 = data.indices[i * 3 + 1];
                var i3 = data.indices[i * 3 + 2];

                var v1 = vec3.fromValues(data.vertices[i1*3+0],
                    data.vertices[i1*3+1], data.vertices[i1*3+2]);
                var v2 = vec3.fromValues(data.vertices[i2*3+0],
                    data.vertices[i2*3+1], data.vertices[i2*3+2]);
                var v3 = vec3.fromValues(data.vertices[i3*3+0],
                    data.vertices[i3*3+1], data.vertices[i3*3+2]);

                var side1 = vec3.subtract(vec3.create(), v2, v1);
                var side2 = vec3.subtract(vec3.create(), v3, v1);

                var normal = vec3.cross(vec3.create(), side1, side2);

                //Inverte a normal caso tenha saído para o lado errado
                vec3.add(normals[i1], normals[i1], normal);
                vec3.add(normals[i2], normals[i2], normal);
                vec3.add(normals[i3], normals[i3], normal);
            }

            //Normalizamos tudo para obter a média das normais
            for (i = 0; i < width*depth; i++)
                vec3.normalize(normals[i], normals[i]);

            //Copiamos as normais para o array data.normals
            for (i = 0; i < width*depth; i++) {
                data.normals[i*3+0] = normals[i][0];
                data.normals[i*3+1] = normals[i][1];
                data.normals[i*3+2] = normals[i][2];
            }

            return data;
        }
        //endregion
    }
}