uniform vec3 bgColor1;
uniform vec3 bgColor2;
uniform vec3 fgColor1;
uniform vec2 hover; 
uniform float uTime; 

uniform sampler2D  uImage;

varying vec2 vUv; 
varying vec3 vNormal;

 // Shader Chunks
#if NUM_CLIPPING_PLANES > 0

	#if ! defined( PHYSICAL ) && ! defined( PHONG )
		varying vec3 vViewPosition;
	#endif

	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];

#endif
 // Shader Chunks

float triSDF(vec2 st) {
    st = (st*2.-1.)*2.;
    return max(abs(st.x) * 0.866025 + st.y * 0.5, -st.y * 0.5);
}

float fill(float x, float size) {
    // return 1.-smoothstep(size, size+0.01, x);
    return 1.-step(size, x);
}

void main(){

    // Shader Chunks
   #if NUM_CLIPPING_PLANES > 0

	for ( int i = 0; i < UNION_CLIPPING_PLANES; ++ i ) {

		vec4 plane = clippingPlanes[ i ];
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;

	}
            
        #if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES

            bool clipped = true;
            for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; ++ i ) {
                vec4 plane = clippingPlanes[ i ];
                clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;
            }

            if ( clipped ) discard;
        
        #endif

#endif
    // Shader Chunks

    vec2 st = (vUv * 2.) - 2.;
    vec2 newVuv = vUv; 

    vec3 color = vec3(0.);

    // Triangle
    // float triangle = triSDF(vec2(vUv.x + cos(vUv.y * 8. + uTime * 0.2) *0.2, vUv.y - sin(vUv.x) * .5)); 
    // color += 1. - triangle;

    // Lines curve
    // color += sin(vUv.x * 100. * vUv.y + uTime);
    // color += cos(vUv.y * 10. * vUv.y + uTime);

    // Circle then lines
    // color+=length(vUv - 0.5);
    // color += sin(color * 10. + vUv.y * 4. * uTime) * vUv.y;

    // Two circles dancing
    // color += dot((vUv.x - 0.5) * 2. * sin(uTime * 2.) * 550., (vUv.y-0.5) * .07 );
    // color -= mod(color * 0.2, 0.6);

    vec4 texture = texture2D(uImage, vUv);


  
    gl_FragColor = vec4(texture);
}