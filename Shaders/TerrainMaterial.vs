attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoord;
attribute vec4 aTexWeight;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uEyePos;

uniform vec4 clipPlane;

varying vec3 vNormal;
varying vec3 vViewPath;
varying highp vec2 vTexCoord;
varying vec4 vTexWeight;
varying float vDepth;

varying float clip;


void main(void)
{
    vec4 worldPos = uModel * vec4(aVertexPosition, 1.0);
    gl_Position = uProjection * uView * worldPos;

    vNormal = vec3(uModel * vec4(aVertexNormal,0));
    vViewPath = vec3(worldPos) - uEyePos;
    vDepth = gl_Position.z / gl_Position.w;

    vTexCoord = aTexCoord;

    //Normaliza os pesos da textura para uma mistura homogênea
    float t = aTexWeight.x + aTexWeight.y + aTexWeight.z + aTexWeight.w;
    vTexWeight = aTexWeight / t;

    clip = dot(vec4(aVertexPosition, 1.0), clipPlane);
}