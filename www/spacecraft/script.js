/**
 * Tiny 3D library
 */
var T3D;
(function (T3D) {
    /**
     * Radiant scale
     */
    T3D.RAD_SCALE = Math.PI / 180;
    /**
     * Vector 3 math
     */
    class Vec3 {
        constructor(x, y, z) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.set(x, y, z);
        }
        set(xOrVec, y, z) {
            if (xOrVec instanceof Vec3) {
                this.x = xOrVec.x;
                this.y = xOrVec.y;
                this.z = xOrVec.z;
                return this;
            }
            if (typeof xOrVec == 'number') {
                this.x = xOrVec;
            }
            if (typeof y == 'number') {
                this.y = y;
            }
            if (typeof z == 'number') {
                this.z = z;
            }
            return this;
        }
        max() {
            return Math.max(this.x, this.y, this.z);
        }
        add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            this.z += vec.z;
            return this;
        }
        sub(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            this.z -= vec.z;
            return this;
        }
        distance(vec) {
            return Math.sqrt((this.x - vec.x) * (this.x - vec.x) +
                (this.y - vec.y) * (this.y - vec.y) +
                (this.z - vec.z) * (this.z - vec.z));
        }
        dot(vec) {
            return this.x * vec.x + this.y * vec.y + this.z * vec.z;
        }
        cross(vec) {
            let x = this.x;
            let y = this.y;
            let z = this.z;
            let vx = vec.x;
            let vy = vec.y;
            let vz = vec.z;
            this.x = y * vz - z * vy;
            this.y = z * vx - x * vz;
            this.z = x * vy - y * vx;
            return this;
        }
        ;
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        scale(value) {
            this.x *= value instanceof Vec3 ? value.x : value;
            this.y *= value instanceof Vec3 ? value.y : value;
            this.z *= value instanceof Vec3 ? value.z : value;
            return this;
        }
        normalize() {
            var length = this.length();
            if (length > 0) {
                this.scale(1 / length);
            }
            return this;
        }
        clone() {
            return new Vec3(this.x, this.y, this.z);
        }
        invert() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        }
        toArray() {
            return [this.x, this.y, this.z];
        }
    }
    T3D.Vec3 = Vec3;
    /**
     * 3x3 matrix math
     */
    class Mat3 {
        constructor(data) {
            this.data = data || [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ];
        }
        transpose() {
            const a = this.data, a01 = a[1], a02 = a[2], a12 = a[5];
            a[1] = a[3];
            a[2] = a[6];
            a[3] = a01;
            a[5] = a[7];
            a[6] = a02;
            a[7] = a12;
            return this;
        }
    }
    T3D.Mat3 = Mat3;
    /**
     * 4x4 matrix math
     */
    class Mat4 {
        constructor(data) {
            this.data = data || [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        clone() {
            return new Mat4(this.data);
        }
        multiply(b) {
            const a = this.data, a00 = a[0 * 4 + 0], a01 = a[0 * 4 + 1], a02 = a[0 * 4 + 2], a03 = a[0 * 4 + 3], a10 = a[1 * 4 + 0], a11 = a[1 * 4 + 1], a12 = a[1 * 4 + 2], a13 = a[1 * 4 + 3], a20 = a[2 * 4 + 0], a21 = a[2 * 4 + 1], a22 = a[2 * 4 + 2], a23 = a[2 * 4 + 3], a30 = a[3 * 4 + 0], a31 = a[3 * 4 + 1], a32 = a[3 * 4 + 2], a33 = a[3 * 4 + 3], b00 = b[0 * 4 + 0], b01 = b[0 * 4 + 1], b02 = b[0 * 4 + 2], b03 = b[0 * 4 + 3], b10 = b[1 * 4 + 0], b11 = b[1 * 4 + 1], b12 = b[1 * 4 + 2], b13 = b[1 * 4 + 3], b20 = b[2 * 4 + 0], b21 = b[2 * 4 + 1], b22 = b[2 * 4 + 2], b23 = b[2 * 4 + 3], b30 = b[3 * 4 + 0], b31 = b[3 * 4 + 1], b32 = b[3 * 4 + 2], b33 = b[3 * 4 + 3];
            this.data = [
                a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
                a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
                a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
                a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
                a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
                a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
                a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
                a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
                a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
                a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
                a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
                a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
                a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
                a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
                a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
                a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
            ];
            return this;
        }
        scale(vec) {
            return this.multiply([
                vec.x, 0, 0, 0,
                0, vec.y, 0, 0,
                0, 0, vec.z, 0,
                0, 0, 0, 1,
            ]);
        }
        translate(vec) {
            return this.multiply([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                vec.x, vec.y, vec.z, 1
            ]);
        }
        rotateX(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1
            ]);
        }
        rotateY(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1
            ]);
        }
        rotateZ(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        }
        rotate(vec) {
            return this
                .rotateX(vec.x)
                .rotateY(vec.y)
                .rotateZ(vec.z);
        }
        perspective(fov, aspect, near, far) {
            const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
            const rangeInv = 1.0 / (near - far);
            return this.multiply([
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ]);
        }
        invert() {
            const mat = this.data, a00 = mat[0], a01 = mat[1], a02 = mat[2], a10 = mat[4], a11 = mat[5], a12 = mat[6], a20 = mat[8], a21 = mat[9], a22 = mat[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, d = a00 * b01 + a01 * b11 + a02 * b21;
            if (!d) {
                return null;
            }
            const id = 1 / d;
            return new Mat3([
                b01 * id,
                (-a22 * a01 + a02 * a21) * id,
                (a12 * a01 - a02 * a11) * id,
                b11 * id,
                (a22 * a00 - a02 * a20) * id,
                (-a12 * a00 + a02 * a10) * id,
                b21 * id,
                (-a21 * a00 + a01 * a20) * id,
                (a11 * a00 - a01 * a10) * id
            ]);
        }
    }
    T3D.Mat4 = Mat4;
    class Collider {
        constructor(transform, scale) {
            this.transform = transform;
            this.scale = scale ? scale : transform.scale;
        }
        getTranslate() {
            let translate = this.transform.translate.clone(), parent = this.transform.parent;
            while (parent) {
                translate.scale(parent.scale).add(parent.translate);
                parent = parent.parent;
            }
            return translate;
        }
        getScale() {
            let scale = this.scale.clone().scale(.5), parent = this.transform.parent;
            while (parent) {
                scale.scale(parent.scale);
                parent = parent.parent;
            }
            return scale;
        }
    }
    T3D.Collider = Collider;
    class Sphere extends Collider {
        intersect(other) {
            let collide = null, translate = this.getTranslate(), otherTranslate = other.getTranslate(), distance = translate.distance(otherTranslate), minDistance = this.getScale().max() + other.getScale().max();
            if (distance < minDistance) {
                collide = otherTranslate.sub(translate).normalize().scale(minDistance - distance);
            }
            return collide;
        }
    }
    T3D.Sphere = Sphere;
    class Box extends Collider {
        intersect(other) {
            let pos = this.getTranslate(), scale = this.getScale(), otherPos = other.getTranslate(), otherScale = other.getScale().max(), closest = new Vec3(Math.max(pos.x - scale.x, Math.min(otherPos.x, pos.x + scale.x)), Math.max(pos.y - scale.y, Math.min(otherPos.y, pos.y + scale.y)), Math.max(pos.z - scale.z, Math.min(otherPos.z, pos.z + scale.z))), distance = closest.distance(otherPos), collide = null;
            if (distance < otherScale) {
                collide = otherPos.sub(closest).normalize().scale(otherScale - distance);
            }
            return collide;
        }
    }
    T3D.Box = Box;
    /**
     * Transform class
     */
    class Transform {
        constructor(data = []) {
            this.translate = new Vec3(data[0] || 0, data[1] || 0, data[2] || 0);
            this.rotate = new Vec3(data[3] || 0, data[4] || 0, data[5] || 0);
            this.scale = new Vec3(data[6] || 1, data[7] || 1, data[8] || 1);
        }
        matrix(matrix) {
            matrix = matrix || new Mat4();
            matrix.scale(this.scale)
                .rotate(this.rotate.clone().scale(T3D.RAD_SCALE))
                .translate(this.translate);
            return this.parent
                ? this.parent.matrix(matrix)
                : matrix;
        }
    }
    T3D.Transform = Transform;
    /**
     * 3D Camera settings
     */
    class Camera {
        constructor(aspect = 1, fov = 45, near = .1, far = 100) {
            this.rotate = new Vec3();
            this.position = new Vec3();
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
        }
        transform(transform) {
            return transform.matrix()
                .rotate(this.rotate.clone().invert())
                .translate(this.position.clone().invert());
        }
        perspective() {
            return new Mat4().perspective(this.fov, this.aspect, this.near, this.far);
        }
    }
    T3D.Camera = Camera;
    /**
     * Vertice class
     */
    class Vert extends Vec3 {
        constructor() {
            super(...arguments);
            this.faces = [];
        }
        addFace(face) {
            this.faces.push(face);
            return this;
        }
    }
    /**
     * Triangle face
     */
    class Face {
        constructor(v1, v2, v3) {
            this.verts = [];
            this.normals = [];
            v1.addFace(this);
            v2.addFace(this);
            v3.addFace(this);
            this.verts.push(v1, v2, v3);
            this.normal = v2.clone().sub(v1).cross(v3.clone().sub(v1)).normalize();
        }
        calcNormals(angleCos) {
            this.verts.forEach((vert, i) => {
                let normal;
                vert.faces.forEach(face => {
                    if (this.normal.dot(face.normal) > angleCos) {
                        normal = normal ? normal.add(face.normal) : face.normal.clone();
                    }
                });
                this.normals.push(normal ? normal.normalize() : this.normal);
            });
            return this;
        }
        pushVerts(data) {
            this.verts.forEach((vec) => {
                data.push(...vec.toArray());
            });
            return this;
        }
        pushNormals(data) {
            this.normals.forEach((vec) => {
                data.push(...vec.toArray());
            });
            return this;
        }
    }
    /**
     * Generated mesh
     */
    class Mesh {
        constructor(gl, divide, path = [], smooth = 0, angle = 360) {
            if (divide < 2) {
                return;
            }
            if (path.length < 2) {
                path = this.sphere(path.length > 0 ? path[0] + 2 : Math.ceil(divide / 2) + 1);
            }
            const verts = this.createVerts(divide, path, 0, angle);
            const faces = this.createFaces(verts, divide, path.length / 2);
            const cos = Math.cos(smooth * T3D.RAD_SCALE);
            const vertData = [];
            const normalData = [];
            faces.forEach((face) => {
                face.calcNormals(cos)
                    .pushVerts(vertData)
                    .pushNormals(normalData);
            });
            this.verts = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verts);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
            this.normals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
            this.length = vertData.length / 3;
        }
        sphere(divide) {
            const path = [];
            if (divide < 3) {
                return;
            }
            let angle = Math.PI / (divide - 1);
            for (let i = 1; i < divide - 1; i++) {
                let a = angle * i;
                path.push(Math.sin(a) / 2);
                path.push(Math.cos(a) / 2);
            }
            return path;
        }
        createVerts(divide, path, start, end) {
            start *= T3D.RAD_SCALE;
            end *= T3D.RAD_SCALE;
            let verts = [];
            let angle = (end - start) / divide;
            verts.push(new Vert(0, .5, 0));
            verts.push(new Vert(0, -.5, 0));
            for (let i = 0; i < divide; i++) {
                let a = angle * i + start;
                let x = Math.cos(a);
                let z = Math.sin(a);
                for (let j = 0; j < path.length; j += 2) {
                    let vert = new Vert(x, 0, z);
                    vert.scale(path[j]).y = path[j + 1];
                    verts.push(vert);
                }
            }
            return verts;
        }
        createFaces(verts, divide, length) {
            const faces = [];
            let index;
            for (let i = 1; i < divide; ++i) {
                index = i * length + 2;
                faces.push(new Face(verts[0], verts[index], verts[index - length]));
                faces.push(new Face(verts[1], verts[index - 1], verts[index + length - 1]));
                for (let j = 0; j < length - 1; j++) {
                    let add = index + j;
                    faces.push(new Face(verts[add + 1], verts[add - length], verts[add]));
                    faces.push(new Face(verts[add - length + 1], verts[add - length], verts[add + 1]));
                }
            }
            faces.push(new Face(verts[0], verts[2], verts[index]));
            faces.push(new Face(verts[1], verts[index + length - 1], verts[length + 1]));
            for (let j = 0; j < length - 1; j++) {
                let add = index + j;
                faces.push(new Face(verts[j + 3], verts[add], verts[j + 2]));
                faces.push(new Face(verts[add + 1], verts[add], verts[j + 3]));
            }
            return faces;
        }
    }
    T3D.Mesh = Mesh;
    /**
     * Simple game item
     */
    class Item {
        constructor(mesh, color, transform) {
            this.childs = [];
            this.active = true;
            this.stroke = 0;
            this.mesh = mesh;
            this.color = color;
            this.transform = new Transform(transform);
        }
        add(child) {
            this.childs.push(child);
            child.transform.parent = this.transform;
            return this;
        }
    }
    T3D.Item = Item;
    /**
     * Shader utility
     */
    class Shader {
        constructor(gl, vertexShader, fragmentShader) {
            this.attribs = {};
            this.location = {};
            this.gl = gl;
            this.program = gl.createProgram();
            this.indices = gl.createBuffer();
            const program = this.program;
            gl.attachShader(program, this.create(gl.VERTEX_SHADER, vertexShader));
            gl.attachShader(program, this.create(gl.FRAGMENT_SHADER, fragmentShader));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }
        }
        create(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        attrib(name, values, size) {
            const gl = this.gl;
            if (!this.location[name]) {
                this.location[name] = gl.getAttribLocation(this.program, name);
            }
            const location = this.location[name];
            gl.bindBuffer(gl.ARRAY_BUFFER, values);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
            return this;
        }
        uniform(name, value) {
            const gl = this.gl;
            if (!this.location[name]) {
                this.location[name] = gl.getUniformLocation(this.program, name);
            }
            const location = this.location[name];
            if (typeof value == 'number') {
                gl.uniform1f(location, value);
                return this;
            }
            switch (value.length) {
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
                case 9:
                    gl.uniformMatrix3fv(location, false, value);
                    break;
                case 16:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
            }
            return this;
        }
    }
    T3D.Shader = Shader;
})(T3D || (T3D = {}));
var SFX;
(function (SFX) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const bitrate = 44100;
    const keys = { c: 0, db: 1, d: 2, eb: 3, e: 4, f: 5, gb: 6, g: 7, ab: 8, a: 9, bb: 10, b: 11 };
    const freq = [];
    const out = new AudioContext();
    const ctx = new OfflineAudioContext(1, bitrate * 2, bitrate);
    const gains = {};
    const buffers = {};
    let noise;
    let output;
    class Sound {
        constructor(type, curve, length) {
            this.type = type;
            this.curve = Float32Array.from(curve);
            this.length = length;
        }
        time(max) {
            return (max < this.length ? max : this.length) - .01;
        }
        async render(id, freq, time) {
            let ctx = new OfflineAudioContext(1, bitrate * time, bitrate), vol = ctx.createGain(), curve = Float32Array.from(freq);
            vol.connect(ctx.destination);
            if (this.curve) {
                vol.gain.setValueCurveAtTime(this.curve, 0, this.time(time));
            }
            ctx.addEventListener('complete', (e) => {
                buffers[id] = e.renderedBuffer;
            });
            if (this.type == 'custom') {
                let src = ctx.createBufferSource(), filter = ctx.createBiquadFilter();
                filter.connect(vol);
                filter.detune.setValueCurveAtTime(curve, 0, time);
                src.buffer = noise;
                src.loop = true;
                src.connect(filter);
                src.start();
            }
            else {
                let osc = ctx.createOscillator();
                osc.type = this.type;
                osc.frequency.setValueCurveAtTime(curve, 0, time);
                osc.connect(vol);
                osc.start();
                osc.stop(time);
            }
            await ctx.startRendering();
        }
    }
    SFX.Sound = Sound;
    class Channel {
        constructor(inst, notes, tempo) {
            this.inst = inst;
            this.data = [];
            this.size = 0;
            this.length = 0;
            let sheet = notes.split('|');
            if (sheet.length > 1) {
                notes = '';
                for (let i = 0; i < sheet.length; i++) {
                    notes += i % 2
                        ? (',' + sheet[i - 1]).repeat(parseInt(sheet[i]) - 1)
                        : (notes ? ',' : '') + sheet[i];
                }
            }
            notes.split(',').forEach((code) => {
                let div = code.match(/^(\d+)/), freqs = code.match(/([a-z]+\d+)/g);
                if (div) {
                    let time = tempo / parseInt(div[1]), row = [time];
                    this.length += time;
                    if (freqs) {
                        if (freqs.length > this.size) {
                            this.size = freqs.length;
                        }
                        for (let i = 0; i < freqs.length; i++) {
                            let note = freqs[i].match(/([a-z]+)(\d+)/);
                            if (note) {
                                row.push(freq[parseInt(note[2]) * 12 + keys[note[1]]]);
                            }
                        }
                    }
                    this.data.push(row);
                }
            });
        }
        play(ctx) {
            let length = 0, inst = this.inst, vol = ctx.createGain(), osc = [];
            vol.connect(ctx.destination);
            for (let i = 0; i < this.size; i++) {
                osc[i] = ctx.createOscillator();
                osc[i].type = inst.type;
                osc[i].connect(vol);
            }
            this.data.forEach(note => {
                if (inst.curve) {
                    vol.gain.setValueCurveAtTime(inst.curve, length, inst.time(note[0]));
                }
                osc.forEach((o, i) => {
                    o.frequency.setValueAtTime(note[i + 1] || 0, length);
                });
                length += note[0];
            });
            osc.forEach(o => {
                o.start();
                o.stop(length);
            });
        }
    }
    SFX.Channel = Channel;
    async function init() {
        if (out.state === 'suspended') {
            await out.resume();
        }
        let a = Math.pow(2, 1 / 12);
        for (let n = -57; n < 50; n++) {
            freq.push(Math.pow(a, n) * 440);
        }
        noise = out.createBuffer(1, bitrate * 2, bitrate);
        output = noise.getChannelData(0);
        for (let i = 0; i < bitrate * 2; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }
    SFX.init = init;
    async function render(id, channels) {
        let length = 0;
        channels.forEach(channel => {
            if (channel.length > length) {
                length = channel.length;
            }
        });
        const ctx = new OfflineAudioContext(1, bitrate * length, bitrate);
        ctx.addEventListener('complete', (e) => {
            buffers[id] = e.renderedBuffer;
        });
        channels.forEach((channel, i) => {
            channel.play(ctx);
        });
        await ctx.startRendering();
    }
    SFX.render = render;
    function mixer(id) {
        if (!(id in gains)) {
            gains[id] = out.createGain();
            gains[id].connect(out.destination);
        }
        return gains[id];
    }
    SFX.mixer = mixer;
    function play(id, loop = false, mixerId = 'master') {
        if (id in buffers) {
            let src = out.createBufferSource();
            if (loop) {
                src.loop = true;
            }
            src.buffer = buffers[id];
            src.connect(mixer(mixerId));
            src.start();
            return src;
        }
        return null;
    }
    SFX.play = play;
})(SFX || (SFX = {}));
var Game;
(function (Game) {
    class Enemy extends T3D.Item {
        init(active) {
            this.active = active;
            this.stroke = 0;
            this.explode = 0;
            this.transform.rotate.set(0, 0, 0);
            this.transform.translate.set(0, 1, 0);
        }
        update(speed, end) {
            if (!this.active) {
                return;
            }
            this.stroke += (this.explode - this.stroke) / 25;
            if (this.stroke) {
                return;
            }
            let pos = this.transform.translate, rotate = this.transform.rotate;
            pos.z = end ? 0 : pos.z + speed / 2;
            rotate.z = (rotate.z + 5) % 360;
            rotate.x = (rotate.x + 3) % 360;
        }
        intersect(hero) {
            if (this.active && !this.explode && !hero.explode && this.collider.intersect(hero.collider)) {
                if (hero.speedTime) {
                    this.explode = 7;
                    Game.Event.trigger('hit', hero);
                    return;
                }
                hero.explode = 7;
                Game.Event.trigger('exp', hero);
            }
        }
    }
    Game.Enemy = Enemy;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Event {
        static on(event, listener) {
            const events = event.match(/[a-zA-Z]+/g);
            if (!events) {
                return;
            }
            events.forEach(event => {
                if (!(event in Event.listener)) {
                    Event.listener[event] = [];
                }
                Event.listener[event].push(listener);
            });
        }
        static trigger(event, params) {
            Event.listener['all'].forEach(listener => {
                listener(event, params);
            });
            if (event in Event.listener) {
                Event.listener[event].forEach(listener => {
                    listener(event, params);
                });
            }
        }
    }
    Event.listener = { all: [] };
    Game.Event = Event;
})(Game || (Game = {}));
/// <reference path="../t3d.ts"/>
var Game;
(function (Game) {
    class Hero extends T3D.Item {
        init(reset = true) {
            const transform = this.transform;
            transform.translate.set(0, 0, 0);
            transform.rotate.set(0, 0, 90);
            transform.scale.set(1, 1, 1);
            this.color = Game.COLOR.WHITE;
            this.active = true;
            this.transform = transform;
            this.collider = new T3D.Sphere(transform);
            this.tokenCollider = new T3D.Sphere(transform);
            this.x = 0;
            this.rad = .4;
            this.acc = -.015;
            this.speed = new T3D.Vec3(0, 0, .1);
            this.speedTime = 0;
            this.scale = .8;
            this.scaleTime = 0;
            this.magnet = new T3D.Vec3(5, 5, 5);
            this.magnetTime = 0;
            this.explode = 0;
            this.stroke = 0;
            if (reset) {
                this.distance = 0;
            }
        }
        left() {
            if (this.x >= 0) {
                this.x--;
                Game.Event.trigger('move', this);
            }
        }
        right() {
            if (this.x <= 0) {
                this.x++;
                Game.Event.trigger('move', this);
            }
        }
        jump() {
            if (this.collide) {
                this.acc = .03;
                Game.Event.trigger('jump', this);
            }
        }
        boost() {
            this.speedTime = 75;
            Game.Event.trigger('move', this);
        }
        magnetize() {
            this.magnetTime = 450;
            Game.Event.trigger('power', this);
        }
        dash() {
            this.scaleTime = 40;
            Game.Event.trigger('move', this);
        }
        coin() {
            Game.Event.trigger('coin', this);
        }
        cancel() {
            this.x = Math.round(this.transform.translate.x);
        }
        update() {
            let pos = this.transform.translate, scale = this.scale, rotate = this.transform.rotate, speed = (this.speedTime ? .13 : .08) + Math.min(this.distance / 15000, .04);
            this.speed.z += ((this.active ? speed : 0) - this.speed.z) / 20;
            this.speedTime -= this.speedTime > 0 ? 1 : 0;
            this.color = this.magnetTime > 100 || this.magnetTime % 20 > 10 ? Game.COLOR.PINK : Game.COLOR.WHITE;
            this.scale += ((this.scaleTime ? .5 : .7) - this.scale) / 5;
            this.scaleTime -= this.scaleTime > 0 ? 1 : 0;
            this.magnetTime -= this.magnetTime > 0 ? 1 : 0;
            this.tokenCollider.scale = this.magnetTime ? this.magnet : this.transform.scale;
            this.stroke += (this.explode - this.stroke) / 25;
            this.active = pos.y > -10 && this.stroke < 6;
            if (!this.active || this.stroke) {
                return;
            }
            this.acc -= this.acc > -.012 ? .003 : 0;
            rotate.z = 90 + (pos.x - this.x) * 25;
            rotate.y = (rotate.y + this.speed.z * 100) % 360;
            this.speed.y += this.acc;
            if (this.speed.y < -.25) {
                this.speed.y = -.25;
            }
            pos.x += (this.x - pos.x) / 7;
            pos.y += this.speed.y;
            pos.z -= pos.z / 30;
            this.transform.scale.set(scale, scale, scale);
        }
        preview() {
            let rotate = this.transform.rotate;
            rotate.y = (rotate.y + 1) % 360;
            rotate.z = (rotate.z + .7) % 360;
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Map {
        constructor(config, lenght = 7, steps = 150) {
            this.config = config.split('|');
            this.length = lenght;
            this.steps = steps;
        }
        init() {
            this.row = [1, 1, 1];
            this.count = 10;
            this.data = [];
            this.step = 0;
            this.min = 0;
            this.update();
        }
        max() {
            let max = this.min + this.length, length = this.config.length;
            return max < length ? max : length - 1;
        }
        update() {
            let next = false;
            if (++this.step > this.steps) {
                next = true;
                this.step = 0;
                if (this.min + this.length < this.config.length - 1) {
                    this.min++;
                }
            }
            if (--this.count > 0) {
                return next;
            }
            if (!this.data.length) {
                this.mirror = Game.Rand.get() > .5;
                let index = Game.Rand.get(this.max(), this.min, true);
                this.data = this.config[index].match(/.{1,4}/g);
            }
            this.row = this.data.shift().split('').map(c => parseInt(c, 36));
            this.count = this.row.shift();
            if (this.mirror) {
                this.row.reverse();
            }
            return next;
        }
    }
    Game.Map = Map;
})(Game || (Game = {}));
var Game;
(function (Game) {
    const STORE = 'offliner_hi';
    class Menu {
        constructor() {
            let data = JSON.parse(window.localStorage.getItem(STORE));
            this.body = Game.$('body');
            this.btn = Game.$('#play');
            this.info = document.getElementsByTagName('H3');
            ;
            this.shop = true;
            this.active = true;
            this.storage = data && typeof data === 'object' && 'shop' in data ? data : {
                score: 0,
                token: 0,
                level: 0,
                shop: [0]
            };
            this.selected = 0;
            this.heroes = [
                { name: 'SPUTNIK', price: 0 },
                { name: 'VOYAGER', price: 500 },
                { name: 'PIONEER', price: 1000 },
                { name: 'CASSINI', price: 2500 }
            ];
            this.tasklist = document.getElementsByTagName('H4');
            this.scores = document.getElementsByTagName('TD');
            this.stats = {};
            this.sfxBtn = Game.$('#sfx');
            this.volume = .3;
            this.hero();
            this.bind();
            this.init();
        }
        level() {
            return this.storage.level + 1;
        }
        init() {
            let level = this.level(), tasks = [], target = Math.ceil(level / 3);
            switch (level % 3) {
                case 1:
                    tasks.push(new Game.Task('coin', target * 75));
                    break;
                case 2:
                    tasks.push(new Game.Task('power', target, target % 2 == 0));
                    break;
                default:
                    tasks.push(new Game.Task('coin', target * 50, true));
                    break;
            }
            target = Math.ceil(level / 4);
            switch (level % 4) {
                case 1:
                    tasks.push(target < 8
                        ? new Game.Task('planet', target)
                        : new Game.Task('hit', target, true));
                    break;
                case 2:
                    tasks.push(target % 2 == 1
                        ? new Game.Task('fence', 5 * target)
                        : new Game.Task('fence', 3 * target, true));
                    break;
                case 3:
                    tasks.push(target % 2 == 1
                        ? new Game.Task('enemy', 3 * target)
                        : new Game.Task('enemy', 2 * target, true));
                    break;
                default:
                    tasks.push(new Game.Task('hit', target));
                    break;
            }
            this.tasks = tasks;
        }
        bind() {
            Game.on(Game.$('#ok'), 'click', () => {
                Game.Event.trigger('end');
            });
            Game.on(this.btn, 'click', () => {
                this.play();
            });
            Game.on(Game.$('#prev'), 'click', () => {
                this.prev();
            });
            Game.on(Game.$('#next'), 'click', () => {
                this.next();
            });
            Game.on(Game.$('#fs'), 'click', () => {
                if (!document.webkitFullscreenElement) {
                    document.documentElement.webkitRequestFullscreen();
                }
                else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            });
            Game.on(this.sfxBtn, 'click', () => {
                let btn = this.sfxBtn, music = SFX.mixer('music'), sound = SFX.mixer('master'), time = sound.context.currentTime;
                try {
                    switch (btn.className) {
                        case 'no':
                            this.volume = .3;
                            music.gain.setValueAtTime(this.volume, time);
                            sound.gain.setValueAtTime(1, time);
                            btn.className = '';
                            break;
                        case 'sfx':
                            sound.gain.setValueAtTime(0, time);
                            btn.className = 'no';
                            break;
                        default:
                            this.volume = 0;
                            music.gain.setValueAtTime(this.volume, time);
                            btn.className = 'sfx';
                    }
                }
                catch (ex) { }
            });
            Game.Event.on('all', (event) => {
                if (event in this.stats) {
                    this.stats[event] += 1;
                }
                else {
                    this.stats[event] = 1;
                }
                this.tasks.forEach(task => {
                    task.on(event);
                });
            });
        }
        input(key) {
            if (!this.active) {
                return;
            }
            switch (key) {
                case 32:
                    if (this.shop) {
                        this.play();
                    }
                    else {
                        Game.Event.trigger('end');
                    }
                    break;
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }
        play() {
            if (this.btn.textContent == 'PLAY') {
                this.stats = {};
                Game.Event.trigger('start');
            }
            else if (this.btn.className == '') {
                this.storage.token -= this.heroes[this.selected].price;
                this.storage.shop.push(this.selected);
                this.store();
                this.hero();
            }
        }
        hero() {
            let token = this.storage.token, data = this.heroes[this.selected], buy = this.storage.shop.indexOf(this.selected) < 0, can = token >= data.price;
            this.info.item(0).textContent = data.name;
            this.info.item(1).textContent = buy ? `₮ ${data.price} / ${token}` : '';
            this.btn.textContent = buy ? 'BUY' : 'PLAY';
            this.btn.className = !buy || can ? '' : 'disabled';
        }
        prev() {
            if (--this.selected < 0) {
                this.selected = this.heroes.length - 1;
            }
            this.hero();
        }
        next() {
            if (++this.selected >= this.heroes.length) {
                this.selected = 0;
            }
            this.hero();
        }
        store() {
            window.localStorage.setItem(STORE, JSON.stringify(this.storage));
        }
        mission(result = false) {
            let complete = true;
            this.tasks.forEach((task, i) => {
                if (!result) {
                    task.init();
                }
                let item = this.tasklist.item(i + 1);
                item.textContent = task.toString();
                item.className = task.done ? 'done' : '';
                complete = complete && task.done;
            });
            if (complete) {
                this.storage.level++;
                this.store();
                this.init();
            }
            return complete;
        }
        score(hero) {
            let high = this.storage.score || 0, element = this.tasklist.item(0), scores = this.scores, hit = this.stats.hit || 0, places = (this.stats.planet || 0) + 1, power = this.stats.power || 0, tokens = this.stats.coin || 0, total = Math.round(hero.distance), mission = this.mission(true) ? 1 : 0;
            scores.item(0).textContent = total + '';
            scores.item(1).textContent = '₮ ' + tokens + ' x 10';
            scores.item(2).textContent = power + ' x 25';
            scores.item(3).textContent = hit + ' x 50';
            scores.item(4).textContent = places + ' x 100';
            scores.item(5).textContent = mission + ' x 500';
            total += (mission * 500) + (places * 100) + (hit * 50) + (power * 25) + (tokens * 10);
            scores.item(6).textContent = total + '';
            if (high < total) {
                element.textContent = 'NEW HIGH SCORE';
                this.storage.score = total;
            }
            else {
                element.textContent = 'SCORE';
            }
            this.storage.token += tokens;
            this.store();
            this.active = true;
            this.body.className = 'end';
        }
        show() {
            this.shop = true;
            this.body.className = '';
        }
        hide() {
            this.shop = false;
            this.active = false;
            this.mission();
            this.tasklist.item(0).textContent = 'MISSION ' + this.level();
            this.scores.item(4).textContent =
                this.scores.item(5).textContent = '';
            this.body.className = 'play';
        }
    }
    Game.Menu = Menu;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Platform extends T3D.Item {
        update(speed) {
            let pos = this.transform.translate;
            pos.z += speed;
            let end = pos.z > 2;
            if (end) {
                pos.z -= 11;
            }
            let scale = 1;
            if (pos.z < -8) {
                scale = pos.z + 9;
            }
            else if (pos.z > 1) {
                scale = 2 - pos.z;
            }
            this.transform.scale.set(scale, scale, scale);
            this.token.update();
            this.enemy.update(speed, end);
            return end;
        }
        intersect(hero, side = false) {
            if (!hero.active || hero.stroke) {
                return;
            }
            let fence = this.fence, collide;
            this.token.intersect(hero);
            if (fence.active) {
                collide = fence.collider.intersect(hero.collider);
                if (collide) {
                    if (side && collide.x)
                        hero.cancel();
                    hero.transform.translate.add(collide);
                    hero.speed.y += collide.y;
                }
            }
            if (!this.block.active) {
                return;
            }
            collide = this.block.collider.intersect(hero.collider);
            if (collide) {
                if (side && collide.x)
                    hero.cancel();
                hero.transform.translate.add(collide);
                hero.speed.y += collide.y;
            }
            return collide;
        }
    }
    Game.Platform = Platform;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Scene extends T3D.Item {
        constructor(hero, factory, map) {
            super();
            this.map = map;
            this.hero = hero;
            this.add(this.hero);
            this.planets = document.getElementsByTagName('LI');
            this.platforms = [];
            for (let i = 0; i < 33; i++) {
                let platform = factory();
                this.platforms.push(platform);
                this.add(platform);
            }
            this.init();
        }
        init() {
            this.row = 9;
            this.hero.init();
            this.map.init();
            let i = 0;
            for (let z = -9; z < 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = this.platforms[i++];
                    platform.transform.translate.set(x, -1, z);
                    platform.enemy.active =
                        platform.fence.active =
                            platform.token.active = false;
                    platform.block.active = true;
                }
            }
            this.planet = this.planets.length - 1;
            for (i = 0; i < this.planets.length; i++) {
                this.planets.item(i).className = '';
            }
        }
        next() {
            if (this.planet > 0) {
                this.planets.item(this.planet--).className = 'hide';
                Game.Event.trigger('planet', this.planet);
            }
        }
        ended() {
            return Math.abs(this.hero.speed.z) < .01;
        }
        input(key) {
            const hero = this.hero;
            switch (key) {
                case 37:
                    hero.left();
                    break;
                case 39:
                    hero.right();
                    break;
                case 38:
                    hero.jump();
                    break;
                case 40:
                    hero.dash();
                    break;
                case 32:
                    hero.boost();
            }
        }
        updateRow(speed) {
            this.row -= speed;
            if (this.row <= -.5) {
                this.row += 11;
            }
            this.index = Math.round(this.row) * 3 + Math.round(this.hero.transform.translate.x) + 1;
        }
        getIndex(add = 0) {
            let length = this.platforms.length, index = this.index + add;
            if (index < 0) {
                return index + length;
            }
            if (index >= length) {
                return index - length;
            }
            return index;
        }
        update() {
            this.hero.update();
            let rotate = false, hero = this.hero, speed = hero.speed.z, fence = 0, enemy = 0;
            this.platforms.forEach((platform, i) => {
                if (platform.update(speed)) {
                    fence += platform.fence.active && hero.transform.translate.y > -1 ? 1 : 0;
                    enemy += platform.enemy.active && !platform.enemy.stroke && !hero.stroke ? 1 : 0;
                    let cfg = this.map.row[i % 3], obj = cfg >> 2;
                    platform.block.active = (cfg & 1) > 0;
                    platform.transform.translate.y = (cfg & 2) > 0 ? 0 : -1;
                    platform.token.init(obj == 1 || obj == 4);
                    platform.fence.active = obj == 2;
                    platform.enemy.init(obj == 3);
                    platform.token.transform.rotate.y = 45;
                    rotate = true;
                }
                platform.enemy.intersect(hero);
            });
            if (rotate && this.map.update()) {
                this.next();
            }
            this.updateRow(speed);
            hero.collide = this.platforms[this.getIndex()].intersect(hero);
            [-3, 3, -1, 1, -2, 2, -4, 4].forEach(add => {
                let index = this.getIndex(add), platform = this.platforms[index];
                platform.intersect(hero, add == 1 || add == -1);
            });
            hero.distance += speed;
            if (fence > 0) {
                Game.Event.trigger('fence', fence);
            }
            if (enemy > 0) {
                Game.Event.trigger('enemy', enemy);
            }
        }
    }
    Game.Scene = Scene;
})(Game || (Game = {}));
var Game;
(function (Game) {
    const LABEL = {
        coin: 'Collect $ token',
        power: 'Collect $ big token',
        planet: 'Travel to $',
        fence: 'Dodge junks $ time',
        enemy: 'Dodge asteroids $ time',
        hit: 'Destroy $ asteroid',
    };
    const PLANETS = ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Space'];
    class Task {
        constructor(event, target, run = false) {
            this.event = event;
            this.target = target;
            this.count = 0;
            this.run = run || event == 'planet';
            this.done = false;
        }
        init() {
            if (!this.done && this.run) {
                this.count = 0;
            }
        }
        on(event) {
            if (!this.done && this.event == event) {
                this.done = this.target <= ++this.count;
            }
        }
        toString() {
            let event = this.event, text = LABEL[event], param = this.target.toString();
            if (event == 'planet') {
                param = PLANETS[this.target - 1];
            }
            else {
                if (this.target > 1) {
                    text += 's';
                }
                if (this.run) {
                    text += ' on a mission';
                }
                if (!this.done && this.count) {
                    param += ' / ' + this.count;
                }
            }
            return text.replace('$', param);
        }
    }
    Game.Task = Task;
})(Game || (Game = {}));
var Game;
(function (Game) {
    const yellow = [1, 1, .3, 30];
    const purple = [1, .3, 1, 30];
    class Token extends T3D.Item {
        constructor() {
            super(...arguments);
            this.big = false;
        }
        init(active) {
            this.active = active;
            this.transform.translate.set(0, 1, 0);
            this.big = !Game.Rand.get(50, 0, true);
            this.speed = .01;
        }
        score() {
            return this.big ? 5 : 1;
        }
        update() {
            let rotate = this.transform.rotate, scale = this.transform.scale;
            rotate.y = (rotate.y + 1.5) % 360;
            if (this.big) {
                scale.set(.7, .15, .7);
                this.color = purple;
            }
            else {
                scale.set(.5, .1, .5);
                this.color = yellow;
            }
        }
        intersect(hero) {
            let collider = this.big ? hero.collider : hero.tokenCollider;
            if (this.active && this.collider.intersect(collider)) {
                let pos = this.collider.getTranslate();
                if (pos.distance(hero.transform.translate) < .5) {
                    this.active = false;
                    if (this.big) {
                        hero.magnetize();
                    }
                    else {
                        hero.coin();
                    }
                    return;
                }
                this.speed += this.speed;
                this.transform.translate.add(hero.transform.translate.clone().sub(pos).scale(this.speed));
            }
        }
    }
    Game.Token = Token;
})(Game || (Game = {}));
var Game;
(function (Game) {
    function $(query, element) {
        return (element || document).querySelector(query);
    }
    Game.$ = $;
    function on(element, event, callback, capture = false) {
        element.addEventListener(event, callback, capture);
    }
    Game.on = on;
    class Rand {
        static get(max = 1, min = 0, round = true) {
            if (max <= min) {
                return max;
            }
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            let value = min + (Rand.seed / 233280) * (max - min);
            return round ? Math.round(value) : value;
        }
    }
    Rand.seed = Math.random();
    Game.Rand = Rand;
    Game.COLOR = {
        WHITE: [1, 1, 1, 10],
        PINK: [1, .3, 1, 30],
        BLUE: [.3, .3, 1, 30],
        YELLOW: [1, 1, .3, 30],
        RED: [1, .3, .3, 0],
        CYAN: [.3, 1, 1, 30]
    };
    let running = false, canvas = $('#game'), menu = new Game.Menu(), music, time = new Date().getTime(), gl = canvas.getContext('webgl'), light = new T3D.Vec3(5, 15, 7), camera = new T3D.Camera(canvas.width / canvas.height), shader = new T3D.Shader(gl, 'precision mediump float;' +
        'attribute vec3 aPos, aNorm;' +
        'uniform mat4 uWorld, uProj;' +
        'uniform mat3 uInverse;' +
        'uniform float uStroke;' +
        'varying vec4 vPos;' +
        'varying vec3 vNorm;' +
        'void main(void) {' +
        'vec3 pos = aPos + (aNorm * uStroke);' +
        'vPos = uWorld * vec4(pos, 1.0);' +
        'vNorm = uInverse * aNorm;' +
        'gl_Position = uProj * vPos;' +
        '}', 'precision mediump float;' +
        'uniform mat4 uWorld;' +
        'uniform vec4 uColor;' +
        'uniform vec3 uLight;' +
        'uniform float uLevels;' +
        'varying vec4 vPos;' +
        'varying vec3 vNorm;' +
        'vec3 uAmbient = vec3(.2, .2, .2);' +
        'vec3 uDiffuse = vec3(.8, .8, .8);' +
        'vec3 uSpecular = vec3(.8, .8, .8);' +
        'void main(void) {' +
        'vec3 lightDir = normalize(uLight - vPos.xyz);' +
        'vec3 normal = normalize(vNorm);' +
        'vec3 eyeDir = normalize(-vPos.xyz);' +
        'vec3 reflectionDir = reflect(-lightDir, normal);' +
        'float specularWeight = 0.0;' +
        'if (uColor.w > 0.0) { specularWeight = pow(max(dot(reflectionDir, eyeDir), 0.0), uColor.w); }' +
        'float diffuseWeight = max(dot(normal, lightDir), 0.0);' +
        'vec3 weight = uAmbient + uSpecular * specularWeight  + uDiffuse * diffuseWeight;' +
        'vec3 color = uColor.xyz * weight;' +
        'if (uLevels > 1.0) { color = floor(color * uLevels) * (1.0 / uLevels); }' +
        'gl_FragColor = vec4(color, 1);' +
        '}'), mesh = {
        hero: [
            new T3D.Mesh(gl, 10),
            new T3D.Mesh(gl, 10, [.5, .15, .5, .1, .5, -.1, .5, -.15]),
            new T3D.Mesh(gl, 10, [.2, .5, .48, .2, .5, .1, .2, .1, .2, -.1, .5, -.1, .48, -.2, .2, -.5]),
            new T3D.Mesh(gl, 10, [.3, .44, .43, .3, .45, .2, .49, .2, .5, .1, .45, .1, .45, -.1, .5, -.1, .49, -.2, .45, -.2, .43, -.3, .3, -.44]),
        ],
        block: new T3D.Mesh(gl, 4, [.55, .5, .65, .4, .65, -.4, .55, -.5]),
        fence: new T3D.Mesh(gl, 12, [.4, .5, .5, .4, .5, -.4, .4, -.5], 40),
        token: new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
        enemy: new T3D.Mesh(gl, 6),
    }, hero = new Game.Hero(mesh.hero[0], Game.COLOR.WHITE), scene = new Game.Scene(hero, () => {
        let platform = new Game.Platform(), block = new T3D.Item(mesh.block, Game.COLOR.BLUE, [, , , , 45]), enemy = new Game.Enemy(mesh.enemy, Game.COLOR.CYAN, [, 1, , , , , .7, .7, .7]), token = new Game.Token(mesh.token, Game.COLOR.YELLOW, [, 1, , 90, , , .5, .1, .5]), fence = new T3D.Item(mesh.fence, Game.COLOR.RED, [, 1.4, , , , , .8, 1, .8]);
        block.collider = new T3D.Box(block.transform);
        enemy.collider = new T3D.Sphere(enemy.transform);
        token.collider = new T3D.Sphere(token.transform);
        fence.collider = new T3D.Box(fence.transform);
        platform.block = block;
        platform.token = token;
        platform.fence = fence;
        platform.enemy = enemy;
        return platform.add(block).add(token).add(fence).add(enemy);
    }, new Game.Map('311737173711|4111|5711|3111|' +
        '211135012111|2111|301531513510|' +
        '311119973111|5111111d|311120003115|' +
        '551111dd|305130053051|3111139b3511|' +
        '211130002115|401510004510'));
    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.width / canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function bind() {
        let x = 0, y = 0, min = 15, keys = [], drag = false;
        on(document, 'touchstart', (e) => {
            let touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            drag = true;
        });
        on(document, 'touchmove', (e) => {
            e.preventDefault();
            if (!drag || menu.active) {
                return;
            }
            let touch = e.touches[0];
            if (!keys[39] && touch.clientX - x > min) {
                keys[39] = true;
                scene.input(39);
                drag = false;
            }
            else if (!keys[37] && touch.clientX - x < -min) {
                keys[37] = true;
                scene.input(37);
                drag = false;
            }
            else if (!keys[40] && touch.clientY - y > min) {
                keys[40] = true;
                scene.input(40);
                drag = false;
            }
            else if (!keys[38] && touch.clientY - y < -min) {
                keys[38] = true;
                scene.input(38);
                drag = false;
            }
        }, { passive: false });
        on(document, 'touchend', (e) => {
            if (drag && !menu.active) {
                keys[32] = true;
                scene.input(32);
            }
            keys[32] =
                keys[37] =
                    keys[38] =
                        keys[39] =
                            keys[40] =
                                drag = false;
        });
        on(document, 'keydown', (e) => {
            if (keys[e.keyCode]) {
                return;
            }
            keys[e.keyCode] = true;
            if (!running) {
                if (keys[32]) {
                    load();
                }
            }
            else if (menu.active) {
                menu.input(e.keyCode);
                return;
            }
            else {
                scene.input(e.keyCode);
            }
        });
        on(document, 'keyup', (e) => {
            keys[e.keyCode] = false;
        });
        on(window, 'resize', resize);
        on($('#start'), 'click', () => {
            if (!running) {
                load();
            }
        });
        Game.Event.on('all', (event) => {
            SFX.play(event);
        });
        Game.Event.on('start', () => {
            menu.hide();
            scene.init();
            if (!music) {
                let mixer = SFX.mixer('music'), time = mixer.context.currentTime;
                mixer.gain.setValueAtTime(menu.volume, time);
                music = SFX.play('music', true, 'music');
            }
        });
        Game.Event.on('end', () => {
            hero.init(false);
            menu.show();
        });
    }
    function render(item, stroke = 0) {
        item.childs.forEach(child => {
            render(child, stroke);
        });
        if (!item.active || !item.mesh) {
            return;
        }
        let invert = item.transform.matrix().invert();
        if (!invert) {
            return;
        }
        gl.cullFace(stroke > 0 ? gl.FRONT : gl.BACK);
        gl.useProgram(shader.program);
        shader.attrib("aPos", item.mesh.verts, 3)
            .attrib("aNorm", item.mesh.normals, 3)
            .uniform("uWorld", camera.transform(item.transform).data)
            .uniform("uProj", camera.perspective().data)
            .uniform("uInverse", invert.transpose().data)
            .uniform("uColor", stroke ? [0, 0, 0, 1] : item.color)
            .uniform("uLight", light.clone().sub(camera.position).toArray())
            .uniform("uStroke", stroke + item.stroke)
            .uniform("uLevels", stroke ? 0 : 5);
        gl.drawArrays(gl.TRIANGLES, 0, item.mesh.length);
    }
    function update() {
        requestAnimationFrame(update);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (menu.shop) {
            hero.mesh = mesh.hero[menu.selected];
            hero.preview();
            render(hero);
            render(hero, .02);
            return;
        }
        let now = new Date().getTime();
        if (now - time > 30) {
            scene.update();
        }
        time = now;
        scene.update();
        render(scene);
        render(scene, .02);
        if (!hero.active && music) {
            let mixer = SFX.mixer('music'), time = mixer.context.currentTime;
            mixer.gain.setValueCurveAtTime(Float32Array.from([menu.volume, 0]), time, .5);
            music.stop(time + .5);
            music = null;
        }
        if (!menu.active && scene.ended()) {
            menu.score(hero);
        }
    }
    async function load() {
        running = true;
        let btn = $('#start');
        btn.className = 'disabled';
        btn.textContent = 'loading';
        await SFX.init();
        await Promise.all([
            new SFX.Sound('custom', [5, 1, 0], 1).render('exp', [220, 0], 1),
            new SFX.Sound('custom', [3, 1, 0], 1).render('hit', [1760, 0], .3),
            new SFX.Sound('square', [.5, .1, 0], 1).render('power', [440, 880, 440, 880, 440, 880, 440, 880], .3),
            new SFX.Sound('triangle', [.5, .1, 0], 1).render('jump', [220, 880], .3),
            new SFX.Sound('square', [.2, .1, 0], .2).render('coin', [1760, 1760], .2),
            new SFX.Sound('custom', [.1, .5, 0], .3).render('move', [1760, 440], .3),
            SFX.render('music', [
                new SFX.Channel(new SFX.Sound('sawtooth', [1, .3], .2), '8a2,8a2,8b2,8c3|8|8g2,8g2,8a2,8b2|8|8e2,8e2,8f2,8g2|4|8g2,8g2,8a2,8b2|4|'.repeat(4), 1),
                new SFX.Channel(new SFX.Sound('sawtooth', [.5, .5], 1), '1a3,1g3,2e3,4b3,4c4,1a3c3e3,1g3b3d4,2e3g3b3,4d3g3b3,4g3c4e4|1|' + '8a3,8a3e4,8a3d4,8a3e4|2|8g3,8g3d4,8g3c4,8g3d4|2|8e3,8e3a3,8e3b3,8e3a3,4g3b3,4g3c4|1|'.repeat(2), 4)
            ])
        ]);
        $('#load').className = 'hide';
        update();
    }
    on(window, 'load', async () => {
        hero.init();
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        camera.rotate.x = -.7;
        camera.position.set(0, 0, 1.2);
        hero.transform.rotate.set(10, 22, 30);
        render(hero);
        render(hero, .02);
        $("link[rel=apple-touch-icon]").href =
            $("link[rel=icon]").href = canvas.toDataURL();
        camera.position.set(0, .5, 5);
        resize();
        bind();
    });
    $('ontouchstart' in window ? '#keys' : '#touch').className = 'hide';
})(Game || (Game = {}));

//# sourceMappingURL=script.js.map
