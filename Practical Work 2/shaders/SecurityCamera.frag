#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main() {

	float lineThickness = 0.005; 
	float lineSpeed = 2.0; //revolutions a second
	float line = mod(time, lineSpeed) / lineSpeed;


    vec2 fromCenter = vTextureCoord - vec2(0.5, 0.5);
	float colorStrengh = 1.0 - length(fromCenter);

	
	if (line >= vTextureCoord.y - lineThickness && line <= vTextureCoord.y + lineThickness)
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	
	else
	gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(colorStrengh , colorStrengh, colorStrengh, 1.0) ;
}
