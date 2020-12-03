/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0;
const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0;
const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog3/triangles.json"; // triangles file loc
const INPUT_ELLIPSOIDS_URL = "https://ncsucgclass.github.io/prog3/ellipsoids.json";
var Eye = new vec4.fromValues(0.5, 0.5, -0.5, 1.0); // default eye position in world space
var win_distance = .5;
var light = [-0.5, 1.5, -0.5];
var view_up = [0, 1, 0];
var center = [0.5, 0.5, 1]
var scale_factor = 1.2

/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var shaderProgram;
var canvas;
var look_at = mat4.create(); // look-at matrix with the given eye position, focal point, and up axis.
var projection = mat4.create(); // perspective projection matrix with the given bounds


/*Triangles*/
var inputTriangles;
var tri_vertexBuffer = []; // this contains vertex coordinates in triples
var tri_indexBuffer = []; // this contains indices into vertexBuffer in triples
var tri_normalBuffer = [];
var tri_selected = null;

var tri_translation = [];
var tri_rotations = [];


/* Ellipsoids */

var inputEllipsoids;
var ell_normalBuffer = [];
var ell_vertexBuffer = [];
var ell_indexBuffer = [];
var ell_selected = null;

var ell_translation = [];
var ell_rotations = [];


/* attributes to pass to vertex shader */
var obj_position; // where to put position for vertex shader
var obj_normal; // where to put normal for vertex shader


// TODO what are these for?????
var altPosition; // flag indicating whether to alter vertex positions
var altPositionUniform; // where to put altPosition flag for vertex shader


// get the JSON file from the passed URL
function getJSONFile(url, descr) {
    try {
        if ((typeof (url) !== "string") || (typeof (descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET", url, false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now() - startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open " + descr + " file!";
            else
                return JSON.parse(httpReq.response);
        } // end if good params
    } // end try    

    catch (e) {
        console.log(e);
        return (String.null);
    }
} // end get input spheres

// set up the webGL environment
function setupWebGL() {

    // Get the canvas and context
    canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it

    try {
        if (gl == null) {
            throw "unable to create gl context -- is your browser gl ready?";
        } else {
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
            gl.clearDepth(1.0); // use max when we clear the depth buffer
            gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
        }
    } // end try

    catch (e) {
        console.log(e);
    } // end catch

} // end setupWebGL

// read triangles in, load them into webgl buffers
function loadTriangles() {
    inputTriangles = getJSONFile(INPUT_TRIANGLES_URL, "triangles");
    if (inputTriangles != String.null) {
        for (var whichSet = 0; whichSet < inputTriangles.length; whichSet++) {

            var coordArray = []; // 1D array of vertex coords for WebGL
            var normalArray = [];
            var triangleIndexArray = []; // 1D array of vertex coords for WebGL

            var inputTriSet = inputTriangles[whichSet];

            // concats all vertex vertices into one array
            coordArray = [].concat.apply(coordArray, inputTriSet.vertices);
            normalArray = [].concat.apply(normalArray, inputTriSet.normals);

            // concats all triangle vertices into one array
            triangleIndexArray = [].concat.apply(triangleIndexArray, inputTriSet.triangles);

            tri_vertexBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tri_vertexBuffer[whichSet]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordArray), gl.STATIC_DRAW);
            tri_vertexBuffer[whichSet].num_items = 3;

            tri_indexBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tri_indexBuffer[whichSet]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndexArray), gl.STATIC_DRAW);
            tri_indexBuffer[whichSet].num_items = inputTriSet.triangles.length * 3;

            // normal buffer things
            tri_normalBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, tri_normalBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW); // coords to that buffer


            // initalize transformation and translation array for a triangle
            tri_rotations[whichSet] = vec3.create();
            tri_translation[whichSet] = vec3.create();

        } // end for each triangle set
    } // end if triangles found
}


