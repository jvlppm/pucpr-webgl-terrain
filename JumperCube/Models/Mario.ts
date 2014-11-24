///<reference path="../references.ts" />

module JumperCube.Models {
    import GameObject = Jv.Games.WebGL.GameObject;
    import Components = Jv.Games.WebGL.Components;
    import Vector3 = Jv.Games.WebGL.Vector3;
    import Behaviors = JumperCube.Behaviors;
    import MeshRenderer = Jv.Games.WebGL.Components.MeshRenderer;

    export class Mario extends GameObject {

        static BodyFrontUV = [0.172566444131249, 0.377019484970136, 0.172566444131249, 0.54592186429061, 0.0388805544570255, 0.54592186429061, 0.0388805544570255, 0.375795554685205];
        static BodyBackUV = [0.171597705800277, 0.0453343777538431, 0.170628967469304, 0.211788896504455, 0.0388805544570255, 0.211788896504455, 0.0388805544570255, 0.046558308038774];
        static BodyLeftUV = [0.169660229138331, 0.211788896504455, 0.170628967469304, 0.378243415255067, 0.0398492927879981, 0.377019484970136, 0.0398492927879981, 0.210564966219524];
        static BodyRightUV = [0.171597705800277, 0.54592186429061, 0.170628967469304, 0.711152452756291, 0.0398492927879981, 0.711152452756291, 0.0398492927879981, 0.544697934005679];
        static BodyTopUV = [0.0485679377667518, 0.332957994712621, 0.0485679377667518, 0.359884460981102, 0.0175683111756275, 0.359884460981102, 0.0156308345136822, 0.320718691863311];
        static BodyBottomUV = [0.302377380481582, 0.378243415255067, 0.302377380481582, 0.544697934005679, 0.170628967469304, 0.54592186429061, 0.172566444131249, 0.379467345539998];

        static ArmFrontUV = [0.355657988685077, 0.139577009693528, 0.390532568600092, 0.184862430235974, 0.32368962376298, 0.270537550181142, 0.28687756718602, 0.226476059923627];
        static ArmBackUV = [0.355657988685077, 0.139577009693528, 0.390532568600092, 0.184862430235974, 0.32368962376298, 0.270537550181142, 0.28687756718602, 0.226476059923627];
        static ArmLeftUV = [0.355657988685077, 0.139577009693528, 0.390532568600092, 0.184862430235974, 0.32368962376298, 0.270537550181142, 0.28687756718602, 0.226476059923627];
        static ArmRightUV = [0.355657988685077, 0.139577009693528, 0.390532568600092, 0.184862430235974, 0.32368962376298, 0.270537550181142, 0.28687756718602, 0.226476059923627];
        static ArmTopUV = [0.252002987271005, 0.17996670909625, 0.288815043847965, 0.225252129638696, 0.252971725601978, 0.270537550181142, 0.218097145686963, 0.226476059923627];
        static ArmBottomUV = [0.391501306931065, 0.0967394497209438, 0.425407148515107, 0.140800939978459, 0.390532568600092, 0.184862430235974, 0.35662672701605, 0.140800939978459];

        static LegFrontUV = [0.635623366336169, 0.981641045726035, 0.585248973125592, 0.981641045726035, 0.586217711456565, 0.919220601194556, 0.635623366336169, 0.921668461764418];
        static LegBackUV = [0.635623366336169, 0.981641045726035, 0.585248973125592, 0.981641045726035, 0.586217711456565, 0.919220601194556, 0.635623366336169, 0.921668461764418];
        static LegLeftUV = [0.635623366336169, 0.981641045726035, 0.585248973125592, 0.981641045726035, 0.586217711456565, 0.919220601194556, 0.635623366336169, 0.921668461764418];
        static LegRightUV = [0.635623366336169, 0.981641045726035, 0.585248973125592, 0.981641045726035, 0.586217711456565, 0.919220601194556, 0.635623366336169, 0.921668461764418];
        static LegTopUV = [0.635623366336169, 0.981641045726035, 0.585248973125592, 0.981641045726035, 0.586217711456565, 0.919220601194556, 0.635623366336169, 0.921668461764418];
        static LegBottomUV = [0.453500560113313, 0.964506021737002, 0.462219205092067, 0.965729952021933, 0.466094158415958, 0.971849603446588, 0.452531821782341, 0.970625673161657];

        static CapUV = [0.850683275812094, 0.749094291589151, 0.697622619518418, 0.555713306570058, 0.733465937764405, 0.510427886027612, 0.89330776237489, 0.696465289337119];

        rigidBody: Components.RigidBody;
        body: GameObject;
        sizeContainer: GameObject;
        private _small: boolean;
        blink: JumperCube.Behaviors.Blink;

        constructor(public context: WebGLRenderingContext, public texture: Jv.Games.WebGL.Materials.Texture) {
            super();
            this.tag = "player";

            this.loadBehaviors();
            this.createBody();
            this.isSmall = false;
        }

        loadBehaviors() {
            this.rigidBody = new Components.RigidBody(this, { friction: new Vector3(8, 0, 8), maxSpeed: 2 });
            this.add(this.rigidBody);
            this.add(Behaviors.Mover, { direction: new Vector3(0, -9.8, 0), acceleration: true, continuous: true });
            this.blink = new Behaviors.Blink(this);
            this.add(this.blink);
        }

