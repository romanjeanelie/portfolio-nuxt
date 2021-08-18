uniform vec2 resolution;
uniform float uTime; 

uniform vec2 hover; 
uniform float hoverState;

varying vec2 vUv; 
varying vec3 vNormal; 



float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
        uv -= disc_center;
        uv*=resolution;
        float dist = sqrt(dot(uv, uv));
        return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main(){

    vec3 newPosition = position;

    // float dist = distance(uv, hover);
    float c = circle(uv, hover, 0.0, 0.4);

    newPosition.z += sin(c * 2.) * 20. * hoverState;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);

    vUv = uv; 
    vNormal = normal; 
}