function loadEllipsoids() {
    inputEllipsoids = getJSONFile(INPUT_ELLIPSOIDS_URL, "ellipsoids");
    if (inputEllipsoids != String.null) {
        for (var whichSet = 0; whichSet < inputEllipsoids.length; whichSet++) {

            var C = [inputEllipsoids[whichSet].x,
                inputEllipsoids[whichSet].y, inputEllipsoids[whichSet].z];

            var A = [
                inputEllipsoids[whichSet].a,
                inputEllipsoids[whichSet].b, inputEllipsoids[whichSet].c];


            var num_slices = 50; // TODO see if this should be bigger?
            var vertices = [];
            var indices = [];
            var normal = [];

            for (var i = 0; i <= num_slices; i++) {
                var ai = i * Math.PI / (num_slices);
                var si = Math.sin(ai);
                var ci = Math.cos(ai);
                for (var j = 0; j <= num_slices; j++) {
                    var aj = j * 2 * Math.PI / num_slices;
                    var sj = Math.sin(aj);
                    var cj = Math.cos(aj);

                    var x0 = cj * si
                    var y0 = ci
                    var z0 = si * sj

                    var x = A[0] * x0 + C[0]
                    var y = A[1] * y0 + C[1]
                    var z = A[2] * z0 + C[2]

                    vertices.push(x, y, z);
                    normal.push(x0 / A[0], y0 / A[1], z0 / A[2]);

                    if (i < num_slices && j < num_slices) {
                        var index1 = i * (num_slices + 1) + j
                        var index2 = index1 + num_slices + 1

                        indices.push(index1, index2, index1 + 1);
                        indices.push(index1 + 1, index2, index2 + 1);
                    }
                }
            }

            ell_vertexBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ell_vertexBuffer[whichSet]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            ell_vertexBuffer[whichSet].num_items = num_slices * num_slices;


            ell_indexBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ell_indexBuffer[whichSet]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            ell_indexBuffer[whichSet].num_items = indices.length;


            ell_normalBuffer[whichSet] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ell_normalBuffer[whichSet]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
            ell_normalBuffer[whichSet].num_items = num_slices * num_slices;


            ell_rotations[whichSet] = vec3.create();
            ell_translation[whichSet] = vec3.create();

        } // end for each triangle set
    } // end if triangles found
}

// setup the webGL shaders
function setupShaders() {

    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;
        
        uniform vec3 eye;
        varying vec3 normal;
        varying vec4 position;
        uniform vec3 light;        
        uniform vec4 Ka;
        uniform vec4 Kd;
        uniform vec4 Ks;
        uniform float Ks_n;

        void main(void) {
            vec3 L = normalize(light - position.xyz); // light to obj pos
            vec3 V = normalize( - position.xyz); // eye to obj pos
            vec3 N = normalize(normal);
            //color = Ka + Kd*(N•L) + Ks*(R•V)^n
            float nl = max(dot(N, L), 0.0);            
			vec3 R = reflect(-L, N);
			float rv_n = pow(max(dot(R, V), 0.0), Ks_n);
            gl_FragColor = vec4(Ka.rgb, 1.0) + vec4(Kd.rgb * nl, 1.0) + vec4(Ks.rgb * rv_n, 1.0);
        }
    `;

    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 obj_position;
        attribute vec3 obj_normal;

        varying vec3 normal;
        varying vec4 position;

        uniform mat4 look_at;
        uniform mat4 projection;
        uniform mat3 transform;

        void main(void) {
            normal = transform * obj_normal;
            position = look_at * vec4(obj_position, 1.0);
            gl_Position = projection * position;
        }
    `;


    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader, fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader, vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
            gl.deleteShader(vShader);
        } else { // no compile errors
            shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                obj_position = gl.getAttribLocation(shaderProgram, "obj_position");
                gl.enableVertexAttribArray(obj_position); // input to shader from array

                obj_normal = gl.getAttribLocation(shaderProgram, "obj_normal");
                gl.enableVertexAttribArray(obj_normal);

                shaderProgram.eye = gl.getUniformLocation(shaderProgram, "eye");
                shaderProgram.light = gl.getUniformLocation(shaderProgram, "light");
                shaderProgram.projection = gl.getUniformLocation(shaderProgram, "projection");
                shaderProgram.look_at = gl.getUniformLocation(shaderProgram, "look_at");

                shaderProgram.Ka = gl.getUniformLocation(shaderProgram, "Ka");
                shaderProgram.Kd = gl.getUniformLocation(shaderProgram, "Kd");
                shaderProgram.Ks = gl.getUniformLocation(shaderProgram, "Ks");
                shaderProgram.Ks_n = gl.getUniformLocation(shaderProgram, "Ks_n");

                shaderProgram.transform = gl.getUniformLocation(shaderProgram, "transform");

            } // end if no shader program link errors
        } // end if no compile errors
    } // end try
    catch (e) {
        console.log(e);
    } // end catch
} // end setup shaders

