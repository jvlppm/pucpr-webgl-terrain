///<reference path="Definitions/es6-promise.d.ts" />
///<reference path="Definitions/jquery.d.ts" />
///<reference path="JumperCube/references.ts" />
///<reference path="Jv.Games.WebGL/references.ts" />

module JumperCube {
    import Color = Jv.Games.WebGL.Color;
    import WebGL = Jv.Games.WebGL.Core.WebGL;
    import Matrix4 = Jv.Games.WebGL.Matrix4;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Utils = Jv.Games.WebGL.Utils;
    import Camera = Jv.Games.WebGL.Camera;
    import Scene = Jv.Games.WebGL.Scene;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import GameObject = Jv.Games.WebGL.GameObject;
    import CoreComponents = Jv.Games.WebGL.Components;
    import Texture = Jv.Games.WebGL.Materials.Texture;

    import Behaviors = JumperCube.Behaviors;
    import Mover = Behaviors.Mover;

    export interface TextureDescription {
        url: string;
        density?: number;
        tile?: boolean;
        attribute: string;
    }

    export interface PlatformDefinition {
        debug?: boolean;
        xAlign?: number;
        yAlign?: number;
        zAlign?: number
        collide?: boolean;
    }

    export class Game {
        // Entities
        player: GameObject;
        enemies: GameObject[];
        targetEnemy: GameObject;

        camera: Camera;
        enemyCamera: Camera;

        scene: Scene;

        // -- Assets --
        textures: TextureDescription[];
        marioTexture: Texture;
        goombaTexture: Texture;
        grassTexture: Texture;

        platformWhite: Texture;
        platformYellow: Texture;
        platformCyan: Texture;
        platformPink: Texture;
        platformGreen: Texture;

        blockEmpty: Texture;
        blockQuestion: Texture;
        blockSolid: Texture;
        blockBrick: Texture;
        blockFloor: Texture;

        itemMushroom: Texture;
        heightmapTerrain: Texture;
        textureGrass: Texture;
        textureRock: Texture;
        textureSand: Texture;
        textureSnow: Texture;

        constructor(public webgl: WebGL) {
            this.textures = [
                { url: "Textures/new-mario.png", attribute: "marioTexture" },
                { url: "Textures/goomba.png", attribute: "goombaTexture" },
                { url: "Textures/grass.png", attribute: "grassTexture" },

                { url: "Textures/platform_white.png", attribute: "platformWhite" },
                { url: "Textures/platform_yellow.png", attribute: "platformYellow" },
                { url: "Textures/platform_cyan.png", attribute: "platformCyan" },
                { url: "Textures/platform_pink.png", attribute: "platformPink" },
                { url: "Textures/platform_green.png", attribute: "platformGreen" },

                { url: "Textures/block_empty.png", attribute: "blockEmpty", density: 128 },
                { url: "Textures/block_question.png", attribute: "blockQuestion", density: 128 },
                { url: "Textures/block_solid.png", attribute: "blockSolid", density: 128 },
                { url: "Textures/block_floor.png", attribute: "blockFloor", density: 128 },
                { url: "Textures/block_brick.png", attribute: "blockBrick" },

                { url: "Textures/item_mushroom.png", attribute: "itemMushroom" },

                { url: "img/terrain/island.png", attribute: "heightmapTerrain" },
                { url: "img/texture/grass.png", attribute: "textureGrass" },
                { url: "img/texture/rock.png", attribute: "textureRock" },
                { url: "img/texture/sand.png", attribute: "textureSand" },
                { url: "img/texture/snow.png", attribute: "textureSnow" },
            ];
            this.camera = new Camera();
            this.enemyCamera = new Camera();

            this.updateCameraProjection();
        }

        loadAssets() {
            var loadTextures: Promise<Texture>[] = [];
            this.textures.forEach(tD => {
                var load = Game.LoadTexture(this.webgl.context, tD.url, tD.tile, tD.density)
                    .then(t => this[tD.attribute] = t);
                loadTextures.push(load);
            });
            return Promise.all(loadTextures);
        }

