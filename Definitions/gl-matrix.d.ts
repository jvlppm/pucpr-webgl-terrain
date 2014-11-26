// Type definitions for gl-matrix 2.2.2
// Project: https://github.com/toji/gl-matrix/tree/master/src/gl-matrix
// Definitions by: João Vitor Pietsiaki Moraes <https://github.com/jvlppm/>

declare class GLMAT_ARRAY_TYPE implements Float32Array {
    BYTES_PER_ELEMENT:number;
    length:number;
    buffer:ArrayBuffer;
    byteOffset:number;
    byteLength:number;

    get(index:number):number;
    set(index:number, value:number):void;
    set(array:Float32Array, offset:number):void;
    set(array:number[], offset:number):void;
    subarray(begin:number, end:number):Float32Array;

    [index: number]: number;
}

/**
 * 3 Dimensional Vector
 */
declare class vec3 extends GLMAT_ARRAY_TYPE {
    /**
     * Creates a new, empty vec3
     * @returns a new 3D vector.
     */
    static create(): vec3;

    /**
     * Creates a new vec3 initialized with the given values
     *
     * @param x X component
     * @param y Y component
     * @param z Z component
     * @returns a new 3D vector
     */
    static fromValues(x: number, y: number, z: number): vec3;

    /**
     * Normalize a vec3
     *
     * @param out the receiving vector
     * @param a vector to normalize
     * @returns out
     */
    static normalize(out: vec3, a: vec3): vec3;

    /**
     * Adds two vec3's
     *
     * @param out the receiving vector
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    static add(out: vec3, a: vec3, b: vec3);

    /**
     * Subtracts vector b from vector a
     *
     * @param out the receiving vector
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    static subtract(out: vec3, a: vec3, b: vec3): vec3;

    /**
     * Computes the cross product of two vec3's
     *
     * @param out the receiving vector
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    static cross(out: vec3, a: vec3, b: vec3): vec3;
}