uniform float uTime; 
uniform float uReveal; 
uniform vec2 uResolution;
uniform vec2 uQuadSize;

varying vec2 vSize;
varying vec2 vUv; 

void main(){
    float PI = 3.1415926;
    vUv = uv; 
    float progress = sin(uTime * 1.);


    // vec4 finalState = mix(defaultState,fullScreenState,cornersProgress);

    vSize = mix(uQuadSize,uResolution,1.);

    // gl_Position = projectionMatrix * viewMatrix * fullScreenState;
    gl_Position = projectionMatrix * viewMatrix *  modelMatrix*vec4( position, 1.0 );
}