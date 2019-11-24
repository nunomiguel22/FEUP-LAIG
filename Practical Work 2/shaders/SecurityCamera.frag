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
	float numberOfStripes = 15.0; // Number of stripes with and without the effect
	float lineSpeed = 2.0; //Seconds for a line to make a full revolution
	float lineEffectIntensity = 0.07; //Itensity of the line effect
	float timeFactor = time / lineSpeed;
	vec4 lineEffectColor;

	float line = mod(floor(timeFactor - vTextureCoord.y * numberOfStripes), 2.0);

	if (line == 0.0){  
		lineEffectColor = vec4(vTextureCoord.y *lineEffectIntensity);	
	}
	else lineEffectColor = vec4(0.0);
	

	//	Final Color
	gl_FragColor = vignetteColor + lineEffectColor;
}
