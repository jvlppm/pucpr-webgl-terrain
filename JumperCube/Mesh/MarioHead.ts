﻿///<reference path="../references.ts" />

module JumperCube.Mesh {
    import WebGL = Jv.Games.WebGL;
    import BufferAttribute = Jv.Games.WebGL.Core.BufferAttribute;
    import DataType = Jv.Games.WebGL.Core.DataType;

    export class MarioHead extends WebGL.Mesh {
        constructor(context: WebGLRenderingContext) {
            super(context, WebGL.MeshRenderMode.Triangles);

            var data = this.addBuffer([
                // Front face
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,

                // Back face
                -1.0, -1.0, -1.0,
                -1.0, 0.6, -1.0,
                1.0, 0.6, -1.0,
                1.0, -1.0, -1.0,

                // Top face
                -1.0, 0.6, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 0.6, -1.0,

                // Bottom face
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,

                // Right face
                1.0, -1.0, -1.0,
                1.0, 0.6, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,

                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 0.6, -1.0,
            ].map(i => i / 2.1), DataType.Float, 3);

            data.attrib("position", 3, false, 0);

            var textureData = this.addBuffer([
                // Front face
                0.55521808486544, 0.372123763830412,
                0.701497572842308, 0.188534221090767,
                0.844870845826258, 0.373347694115343,
                0.699560096180363, 0.555713306570058,

                // Back face
                0.41184481188149, 0.554489376285127,
                0.511624859971672, 0.681778125917948,
                0.367282848656749, 0.864143738372662,
                0.265565323904622, 0.738078919024772,

                // Top face
                0.700528834511336, 0.554489376285127,
                0.843902107495286, 0.372123763830412,
                0.996962763788962, 0.564280818564574,
                0.849714537481121, 0.74787036130422,

                // Bottom face
                0.412813550212463, 0.187310290805836,
                0.556186823196413, 0.00494467835112111,
                0.702466311173281, 0.189758151375698,
                0.558124299858358, 0.370899833545481,

                // Right face
                0.845839584157231, 0.00739253892098302,
                0.946588370578385, 0.134681288553804,
                0.844870845826258, 0.370899833545481,
                0.701497572842308, 0.188534221090767,

                // Left face
                0.409907335219545, 0.555713306570058,
                0.556186823196413, 0.370899833545481,
                0.701497572842308, 0.554489376285127,
                0.510656121640699, 0.683002056202879,

            ], DataType.Float, 2);

            textureData.attrib("textureCoord", 2, false, 0);

            var normalData = this.addBuffer([
            // Front
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

            // Back
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

            // Top
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

            // Bottom
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,

            // Right
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Left
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ], Jv.Games.WebGL.Core.DataType.Float, 3);
            normalData.attrib("normal", 3, false, 0);

            this.index = [
                0, 1, 2, 0, 2, 3,    // Front face
                4, 5, 6, 4, 6, 7,    // Back face
                8, 9, 10, 8, 10, 11,  // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
            ];
        }
    }
}