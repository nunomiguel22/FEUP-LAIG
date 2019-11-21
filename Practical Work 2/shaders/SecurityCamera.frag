#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);

	//	Vignette;
	float lengthFromCenter = length(vTextureCoord - 0.5);
	float colorStrength = length(vec2(0.5)) - lengthFromCenter * 1.0 / length(vec2(0.5)) ;

	vec4 vignetteColor = vec4(mix(color.rgb, color.rgb * colorStrength, 0.8), 1.0);

	//	Cmamera lines effect
	float lineSpeed = 20.0; //Seconds for a line to make a full revolution
	float linethickness =  0.05; // Thickness of the line effect
	float timeFactor = time / lineSpeed;
	vec4 textureMod = vec4(mod(timeFactor - vTextureCoord.y, linethickness));

	//	Final Color
	gl_FragColor = vignetteColor + textureMod;
}
