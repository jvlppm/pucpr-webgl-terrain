attribute vec3 position;
attribute vec3 color; //the color of the point

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;

varying vec3 vColor;

void main(void) { //pre-built function
    gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
    vColor = color;
}
