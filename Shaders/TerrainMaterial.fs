precision mediump float;

//Propriedades das luzes
uniform vec3 uLightDir;
uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight;
uniform vec3 uSpecularLight;

//Propriedades do material
uniform vec3 uAmbientMaterial;
uniform vec3 uDiffuseMaterial;
uniform vec3 uSpecularMaterial;
uniform float uSpecularPower;
uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uTex3;

uniform bool isClipping;

//Propriedades do vertice
varying vec3 vNormal;
varying vec3 vViewPath;
varying highp vec2 vTexCoord;
varying vec4 vTexWeight;
varying float vDepth;
varying float clip;

void main(void) 
{
    if (isClipping && clip < 0.0) {
        discard;
    }
    
    //Ajusta os parametros de entrada
    vec3 L = normalize(uLightDir);
    vec3 N = normalize(vNormal);

    //Calculo do componente ambiente
    vec3 ambient = uAmbientLight * uAmbientMaterial;

    //Calculo do componente difuso
    float Id = dot(N, -L);
    vec3 diffuse = Id * uDiffuseLight * uDiffuseMaterial;
    
    //Calculo do componente especular
    float Is = 0.0;
    if (uSpecularPower > 0.0) {
        vec3 V = normalize(vViewPath);
        vec3 R = reflect(L, N);
        Is = pow(max(dot(R, V), 0.0), uSpecularPower);
    }

    vec3 specular = Is * uSpecularLight * uSpecularMaterial;

    //Interpolação da textura
    float blendDistance = 0.99;
    float blendWidth = 100.0;
    float blendFactor = clamp((vDepth - blendDistance) * blendWidth, 0.0, 1.0);
        
    vec4 texelNear = texture2D(uTex0, vec2(vTexCoord.s * 50.0, vTexCoord.t * 50.0)) * vTexWeight.w + 
                     texture2D(uTex1, vec2(vTexCoord.s * 50.0, vTexCoord.t * 50.0)) * vTexWeight.z +
                     texture2D(uTex2, vec2(vTexCoord.s * 50.0, vTexCoord.t * 50.0)) * vTexWeight.y +
                     texture2D(uTex3, vec2(vTexCoord.s * 50.0, vTexCoord.t * 50.0)) * vTexWeight.x;
                     
    vec4 texelFar = texture2D(uTex0, vec2(vTexCoord.s * 10.0, vTexCoord.t  * 10.0)) * vTexWeight.w + 
                    texture2D(uTex1, vec2(vTexCoord.s * 10.0, vTexCoord.t  * 10.0)) * vTexWeight.z +
                    texture2D(uTex2, vec2(vTexCoord.s * 10.0, vTexCoord.t  * 10.0)) * vTexWeight.y +
                    texture2D(uTex3, vec2(vTexCoord.s * 10.0, vTexCoord.t  * 10.0)) * vTexWeight.x;
                    
    vec3 texel = vec3(mix(texelNear, texelFar, blendFactor));

    //Combina os componentes para a cor final
    
    vec3 color = clamp(texel * (ambient + diffuse) + specular, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}