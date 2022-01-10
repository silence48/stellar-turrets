"use strict";
var t = require("bignumber.js"),
    e = require("lodash"),
    a = require("util"),
    i = require("stellar-sdk");

function n(t) {
    return t && "object" == typeof t && "default" in t ? t : {
        default: t
    }
}
var s = n(t);
const r = new a.TextDecoder("utf-8");
const o = new a.TextEncoder;
class l {
    constructor(t = 8192, e = {}) {
        let a = !1;
        "number" == typeof t ? t = new ArrayBuffer(t) : (a = !0, this.lastWrittenByte = t.byteLength);
        const i = e.offset ? e.offset >>> 0 : 0,
            n = t.byteLength - i;
        let s = i;
        (ArrayBuffer.isView(t) || t instanceof l) && (t.byteLength !== t.buffer.byteLength && (s = t.byteOffset + i), t = t.buffer), this.lastWrittenByte = a ? n : 0, this.buffer = t, this.length = n, this.byteLength = n, this.byteOffset = s, this.offset = 0, this.littleEndian = !0, this._data = new DataView(this.buffer, s, n), this._mark = 0, this._marks = []
    }
    available(t = 1) {
        return this.offset + t <= this.length
    }
    isLittleEndian() {
        return this.littleEndian
    }
    setLittleEndian() {
        return this.littleEndian = !0, this
    }
    isBigEndian() {
        return !this.littleEndian
    }
    setBigEndian() {
        return this.littleEndian = !1, this
    }
    skip(t = 1) {
        return this.offset += t, this
    }
    seek(t) {
        return this.offset = t, this
    }
    mark() {
        return this._mark = this.offset, this
    }
    reset() {
        return this.offset = this._mark, this
    }
    pushMark() {
        return this._marks.push(this.offset), this
    }
    popMark() {
        const t = this._marks.pop();
        if (void 0 === t) throw new Error("Mark stack empty");
        return this.seek(t), this
    }
    rewind() {
        return this.offset = 0, this
    }
    ensureAvailable(t = 1) {
        if (!this.available(t)) {
            const e = 2 * (this.offset + t),
                a = new Uint8Array(e);
            a.set(new Uint8Array(this.buffer)), this.buffer = a.buffer, this.length = this.byteLength = e, this._data = new DataView(this.buffer)
        }
        return this
    }
    readBoolean() {
        return 0 !== this.readUint8()
    }
    readInt8() {
        return this._data.getInt8(this.offset++)
    }
    readUint8() {
        return this._data.getUint8(this.offset++)
    }
    readByte() {
        return this.readUint8()
    }
    readBytes(t = 1) {
        const e = new Uint8Array(t);
        for (let a = 0; a < t; a++) e[a] = this.readByte();
        return e
    }
    readInt16() {
        const t = this._data.getInt16(this.offset, this.littleEndian);
        return this.offset += 2, t
    }
    readUint16() {
        const t = this._data.getUint16(this.offset, this.littleEndian);
        return this.offset += 2, t
    }
    readInt32() {
        const t = this._data.getInt32(this.offset, this.littleEndian);
        return this.offset += 4, t
    }
    readUint32() {
        const t = this._data.getUint32(this.offset, this.littleEndian);
        return this.offset += 4, t
    }
    readFloat32() {
        const t = this._data.getFloat32(this.offset, this.littleEndian);
        return this.offset += 4, t
    }
    readFloat64() {
        const t = this._data.getFloat64(this.offset, this.littleEndian);
        return this.offset += 8, t
    }
    readChar() {
        return String.fromCharCode(this.readInt8())
    }
    readChars(t = 1) {
        let e = "";
        for (let a = 0; a < t; a++) e += this.readChar();
        return e
    }
    readUtf8(t = 1) {
        return e = this.readBytes(t), r.decode(e);
        var e
    }
    writeBoolean(t) {
        return this.writeUint8(t ? 255 : 0), this
    }
    writeInt8(t) {
        return this.ensureAvailable(1), this._data.setInt8(this.offset++, t), this._updateLastWrittenByte(), this
    }
    writeUint8(t) {
        return this.ensureAvailable(1), this._data.setUint8(this.offset++, t), this._updateLastWrittenByte(), this
    }
    writeByte(t) {
        return this.writeUint8(t)
    }
    writeBytes(t) {
        this.ensureAvailable(t.length);
        for (let e = 0; e < t.length; e++) this._data.setUint8(this.offset++, t[e]);
        return this._updateLastWrittenByte(), this
    }
    writeInt16(t) {
        return this.ensureAvailable(2), this._data.setInt16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this
    }
    writeUint16(t) {
        return this.ensureAvailable(2), this._data.setUint16(this.offset, t, this.littleEndian), this.offset += 2, this._updateLastWrittenByte(), this
    }
    writeInt32(t) {
        return this.ensureAvailable(4), this._data.setInt32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this
    }
    writeUint32(t) {
        return this.ensureAvailable(4), this._data.setUint32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this
    }
    writeFloat32(t) {
        return this.ensureAvailable(4), this._data.setFloat32(this.offset, t, this.littleEndian), this.offset += 4, this._updateLastWrittenByte(), this
    }
    writeFloat64(t) {
        return this.ensureAvailable(8), this._data.setFloat64(this.offset, t, this.littleEndian), this.offset += 8, this._updateLastWrittenByte(), this
    }
    writeChar(t) {
        return this.writeUint8(t.charCodeAt(0))
    }
    writeChars(t) {
        for (let e = 0; e < t.length; e++) this.writeUint8(t.charCodeAt(e));
        return this
    }
    writeUtf8(t) {
        return this.writeBytes(function (t) {
            return o.encode(t)
        }(t))
    }
    toArray() {
        return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte)
    }
    _updateLastWrittenByte() {
        this.offset > this.lastWrittenByte && (this.lastWrittenByte = this.offset)
    }
}
/*! pako 2.0.4 https://github.com/nodeca/pako @license (MIT AND Zlib) */
function h(t) {
    let e = t.length;
    for (;
        --e >= 0;
    ) t[e] = 0
}
const d = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]),
    _ = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
    f = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]),
    c = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
    u = new Array(576);
h(u);
const w = new Array(60);
h(w);
const p = new Array(512);
h(p);
const g = new Array(256);
h(g);
const b = new Array(29);
h(b);
const m = new Array(30);

function y(t, e, a, i, n) {
    this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = i, this.max_length = n, this.has_stree = t && t.length
}
let k, v, A;

