///<reference path="../references.ts" />

module JumperCube.Models {
    import GameObject = Jv.Games.WebGL.GameObject;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import Texture = Jv.Games.WebGL.Materials.Texture;
    import TextureMaterial = Jv.Games.WebGL.Materials.TextureMaterial;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class Mushroom extends GameObject {

        static HeadFrontUV = [0.251034248940033, 0.323166552433173, 0.456406775106231, 0.323166552433173, 0.457375513437204, 0.504308234602957, 0.252002987271005, 0.505532164887888];
        static HeadBackUV = [0.251034248940033, 0.323166552433173, 0.456406775106231, 0.323166552433173, 0.457375513437204, 0.504308234602957, 0.252002987271005, 0.505532164887888];
        static HeadLeftUV = [0.251034248940033, 0.323166552433173, 0.456406775106231, 0.323166552433173, 0.457375513437204, 0.504308234602957, 0.252002987271005, 0.505532164887888];
        static HeadRightUV = [0.251034248940033, 0.323166552433173, 0.456406775106231, 0.323166552433173, 0.457375513437204, 0.504308234602957, 0.252002987271005, 0.505532164887888];
        static HeadTopUV = [0.456406775106231, 0.503084304318026, 0.662748039603403, 0.504308234602957, 0.662748039603403, 0.763781455008323, 0.456406775106231, 0.763781455008323];
        static HeadBottomUV = [0.456406775106231, 0.503084304318026, 0.662748039603403, 0.504308234602957, 0.662748039603403, 0.763781455008323, 0.456406775106231, 0.763781455008323];

        static BodyFrontUV = [0.711184956152035, 0.869039459512386, 0.844870845826258, 0.865367668657593, 0.844870845826258, 0.948594928032899, 0.71312243281398, 0.948594928032899];
        static BodyBackUV = [0.449625606789423, 0.869039459512386, 0.582342758132674, 0.869039459512386, 0.582342758132674, 0.946147067463037, 0.449625606789423, 0.947370997747968];
        static BodyLeftUV = [0.449625606789423, 0.869039459512386, 0.582342758132674, 0.869039459512386, 0.582342758132674, 0.946147067463037, 0.449625606789423, 0.947370997747968];
        static BodyRightUV = [0.449625606789423, 0.869039459512386, 0.582342758132674, 0.869039459512386, 0.582342758132674, 0.946147067463037, 0.449625606789423, 0.947370997747968];
        static BodyTopUV = [0.449625606789423, 0.869039459512386, 0.582342758132674, 0.869039459512386, 0.582342758132674, 0.946147067463037, 0.449625606789423, 0.947370997747968];
        static BodyBottomUV = [0.449625606789423, 0.869039459512386, 0.582342758132674, 0.869039459512386, 0.582342758132674, 0.946147067463037, 0.449625606789423, 0.947370997747968];

        constructor(context: WebGLRenderingContext, texture: Texture) {
            super();

            var head = this.add(new GameObject());
            head.add(MeshRenderer, {
                mesh: new JumperCube.Mesh.Cube(0.5, 0.4, 0.5, context,
                    Mushroom.HeadFrontUV, Mushroom.HeadBackUV,
                    Mushroom.HeadLeftUV, Mushroom.HeadRightUV,
                    Mushroom.HeadTopUV, Mushroom.HeadBottomUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(texture)
            });
            head.transform.y = 0.05;

            var body = this.add(new GameObject());
            body.add(MeshRenderer, {
                mesh: new JumperCube.Mesh.Cube(0.35, 0.2, 0.35, context,
                    Mushroom.BodyFrontUV, Mushroom.BodyBackUV,
                    Mushroom.BodyLeftUV, Mushroom.BodyRightUV,
                    Mushroom.BodyTopUV, Mushroom.BodyBottomUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(texture)
            });
            body.transform.y = -0.2;

            this.add(Jv.Games.WebGL.Components.RigidBody);
            this.add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: 0.3, radiusHeight: 0.4, radiusDepth: 0.3 });
            this.add(JumperCube.Behaviors.Follow, { viewDistance: 8, speed: 0.5, stopSpeed: 1 });
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });

            var trigger = new Trigger(t => { }, 1.2, 0.9, 1.2, new Vector3());
            trigger.collider.object = this;
            this.add(trigger);
        }
    }
}