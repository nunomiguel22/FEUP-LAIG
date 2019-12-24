#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 uFontColor;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);

	if (color.r <= 0.5)
		color = vec4(0.0, 0.0, 0.0, 0.0);
	else color = uFontColor;
	
	gl_FragColor = color;
}