function E(t, e) {
    this.dyn_tree = t, this.max_code = 0, this.stat_desc = e
}
h(m);
const O = t => t < 256 ? p[t] : p[256 + (t >>> 7)],
    x = (t, e) => {
        t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255
    },
    T = (t, e, a) => {
        t.bi_valid > 16 - a ? (t.bi_buf |= e << t.bi_valid & 65535, x(t, t.bi_buf), t.bi_buf = e >> 16 - t.bi_valid, t.bi_valid += a - 16) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a)
    },
    z = (t, e, a) => {
        T(t, a[2 * e], a[2 * e + 1])
    },
    R = (t, e) => {
        let a = 0;
        do {
            a |= 1 & t, t >>>= 1, a <<= 1
        } while (--e > 0);
        return a >>> 1
    },
    U = (t, e, a) => {
        const i = new Array(16);
        let n, s, r = 0;
        for (n = 1; n <= 15; n++) i[n] = r = r + a[n - 1] << 1;
        for (s = 0; s <= e; s++) {
            let e = t[2 * s + 1];
            0 !== e && (t[2 * s] = R(i[e]++, e))
        }
    },
    N = t => {
        let e;
        for (e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
        for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
        for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
        t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0
    },
    S = t => {
        t.bi_valid > 8 ? x(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0
    },
    L = (t, e, a, i) => {
        const n = 2 * e,
            s = 2 * a;
        return t[n] < t[s] || t[n] === t[s] && i[e] <= i[a]
    },
    D = (t, e, a) => {
        const i = t.heap[a];
        let n = a << 1;
        for (; n <= t.heap_len && (n < t.heap_len && L(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !L(e, i, t.heap[n], t.depth));) t.heap[a] = t.heap[n], a = n, n <<= 1;
        t.heap[a] = i
    },
    B = (t, e, a) => {
        let i, n, s, r, o = 0;
        if (0 !== t.last_lit)
            do {
                i = t.pending_buf[t.d_buf + 2 * o] << 8 | t.pending_buf[t.d_buf + 2 * o + 1], n = t.pending_buf[t.l_buf + o], o++, 0 === i ? z(t, n, e) : (s = g[n], z(t, s + 256 + 1, e), r = d[s], 0 !== r && (n -= b[s], T(t, n, r)), i--, s = O(i), z(t, s, a), r = _[s], 0 !== r && (i -= m[s], T(t, i, r)))
            } while (o < t.last_lit);
        z(t, 256, e)
    },
    F = (t, e) => {
        const a = e.dyn_tree,
            i = e.stat_desc.static_tree,
            n = e.stat_desc.has_stree,
            s = e.stat_desc.elems;
        let r, o, l, h = -1;
        for (t.heap_len = 0, t.heap_max = 573, r = 0; r < s; r++) 0 !== a[2 * r] ? (t.heap[++t.heap_len] = h = r, t.depth[r] = 0) : a[2 * r + 1] = 0;
        for (; t.heap_len < 2;) l = t.heap[++t.heap_len] = h < 2 ? ++h : 0, a[2 * l] = 1, t.depth[l] = 0, t.opt_len--, n && (t.static_len -= i[2 * l + 1]);
        for (e.max_code = h, r = t.heap_len >> 1; r >= 1; r--) D(t, a, r);
        l = s;
        do {
            r = t.heap[1], t.heap[1] = t.heap[t.heap_len--], D(t, a, 1), o = t.heap[1], t.heap[--t.heap_max] = r, t.heap[--t.heap_max] = o, a[2 * l] = a[2 * r] + a[2 * o], t.depth[l] = (t.depth[r] >= t.depth[o] ? t.depth[r] : t.depth[o]) + 1, a[2 * r + 1] = a[2 * o + 1] = l, t.heap[1] = l++, D(t, a, 1)
        } while (t.heap_len >= 2);
        t.heap[--t.heap_max] = t.heap[1], ((t, e) => {
            const a = e.dyn_tree,
                i = e.max_code,
                n = e.stat_desc.static_tree,
                s = e.stat_desc.has_stree,
                r = e.stat_desc.extra_bits,
                o = e.stat_desc.extra_base,
                l = e.stat_desc.max_length;
            let h, d, _, f, c, u, w = 0;
            for (f = 0; f <= 15; f++) t.bl_count[f] = 0;
            for (a[2 * t.heap[t.heap_max] + 1] = 0, h = t.heap_max + 1; h < 573; h++) d = t.heap[h], f = a[2 * a[2 * d + 1] + 1] + 1, f > l && (f = l, w++), a[2 * d + 1] = f, d > i || (t.bl_count[f]++, c = 0, d >= o && (c = r[d - o]), u = a[2 * d], t.opt_len += u * (f + c), s && (t.static_len += u * (n[2 * d + 1] + c)));
            if (0 !== w) {
                do {
                    for (f = l - 1; 0 === t.bl_count[f];) f--;
                    t.bl_count[f]--, t.bl_count[f + 1] += 2, t.bl_count[l]--, w -= 2
                } while (w > 0);
                for (f = l; 0 !== f; f--)
                    for (d = t.bl_count[f]; 0 !== d;) _ = t.heap[--h], _ > i || (a[2 * _ + 1] !== f && (t.opt_len += (f - a[2 * _ + 1]) * a[2 * _], a[2 * _ + 1] = f), d--)
            }
        })(t, e), U(a, h, t.bl_count)
    },
    I = (t, e, a) => {
        let i, n, s = -1,
            r = e[1],
            o = 0,
            l = 7,
            h = 4;
        for (0 === r && (l = 138, h = 3), e[2 * (a + 1) + 1] = 65535, i = 0; i <= a; i++) n = r, r = e[2 * (i + 1) + 1], ++o < l && n === r || (o < h ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== s && t.bl_tree[2 * n]++, t.bl_tree[32]++) : o <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, o = 0, s = n, 0 === r ? (l = 138, h = 3) : n === r ? (l = 6, h = 3) : (l = 7, h = 4))
    },
    Z = (t, e, a) => {
        let i, n, s = -1,
            r = e[1],
            o = 0,
            l = 7,
            h = 4;
        for (0 === r && (l = 138, h = 3), i = 0; i <= a; i++)
            if (n = r, r = e[2 * (i + 1) + 1], !(++o < l && n === r)) {
                if (o < h)
                    do {
                        z(t, n, t.bl_tree)
                    } while (0 != --o);
                else 0 !== n ? (n !== s && (z(t, n, t.bl_tree), o--), z(t, 16, t.bl_tree), T(t, o - 3, 2)) : o <= 10 ? (z(t, 17, t.bl_tree), T(t, o - 3, 3)) : (z(t, 18, t.bl_tree), T(t, o - 11, 7));
                o = 0, s = n, 0 === r ? (l = 138, h = 3) : n === r ? (l = 6, h = 3) : (l = 7, h = 4)
            }
    };
let C = !1;
const K = (t, e, a, i) => {
    T(t, 0 + (i ? 1 : 0), 3), ((t, e, a, i) => {
        S(t), i && (x(t, a), x(t, ~a)), t.pending_buf.set(t.window.subarray(e, e + a), t.pending), t.pending += a
    })(t, e, a, !0)
};
var M = (t, e, a, i) => {
        let n, s, r = 0;
        t.level > 0 ? (2 === t.strm.data_type && (t.strm.data_type = (t => {
            let e, a = 4093624447;
            for (e = 0; e <= 31; e++, a >>>= 1)
                if (1 & a && 0 !== t.dyn_ltree[2 * e]) return 0;
            if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
            for (e = 32; e < 256; e++)
                if (0 !== t.dyn_ltree[2 * e]) return 1;
            return 0
        })(t)), F(t, t.l_desc), F(t, t.d_desc), r = (t => {
            let e;
            for (I(t, t.dyn_ltree, t.l_desc.max_code), I(t, t.dyn_dtree, t.d_desc.max_code), F(t, t.bl_desc), e = 18; e >= 3 && 0 === t.bl_tree[2 * c[e] + 1]; e--);
            return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e
        })(t), n = t.opt_len + 3 + 7 >>> 3, s = t.static_len + 3 + 7 >>> 3, s <= n && (n = s)) : n = s = a + 5, a + 4 <= n && -1 !== e ? K(t, e, a, i) : 4 === t.strategy || s === n ? (T(t, 2 + (i ? 1 : 0), 3), B(t, u, w)) : (T(t, 4 + (i ? 1 : 0), 3), ((t, e, a, i) => {
            let n;
            for (T(t, e - 257, 5), T(t, a - 1, 5), T(t, i - 4, 4), n = 0; n < i; n++) T(t, t.bl_tree[2 * c[n] + 1], 3);
            Z(t, t.dyn_ltree, e - 1), Z(t, t.dyn_dtree, a - 1)
        })(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, r + 1), B(t, t.dyn_ltree, t.dyn_dtree)), N(t), i && S(t)
    },
    P = {
        _tr_init: t => {
            C || ((() => {
                let t, e, a, i, n;
                const s = new Array(16);
                for (a = 0, i = 0; i < 28; i++)
                    for (b[i] = a, t = 0; t < 1 << d[i]; t++) g[a++] = i;
                for (g[a - 1] = i, n = 0, i = 0; i < 16; i++)
                    for (m[i] = n, t = 0; t < 1 << _[i]; t++) p[n++] = i;
                for (n >>= 7; i < 30; i++)
                    for (m[i] = n << 7, t = 0; t < 1 << _[i] - 7; t++) p[256 + n++] = i;
                for (e = 0; e <= 15; e++) s[e] = 0;
                for (t = 0; t <= 143;) u[2 * t + 1] = 8, t++, s[8]++;
                for (; t <= 255;) u[2 * t + 1] = 9, t++, s[9]++;
                for (; t <= 279;) u[2 * t + 1] = 7, t++, s[7]++;
                for (; t <= 287;) u[2 * t + 1] = 8, t++, s[8]++;
                for (U(u, 287, s), t = 0; t < 30; t++) w[2 * t + 1] = 5, w[2 * t] = R(t, 5);
                k = new y(u, d, 257, 286, 15), v = new y(w, _, 0, 30, 15), A = new y(new Array(0), f, 0, 19, 7)
            })(), C = !0), t.l_desc = new E(t.dyn_ltree, k), t.d_desc = new E(t.dyn_dtree, v), t.bl_desc = new E(t.bl_tree, A), t.bi_buf = 0, t.bi_valid = 0, N(t)
        },
        _tr_stored_block: K,
        _tr_flush_block: M,
        _tr_tally: (t, e, a) => (t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++, e--, t.dyn_ltree[2 * (g[a] + 256 + 1)]++, t.dyn_dtree[2 * O(e)]++), t.last_lit === t.lit_bufsize - 1),
        _tr_align: t => {
            T(t, 2, 3), z(t, 256, u), (t => {
                16 === t.bi_valid ? (x(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
            })(t)
        }
    };
var W = (t, e, a, i) => {
    let n = 65535 & t | 0,
        s = t >>> 16 & 65535 | 0,
        r = 0;
    for (; 0 !== a;) {
        r = a > 2e3 ? 2e3 : a, a -= r;
        do {
            n = n + e[i++] | 0, s = s + n | 0
        } while (--r);
        n %= 65521, s %= 65521
    }
    return n | s << 16 | 0
};
const H = new Uint32Array((() => {
    let t, e = [];
    for (var a = 0; a < 256; a++) {
        t = a;
        for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
        e[a] = t
    }
    return e
})());
var Y = (t, e, a, i) => {
        const n = H,
            s = i + a;
        t ^= -1;
        for (let a = i; a < s; a++) t = t >>> 8 ^ n[255 & (t ^ e[a])];
        return -1 ^ t
    },
    j = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
    },
    G = {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_MEM_ERROR: -4,
        Z_BUF_ERROR: -5,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        Z_BINARY: 0,
        Z_TEXT: 1,
        Z_UNKNOWN: 2,
        Z_DEFLATED: 8
    };
const {
    _tr_init: X,
    _tr_stored_block: V,
    _tr_flush_block: $,
    _tr_tally: J,
    _tr_align: q
} = P, {
    Z_NO_FLUSH: Q,
    Z_PARTIAL_FLUSH: tt,
    Z_FULL_FLUSH: et,
    Z_FINISH: at,
    Z_BLOCK: it,
    Z_OK: nt,
    Z_STREAM_END: st,
    Z_STREAM_ERROR: rt,
    Z_DATA_ERROR: ot,
    Z_BUF_ERROR: lt,
    Z_DEFAULT_COMPRESSION: ht,
    Z_FILTERED: dt,
    Z_HUFFMAN_ONLY: _t,
    Z_RLE: ft,
    Z_FIXED: ct,
    Z_DEFAULT_STRATEGY: ut,
    Z_UNKNOWN: wt,
    Z_DEFLATED: pt
} = G, gt = (t, e) => (t.msg = j[e], e), bt = t => (t << 1) - (t > 4 ? 9 : 0), mt = t => {
    let e = t.length;
    for (;
        --e >= 0;
    ) t[e] = 0
};
let yt = (t, e, a) => (e << t.hash_shift ^ a) & t.hash_mask;
const kt = t => {
        const e = t.state;
        let a = e.pending;
        a > t.avail_out && (a = t.avail_out), 0 !== a && (t.output.set(e.pending_buf.subarray(e.pending_out, e.pending_out + a), t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0))
    },
    vt = (t, e) => {
        $(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, kt(t.strm)
    },
    At = (t, e) => {
        t.pending_buf[t.pending++] = e
    },
    Et = (t, e) => {
        t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e
    },
    Ot = (t, e, a, i) => {
        let n = t.avail_in;
        return n > i && (n = i), 0 === n ? 0 : (t.avail_in -= n, e.set(t.input.subarray(t.next_in, t.next_in + n), a), 1 === t.state.wrap ? t.adler = W(t.adler, e, n, a) : 2 === t.state.wrap && (t.adler = Y(t.adler, e, n, a)), t.next_in += n, t.total_in += n, n)
    },
    xt = (t, e) => {
        let a, i, n = t.max_chain_length,
            s = t.strstart,
            r = t.prev_length,
            o = t.nice_match;
        const l = t.strstart > t.w_size - 262 ? t.strstart - (t.w_size - 262) : 0,
            h = t.window,
            d = t.w_mask,
            _ = t.prev,
            f = t.strstart + 258;
        let c = h[s + r - 1],
            u = h[s + r];
        t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead);
        do {
            if (a = e, h[a + r] === u && h[a + r - 1] === c && h[a] === h[s] && h[++a] === h[s + 1]) {
                s += 2, a++;
                do {} while (h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && h[++s] === h[++a] && s < f);
                if (i = 258 - (f - s), s = f - 258, i > r) {
                    if (t.match_start = e, r = i, i >= o) break;
                    c = h[s + r - 1], u = h[s + r]
                }
            }
        } while ((e = _[e & d]) > l && 0 != --n);
        return r <= t.lookahead ? r : t.lookahead
    },
    Tt = t => {
        const e = t.w_size;
        let a, i, n, s, r;
        do {
            if (s = t.window_size - t.lookahead - t.strstart, t.strstart >= e + (e - 262)) {
                t.window.set(t.window.subarray(e, e + e), 0), t.match_start -= e, t.strstart -= e, t.block_start -= e, i = t.hash_size, a = i;
                do {
                    n = t.head[--a], t.head[a] = n >= e ? n - e : 0
                } while (--i);
                i = e, a = i;
                do {
                    n = t.prev[--a], t.prev[a] = n >= e ? n - e : 0
                } while (--i);
                s += e
            }
            if (0 === t.strm.avail_in) break;
            if (i = Ot(t.strm, t.window, t.strstart + t.lookahead, s), t.lookahead += i, t.lookahead + t.insert >= 3)
                for (r = t.strstart - t.insert, t.ins_h = t.window[r], t.ins_h = yt(t, t.ins_h, t.window[r + 1]); t.insert && (t.ins_h = yt(t, t.ins_h, t.window[r + 3 - 1]), t.prev[r & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = r, r++, t.insert--, !(t.lookahead + t.insert < 3)););
        } while (t.lookahead < 262 && 0 !== t.strm.avail_in)
    },
    zt = (t, e) => {
        let a, i;
        for (;;) {
            if (t.lookahead < 262) {
                if (Tt(t), t.lookahead < 262 && e === Q) return 1;
                if (0 === t.lookahead) break
            }
            if (a = 0, t.lookahead >= 3 && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - 262 && (t.match_length = xt(t, a)), t.match_length >= 3)
                if (i = J(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
                    t.match_length--;
                    do {
                        t.strstart++, t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart
                    } while (0 != --t.match_length);
                    t.strstart++
                } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 1]);
            else i = J(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
            if (i && (vt(t, !1), 0 === t.strm.avail_out)) return 1
        }
        return t.insert = t.strstart < 2 ? t.strstart : 2, e === at ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
    },
    Rt = (t, e) => {
        let a, i, n;
        for (;;) {
            if (t.lookahead < 262) {
                if (Tt(t), t.lookahead < 262 && e === Q) return 1;
                if (0 === t.lookahead) break
            }
            if (a = 0, t.lookahead >= 3 && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - 262 && (t.match_length = xt(t, a), t.match_length <= 5 && (t.strategy === dt || 3 === t.match_length && t.strstart - t.match_start > 4096) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
                n = t.strstart + t.lookahead - 3, i = J(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
                do {
                    ++t.strstart <= n && (t.ins_h = yt(t, t.ins_h, t.window[t.strstart + 3 - 1]), a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart)
                } while (0 != --t.prev_length);
                if (t.match_available = 0, t.match_length = 2, t.strstart++, i && (vt(t, !1), 0 === t.strm.avail_out)) return 1
            } else if (t.match_available) {
                if (i = J(t, 0, t.window[t.strstart - 1]), i && vt(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1
            } else t.match_available = 1, t.strstart++, t.lookahead--
        }
        return t.match_available && (i = J(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, e === at ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
    };

function Ut(t, e, a, i, n) {
    this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = i, this.func = n
}
const Nt = [new Ut(0, 0, 0, 0, ((t, e) => {
    let a = 65535;
    for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5);;) {
        if (t.lookahead <= 1) {
            if (Tt(t), 0 === t.lookahead && e === Q) return 1;
            if (0 === t.lookahead) break
        }
        t.strstart += t.lookahead, t.lookahead = 0;
        const i = t.block_start + a;
        if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, vt(t, !1), 0 === t.strm.avail_out)) return 1;
        if (t.strstart - t.block_start >= t.w_size - 262 && (vt(t, !1), 0 === t.strm.avail_out)) return 1
    }
    return t.insert = 0, e === at ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (vt(t, !1), t.strm.avail_out), 1)
})), new Ut(4, 4, 8, 4, zt), new Ut(4, 5, 16, 8, zt), new Ut(4, 6, 32, 32, zt), new Ut(4, 4, 16, 16, Rt), new Ut(8, 16, 32, 32, Rt), new Ut(8, 16, 128, 128, Rt), new Ut(8, 32, 128, 256, Rt), new Ut(32, 128, 258, 1024, Rt), new Ut(32, 258, 258, 4096, Rt)];

function St() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = pt, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), mt(this.dyn_ltree), mt(this.dyn_dtree), mt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), mt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), mt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
}
const Lt = t => {
        if (!t || !t.state) return gt(t, rt);
        t.total_in = t.total_out = 0, t.data_type = wt;
        const e = t.state;
        return e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? 42 : 113, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = Q, X(e), nt
    },
    Dt = t => {
        const e = Lt(t);
        var a;
        return e === nt && ((a = t.state).window_size = 2 * a.w_size, mt(a.head), a.max_lazy_match = Nt[a.level].max_lazy, a.good_match = Nt[a.level].good_length, a.nice_match = Nt[a.level].nice_length, a.max_chain_length = Nt[a.level].max_chain, a.strstart = 0, a.block_start = 0, a.lookahead = 0, a.insert = 0, a.match_length = a.prev_length = 2, a.match_available = 0, a.ins_h = 0), e
    },
    Bt = (t, e, a, i, n, s) => {
        if (!t) return rt;
        let r = 1;
        if (e === ht && (e = 6), i < 0 ? (r = 0, i = -i) : i > 15 && (r = 2, i -= 16), n < 1 || n > 9 || a !== pt || i < 8 || i > 15 || e < 0 || e > 9 || s < 0 || s > ct) return gt(t, rt);
        8 === i && (i = 9);
        const o = new St;
        return t.state = o, o.strm = t, o.wrap = r, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3), o.window = new Uint8Array(2 * o.w_size), o.head = new Uint16Array(o.hash_size), o.prev = new Uint16Array(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new Uint8Array(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = s, o.method = a, Dt(t)
    };
var Ft = {
    deflateInit: (t, e) => Bt(t, e, pt, 15, 8, ut),
    deflateInit2: Bt,
    deflateReset: Dt,
    deflateResetKeep: Lt,
    deflateSetHeader: (t, e) => t && t.state ? 2 !== t.state.wrap ? rt : (t.state.gzhead = e, nt) : rt,
    deflate: (t, e) => {
        let a, i;
        if (!t || !t.state || e > it || e < 0) return t ? gt(t, rt) : rt;
        const n = t.state;
        if (!t.output || !t.input && 0 !== t.avail_in || 666 === n.status && e !== at) return gt(t, 0 === t.avail_out ? lt : rt);
        n.strm = t;
        const s = n.last_flush;
        if (n.last_flush = e, 42 === n.status)
            if (2 === n.wrap) t.adler = 0, At(n, 31), At(n, 139), At(n, 8), n.gzhead ? (At(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), At(n, 255 & n.gzhead.time), At(n, n.gzhead.time >> 8 & 255), At(n, n.gzhead.time >> 16 & 255), At(n, n.gzhead.time >> 24 & 255), At(n, 9 === n.level ? 2 : n.strategy >= _t || n.level < 2 ? 4 : 0), At(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (At(n, 255 & n.gzhead.extra.length), At(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (t.adler = Y(t.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (At(n, 0), At(n, 0), At(n, 0), At(n, 0), At(n, 0), At(n, 9 === n.level ? 2 : n.strategy >= _t || n.level < 2 ? 4 : 0), At(n, 3), n.status = 113);
            else {
                let e = pt + (n.w_bits - 8 << 4) << 8,
                    a = -1;
                a = n.strategy >= _t || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3, e |= a << 6, 0 !== n.strstart && (e |= 32), e += 31 - e % 31, n.status = 113, Et(n, e), 0 !== n.strstart && (Et(n, t.adler >>> 16), Et(n, 65535 & t.adler)), t.adler = 1
            } if (69 === n.status)
            if (n.gzhead.extra) {
                for (a = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), kt(t), a = n.pending, n.pending !== n.pending_buf_size));) At(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;
                n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73)
            } else n.status = 73;
        if (73 === n.status)
            if (n.gzhead.name) {
                a = n.pending;
                do {
                    if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), kt(t), a = n.pending, n.pending === n.pending_buf_size)) {
                        i = 1;
                        break
                    }
                    i = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, At(n, i)
                } while (0 !== i);
                n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), 0 === i && (n.gzindex = 0, n.status = 91)
            } else n.status = 91;
        if (91 === n.status)
            if (n.gzhead.comment) {
                a = n.pending;
                do {
                    if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), kt(t), a = n.pending, n.pending === n.pending_buf_size)) {
                        i = 1;
                        break
                    }
                    i = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, At(n, i)
                } while (0 !== i);
                n.gzhead.hcrc && n.pending > a && (t.adler = Y(t.adler, n.pending_buf, n.pending - a, a)), 0 === i && (n.status = 103)
            } else n.status = 103;
        if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && kt(t), n.pending + 2 <= n.pending_buf_size && (At(n, 255 & t.adler), At(n, t.adler >> 8 & 255), t.adler = 0, n.status = 113)) : n.status = 113), 0 !== n.pending) {
            if (kt(t), 0 === t.avail_out) return n.last_flush = -1, nt
        } else if (0 === t.avail_in && bt(e) <= bt(s) && e !== at) return gt(t, lt);
        if (666 === n.status && 0 !== t.avail_in) return gt(t, lt);
        if (0 !== t.avail_in || 0 !== n.lookahead || e !== Q && 666 !== n.status) {
            let a = n.strategy === _t ? ((t, e) => {
                let a;
                for (;;) {
                    if (0 === t.lookahead && (Tt(t), 0 === t.lookahead)) {
                        if (e === Q) return 1;
                        break
                    }
                    if (t.match_length = 0, a = J(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (vt(t, !1), 0 === t.strm.avail_out)) return 1
                }
                return t.insert = 0, e === at ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
            })(n, e) : n.strategy === ft ? ((t, e) => {
                let a, i, n, s;
                const r = t.window;
                for (;;) {
                    if (t.lookahead <= 258) {
                        if (Tt(t), t.lookahead <= 258 && e === Q) return 1;
                        if (0 === t.lookahead) break
                    }
                    if (t.match_length = 0, t.lookahead >= 3 && t.strstart > 0 && (n = t.strstart - 1, i = r[n], i === r[++n] && i === r[++n] && i === r[++n])) {
                        s = t.strstart + 258;
                        do {} while (i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && i === r[++n] && n < s);
                        t.match_length = 258 - (s - n), t.match_length > t.lookahead && (t.match_length = t.lookahead)
                    }
                    if (t.match_length >= 3 ? (a = J(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = J(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (vt(t, !1), 0 === t.strm.avail_out)) return 1
                }
                return t.insert = 0, e === at ? (vt(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (vt(t, !1), 0 === t.strm.avail_out) ? 1 : 2
            })(n, e) : Nt[n.level].func(n, e);
            if (3 !== a && 4 !== a || (n.status = 666), 1 === a || 3 === a) return 0 === t.avail_out && (n.last_flush = -1), nt;
            if (2 === a && (e === tt ? q(n) : e !== it && (V(n, 0, 0, !1), e === et && (mt(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), kt(t), 0 === t.avail_out)) return n.last_flush = -1, nt
        }
        return e !== at ? nt : n.wrap <= 0 ? st : (2 === n.wrap ? (At(n, 255 & t.adler), At(n, t.adler >> 8 & 255), At(n, t.adler >> 16 & 255), At(n, t.adler >> 24 & 255), At(n, 255 & t.total_in), At(n, t.total_in >> 8 & 255), At(n, t.total_in >> 16 & 255), At(n, t.total_in >> 24 & 255)) : (Et(n, t.adler >>> 16), Et(n, 65535 & t.adler)), kt(t), n.wrap > 0 && (n.wrap = -n.wrap), 0 !== n.pending ? nt : st)
    },
    deflateEnd: t => {
        if (!t || !t.state) return rt;
        const e = t.state.status;
        return 42 !== e && 69 !== e && 73 !== e && 91 !== e && 103 !== e && 113 !== e && 666 !== e ? gt(t, rt) : (t.state = null, 113 === e ? gt(t, ot) : nt)
    },
    deflateSetDictionary: (t, e) => {
        let a = e.length;
        if (!t || !t.state) return rt;
        const i = t.state,
            n = i.wrap;
        if (2 === n || 1 === n && 42 !== i.status || i.lookahead) return rt;
        if (1 === n && (t.adler = W(t.adler, e, a, 0)), i.wrap = 0, a >= i.w_size) {
            0 === n && (mt(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
            let t = new Uint8Array(i.w_size);
            t.set(e.subarray(a - i.w_size, a), 0), e = t, a = i.w_size
        }
        const s = t.avail_in,
            r = t.next_in,
            o = t.input;
        for (t.avail_in = a, t.next_in = 0, t.input = e, Tt(i); i.lookahead >= 3;) {
            let t = i.strstart,
                e = i.lookahead - 2;
            do {
                i.ins_h = yt(i, i.ins_h, i.window[t + 3 - 1]), i.prev[t & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = t, t++
            } while (--e);
            i.strstart = t, i.lookahead = 2, Tt(i)
        }
        return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = 2, i.match_available = 0, t.next_in = r, t.input = o, t.avail_in = s, i.wrap = n, nt
    },
    deflateInfo: "pako deflate (from Nodeca project)"
};
const It = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
var Zt = function (t) {
        const e = Array.prototype.slice.call(arguments, 1);
        for (; e.length;) {
            const a = e.shift();
            if (a) {
                if ("object" != typeof a) throw new TypeError(a + "must be non-object");
                for (const e in a) It(a, e) && (t[e] = a[e])
            }
        }
        return t
    },
    Ct = t => {
        let e = 0;
        for (let a = 0, i = t.length; a < i; a++) e += t[a].length;
        const a = new Uint8Array(e);
        for (let e = 0, i = 0, n = t.length; e < n; e++) {
            let n = t[e];
            a.set(n, i), i += n.length
        }
        return a
    };
let Kt = !0;
try {
    String.fromCharCode.apply(null, new Uint8Array(1))
} catch (t) {
    Kt = !1
}
const Mt = new Uint8Array(256);
for (let t = 0; t < 256; t++) Mt[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
Mt[254] = Mt[254] = 1;
var Pt = t => {
        if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return (new TextEncoder).encode(t);
        let e, a, i, n, s, r = t.length,
            o = 0;
        for (n = 0; n < r; n++) a = t.charCodeAt(n), 55296 == (64512 & a) && n + 1 < r && (i = t.charCodeAt(n + 1), 56320 == (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++)), o += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
        for (e = new Uint8Array(o), s = 0, n = 0; s < o; n++) a = t.charCodeAt(n), 55296 == (64512 & a) && n + 1 < r && (i = t.charCodeAt(n + 1), 56320 == (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), n++)), a < 128 ? e[s++] = a : a < 2048 ? (e[s++] = 192 | a >>> 6, e[s++] = 128 | 63 & a) : a < 65536 ? (e[s++] = 224 | a >>> 12, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a) : (e[s++] = 240 | a >>> 18, e[s++] = 128 | a >>> 12 & 63, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a);
        return e
    },
    Wt = (t, e) => {
        const a = e || t.length;
        if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return (new TextDecoder).decode(t.subarray(0, e));
        let i, n;
        const s = new Array(2 * a);
        for (n = 0, i = 0; i < a;) {
            let e = t[i++];
            if (e < 128) {
                s[n++] = e;
                continue
            }
            let r = Mt[e];
            if (r > 4) s[n++] = 65533, i += r - 1;
            else {
                for (e &= 2 === r ? 31 : 3 === r ? 15 : 7; r > 1 && i < a;) e = e << 6 | 63 & t[i++], r--;
                r > 1 ? s[n++] = 65533 : e < 65536 ? s[n++] = e : (e -= 65536, s[n++] = 55296 | e >> 10 & 1023, s[n++] = 56320 | 1023 & e)
            }
        }
        return ((t, e) => {
            if (e < 65534 && t.subarray && Kt) return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
            let a = "";
            for (let i = 0; i < e; i++) a += String.fromCharCode(t[i]);
            return a
        })(s, n)
    },
    Ht = (t, e) => {
        (e = e || t.length) > t.length && (e = t.length);
        let a = e - 1;
        for (; a >= 0 && 128 == (192 & t[a]);) a--;
        return a < 0 || 0 === a ? e : a + Mt[t[a]] > e ? a : e
    };
var Yt = function () {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
};
const jt = Object.prototype.toString,
    {
        Z_NO_FLUSH: Gt,
        Z_SYNC_FLUSH: Xt,
        Z_FULL_FLUSH: Vt,
        Z_FINISH: $t,
        Z_OK: Jt,
        Z_STREAM_END: qt,
        Z_DEFAULT_COMPRESSION: Qt,
        Z_DEFAULT_STRATEGY: te,
        Z_DEFLATED: ee
    } = G;

function ae(t) {
    this.options = Zt({
        level: Qt,
        method: ee,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: te
    }, t || {});
    let e = this.options;
    e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Yt, this.strm.avail_out = 0;
    let a = Ft.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
    if (a !== Jt) throw new Error(j[a]);
    if (e.header && Ft.deflateSetHeader(this.strm, e.header), e.dictionary) {
        let t;
        if (t = "string" == typeof e.dictionary ? Pt(e.dictionary) : "[object ArrayBuffer]" === jt.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, a = Ft.deflateSetDictionary(this.strm, t), a !== Jt) throw new Error(j[a]);
        this._dict_set = !0
    }
}

function ie(t, e) {
    const a = new ae(e);
    if (a.push(t, !0), a.err) throw a.msg || j[a.err];
    return a.result
}
ae.prototype.push = function (t, e) {
    const a = this.strm,
        i = this.options.chunkSize;
    let n, s;
    if (this.ended) return !1;
    for (s = e === ~~e ? e : !0 === e ? $t : Gt, "string" == typeof t ? a.input = Pt(t) : "[object ArrayBuffer]" === jt.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;;)
        if (0 === a.avail_out && (a.output = new Uint8Array(i), a.next_out = 0, a.avail_out = i), (s === Xt || s === Vt) && a.avail_out <= 6) this.onData(a.output.subarray(0, a.next_out)), a.avail_out = 0;
        else {
            if (n = Ft.deflate(a, s), n === qt) return a.next_out > 0 && this.onData(a.output.subarray(0, a.next_out)), n = Ft.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === Jt;
            if (0 !== a.avail_out) {
                if (s > 0 && a.next_out > 0) this.onData(a.output.subarray(0, a.next_out)), a.avail_out = 0;
                else if (0 === a.avail_in) break
            } else this.onData(a.output)
        } return !0
}, ae.prototype.onData = function (t) {
    this.chunks.push(t)
}, ae.prototype.onEnd = function (t) {
    t === Jt && (this.result = Ct(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
};
var ne = {
    Deflate: ae,
    deflate: ie,
    deflateRaw: function (t, e) {
        return (e = e || {}).raw = !0, ie(t, e)
    },
    gzip: function (t, e) {
        return (e = e || {}).gzip = !0, ie(t, e)
    },
    constants: G
};
var se = function (t, e) {
    let a, i, n, s, r, o, l, h, d, _, f, c, u, w, p, g, b, m, y, k, v, A, E, O;
    const x = t.state;
    a = t.next_in, E = t.input, i = a + (t.avail_in - 5), n = t.next_out, O = t.output, s = n - (e - t.avail_out), r = n + (t.avail_out - 257), o = x.dmax, l = x.wsize, h = x.whave, d = x.wnext, _ = x.window, f = x.hold, c = x.bits, u = x.lencode, w = x.distcode, p = (1 << x.lenbits) - 1, g = (1 << x.distbits) - 1;
    t: do {
        c < 15 && (f += E[a++] << c, c += 8, f += E[a++] << c, c += 8), b = u[f & p];
        e: for (;;) {
            if (m = b >>> 24, f >>>= m, c -= m, m = b >>> 16 & 255, 0 === m) O[n++] = 65535 & b;
            else {
                if (!(16 & m)) {
                    if (0 == (64 & m)) {
                        b = u[(65535 & b) + (f & (1 << m) - 1)];
                        continue e
                    }
                    if (32 & m) {
                        x.mode = 12;
                        break t
                    }
                    t.msg = "invalid literal/length code", x.mode = 30;
                    break t
                }
                y = 65535 & b, m &= 15, m && (c < m && (f += E[a++] << c, c += 8), y += f & (1 << m) - 1, f >>>= m, c -= m), c < 15 && (f += E[a++] << c, c += 8, f += E[a++] << c, c += 8), b = w[f & g];
                a: for (;;) {
                    if (m = b >>> 24, f >>>= m, c -= m, m = b >>> 16 & 255, !(16 & m)) {
                        if (0 == (64 & m)) {
                            b = w[(65535 & b) + (f & (1 << m) - 1)];
                            continue a
                        }
                        t.msg = "invalid distance code", x.mode = 30;
                        break t
                    }
                    if (k = 65535 & b, m &= 15, c < m && (f += E[a++] << c, c += 8, c < m && (f += E[a++] << c, c += 8)), k += f & (1 << m) - 1, k > o) {
                        t.msg = "invalid distance too far back", x.mode = 30;
                        break t
                    }
                    if (f >>>= m, c -= m, m = n - s, k > m) {
                        if (m = k - m, m > h && x.sane) {
                            t.msg = "invalid distance too far back", x.mode = 30;
                            break t
                        }
                        if (v = 0, A = _, 0 === d) {
                            if (v += l - m, m < y) {
                                y -= m;
                                do {
                                    O[n++] = _[v++]
                                } while (--m);
                                v = n - k, A = O
                            }
                        } else if (d < m) {
                            if (v += l + d - m, m -= d, m < y) {
                                y -= m;
                                do {
                                    O[n++] = _[v++]
                                } while (--m);
                                if (v = 0, d < y) {
                                    m = d, y -= m;
                                    do {
                                        O[n++] = _[v++]
                                    } while (--m);
                                    v = n - k, A = O
                                }
                            }
                        } else if (v += d - m, m < y) {
                            y -= m;
                            do {
                                O[n++] = _[v++]
                            } while (--m);
                            v = n - k, A = O
                        }
                        for (; y > 2;) O[n++] = A[v++], O[n++] = A[v++], O[n++] = A[v++], y -= 3;
                        y && (O[n++] = A[v++], y > 1 && (O[n++] = A[v++]))
                    } else {
                        v = n - k;
                        do {
                            O[n++] = O[v++], O[n++] = O[v++], O[n++] = O[v++], y -= 3
                        } while (y > 2);
                        y && (O[n++] = O[v++], y > 1 && (O[n++] = O[v++]))
                    }
                    break
                }
            }
            break
        }
    } while (a < i && n < r);
    y = c >> 3, a -= y, c -= y << 3, f &= (1 << c) - 1, t.next_in = a, t.next_out = n, t.avail_in = a < i ? i - a + 5 : 5 - (a - i), t.avail_out = n < r ? r - n + 257 : 257 - (n - r), x.hold = f, x.bits = c
};
const re = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
    oe = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]),
    le = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]),
    he = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
var de = (t, e, a, i, n, s, r, o) => {
    const l = o.bits;
    let h, d, _, f, c, u, w = 0,
        p = 0,
        g = 0,
        b = 0,
        m = 0,
        y = 0,
        k = 0,
        v = 0,
        A = 0,
        E = 0,
        O = null,
        x = 0;
    const T = new Uint16Array(16),
        z = new Uint16Array(16);
    let R, U, N, S = null,
        L = 0;
    for (w = 0; w <= 15; w++) T[w] = 0;
    for (p = 0; p < i; p++) T[e[a + p]]++;
    for (m = l, b = 15; b >= 1 && 0 === T[b]; b--);
    if (m > b && (m = b), 0 === b) return n[s++] = 20971520, n[s++] = 20971520, o.bits = 1, 0;
    for (g = 1; g < b && 0 === T[g]; g++);
    for (m < g && (m = g), v = 1, w = 1; w <= 15; w++)
        if (v <<= 1, v -= T[w], v < 0) return -1;
    if (v > 0 && (0 === t || 1 !== b)) return -1;
    for (z[1] = 0, w = 1; w < 15; w++) z[w + 1] = z[w] + T[w];
    for (p = 0; p < i; p++) 0 !== e[a + p] && (r[z[e[a + p]]++] = p);
    if (0 === t ? (O = S = r, u = 19) : 1 === t ? (O = re, x -= 257, S = oe, L -= 257, u = 256) : (O = le, S = he, u = -1), E = 0, p = 0, w = g, c = s, y = m, k = 0, _ = -1, A = 1 << m, f = A - 1, 1 === t && A > 852 || 2 === t && A > 592) return 1;
    for (;;) {
        R = w - k, r[p] < u ? (U = 0, N = r[p]) : r[p] > u ? (U = S[L + r[p]], N = O[x + r[p]]) : (U = 96, N = 0), h = 1 << w - k, d = 1 << y, g = d;
        do {
            d -= h, n[c + (E >> k) + d] = R << 24 | U << 16 | N | 0
        } while (0 !== d);
        for (h = 1 << w - 1; E & h;) h >>= 1;
        if (0 !== h ? (E &= h - 1, E += h) : E = 0, p++, 0 == --T[w]) {
            if (w === b) break;
            w = e[a + r[p]]
        }
        if (w > m && (E & f) !== _) {
            for (0 === k && (k = m), c += g, y = w - k, v = 1 << y; y + k < b && (v -= T[y + k], !(v <= 0));) y++, v <<= 1;
            if (A += 1 << y, 1 === t && A > 852 || 2 === t && A > 592) return 1;
            _ = E & f, n[_] = m << 24 | y << 16 | c - s | 0
        }
    }
    return 0 !== E && (n[c + E] = w - k << 24 | 64 << 16 | 0), o.bits = m, 0
};
const {
    Z_FINISH: _e,
    Z_BLOCK: fe,
    Z_TREES: ce,
    Z_OK: ue,
    Z_STREAM_END: we,
    Z_NEED_DICT: pe,
    Z_STREAM_ERROR: ge,
    Z_DATA_ERROR: be,
    Z_MEM_ERROR: me,
    Z_BUF_ERROR: ye,
    Z_DEFLATED: ke
} = G, ve = t => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);

function Ae() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
}
const Ee = t => {
        if (!t || !t.state) return ge;
        const e = t.state;
        return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = 1, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(852), e.distcode = e.distdyn = new Int32Array(592), e.sane = 1, e.back = -1, ue
    },
    Oe = t => {
        if (!t || !t.state) return ge;
        const e = t.state;
        return e.wsize = 0, e.whave = 0, e.wnext = 0, Ee(t)
    },
    xe = (t, e) => {
        let a;
        if (!t || !t.state) return ge;
        const i = t.state;
        return e < 0 ? (a = 0, e = -e) : (a = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? ge : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = a, i.wbits = e, Oe(t))
    },
    Te = (t, e) => {
        if (!t) return ge;
        const a = new Ae;
        t.state = a, a.window = null;
        const i = xe(t, e);
        return i !== ue && (t.state = null), i
    };
let ze, Re, Ue = !0;
const Ne = t => {
        if (Ue) {
            ze = new Int32Array(512), Re = new Int32Array(32);
            let e = 0;
            for (; e < 144;) t.lens[e++] = 8;
            for (; e < 256;) t.lens[e++] = 9;
            for (; e < 280;) t.lens[e++] = 7;
            for (; e < 288;) t.lens[e++] = 8;
            for (de(1, t.lens, 0, 288, ze, 0, t.work, {
                    bits: 9
                }), e = 0; e < 32;) t.lens[e++] = 5;
            de(2, t.lens, 0, 32, Re, 0, t.work, {
                bits: 5
            }), Ue = !1
        }
        t.lencode = ze, t.lenbits = 9, t.distcode = Re, t.distbits = 5
    },
    Se = (t, e, a, i) => {
        let n;
        const s = t.state;
        return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new Uint8Array(s.wsize)), i >= s.wsize ? (s.window.set(e.subarray(a - s.wsize, a), 0), s.wnext = 0, s.whave = s.wsize) : (n = s.wsize - s.wnext, n > i && (n = i), s.window.set(e.subarray(a - i, a - i + n), s.wnext), (i -= n) ? (s.window.set(e.subarray(a - i, a), 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += n, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += n))), 0
    };
var Le = {
    inflateReset: Oe,
    inflateReset2: xe,
    inflateResetKeep: Ee,
    inflateInit: t => Te(t, 15),
    inflateInit2: Te,
    inflate: (t, e) => {
        let a, i, n, s, r, o, l, h, d, _, f, c, u, w, p, g, b, m, y, k, v, A, E = 0;
        const O = new Uint8Array(4);
        let x, T;
        const z = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
        if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return ge;
        a = t.state, 12 === a.mode && (a.mode = 13), r = t.next_out, n = t.output, l = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, _ = o, f = l, A = ue;
        t: for (;;) switch (a.mode) {
            case 1:
                if (0 === a.wrap) {
                    a.mode = 13;
                    break
                }
                for (; d < 16;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if (2 & a.wrap && 35615 === h) {
                    a.check = 0, O[0] = 255 & h, O[1] = h >>> 8 & 255, a.check = Y(a.check, O, 2, 0), h = 0, d = 0, a.mode = 2;
                    break
                }
                if (a.flags = 0, a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & h) << 8) + (h >> 8)) % 31) {
                    t.msg = "incorrect header check", a.mode = 30;
                    break
                }
                if ((15 & h) !== ke) {
                    t.msg = "unknown compression method", a.mode = 30;
                    break
                }
                if (h >>>= 4, d -= 4, v = 8 + (15 & h), 0 === a.wbits) a.wbits = v;
                else if (v > a.wbits) {
                    t.msg = "invalid window size", a.mode = 30;
                    break
                }
                a.dmax = 1 << a.wbits, t.adler = a.check = 1, a.mode = 512 & h ? 10 : 12, h = 0, d = 0;
                break;
            case 2:
                for (; d < 16;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if (a.flags = h, (255 & a.flags) !== ke) {
                    t.msg = "unknown compression method", a.mode = 30;
                    break
                }
                if (57344 & a.flags) {
                    t.msg = "unknown header flags set", a.mode = 30;
                    break
                }
                a.head && (a.head.text = h >> 8 & 1), 512 & a.flags && (O[0] = 255 & h, O[1] = h >>> 8 & 255, a.check = Y(a.check, O, 2, 0)), h = 0, d = 0, a.mode = 3;
            case 3:
                for (; d < 32;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                a.head && (a.head.time = h), 512 & a.flags && (O[0] = 255 & h, O[1] = h >>> 8 & 255, O[2] = h >>> 16 & 255, O[3] = h >>> 24 & 255, a.check = Y(a.check, O, 4, 0)), h = 0, d = 0, a.mode = 4;
            case 4:
                for (; d < 16;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                a.head && (a.head.xflags = 255 & h, a.head.os = h >> 8), 512 & a.flags && (O[0] = 255 & h, O[1] = h >>> 8 & 255, a.check = Y(a.check, O, 2, 0)), h = 0, d = 0, a.mode = 5;
            case 5:
                if (1024 & a.flags) {
                    for (; d < 16;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    a.length = h, a.head && (a.head.extra_len = h), 512 & a.flags && (O[0] = 255 & h, O[1] = h >>> 8 & 255, a.check = Y(a.check, O, 2, 0)), h = 0, d = 0
                } else a.head && (a.head.extra = null);
                a.mode = 6;
            case 6:
                if (1024 & a.flags && (c = a.length, c > o && (c = o), c && (a.head && (v = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Uint8Array(a.head.extra_len)), a.head.extra.set(i.subarray(s, s + c), v)), 512 & a.flags && (a.check = Y(a.check, i, c, s)), o -= c, s += c, a.length -= c), a.length)) break t;
                a.length = 0, a.mode = 7;
            case 7:
                if (2048 & a.flags) {
                    if (0 === o) break t;
                    c = 0;
                    do {
                        v = i[s + c++], a.head && v && a.length < 65536 && (a.head.name += String.fromCharCode(v))
                    } while (v && c < o);
                    if (512 & a.flags && (a.check = Y(a.check, i, c, s)), o -= c, s += c, v) break t
                } else a.head && (a.head.name = null);
                a.length = 0, a.mode = 8;
            case 8:
                if (4096 & a.flags) {
                    if (0 === o) break t;
                    c = 0;
                    do {
                        v = i[s + c++], a.head && v && a.length < 65536 && (a.head.comment += String.fromCharCode(v))
                    } while (v && c < o);
                    if (512 & a.flags && (a.check = Y(a.check, i, c, s)), o -= c, s += c, v) break t
                } else a.head && (a.head.comment = null);
                a.mode = 9;
            case 9:
                if (512 & a.flags) {
                    for (; d < 16;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    if (h !== (65535 & a.check)) {
                        t.msg = "header crc mismatch", a.mode = 30;
                        break
                    }
                    h = 0, d = 0
                }
                a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = 12;
                break;
            case 10:
                for (; d < 32;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                t.adler = a.check = ve(h), h = 0, d = 0, a.mode = 11;
            case 11:
                if (0 === a.havedict) return t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, pe;
                t.adler = a.check = 1, a.mode = 12;
            case 12:
                if (e === fe || e === ce) break t;
            case 13:
                if (a.last) {
                    h >>>= 7 & d, d -= 7 & d, a.mode = 27;
                    break
                }
                for (; d < 3;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                switch (a.last = 1 & h, h >>>= 1, d -= 1, 3 & h) {
                    case 0:
                        a.mode = 14;
                        break;
                    case 1:
                        if (Ne(a), a.mode = 20, e === ce) {
                            h >>>= 2, d -= 2;
                            break t
                        }
                        break;
                    case 2:
                        a.mode = 17;
                        break;
                    case 3:
                        t.msg = "invalid block type", a.mode = 30
                }
                h >>>= 2, d -= 2;
                break;
            case 14:
                for (h >>>= 7 & d, d -= 7 & d; d < 32;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if ((65535 & h) != (h >>> 16 ^ 65535)) {
                    t.msg = "invalid stored block lengths", a.mode = 30;
                    break
                }
                if (a.length = 65535 & h, h = 0, d = 0, a.mode = 15, e === ce) break t;
            case 15:
                a.mode = 16;
            case 16:
                if (c = a.length, c) {
                    if (c > o && (c = o), c > l && (c = l), 0 === c) break t;
                    n.set(i.subarray(s, s + c), r), o -= c, s += c, l -= c, r += c, a.length -= c;
                    break
                }
                a.mode = 12;
                break;
            case 17:
                for (; d < 14;) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if (a.nlen = 257 + (31 & h), h >>>= 5, d -= 5, a.ndist = 1 + (31 & h), h >>>= 5, d -= 5, a.ncode = 4 + (15 & h), h >>>= 4, d -= 4, a.nlen > 286 || a.ndist > 30) {
                    t.msg = "too many length or distance symbols", a.mode = 30;
                    break
                }
                a.have = 0, a.mode = 18;
            case 18:
                for (; a.have < a.ncode;) {
                    for (; d < 3;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    a.lens[z[a.have++]] = 7 & h, h >>>= 3, d -= 3
                }
                for (; a.have < 19;) a.lens[z[a.have++]] = 0;
                if (a.lencode = a.lendyn, a.lenbits = 7, x = {
                        bits: a.lenbits
                    }, A = de(0, a.lens, 0, 19, a.lencode, 0, a.work, x), a.lenbits = x.bits, A) {
                    t.msg = "invalid code lengths set", a.mode = 30;
                    break
                }
                a.have = 0, a.mode = 19;
            case 19:
                for (; a.have < a.nlen + a.ndist;) {
                    for (; E = a.lencode[h & (1 << a.lenbits) - 1], p = E >>> 24, g = E >>> 16 & 255, b = 65535 & E, !(p <= d);) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    if (b < 16) h >>>= p, d -= p, a.lens[a.have++] = b;
                    else {
                        if (16 === b) {
                            for (T = p + 2; d < T;) {
                                if (0 === o) break t;
                                o--, h += i[s++] << d, d += 8
                            }
                            if (h >>>= p, d -= p, 0 === a.have) {
                                t.msg = "invalid bit length repeat", a.mode = 30;
                                break
                            }
                            v = a.lens[a.have - 1], c = 3 + (3 & h), h >>>= 2, d -= 2
                        } else if (17 === b) {
                            for (T = p + 3; d < T;) {
                                if (0 === o) break t;
                                o--, h += i[s++] << d, d += 8
                            }
                            h >>>= p, d -= p, v = 0, c = 3 + (7 & h), h >>>= 3, d -= 3
                        } else {
                            for (T = p + 7; d < T;) {
                                if (0 === o) break t;
                                o--, h += i[s++] << d, d += 8
                            }
                            h >>>= p, d -= p, v = 0, c = 11 + (127 & h), h >>>= 7, d -= 7
                        }
                        if (a.have + c > a.nlen + a.ndist) {
                            t.msg = "invalid bit length repeat", a.mode = 30;
                            break
                        }
                        for (; c--;) a.lens[a.have++] = v
                    }
                }
                if (30 === a.mode) break;
                if (0 === a.lens[256]) {
                    t.msg = "invalid code -- missing end-of-block", a.mode = 30;
                    break
                }
                if (a.lenbits = 9, x = {
                        bits: a.lenbits
                    }, A = de(1, a.lens, 0, a.nlen, a.lencode, 0, a.work, x), a.lenbits = x.bits, A) {
                    t.msg = "invalid literal/lengths set", a.mode = 30;
                    break
                }
                if (a.distbits = 6, a.distcode = a.distdyn, x = {
                        bits: a.distbits
                    }, A = de(2, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, x), a.distbits = x.bits, A) {
                    t.msg = "invalid distances set", a.mode = 30;
                    break
                }
                if (a.mode = 20, e === ce) break t;
            case 20:
                a.mode = 21;
            case 21:
                if (o >= 6 && l >= 258) {
                    t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, se(t, f), r = t.next_out, n = t.output, l = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, h = a.hold, d = a.bits, 12 === a.mode && (a.back = -1);
                    break
                }
                for (a.back = 0; E = a.lencode[h & (1 << a.lenbits) - 1], p = E >>> 24, g = E >>> 16 & 255, b = 65535 & E, !(p <= d);) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if (g && 0 == (240 & g)) {
                    for (m = p, y = g, k = b; E = a.lencode[k + ((h & (1 << m + y) - 1) >> m)], p = E >>> 24, g = E >>> 16 & 255, b = 65535 & E, !(m + p <= d);) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    h >>>= m, d -= m, a.back += m
                }
                if (h >>>= p, d -= p, a.back += p, a.length = b, 0 === g) {
                    a.mode = 26;
                    break
                }
                if (32 & g) {
                    a.back = -1, a.mode = 12;
                    break
                }
                if (64 & g) {
                    t.msg = "invalid literal/length code", a.mode = 30;
                    break
                }
                a.extra = 15 & g, a.mode = 22;
            case 22:
                if (a.extra) {
                    for (T = a.extra; d < T;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    a.length += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra
                }
                a.was = a.length, a.mode = 23;
            case 23:
                for (; E = a.distcode[h & (1 << a.distbits) - 1], p = E >>> 24, g = E >>> 16 & 255, b = 65535 & E, !(p <= d);) {
                    if (0 === o) break t;
                    o--, h += i[s++] << d, d += 8
                }
                if (0 == (240 & g)) {
                    for (m = p, y = g, k = b; E = a.distcode[k + ((h & (1 << m + y) - 1) >> m)], p = E >>> 24, g = E >>> 16 & 255, b = 65535 & E, !(m + p <= d);) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    h >>>= m, d -= m, a.back += m
                }
                if (h >>>= p, d -= p, a.back += p, 64 & g) {
                    t.msg = "invalid distance code", a.mode = 30;
                    break
                }
                a.offset = b, a.extra = 15 & g, a.mode = 24;
            case 24:
                if (a.extra) {
                    for (T = a.extra; d < T;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    a.offset += h & (1 << a.extra) - 1, h >>>= a.extra, d -= a.extra, a.back += a.extra
                }
                if (a.offset > a.dmax) {
                    t.msg = "invalid distance too far back", a.mode = 30;
                    break
                }
                a.mode = 25;
            case 25:
                if (0 === l) break t;
                if (c = f - l, a.offset > c) {
                    if (c = a.offset - c, c > a.whave && a.sane) {
                        t.msg = "invalid distance too far back", a.mode = 30;
                        break
                    }
                    c > a.wnext ? (c -= a.wnext, u = a.wsize - c) : u = a.wnext - c, c > a.length && (c = a.length), w = a.window
                } else w = n, u = r - a.offset, c = a.length;
                c > l && (c = l), l -= c, a.length -= c;
                do {
                    n[r++] = w[u++]
                } while (--c);
                0 === a.length && (a.mode = 21);
                break;
            case 26:
                if (0 === l) break t;
                n[r++] = a.length, l--, a.mode = 21;
                break;
            case 27:
                if (a.wrap) {
                    for (; d < 32;) {
                        if (0 === o) break t;
                        o--, h |= i[s++] << d, d += 8
                    }
                    if (f -= l, t.total_out += f, a.total += f, f && (t.adler = a.check = a.flags ? Y(a.check, n, f, r - f) : W(a.check, n, f, r - f)), f = l, (a.flags ? h : ve(h)) !== a.check) {
                        t.msg = "incorrect data check", a.mode = 30;
                        break
                    }
                    h = 0, d = 0
                }
                a.mode = 28;
            case 28:
                if (a.wrap && a.flags) {
                    for (; d < 32;) {
                        if (0 === o) break t;
                        o--, h += i[s++] << d, d += 8
                    }
                    if (h !== (4294967295 & a.total)) {
                        t.msg = "incorrect length check", a.mode = 30;
                        break
                    }
                    h = 0, d = 0
                }
                a.mode = 29;
            case 29:
                A = we;
                break t;
            case 30:
                A = be;
                break t;
            case 31:
                return me;
            default:
                return ge
        }
        return t.next_out = r, t.avail_out = l, t.next_in = s, t.avail_in = o, a.hold = h, a.bits = d, (a.wsize || f !== t.avail_out && a.mode < 30 && (a.mode < 27 || e !== _e)) && Se(t, t.output, t.next_out, f - t.avail_out), _ -= t.avail_in, f -= t.avail_out, t.total_in += _, t.total_out += f, a.total += f, a.wrap && f && (t.adler = a.check = a.flags ? Y(a.check, n, f, t.next_out - f) : W(a.check, n, f, t.next_out - f)), t.data_type = a.bits + (a.last ? 64 : 0) + (12 === a.mode ? 128 : 0) + (20 === a.mode || 15 === a.mode ? 256 : 0), (0 === _ && 0 === f || e === _e) && A === ue && (A = ye), A
    },
    inflateEnd: t => {
        if (!t || !t.state) return ge;
        let e = t.state;
        return e.window && (e.window = null), t.state = null, ue
    },
    inflateGetHeader: (t, e) => {
        if (!t || !t.state) return ge;
        const a = t.state;
        return 0 == (2 & a.wrap) ? ge : (a.head = e, e.done = !1, ue)
    },
    inflateSetDictionary: (t, e) => {
        const a = e.length;
        let i, n, s;
        return t && t.state ? (i = t.state, 0 !== i.wrap && 11 !== i.mode ? ge : 11 === i.mode && (n = 1, n = W(n, e, a, 0), n !== i.check) ? be : (s = Se(t, e, a, a), s ? (i.mode = 31, me) : (i.havedict = 1, ue))) : ge
    },
    inflateInfo: "pako inflate (from Nodeca project)"
};
var De = function () {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
};
const Be = Object.prototype.toString,
    {
        Z_NO_FLUSH: Fe,
        Z_FINISH: Ie,
        Z_OK: Ze,
        Z_STREAM_END: Ce,
        Z_NEED_DICT: Ke,
        Z_STREAM_ERROR: Me,
        Z_DATA_ERROR: Pe,
        Z_MEM_ERROR: We
    } = G;

function He(t) {
    this.options = Zt({
        chunkSize: 65536,
        windowBits: 15,
        to: ""
    }, t || {});
    const e = this.options;
    e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Yt, this.strm.avail_out = 0;
    let a = Le.inflateInit2(this.strm, e.windowBits);
    if (a !== Ze) throw new Error(j[a]);
    if (this.header = new De, Le.inflateGetHeader(this.strm, this.header), e.dictionary && ("string" == typeof e.dictionary ? e.dictionary = Pt(e.dictionary) : "[object ArrayBuffer]" === Be.call(e.dictionary) && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (a = Le.inflateSetDictionary(this.strm, e.dictionary), a !== Ze))) throw new Error(j[a])
}
He.prototype.push = function (t, e) {
    const a = this.strm,
        i = this.options.chunkSize,
        n = this.options.dictionary;
    let s, r, o;
    if (this.ended) return !1;
    for (r = e === ~~e ? e : !0 === e ? Ie : Fe, "[object ArrayBuffer]" === Be.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;;) {
        for (0 === a.avail_out && (a.output = new Uint8Array(i), a.next_out = 0, a.avail_out = i), s = Le.inflate(a, r), s === Ke && n && (s = Le.inflateSetDictionary(a, n), s === Ze ? s = Le.inflate(a, r) : s === Pe && (s = Ke)); a.avail_in > 0 && s === Ce && a.state.wrap > 0 && 0 !== t[a.next_in];) Le.inflateReset(a), s = Le.inflate(a, r);
        switch (s) {
            case Me:
            case Pe:
            case Ke:
            case We:
                return this.onEnd(s), this.ended = !0, !1
        }
        if (o = a.avail_out, a.next_out && (0 === a.avail_out || s === Ce))
            if ("string" === this.options.to) {
                let t = Ht(a.output, a.next_out),
                    e = a.next_out - t,
                    n = Wt(a.output, t);
                a.next_out = e, a.avail_out = i - e, e && a.output.set(a.output.subarray(t, t + e), 0), this.onData(n)
            } else this.onData(a.output.length === a.next_out ? a.output : a.output.subarray(0, a.next_out));
        if (s !== Ze || 0 !== o) {
            if (s === Ce) return s = Le.inflateEnd(this.strm), this.onEnd(s), this.ended = !0, !0;
            if (0 === a.avail_in) break
        }
    }
    return !0
}, He.prototype.onData = function (t) {
    this.chunks.push(t)
}, He.prototype.onEnd = function (t) {
    t === Ze && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = Ct(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
};
const {
    Deflate: Ye,
    deflate: je,
    deflateRaw: Ge,
    gzip: Xe
} = ne;
var Ve = je;
const $e = [137, 80, 78, 71, 13, 10, 26, 10],
    Je = [];
for (let t = 0; t < 256; t++) {
    let e = t;
    for (let t = 0; t < 8; t++) 1 & e ? e = 3988292384 ^ e >>> 1 : e >>>= 1;
    Je[t] = e
}

function qe(t, e) {
    return (4294967295 ^ function (t, e, a) {
        let i = t;
        for (let t = 0; t < a; t++) i = Je[255 & (i ^ e[t])] ^ i >>> 8;
        return i
    }(4294967295, t, e)) >>> 0
}
var Qe, ta, ea, aa;
! function (t) {
    t[t.UNKNOWN = -1] = "UNKNOWN", t[t.GREYSCALE = 0] = "GREYSCALE", t[t.TRUECOLOUR = 2] = "TRUECOLOUR", t[t.INDEXED_COLOUR = 3] = "INDEXED_COLOUR", t[t.GREYSCALE_ALPHA = 4] = "GREYSCALE_ALPHA", t[t.TRUECOLOUR_ALPHA = 6] = "TRUECOLOUR_ALPHA"
}(Qe || (Qe = {})),
function (t) {
    t[t.UNKNOWN = -1] = "UNKNOWN", t[t.DEFLATE = 0] = "DEFLATE"
}(ta || (ta = {})),
function (t) {
    t[t.UNKNOWN = -1] = "UNKNOWN", t[t.ADAPTIVE = 0] = "ADAPTIVE"
}(ea || (ea = {})),
function (t) {
    t[t.UNKNOWN = -1] = "UNKNOWN", t[t.NO_INTERLACE = 0] = "NO_INTERLACE", t[t.ADAM7 = 1] = "ADAM7"
}(aa || (aa = {}));
const ia = new Uint16Array([255]);
new Uint8Array(ia.buffer)[0];
const na = {
    level: 3
};
class sa extends l {
    constructor(t, e = {}) {
        super(), this._colorType = Qe.UNKNOWN, this._zlibOptions = Object.assign({}, na, e.zlib), this._png = this._checkData(t), this.setBigEndian()
    }
    encode() {
        return this.encodeSignature(), this.encodeIHDR(), this.encodeData(), this.encodeIEND(), this.toArray()
    }
    encodeSignature() {
        this.writeBytes($e)
    }
    encodeIHDR() {
        this.writeUint32(13), this.writeChars("IHDR"), this.writeUint32(this._png.width), this.writeUint32(this._png.height), this.writeByte(this._png.depth), this.writeByte(this._colorType), this.writeByte(ta.DEFLATE), this.writeByte(ea.ADAPTIVE), this.writeByte(aa.NO_INTERLACE), this.writeCrc(17)
    }
    encodeIEND() {
        this.writeUint32(0), this.writeChars("IEND"), this.writeCrc(4)
    }
    encodeIDAT(t) {
        this.writeUint32(t.length), this.writeChars("IDAT"), this.writeBytes(t), this.writeCrc(t.length + 4)
    }
    encodeData() {
        const {
            width: t,
            height: e,
            channels: a,
            depth: i,
            data: n
        } = this._png, s = a * t, r = (new l).setBigEndian();
        let o = 0;
        for (let t = 0; t < e; t++)
            if (r.writeByte(0), 8 === i) o = oa(n, r, s, o);
            else {
                if (16 !== i) throw new Error("unreachable");
                o = la(n, r, s, o)
            } const h = r.toArray(),
            d = Ve(h, this._zlibOptions);
        this.encodeIDAT(d)
    }
    _checkData(t) {
        const {
            colorType: e,
            channels: a,
            depth: i
        } = function (t) {
            const {
                channels: e = 4,
                depth: a = 8
            } = t;
            if (4 !== e && 3 !== e && 2 !== e && 1 !== e) throw new RangeError(`unsupported number of channels: ${e}`);
            if (8 !== a && 16 !== a) throw new RangeError(`unsupported bit depth: ${a}`);
            const i = {
                channels: e,
                depth: a,
                colorType: Qe.UNKNOWN
            };
            switch (e) {
                case 4:
                    i.colorType = Qe.TRUECOLOUR_ALPHA;
                    break;
                case 3:
                    i.colorType = Qe.TRUECOLOUR;
                    break;
                case 1:
                    i.colorType = Qe.GREYSCALE;
                    break;
                case 2:
                    i.colorType = Qe.GREYSCALE_ALPHA;
                    break;
                default:
                    throw new Error("unsupported number of channels")
            }
            return i
        }(t), n = {
            width: ra(t.width, "width"),
            height: ra(t.height, "height"),
            channels: a,
            data: t.data,
            depth: i,
            text: {}
        };
        this._colorType = e;
        const s = n.width * n.height * a;
        if (n.data.length !== s) throw new RangeError(`wrong data size. Found ${n.data.length}, expected ${s}`);
        return n
    }
    writeCrc(t) {
        this.writeUint32(qe(new Uint8Array(this.buffer, this.byteOffset + this.offset - t, t), t))
    }
}

function ra(t, e) {
    if (Number.isInteger(t) && t > 0) return t;
    throw new TypeError(`${e} must be a positive integer`)
}

function oa(t, e, a, i) {
    for (let n = 0; n < a; n++) e.writeByte(t[i++]);
    return i
}

function la(t, e, a, i) {
    for (let n = 0; n < a; n++) e.writeUint16(t[i++]);
    return i
}
var ha;
! function (t) {
    t[t.UNKNOWN = 0] = "UNKNOWN", t[t.METRE = 1] = "METRE"
}(ha || (ha = {}));
const da = "QmQL3gfVSmxL2wotc363Q6mmxaWLpVEzcjWKzYVqkARfwF",
    _a = "GDJ2TPZFWEWXYIR27YMCUUR3KEDM37PUY7KY2MEFGB344EMTIRA7PXXJ",
    fa = "GDKYN7QARRKKOITW5JAN35LTZVKWD52MJDTTKOJIBXVFX7IHKMA7UKCW",
    ca = "GAHRTMNCDU2T3BV4KA4LKEYQW6UIFTE7F3T6YPRMIBFIMFCJNSE76FTT",
    ua = new i.Asset("ProxyAsset", _a),
    wa = new i.Asset("SmartNFT01", _a),
    pa = new i.Server(HORIZON_URL);

function ga() {
    return pa.feeStats().then((t => t ? .fee_charged ? .max || 1e5)).catch((() => 1e5))
}

function ba() {
    return Promise.all([pa.loadAccount(fa), pa.loadAccount(ca)]).then((t => t.map((({
        id: t,
        balances: e
    }) => e.filter((({
        asset_type: t,
        asset_issuer: e
    }) => "native" !== t && e === _a)).map((({
        asset_code: e
    }) => ({
        asset_distributor: t,
        asset_code: e
    }))))))).then(e.flatten).catch((t => {
        if (404 === t ? .response ? .status) throw {
            message: "SmartNFT01 has already been minted"
        };
        throw t
    }))
}

function ma(t) {
    const e = i.Keypair.fromPublicKey(t).rawPublicKey(),
        a = i.Keypair.fromRawEd25519Seed(e),
        n = a.publicKey();
    return {
        plotKeypair: a,
        plotPublicKey: n,
        SmartPlotNFT: new i.Asset("SmartPlotNFT", n)
    }
}
module.exports = async ({
    command: t,
    ...a
}) => {
    switch (t) {
        case "dig":
            return async function (t) {
                const {
                    source: a,
                    signers: n,
                    pixels: r
                } = t;
                if (r.length > 20) throw {
                    message: "Cannot buy more than 20 pixels"
                };
                const o = await ba().then((t => t.filter((({
                    asset_code: t
                }) => r.indexOf(t) > -1))));
                if (!o.length) throw {
                    message: "These pixels are not available to dig"
                };
                if (!r.length || o.length >= 10 && r.length < 10) throw {
                    message: "Must buy at least 10 pixels"
                };
                if (o.length !== r.length) throw {
                    message: "Some or all of these pixels have already been dug"
                };
                return pa.loadAccount(a).then((async t => {
                    const {
                        plotKeypair: l,
                        plotPublicKey: h,
                        SmartPlotNFT: d
                    } = ma(a);
                    if (e.find(t.balances, {
                            asset_code: d.code,
                            asset_issuer: d.issuer
                        })) throw {
                        message: "Source account has already been issued a SmartPlotNFT"
                    };
                    const _ = await ga();
                    let f = new i.TransactionBuilder(t, {
                        fee: _,
                        networkPassphrase: i.Networks[STELLAR_NETWORK]
                    });
                    f.addOperation(i.Operation.beginSponsoringFutureReserves({
                        sponsoredId: h
                    })), f.addOperation(i.Operation.beginSponsoringFutureReserves({
                        sponsoredId: _a
                    })), f.addOperation(i.Operation.createAccount({
                        destination: h,
                        startingBalance: "0"
                    })), n.forEach(((t, e) => {
                        let a = {
                            signer: {
                                ed25519PublicKey: t,
                                weight: 1
                            },
                            source: h
                        };
                        0 === e && (a = {
                            ...a,
                            homeDomain: "nft.kalepail.com",
                            masterWeight: 0,
                            setFlags: 11
                        }), f.addOperation(i.Operation.setOptions(a))
                    }));
                    const c = function (t) {
                        const a = new Array(1600).fill(0).map(((a, i) => {
                            const n = i % 40,
                                s = Math.floor(i / 40);
                            return e.find(t, (t => t.substr(0, 4) === `${String(n).padStart(2,"0")}${String(s).padStart(2,"0")}`))
                        }));
                        let i = 0,
                            n = function (t, e) {
                                const a = Buffer.alloc(e * e * 4);
                                t.forEach((t => {
                                    if (!t) return;
                                    const i = parseInt(t.substring(0, 2), 10),
                                        n = parseInt(t.substring(2, 4), 10),
                                        s = function (t) {
                                            if (6 !== t.length) throw {
                                                message: "Only six-digit hex colors are allowed"
                                            };
                                            const e = t.toLowerCase().match(/.{1,2}/g);
                                            return [parseInt(e[0], 16), parseInt(e[1], 16), parseInt(e[2], 16)]
                                        }(t.substring(4));
                                    a[4 * n * e + 4 * i] = s[0], a[4 * n * e + 4 * i + 1] = s[1], a[4 * n * e + 4 * i + 2] = s[2], a[4 * n * e + 4 * i + 3] = 255
                                }));
                                let i = function (t, e) {
                                    return new sa(t, e).encode()
                                }({
                                    width: e,
                                    height: e,
                                    data: a,
                                    depth: 8,
                                    channels: 4
                                });
                                return Buffer.from(i)
                            }(a, 40);
                        const s = [];
                        for (; n.length;) {
                            const t = Buffer.alloc(2);
                            t.writeIntBE(i, 0, 2);
                            const e = Buffer.concat([t, n.slice(0, 46)]).toString("base64"),
                                a = n.slice(46, 110);
                            s.push([e, a]), n = n.slice(110), i++
                        }
                        return s
                    }(r);
                    return c.forEach((([t, e]) => f.addOperation(i.Operation.manageData({
                        name: t,
                        value: e,
                        source: h
                    })))), f.addOperation(i.Operation.changeTrust({
                        asset: ua,
                        limit: "0.0000001"
                    })), f.addOperation(i.Operation.changeTrust({
                        asset: ua,
                        limit: "0.0000001",
                        source: h
                    })), f.addOperation(i.Operation.setTrustLineFlags({
                        asset: ua,
                        trustor: a,
                        flags: {
                            authorized: !0
                        },
                        source: _a
                    })), f.addOperation(i.Operation.setTrustLineFlags({
                        asset: ua,
                        trustor: h,
                        flags: {
                            authorized: !0
                        },
                        source: _a
                    })), f.addOperation(i.Operation.payment({
                        asset: ua,
                        amount: "0.0000001",
                        destination: a,
                        source: _a
                    })), f.addOperation(i.Operation.changeTrust({
                        asset: d,
                        limit: "0.0000001"
                    })), f.addOperation(i.Operation.setTrustLineFlags({
                        asset: d,
                        trustor: a,
                        flags: {
                            authorized: !0
                        },
                        source: h
                    })), f.addOperation(i.Operation.manageSellOffer({
                        selling: d,
                        buying: ua,
                        amount: "0.0000001",
                        price: "1",
                        source: h
                    })), f.addOperation(i.Operation.manageBuyOffer({
                        selling: ua,
                        buying: d,
                        buyAmount: "0.0000001",
                        price: "1"
                    })), f.addOperation(i.Operation.setTrustLineFlags({
                        asset: d,
                        trustor: a,
                        flags: {
                            authorized: !1
                        },
                        source: h
                    })), f.addOperation(i.Operation.payment({
                        asset: ua,
                        amount: "0.0000001",
                        destination: _a,
                        source: h
                    })), f.addOperation(i.Operation.changeTrust({
                        asset: ua,
                        limit: "0",
                        source: h
                    })), f.addOperation(i.Operation.changeTrust({
                        asset: ua,
                        limit: "0"
                    })), o.forEach((({
                        asset_code: t,
                        asset_distributor: e
                    }) => {
                        const a = new i.Asset(t, _a);
                        f.addOperation(i.Operation.payment({
                            destination: _a,
                            asset: a,
                            amount: "1",
                            source: e
                        })), f.addOperation(i.Operation.changeTrust({
                            asset: a,
                            limit: "0",
                            source: e
                        }))
                    })), f.addOperation(i.Operation.payment({
                        asset: i.Asset.native(),
                        amount: new s.default(o.length).times(10).toFixed(0, 2),
                        destination: _a
                    })), f.addOperation(i.Operation.endSponsoringFutureReserves({
                        source: h
                    })), f.addOperation(i.Operation.endSponsoringFutureReserves({
                        source: _a
                    })), f = f.setTimeout(0).build(), f.sign(l), f.toXDR()
                }))
            }(a);
        case "mint":
            return async function (t) {
                const {
                    source: e
                } = t;
                if ((await ba()).length) throw {
                    message: "There are still pixels left to dig"
                };
                const {
                    SmartPlotNFT: a
                } = ma(e);
                if (await pa.trades().forAssetPair(ua, a).limit(1).call().then((({
                        records: t
                    }) => !t[0]))) throw {
                    message: "Source account wasn't a digger"
                };
                return pa.loadAccount(_a).then((async t => {
                    if (t.data_attr.ipfshash) throw {
                        message: "SmartNFT01 has already been minted"
                    };
                    const a = await ga();
                    return new i.TransactionBuilder(t, {
                        fee: a,
                        networkPassphrase: i.Networks[STELLAR_NETWORK]
                    }).addOperation(i.Operation.manageData({
                        name: "ipfshash",
                        value: da
                    })).addOperation(i.Operation.setOptions({
                        homeDomain: "nft.kalepail.com",
                        setFlags: 11
                    })).addOperation(i.Operation.accountMerge({
                        destination: _a,
                        source: fa
                    })).addOperation(i.Operation.accountMerge({
                        destination: _a,
                        source: ca
                    })).addOperation(i.Operation.payment({
                        asset: i.Asset.native(),
                        amount: "100",
                        destination: e
                    })).setTimeout(0).build().toXDR()
                }))
            }(a);
        case "issue":
            return async function (t) {
                const {
                    source: e
                } = t;
                if (!(await pa.loadAccount(_a)).data_attr.ipfshash) throw {
                    message: "SmartNFT01 hasn't been minted yet"
                };
                const {
                    plotPublicKey: a,
                    SmartPlotNFT: n
                } = ma(e), s = await pa.trades().forAssetPair(wa, n).limit(1).call().then((({
                    records: t
                }) => !!t[0])).catch((t => {
                    if (404 === t ? .response ? .status) return !1;
                    throw t
                }));
                if (s) throw {
                    message: "SmartNFT01 has already been issued to this account"
                };
                return pa.loadAccount(e).then((async t => {
                    const s = await ga();
                    let r = new i.TransactionBuilder(t, {
                        fee: s,
                        networkPassphrase: i.Networks[STELLAR_NETWORK]
                    });
                    return r.addOperation(i.Operation.changeTrust({
                        asset: n,
                        limit: "0.0000001",
                        source: _a
                    })), r.addOperation(i.Operation.setTrustLineFlags({
                        asset: n,
                        trustor: _a,
                        flags: {
                            authorized: !0
                        },
                        source: a
                    })), r.addOperation(i.Operation.setTrustLineFlags({
                        asset: n,
                        trustor: e,
                        flags: {
                            authorized: !0
                        },
                        source: a
                    })), r.addOperation(i.Operation.changeTrust({
                        asset: wa,
                        limit: "0.0000001"
                    })), r.addOperation(i.Operation.setTrustLineFlags({
                        asset: wa,
                        trustor: e,
                        flags: {
                            authorized: !0
                        },
                        source: _a
                    })), r.addOperation(i.Operation.manageSellOffer({
                        selling: wa,
                        buying: n,
                        amount: "0.0000001",
                        price: "1",
                        source: _a
                    })), r.addOperation(i.Operation.manageBuyOffer({
                        selling: n,
                        buying: wa,
                        buyAmount: "0.0000001",
                        price: "1"
                    })), r.addOperation(i.Operation.payment({
                        asset: n,
                        amount: "0.0000001",
                        destination: e,
                        source: _a
                    })), r.addOperation(i.Operation.changeTrust({
                        asset: n,
                        limit: "0",
                        source: _a
                    })), r = r.setTimeout(0).build(), r.toXDR()
                }))
            }(a);
        default:
            throw {
                message: "Invalid command"
            }
    }
};
