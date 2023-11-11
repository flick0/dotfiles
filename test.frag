//
// Example blue light filter shader.
// 

precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D tex;
vec4 color = vec4(1);

void main() {

    vec4 pixColor = texture2D(tex, v_texcoord);



if (int(mod(gl_FragCoord.x, 10.0)) == 0 ||
        int(mod(gl_FragCoord.y, 10.0)) == 0) {
			pixColor[0] *= 0.9;
			pixColor[1] *= 0.9;
			pixColor[2] *= 0.9;

		// pixColor = vec4(0.10980392156,0.10588235294 ,0.09411764705 ,1);
    }
	gl_FragColor = pixColor;
}