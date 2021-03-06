if (!gl) {
  throw new Error(`webGL not supported`);
}
/* ***OUTLINE**** */
// load vertexData into Buffer
// create vertex SharedArrayBuffer
// create program
// attach shaders to program
// enable vertex attributes
// draw

console.log(`Starting...`);

// create a triangle, x,y,z. WebGL uses OpenGL uses Float32 Arrays.
// Typically don't use Float32 arrays in JS as per:
// https://stackoverflow.com/questions/15823021/when-to-use-float32array-instead-of-array-in-javascript
// changing these points will alter where the corners of your triangle are. max is 1, min is -1

const vertexData = new Float32Array([0, 1, 0, 1, -1, 0, -1, -1, 0]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // bind this buffer as the current buffer; as an array of vertices
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW); // STATIC_DRAW if not rewriting (optomise) common alternative is DYNAMIC_DRAW

// Creates the vertex-shader; a mini program that runs on the GPU
// this uses the GL shading language (not JS), hence the typed return for the function (ie 'void')
// gl_position is the output of the shader; an array of 4 components from the buffer
// vec3 indicates the three parts of x,y,z; this is converted to a vec4 by adding "1" to 'position'
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  attribute vec3 position;
  void main() { 
      gl_Position = vec4(position, 1);
  }
  `
);
gl.compileShader(vertexShader);

// create a fragment-shader
// a fragment shader shades the pixels between vertices
// the vec4 is in format RGB-A
// try changing some of these numbers and see what happens
// eg vec4(0,1,0,.5) gives a transparent green triangle
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  void main(){
      gl_FragColor = vec4(1, 0, 0, 1);
  }
  `
);
gl.compileShader(fragmentShader);

// create a program that links the two shaders (vertex and fragment)
// to the actual vertices
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// load the attributes.
// Currently we just have a single attribute `position` created with the vertex shader
// Attributes are disabled by default - so we have to enable it
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);

// how webgl should retrieve data from the currently bound buffer
// what is being retrieved? positionLocation
// how many elements to read at a time? 3 (x,y,z)
// what type are the elements? floating point numbers (from Float32Array)
// remaining arguments are not used ('normalise' is an advanced optomisation, not needed here)
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// create an excutable program on the graphics card
// drawArrays, 2nd argument is which vertex to start at, how many to draw? (in this case there are 3 vertices all with 3 attributes (x,y,z))
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