        initScene() {
            this.scene = new Jv.Games.WebGL.Scene(this.webgl);
            this.scene.ambientLight = Color.Rgb(0.6, 0.6, 0.6);
            this.scene.mainLight = new Jv.Games.WebGL.Materials.DirectionalLight(
                Color.Rgb(0.55, 0.55, 0.5),
                new Vector3(-0.85, 0.8, -0.75)
            );

            this.createMap();
        }

        initPlayer() {
            this.player = this.scene.add(new JumperCube.Models.Mario(this.webgl.context, this.marioTexture));
            this.player.add(Behaviors.Controller, {
                minJumpForce: 2.0,
                maxJumpForce: 4.91,
                moveForce: 20,
                camera: this.camera
            });
            this.player.transform.y = 15;
        }

        initEnemies() {
            var goombas:Vector3[] = [
                new Vector3(0, 0, 10),
            ];
            this.enemies = goombas.map(g => {
                var goomba = this.scene.add(new JumperCube.Models.Goomba(this.webgl.context, this.goombaTexture));
                goomba.transform.x = g.x;
                goomba.transform.z = g.y;
                goomba.transform.y = g.z + 0.6;
                return goomba;
            });
        }

        selectTargetEnemy() {
            this.targetEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            this.showOnCamera(this.enemyCamera, this.targetEnemy);
        }

        initCamera(camera: Camera) {
            camera.add(CoreComponents.RigidBody, {friction: new Vector3(1, 0, 1)});
            camera.add(CoreComponents.AxisAlignedBoxCollider);

            camera.add(JumperCube.Behaviors.Follow, {
                target: undefined,
                minDistance: 4,
                maxDistance: 10,
                speed: 5
            });
            camera.add(JumperCube.Behaviors.KeepAbove, {
                target: undefined,
                minDistance: 3,
                maxDistance: 7,
                speed: 1
            });
            camera.add(JumperCube.Behaviors.LookAtObject, {target: undefined});
            this.scene.add(camera);
        }

        showOnCamera(camera: Camera, target: GameObject) {
            camera.transform.position.z = target.globalTransform.position.z - 3;
            camera.transform.position.y = target.globalTransform.position.y + 3;

            camera.getComponent(JumperCube.Behaviors.Follow).target = target;
            camera.getComponent(JumperCube.Behaviors.KeepAbove).target = target;
            camera.getComponent(JumperCube.Behaviors.LookAtObject).target = target;
        }

        init() {
            var materials: { materialProgram: Jv.Games.WebGL.Core.ShaderProgram; new (...args: any[]) }[]
                = [Materials.TextureMaterial, Materials.VertexColorMaterial, Materials.TerrainMaterial, Materials.SolidColorMaterial];

            return Jv.Games.WebGL.Materials.Material.initAll(this.webgl.context, materials)
                .then(() => this.loadAssets())
                .then(() => {
                    Jv.Games.WebGL.MeterSize = 3;
                    Jv.Games.WebGL.Keyboard.init();

                    this.initScene();
                    this.initCamera(this.camera);
                    this.initCamera(this.enemyCamera);

                    this.initPlayer();
                    this.initEnemies();

                    this.showOnCamera(this.camera, this.player);
                    this.showOnCamera(this.enemyCamera, this.player);

                    this.selectTargetEnemy();

                    this.scene.init();
                });
        }

        createMap() {
            // Map terrain
            this.scene.add(this.initTerrain(this.webgl.context, 100, 100));

            // Map Boundary
            this.scene.add(new GameObject())
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, {
                    radiusWidth: 45, radiusDepth: 45, radiusHeight: 50, inverse: true});
        }

        createQuestionBlock(x: number, z: number, y: number, item?: GameObject) {
            var question = this.scene.add(new JumperCube.Models.ItemBlock(this.webgl.context, this.blockQuestion, this.blockEmpty));
            question.transform.x = x;
            question.transform.y = y;
            question.transform.z = z;
            question.item = item;
        }

