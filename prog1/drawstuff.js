/* classes */

// Color constructor
class Color {
    constructor(r, g, b, a) {
        try {
            if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
                throw "color component not a number";
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw "color component less than 0";
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw "color component bigger than 255";
            else {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end Color constructor

    // Color change method
    change(r, g, b, a) {
        try {
            if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
                throw "color component not a number";
            else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
                throw "color component less than 0";
            else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
                throw "color component bigger than 255";
            else {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        } // end throw

        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


// Vector class
class Vector {
    constructor(x, y, z) {
        this.set(x, y, z);
    } // end constructor

    // sets the components of a vector
    set(x, y, z) {
        try {
            if ((typeof (x) !== "number") || (typeof (y) !== "number") || (typeof (z) !== "number"))
                throw "vector component not a number";
            else
                this.x = x;
            this.y = y;
            this.z = z;
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end vector set

    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.copy: non-vector parameter";
            else
                this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        } // end try

        catch (e) {
            console.log(e);
        }
    }

    toConsole(prefix = "") {
        console.log(prefix + "[" + this.x + "," + this.y + "," + this.z + "]");
    } // end to console

    // static dot method
    static dot(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.dot: non-vector parameter";
            else
                return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
        } // end try

        catch (e) {
            console.log(e);
            return (NaN);
        }
    } // end dot static method

    // static cross method
    static cross(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else {
                var crossX = v1.y * v2.z - v1.z * v2.y;
                var crossY = v1.z * v2.x - v1.x * v2.z;
                var crossZ = v1.x * v2.y - v1.y * v2.x;
                return (new Vector(crossX, crossY, crossZ));
            } // endif vector params
        } // end try

        catch (e) {
            console.log(e);
            return (NaN);
        }
    } // end dot static method

    // static add method
    static add(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.add: non-vector parameter";
            else
                return (new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z));
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.subtract: non-vector parameter";
            else {
                var v = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
                return (v);
            }
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end subtract static method

    // static scale method
    static scale(c, v) {
        try {
            if (!(typeof (c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return (new Vector(c * v.x, c * v.y, c * v.z));
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end scale static method


    // static scale method
    static scalar_sub(c, v) {
        try {
            if (!(typeof (c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return (new Vector(v.x - c, v.y - c, v.z - c));
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end scale static method


    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.normalize: parameter not a vector";
            else {
                var lenDenom = 1 / Math.sqrt(Vector.dot(v, v));
                return (Vector.scale(lenDenom, v));
            }
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end scale static method


    // hadamard division method, where v1/v2 = [v1_x/v2_x, v1_y/v2_y, v1_z/v2_z]
    static hadamard_divide(v1, v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.division: non-vector parameter";
            else {
                var v = new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
                return (v);
            }
        } // end try

        catch (e) {
            console.log(e);
            return (new Vector(NaN, NaN, NaN));
        }
    } // end subtract static method


        static multiply(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.multiply: non-vector parameter";
            else {
                var v = new Vector(v1.x*v2.x,v1.y*v2.y,v1.z*v2.z);
                //v.toConsole("Vector.multiply: ");
                return(v);
            }
        } // end try

        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end multiply static method

} // end Vector class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata, x, y, color) {
    try {
        if ((typeof (x) !== "number") || (typeof (y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x < 0) || (y < 0) || (x >= imagedata.width) || (y >= imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y * imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex + 1] = color.g;
            imagedata.data[pixelindex + 2] = color.b;
            imagedata.data[pixelindex + 3] = color.a;
        } else
            throw "drawpixel color is not a Color";
    } // end try

    catch (e) {
        console.log(e);
    }
} // end drawPixel

// get the input ellipsoids from the standard class URL
function getInputEllipsoids() {
    const INPUT_ELLIPSOIDS_URL =
        "https://ncsucgclass.github.io/prog1/ellipsoids.json";

    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET", INPUT_ELLIPSOIDS_URL, false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now() - startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log * ("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response);
} // end get input ellipsoids

function getIntersection(ellipsoid, E, D, window_z) {
    var C = new Vector(ellipsoid.x, ellipsoid.y, ellipsoid.z)
    var A = new Vector(ellipsoid.a, ellipsoid.b, ellipsoid.c)

    // a= D/A*D/A
    var d_div_a = Vector.hadamard_divide(D, A) //ta
    var a = Vector.dot(d_div_a, d_div_a)

    var e_sub_c = Vector.subtract(E, C)
    var e_sub_c_div_a = Vector.hadamard_divide(e_sub_c, A) //tb
    var b = 2 * Vector.dot(e_sub_c_div_a, d_div_a)

    var c = Vector.dot(e_sub_c_div_a, e_sub_c_div_a) - 1

    var discriminant = Math.pow(b, 2) - (4 * a * c)
    if (discriminant < 0) {
        return null
    }
    // discriminant>=0
    else {
        var t1 = (-b - Math.sqrt(discriminant))/(2*a)
        var t2 = (-b + Math.sqrt(discriminant))/(2*a)
        if (t1 >= t2) {
            t1 = (-b + Math.sqrt(discriminant))/(2*a)
            t2 = (-b - Math.sqrt(discriminant))/(2*a)
        }
        // discriminant is positive so t1<t2
        //console.assert(t1<=t2, "For intersection calculation t1<t2")
        var I = Vector.add(E, Vector.scale(t1, D))

        //t1 intersects before window
        if (I.z < window_z) {

            var I2 = Vector.add(E, Vector.scale(t2, D))

            //t2 also intersects before window
            if (I2.z < window_z) {
                return null
            }
            return t2
        }
        return t1
    }

}

function findNormalVectorEllipsoid(Intersection, ellipsoid){
    //[2(Ix - Cx) / a2  2(Iy - Cy) / b2  2(Iz - Cz) / c2]
    var C = new Vector(ellipsoid.x, ellipsoid.y, ellipsoid.z)
    var A = new Vector(ellipsoid.a, ellipsoid.b, ellipsoid.c)

    var temp = Vector.subtract(Intersection, C)

    var N = new Vector(
        temp.x/Math.pow(A.x,2),
        temp.y/Math.pow(A.y,2),
        temp.z/Math.pow(A.z,2)
    )
    return Vector.normalize(N)


}
function DrawRaycastEllipsoid(context, view, projection_window, light_loc) {
    var input_ellipsoids = getInputEllipsoids();
    var width_canvas = context.canvas.width;
    var height_canvas = context.canvas.height;
    var imagedata = context.createImageData(width_canvas, height_canvas);
    console.log(input_ellipsoids)

    var ul = projection_window[0]
    var ur = projection_window[1]
    var ll = projection_window[2]
    var lr = projection_window[3]
    var screen_center = projection_window[4]

    // For each screen pixel
    for (var x = 0; x < width_canvas; x++) {
        for (var y = 0; y < height_canvas; y++) {
            // Find the ray from the eye through the pixel
            var P_ly = ul.y + (y / height_canvas) * (ll.y - ul.y)
            var P_ry = ur.y + (y / height_canvas) * (lr.y - ur.y)
            var P_y = P_ly + (x / width_canvas) * (P_ry - P_ly)

            var P_lx = ul.x + (y / height_canvas) * (ll.x - ul.x)
            var P_rx = ur.x + (y / height_canvas) * (lr.x - ur.x)
            var P_x = P_lx + (x / width_canvas) * (P_rx - P_lx)

            var P = new Vector(P_x, P_y, 0)

            // Get ray direction for current point.
            var D = Vector.subtract(P, view.eye);

            // The intersection of the epplisoid and ray, and which ellipsoid it came from
            var intersection_t = null;
            var ellipsoid_index = 0;

            // for every object in the scene
            for (var e = 0; e < input_ellipsoids.length; e++) {

                var t = getIntersection(input_ellipsoids[e], view.eye, D, screen_center.z);

                if (t != null) {
                    //if P_e is null we can't do logical comparison, so check this case beforehand
                    if (intersection_t == null) {
                        intersection_t = t;
                        ellipsoid_index = e;
                    } else if (t <= intersection_t) {
                        intersection_t = t;
                        ellipsoid_index = e;
                    }
                }
            }
            var c = new Color(0, 0, 0, 255)
            if (intersection_t != null) {

                //color = Ka*La + Kd*Ld*(N•L) + Ks*Ls*(N•H)^n

                //ambient
                // L_a is 1,1,1 so no need to multiply

                var Ka_r = input_ellipsoids[ellipsoid_index].ambient[0]
                var Ka_g = input_ellipsoids[ellipsoid_index].ambient[1]
                var Ka_b = input_ellipsoids[ellipsoid_index].ambient[2]


                //diffuse, Ld is also 1,1,1
                var Kd_r = input_ellipsoids[ellipsoid_index].diffuse[0]
                var Kd_g = input_ellipsoids[ellipsoid_index].diffuse[1]
                var Kd_b = input_ellipsoids[ellipsoid_index].diffuse[2]


                //specular
                // Ls is 1,1,1
                var Ks_r = input_ellipsoids[ellipsoid_index].specular[0]
                var Ks_g = input_ellipsoids[ellipsoid_index].specular[1]
                var Ks_b = input_ellipsoids[ellipsoid_index].specular[2]


                //color = Ka + Kd*(N•L) + Ks*(R•V)^n
                var P_e = Vector.add(view.eye, Vector.scale(intersection_t, D))

            	var N = findNormalVectorEllipsoid(P_e, input_ellipsoids[ellipsoid_index]);
            	var L = Vector.normalize(Vector.subtract(light_loc, P_e));
            	var V = Vector.normalize(Vector.subtract(view.eye, P_e));

                var NL = Vector.dot(N, L)

                var V = Vector.normalize(Vector.add(L, V));
                var NV_n = Math.pow(Vector.dot(N, V), input_ellipsoids[ellipsoid_index].n);


            	var c_r = color_correct(Ka_r)+
                    color_correct(Kd_r*NL)+
                    color_correct(Ks_r*NV_n)
            	var c_g = color_correct(Ka_g)+
                    color_correct(Kd_g*NL)+
                    color_correct(Ks_g*NV_n)
            	var c_b = color_correct(Ka_b)+
                    color_correct(Kd_b*NL)+
                    color_correct(Ks_b*NV_n)

            	c_r = Math.min(c_r, 255)
                c_r = Math.max(c_r, 0)
            	c_g = Math.min(c_g, 255)
                c_g = Math.max(c_g, 0)
            	c_b = Math.min(c_b, 255)
                c_b = Math.max(c_b, 0)


                c = new Color(
                    c_r,
                    c_g,
                    c_b,
                    255
                )

            }
            drawPixel(imagedata, x, y, c);
        }
    }
    context.putImageData(imagedata, 0, 0);
}

function color_correct(r) {
	 r = Math.round(r*255);
	 r = Math.min(r, 255)
	 r = Math.max(r, 1)
	return r;
}

function main() {


    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    var eye = new Vector(0.5, 0.5, -0.5);
    var view_up = new Vector(0, 1, 0);
    var look_at = new Vector(0, 0, 1);

    var view = {eye: eye, lookat: look_at, viewup: view_up};

    // Locate the window a distance of 0.5 from the eye,
    // and make it a 1x1 square normal to the look at vector and centered at (0.5,0.5,0),
    // and parallel to the view up vector. With this scheme, you can assume that everything
    // in the world is in view if it is located in a 1x1x1 box with one corner at the origin,
    // and another at (1,1,1).
    var window_distance = .5
    var window_W = 1
    var window_H = 1
    var screen_center = new Vector(.5, .5, 0)
    var ul = new Vector(0, 1, 0)
    var ur = new Vector(1, 1, 0)
    var ll = new Vector(0, 0, 0)
    var lr = new Vector(1, 0, 0)


    var projection_window = [ul, ur, ll, lr, screen_center]


    // Put a white (1,1,1) (for ambient, diffuse and specular) light at location (-0.5,1.5,-0.5).
    var light_loc = new Vector(-.5,1.5,-.5)
    DrawRaycastEllipsoid(context, view, projection_window, light_loc);
}
