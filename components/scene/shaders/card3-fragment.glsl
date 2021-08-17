uniform vec3 bgColor1;
uniform vec3 bgColor2;
uniform vec3 fgColor1;
uniform float uTime; 

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

float circleSDF(vec2 st) {
    return length(st-.5)*2.;
}

float stroke(float x, float size, float w) {
    float d = step(size, x+w*.5) - step(size, x-w*.5);
    return clamp(d, 0., 1.);
}

float fill(float x, float size) {
    // return 1.-smoothstep(size, size+0.01, x);
    return 1.-smoothstep(size, size*0.9, x);
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
    vec3 color = vec3(0.);


    // Lines curve
    // color += sin(vUv.x * 100. * vUv.y + uTime);
    // color += cos(vUv.y * 10. * vUv.y + uTime);

    // Circle then lines
    // color+=length(vUv - 0.5);
    // color += sin(color * 10. + vUv.y * 4. * uTime) * vUv.y;

    // Two circles dancing
    // color += dot((vUv.x - 0.5) * 2. * sin(uTime * .1) * 550., (vUv.y-0.5) * .07 );
    // color -= mod(color * 0.2, 0.6);


    color += fill(circleSDF(vUv),.65);
    vec2 offset = vec2(.1,.05 * sin(uTime * 0.1) * 3.);
    color -= fill(circleSDF(vUv-offset),.5);
 
    vec3 bg = mix(bgColor1, bgColor2, vNormal.y * sin(uTime));


    // gl_FragColor = vec4(vec3(light),1.);
    gl_FragColor = vec4(color,1.);
}