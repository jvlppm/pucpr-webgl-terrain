attribute vec3 position;
attribute vec2 textureCoord;
attribute highp vec3 normal;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

uniform vec3 ambientLight;
uniform vec3 directionalLightColor;
uniform vec3 directionalVector;

uniform mat4 Mmatrix;
uniform mat4 Nmatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) { //pre-built function
    gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
    vTextureCoord = textureCoord;

    // Apply lighting effect
    highp vec4 transformedNormal = Nmatrix * vec4(normal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}