// render the loaded model
function renderTriangles() {

    for (var whichSet = 0; whichSet < inputTriangles.length; whichSet++) {

        gl.bindBuffer(gl.ARRAY_BUFFER, tri_vertexBuffer[whichSet]);
        gl.vertexAttribPointer(obj_position, tri_vertexBuffer[whichSet].num_items, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, tri_normalBuffer[whichSet]);
        gl.vertexAttribPointer(obj_normal, 3, gl.FLOAT, false, 0, 0);


        // gotta know current center of triangle
        // Center = sum(x)/3, sum(y)/3, sum(y)/3 + translated
        var tri_center = vec3.create();
        for (whichSetTri = 0; whichSetTri < inputTriangles[whichSet].vertices.length; whichSetTri++) {

            var vertex = inputTriangles[whichSet].vertices[whichSetTri];
            vec3.add(tri_center, tri_center, vertex);
        }
        vec3.scale(tri_center, tri_center, 1 / inputTriangles[whichSet].vertices.length);

        renderObj(
            tri_center,
            tri_translation[whichSet],
            tri_rotations[whichSet],
            whichSet == tri_selected,
            inputTriangles[whichSet].material
        )


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tri_indexBuffer[whichSet]);
        gl.drawElements(gl.TRIANGLES, tri_indexBuffer[whichSet].num_items, gl.UNSIGNED_SHORT, 0);


    }

} // end render triangles


function renderEllipsoids() {


    for (var whichSet = 0; whichSet < inputEllipsoids.length; whichSet++) {

        gl.bindBuffer(gl.ARRAY_BUFFER, ell_vertexBuffer[whichSet]);
        gl.vertexAttribPointer(obj_position, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, ell_normalBuffer[whichSet]);
        gl.vertexAttribPointer(obj_normal, 3, gl.FLOAT, false, 0, 0);


        var ell_center = [inputEllipsoids[whichSet].x, inputEllipsoids[whichSet].y, inputEllipsoids[whichSet].z];

        renderObj(
            ell_center,
            ell_translation[whichSet],
            ell_rotations[whichSet],
            whichSet == ell_selected,
            inputEllipsoids[whichSet]
        )

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ell_indexBuffer[whichSet]);
        gl.drawElements(gl.TRIANGLES, ell_indexBuffer[whichSet].num_items, gl.UNSIGNED_SHORT, 0); // render
    }


}


function renderObj(center, translations, rotations, scale, material) {


    // transform matrix for translate rotate scale
    var transform = mat4.create();
    // Move transform matrix to currentl location of triangle
    mat4.translate(transform, transform, center);


    // Translate based on use input
    mat4.translate(transform, transform, translations);

    //Rotate
    mat4.rotateX(transform, transform, rotations[0]);
    mat4.rotateY(transform, transform, rotations[1]);
    mat4.rotateZ(transform, transform, rotations[2]);

    if (scale) {
        mat4.scale(transform, transform, [scale_factor, scale_factor, scale_factor]);

    }

    // subtract the center we added to the transform amtrix, this ensures that
    // our scaled matrix stays in place
    var center_rev = vec3.clone(center);
    vec3.scale(center_rev, center, -1.0)
    mat4.translate(transform, transform, center_rev);

    mat4.multiply(transform, look_at, transform);


    gl.uniformMatrix4fv(shaderProgram.projection, false, projection);
    gl.uniformMatrix4fv(shaderProgram.look_at, false, transform);
    gl.uniform3f(shaderProgram.light, light[0], light[1], light[2]);
    gl.uniform3f(shaderProgram.eye, Eye[0], Eye[1], Eye[2]);

    var transform_mat3 = mat3.create();
    mat3.fromMat4(transform_mat3, transform);
    gl.uniformMatrix3fv(shaderProgram.transform, false, transform_mat3);


    gl.uniform4f(shaderProgram.Ka, material.ambient[0], material.ambient[1], material.ambient[2], 1.0);
    gl.uniform4f(shaderProgram.Kd, material.diffuse[0], material.diffuse[1], material.diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.Ks, material.specular[0], material.specular[1], material.specular[2], 1.0);
    gl.uniform1f(shaderProgram.Ks_n, material.n);


}

