///<reference path="references.ts" />
module Jv.Games.WebGL {
    export enum Key {
        Space = 32,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,

        A = 65,
        D = 68,
        E = 69,
        Q = 81,
        S = 83,
        W = 87,
    }

    export class Keyboard {
        static currentlyPressedKeys = {};

        public static init() {
            window.onkeydown = Keyboard.handleKeyDown;
            window.onkeyup = Keyboard.handleKeyUp;
        }

        private static handleKeyDown(event: KeyboardEvent) {
            Keyboard.currentlyPressedKeys[event.keyCode] = true;
        }

        private static handleKeyUp(event: KeyboardEvent) {
            Keyboard.currentlyPressedKeys[event.keyCode] = false;
        }

        static isKeyDown(key: Key) : boolean {
            return Keyboard.currentlyPressedKeys[key];
        }
    }
}