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
	float lengthColor = length(vec2(0.5)) - lengthFromCenter * 1.0 / length(vec2(0.5)) ;
	float effectStrength = 0.9;
	vec4 vignetteColor = vec4(mix(color.rgb, color.rgb * lengthColor, effectStrength), 1.0);

	//	Cmamera lines effect
	float numberOfStripes = 14.0; // Number of stripes with and without the effect
	float lineSpeed = 2.0; // The higher this value is the faster the lines move
	float lineEffectIntensity = 0.07; //Itensity of the line effect
	float timeFactor = time * lineSpeed;
	vec4 lineEffectColor;

	float line = mod(floor(timeFactor - vTextureCoord.y * numberOfStripes), 2.0);

	if (line == 0.0){  
		lineEffectColor = vec4(vTextureCoord.y *lineEffectIntensity);	
	}
	else lineEffectColor = vec4(0.0);
	

	//	Final Color
	gl_FragColor = vignetteColor + lineEffectColor;
}