        set isSmall(value: boolean) {
            if (this._small === value)
                return;

            this._small = value;

            var scale = value ? 0.5 : 0.8;
            this.sizeContainer.transform = Jv.Games.WebGL.Matrix4.Scale(scale);

            var collider = this.searchComponent(Components.AxisAlignedBoxCollider);
            if (typeof collider !== "undefined") {
                collider.radiusWidth = 0.4 * scale;
                collider.radiusHeight = 1 * scale;
                collider.radiusDepth = 0.4 * scale;
            }

            while (!this.rigidBody.validPosition()) {
                this.transform.y += 0.05 * (this.rigidBody.momentum.y > 0 ? -1 : 1);
            }
        }

        private createBody() {
            this.sizeContainer = this.add(new GameObject());

            // Container vai ser rotacionado no plano xz para olhar na direção do movimento
            var container = this.sizeContainer.add(new GameObject())
                .add(Behaviors.LookForward);

            container.add(Components.AxisAlignedBoxCollider, { object: this });

            // Body container poderá rotacionar no seu eixo X, sem que a direção seja impactada
            var bodyContainer = container.add(new GameObject());
                //.add(Behaviors.RotateWhileJumping, { speed: 6 });
            bodyContainer.transform.y = 0.1;
            
            this.body = bodyContainer.add(new GameObject());
            this.body.transform.y = -0.5 - bodyContainer.transform.y;

            var xAxis = new Vector3(1, 0, 0);

            this.addHead();
            this.addCap();
            this.addChest();
            this.addArm(new Vector3(-0.35, 0.05, 0))
                .add(Behaviors.SwingWhileMoving, { axis: xAxis, inverse: true });
            this.addArm(new Vector3(0.35, 0.05, 0))
                .add(Behaviors.SwingWhileMoving, { axis: xAxis });
            this.addLeg(new Vector3(-0.125, -0.35, 0))
                .add(Behaviors.SwingWhileMoving, { axis: xAxis });
            this.addLeg(new Vector3(0.125, -0.35, 0))
                .add(Behaviors.SwingWhileMoving, { axis: xAxis, inverse: true });
        }

        private addHead() {
            var marioHeadMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Mesh.MarioHead(this.context),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.texture)
            };

            var head = this.body.add(new GameObject());
            head.transform.y = 0.8;
            head.add(MeshRenderer, marioHeadMesh);
            return head;
        }

        private addCap() {
            var marioCapMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Mesh.Cube(0.95, 0.01, 0.3, this.context, Mario.CapUV, Mario.CapUV, Mario.CapUV, Mario.CapUV, Mario.CapUV, Mario.CapUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.texture)
            };

            var cap = this.body.add(new GameObject());
            cap.transform.y = 1;
            cap.transform.z = 0.5;
            cap.add(MeshRenderer, marioCapMesh);
            return cap;
        }

        private addChest() {
            var marioChestMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Mesh.Cube(0.5, 0.5, 0.5, this.context,
                    Mario.BodyFrontUV, Mario.BodyBackUV,
                    Mario.BodyLeftUV, Mario.BodyRightUV,
                    Mario.BodyTopUV, Mario.BodyBottomUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.texture)
            };

            var chest = this.body.add(new GameObject());
            chest.add(MeshRenderer, marioChestMesh);
            return chest;
        }

        private addArm(location: Vector3) {
            var marioArmMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Mesh.Cube(0.2, 0.5, 0.2, this.context,
                    Mario.ArmFrontUV, Mario.ArmBackUV,
                    Mario.ArmLeftUV, Mario.ArmRightUV,
                    Mario.ArmTopUV, Mario.ArmBottomUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.texture)
            };

            var container = this.body.add(new GameObject());
            container.transform.y = 0.2;
            var arm = container.add(new GameObject());
            arm.transform = arm.transform.translate(location.add(new Vector3(0, -0.2, 0)));
            arm.add(MeshRenderer, marioArmMesh);
            return container;
        }

        private addLeg(location: Vector3) {
            var marioLegMesh = <{ [prop: string]: any }>{
                mesh: new JumperCube.Mesh.Cube(0.24, 0.24, 0.3, this.context,
                    Mario.LegFrontUV, Mario.LegBackUV,
                    Mario.LegLeftUV, Mario.LegRightUV,
                    Mario.LegTopUV, Mario.LegBottomUV),
                material: new Jv.Games.WebGL.Materials.TextureMaterial(this.texture)
            };

            var container = this.body.add(new GameObject());
            container.transform.y = -0.05;
            var leg = container.add(new GameObject());
            leg.transform = leg.transform.translate(location.add(new Vector3(0, 0.05, 0)));
            leg.add(MeshRenderer, marioLegMesh);
            return container;
        }

        onHit() {
            if(!this.blink.isActive)
                this.isSmall = true;
        }

        onTrigger(collider: Components.Collider) {
            if (collider.object instanceof Mushroom) {
                this.isSmall = false;
                collider.object.destroy();
            }
        }
    }
}
