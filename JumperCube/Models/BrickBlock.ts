///<reference path="../references.ts" />

module JumperCube.Models {
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;
    import Texture = Jv.Games.WebGL.Materials.Texture;
    import RigidBody = Jv.Games.WebGL.Components.RigidBody;
    import TextureMaterial = Jv.Games.WebGL.Materials.TextureMaterial;
    import AxisAlignedBoxCollider = Jv.Games.WebGL.Components.AxisAlignedBoxCollider;
    import GameObject = Jv.Games.WebGL.GameObject;
    import Vector3 = Jv.Games.WebGL.Vector3;

    export class BrickBlock extends GameObject {
        static TopUV = [0.548436916548632, 0.678106335063155, 0.638529581329087, 0.680554195633017, 0.634654628005196, 0.777244688142563, 0.556186823196413, 0.780916478997356];
        static BottomUV = [0.524218458274316, 0.303583667874278, 0.561999253182249, 0.302359737589347, 0.562967991513221, 0.347645158131793, 0.522280981612371, 0.347645158131793];
        static UV = [0.500968738330973, 0.368451972975619, 0.707310002828144, 0.368451972975619, 0.706341264497171, 0.631596984235778, 0.5, 0.631596984235778];
        collider: AxisAlignedBoxCollider;
        renderer: MeshRenderer;
        toMove: number;

        constructor(context: WebGLRenderingContext, public texture: Texture) {
            super();

            this.renderer = new MeshRenderer(this, {
                mesh: new JumperCube.Mesh.Cube(1, 1, 1, context, BrickBlock.UV, BrickBlock.UV, BrickBlock.UV, BrickBlock.UV, BrickBlock.TopUV, BrickBlock.BottomUV),
                material: new TextureMaterial(texture)
            });
            this.collider = new AxisAlignedBoxCollider(this, { radiusWidth: 0.5, radiusHeight: 0.5, radiusDepth: 0.5 });

            this.add(new Trigger(c => {
                var body = <RigidBody>c.object.searchComponent(RigidBody);
                if (body.momentum.y < 0)
                    return;

                if (typeof this.toMove === "undefined")
                    this.toMove = 0.3;
            }, 1, 0.5, 1, new Vector3(0, -0.5, 0)));

            this.add(this.renderer);
            this.add(this.collider);
        }

        update(deltaTime: number) {
            if (typeof this.toMove === "undefined")
                return;

            this.transform._translate(new Vector3(0, deltaTime * 2, 0));
            this.toMove -= deltaTime * 2;

            if (this.toMove < 0) {
                delete this.toMove;
                this.destroy();
            }
        }
    }
}