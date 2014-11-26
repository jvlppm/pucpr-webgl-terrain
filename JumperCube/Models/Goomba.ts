///<reference path="../references.ts" />

module JumperCube.Models {
    import Vector3 = Jv.Games.WebGL.Vector3;
    import GameObject = Jv.Games.WebGL.GameObject;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export class Goomba extends GameObject {

        static FrontUV = [0.469969111739848, 0.417409184372858, 0.673404161244102, 0.416185254087927, 0.673404161244102, 0.641388426515226, 0.469969111739848, 0.642612356800157];
        static BackUV = [0.064067751062314, 0.417409184372858, 0.26847153889754, 0.416185254087927, 0.26847153889754, 0.643836287085088, 0.064067751062314, 0.641388426515226];
        static LeftUV = [0.267502800566567, 0.417409184372858, 0.471906588401794, 0.416185254087927, 0.471906588401794, 0.643836287085088, 0.267502800566567, 0.642612356800157];
        static RightUV = [0.267502800566567, 0.417409184372858, 0.471906588401794, 0.416185254087927, 0.471906588401794, 0.643836287085088, 0.267502800566567, 0.642612356800157];
        static TopUV = [0.469000373408876, 0.638940565945364, 0.670497946251184, 0.638940565945364, 0.673404161244102, 0.895965925780868, 0.469000373408876, 0.895965925780868];
        static BottomUV = [0.468031635077903, 0.162831685107216, 0.674372899575074, 0.161607754822285, 0.672435422913129, 0.41985704494272, 0.469000373408876, 0.421080975227651];

        constructor(context: WebGLRenderingContext, texture: Jv.Games.WebGL.Materials.Texture) {
            super();
            this.tag = "npc";
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true })
                .add(Jv.Games.WebGL.Components.RigidBody)
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { radiusWidth: 0.5, radiusHeight: 0.5, radiusDepth: 0.5 })
                .add(new GameObject())
                .add(JumperCube.Behaviors.LookForward)
                .add(new GameObject())
                .add(Behaviors.SwingWhileMoving, { axis: new Vector3(0, 0, 1), speed: 15, maxSwing: 0.2 })
                .add(MeshRenderer, {
                    mesh: new JumperCube.Mesh.Cube(1, 1, 1, context, Goomba.FrontUV, Goomba.BackUV, Goomba.LeftUV, Goomba.RightUV, Goomba.TopUV, Goomba.BottomUV),
                    material: new JumperCube.Materials.TextureMaterial(texture)
                });

            //perspectiveContainer.transform._rotateX(-0.6);

            var deathHitbox = this.add(new GameObject())
                .add(JumperCube.Behaviors.Bouncy, { tags: ["player"] })
            //  .add(JumperCube.Behaviors.DebugPosition)
            //  .add(MeshRenderer, { mesh: new JumperCube.Mesh.Cube(0.98, 0.2, 0.98, context) })
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { isTrigger: true, radiusWidth: 0.49, radiusHeight: 0.1, radiusDepth: 0.49 })
                .add(JumperCube.Behaviors.DieOnTrigger, { object: this, tags: ["player"] });
            deathHitbox.transform.y = 0.6;

            var collisionHitbox = this.add(new GameObject())
            //  .add(JumperCube.Behaviors.DebugPosition)
            //  .add(MeshRenderer, { mesh: new JumperCube.Mesh.Cube(1.25, 0.8, 1.25, context) })
                .add(Jv.Games.WebGL.Components.AxisAlignedBoxCollider, { isTrigger: true, radiusWidth: 1.25/2, radiusHeight: 0.8/2, radiusDepth: 1.25/2 })
                .add(JumperCube.Behaviors.HitOnTrigger, { object: this, tags: ["player"] });
            //deathHitbox.transform.y = 0.6;
        }
    }
}
