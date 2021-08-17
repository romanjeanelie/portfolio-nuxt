uniform float uTime; 

varying vec2 vUv; 
varying vec3 vNormal; 

 // Shader Chunks
#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	varying vec3 vViewPosition;
#endif
 // Shader Chunks

void main(){
     // Shader Chunks
    vec3 transformed = vec3( position );

    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

     #if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )
	vViewPosition = - mvPosition.xyz;
 #endif
     // Shader Chunks

    vec3 newPosition = position;

    gl_Position = projectionMatrix * mvPosition;

    vUv = uv; 
    vNormal = normal; 
}