/* MAIN -- HERE is where execution begins after window load */

function main() {

    setupWebGL(); // set up the webGL environment
    setupShaders();

    loadTriangles(); // load in the triangles from tri file
    loadEllipsoids();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.lookAt(look_at, Eye, center, view_up);
    mat4.perspective(projection, Math.PI / 2, canvas.width / canvas.height, win_distance, 100);
    renderTriangles();
    renderEllipsoids();

    // keypress events does not include arrow keys :/
    window.onkeypress = keypress_eventhandler;
    window.onkeydown = keydown_eventhandler;


}


function keypress_eventhandler(e) {
    const key = e.key;

    switch (key) {

        // View Translate
        case  'a': //a
            center[0] -= .1
            Eye[0] -= 0.1
            break
        case 'd': //d
            center[0] += .1
            Eye[0] += 0.1

            break
        case 'w': //w
            center[2] += .1
            Eye[2] += 0.1

            break
        case 's'://s
            center[2] -= .1
            Eye[2] -= 0.1

            break
        case 'q'://q
            center[1] -= .1
            Eye[1] -= 0.1

            break
        case 'e': //e
            center[1] += .1
            Eye[1] += 0.1
            break

        // view rotate
        case 'A':
            center[0] -= .1
            break
        case 'D':
            center[0] += .1
            break
        case 'W':
            center[1] -= .1
            break
        case 'S':
            center[1] += .1
            break


        // Model translate
        case ';':
            if (tri_selected != null) {
                tri_translation[tri_selected][0] -= .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][0] -= .1
            }
            break
        case 'k':
            if (tri_selected != null) {
                tri_translation[tri_selected][0] += .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][0] += .1
            }
            break
        case 'o':
            if (tri_selected != null) {
                tri_translation[tri_selected][2] -= .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][2] -= .1
            }
            break
        case 'l':
            if (tri_selected != null) {
                tri_translation[tri_selected][2] += .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][2] += .1
            }
            break
        case 'i':
            if (tri_selected != null) {
                tri_translation[tri_selected][1] -= .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][1] -= .1
            }
            break
        case 'p':
            if (tri_selected != null) {
                tri_translation[tri_selected][1] += .1
            }
            if (ell_selected != null) {
                ell_translation[ell_selected][1] += .1
            }
            break

        // Model rotate
        case 'K':
            if (tri_selected != null) {
                tri_rotations[tri_selected][1] -= .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][1] -= .1
            }
            break
        case ':':
            if (tri_selected != null) {
                tri_rotations[tri_selected][1] += .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][1] += .1
            }
            break


        case 'O':
            if (tri_selected != null) {
                tri_rotations[tri_selected][0] -= .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][0] -= .1
            }
            break
        case 'L':
            if (tri_selected != null) {
                tri_rotations[tri_selected][0] += .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][0] += .1
            }
            break


        case 'I':
            if (tri_selected != null) {
                tri_rotations[tri_selected][2] -= .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][2] -= .1
            }
            break
        case 'P':
            if (tri_selected != null) {
                tri_rotations[tri_selected][2] += .1
            }
            if (ell_selected != null) {
                ell_rotations[ell_selected][2] += .1
            }
            break
    }


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.lookAt(look_at, Eye, center, view_up);
    mat4.perspective(projection, Math.PI / 2, canvas.width / canvas.height, win_distance, 100);

    renderTriangles();
    renderEllipsoids();


}

/*
Javascript does not do negative mod correctly, implement an actual mod function
 */
function mod(n, m) {
    return (n + m) % m;
}

function keydown_eventhandler(e) {
    var keycode = e.keyCode
    switch (keycode) {
        case 37: //left arrow
            tri_selected -= 1
            tri_selected = mod(tri_selected, inputTriangles.length)
            break
        case  39: //right arrow
            tri_selected += 1
            tri_selected = mod(tri_selected, inputTriangles.length)
            break
        case 38: // up arrow
            ell_selected += 1
            ell_selected = mod(ell_selected, inputEllipsoids.length)
            break
        case 40: //down arrow
            ell_selected -= 1
            ell_selected = mod(ell_selected, inputEllipsoids.length)
            break
        case 32: //space
            tri_selected = null
            ell_selected = null
            break

    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderTriangles();
    renderEllipsoids();


}