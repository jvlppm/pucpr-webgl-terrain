///<reference path="references.ts" />

module Jv.Games.WebGL {
    export class Utils {
        static StartTick(tickMethod: (dt: number) => void) {
            var oldTime = 0;
            return new Promise((resolve, reject) => {
                var tickLoop = (time) => {
                    try {
                        var deltaTime = time - oldTime;
                        oldTime = time;

                        tickMethod(deltaTime / 1000);
                        window.requestAnimationFrame(tickLoop);
                    }
                    catch (e) {
                        reject(e);
                    }
                };
                tickLoop(0);
            });
        }
    }
}