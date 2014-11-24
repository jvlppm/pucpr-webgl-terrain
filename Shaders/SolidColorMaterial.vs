attribute vec3 position;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;

void main(void) { //pre-built function
    gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
}