        createBrickBlock(x: number, z: number, y: number) {
            var question = this.scene.add(new JumperCube.Models.BrickBlock(this.webgl.context, this.blockBrick));
            question.transform.x = x;
            question.transform.y = y;
            question.transform.z = z;
        }

        createUV(texture: Texture, w: number, h: number) {
            if (!texture.tile)
                return [0, 0, 1, 0, 1, 1, 0, 1];

            var tw = texture.image.naturalWidth || texture.image.width;
            var th = texture.image.naturalHeight || texture.image.height;

            var u = w / (tw / texture.density);
            var v = h / (th / texture.density);

            return [0, 0, u, 0, u, v, 0, v];
        }

        static loadDefaults<Type>(current: Type, defaults: Type) {
            if (typeof current === "undefined")
                return defaults;

            for (var prop in defaults)
                if (typeof current[prop] === "undefined")
                    current[prop] = defaults[prop];

            return current;
        }

        initTerrain(context: WebGLRenderingContext, w: number, d: number) {
            var terrainMaterial = new Materials.TerrainMaterial();
            terrainMaterial.texture0 = this.textureSand;
            terrainMaterial.texture1 = this.textureGrass;
            terrainMaterial.texture2 = this.textureRock;
            terrainMaterial.texture3 = this.textureSnow;
            terrainMaterial.specularPower = 32;

            var mesh = new Mesh.Terrain(context, imp.getImageData(this.heightmapTerrain.image), { smoothness: 1, width: w, depth: d, heightScale: 0.05 });

            var terrain = new GameObject()
                .add(MeshRenderer, {
                    mesh: mesh,
                    material: terrainMaterial
                })
                .add(Components.TerrainCollider, { radiusX: w / 2, radiusZ: d / 2, terrain: mesh });

            return terrain;
        }

        run() {
            var maxDeltaTime = 1 / 8;
            return Utils.StartTick(dt => {
                if (dt > maxDeltaTime)
                    dt = maxDeltaTime;
                this.scene.update(dt);
                this.scene.draw();
            });
        }

        static LoadTexture(context: WebGLRenderingContext, url: string, tile?: boolean, density?: number) {
            var image = new Image();
            var def = new Promise<Texture>((resolve, reject) => {
                image.onload = () => {
                    var width = image.naturalWidth || image.width;
                    var height = image.naturalHeight || image.height;

                    if (typeof tile === "undefined")
                        tile = width == height && ((width & (width - 1)) == 0);

                    resolve(Texture.FromImage(context, image, tile, density));
                };
                image.onerror = reject;
            });
            image.src = url;
            return def;
        }

        updateCameraProjection() {
            var playerCameraWidth = 0.6;

            var playerAspect = (this.webgl.canvas.width * playerCameraWidth) / this.webgl.canvas.height;
            var enemyAspect = (this.webgl.canvas.width * (1 - playerCameraWidth)) / this.webgl.canvas.height;

            this.camera.setPerspective(40, playerAspect, 1, 100);
            this.enemyCamera.setPerspective(40, enemyAspect, 1, 100);

            this.camera.viewport = new Jv.Games.WebGL.Viewport(0, 0, playerCameraWidth, 1);
            this.enemyCamera.viewport = new Jv.Games.WebGL.Viewport(playerCameraWidth, 0, 1 - playerCameraWidth, 1);
        }
    }
}

// -- Page --

function matchWindowSize(canvas: HTMLCanvasElement, sizeChanged?: () => any) {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (typeof sizeChanged !== "undefined")
            sizeChanged();
    }
    resizeCanvas();
}

$(document).ready(function () {
    var canvas = <HTMLCanvasElement>document.getElementById("canvas-element-id");
    var webgl = Jv.Games.WebGL.Core.WebGL.fromCanvas(canvas);
    var game = new JumperCube.Game(webgl);

    matchWindowSize(canvas, () => game.updateCameraProjection());

    var fail = e => {
        alert("Error: " + e);
    };

    game.init()
        .then(() => game.run(), fail);
});

