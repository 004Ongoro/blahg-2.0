module.exports = [
"[project]/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/node_modules/uuid/dist/esm-node/max.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
}),
"[project]/node_modules/uuid/dist/esm-node/nil.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = '00000000-0000-0000-0000-000000000000';
}),
"[project]/node_modules/uuid/dist/esm-node/regex.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
}),
"[project]/node_modules/uuid/dist/esm-node/validate.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/regex.js [app-route] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}),
"[project]/node_modules/uuid/dist/esm-node/parse.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/validate.js [app-route] (ecmascript)");
;
function parse(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    let v;
    const arr = new Uint8Array(16);
    // Parse ########-....-....-....-............
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 0xff;
    arr[2] = v >>> 8 & 0xff;
    arr[3] = v & 0xff;
    // Parse ........-####-....-....-............
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 0xff;
    // Parse ........-....-####-....-............
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 0xff;
    // Parse ........-....-....-####-............
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 0xff;
    // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
    arr[11] = v / 0x100000000 & 0xff;
    arr[12] = v >>> 24 & 0xff;
    arr[13] = v >>> 16 & 0xff;
    arr[14] = v >>> 8 & 0xff;
    arr[15] = v & 0xff;
    return arr;
}
const __TURBOPACK__default__export__ = parse;
}),
"[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "unsafeStringify",
    ()=>unsafeStringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/validate.js [app-route] (ecmascript)");
;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    //
    // Note to future-self: No, you can't remove the `toLowerCase()` call.
    // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}),
"[project]/node_modules/uuid/dist/esm-node/rng.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>rng
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
}),
"[project]/node_modules/uuid/dist/esm-node/v1.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/rng.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
;
;
// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;
let _clockseq;
// Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0;
// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node;
    let clockseq = options.clockseq;
    // v1 only: Use cached `node` and `clockseq` values
    if (!options._v6) {
        if (!node) {
            node = _nodeId;
        }
        if (clockseq == null) {
            clockseq = _clockseq;
        }
    }
    // Handle cases where we need entropy.  We do this lazily to minimize issues
    // related to insufficient system entropy.  See #189
    if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Randomize node
        if (node == null) {
            node = [
                seedBytes[0],
                seedBytes[1],
                seedBytes[2],
                seedBytes[3],
                seedBytes[4],
                seedBytes[5]
            ];
            // v1 only: cache node value for reuse
            if (!_nodeId && !options._v6) {
                // per RFC4122 4.5: Set MAC multicast bit (v1 only)
                node[0] |= 0x01; // Set multicast bit
                _nodeId = node;
            }
        }
        // Randomize clockseq
        if (clockseq == null) {
            // Per 4.2.2, randomize (14 bit) clockseq
            clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
            if (_clockseq === undefined && !options._v6) {
                _clockseq = clockseq;
            }
        }
    }
    // v1 & v6 timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so time is
    // handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    let msecs = options.msecs !== undefined ? options.msecs : Date.now();
    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
    // Time since last uuid creation (in msecs)
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;
    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
    }
    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
    }
    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;
    // `time_low`
    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;
    // `time_mid`
    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;
    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;
    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;
    // `clock_seq_low`
    b[i++] = clockseq & 0xff;
    // `node`
    for(let n = 0; n < 6; ++n){
        b[i + n] = node[n];
    }
    return buf || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(b);
}
const __TURBOPACK__default__export__ = v1;
}),
"[project]/node_modules/uuid/dist/esm-node/v1ToV6.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>v1ToV6
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
;
;
function v1ToV6(uuid) {
    const v1Bytes = typeof uuid === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(uuid) : uuid;
    const v6Bytes = _v1ToV6(v1Bytes);
    return typeof uuid === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(v6Bytes) : v6Bytes;
}
// Do the field transformation needed for v1 -> v6
function _v1ToV6(v1Bytes, randomize = false) {
    return Uint8Array.of((v1Bytes[6] & 0x0f) << 4 | v1Bytes[7] >> 4 & 0x0f, (v1Bytes[7] & 0x0f) << 4 | (v1Bytes[4] & 0xf0) >> 4, (v1Bytes[4] & 0x0f) << 4 | (v1Bytes[5] & 0xf0) >> 4, (v1Bytes[5] & 0x0f) << 4 | (v1Bytes[0] & 0xf0) >> 4, (v1Bytes[0] & 0x0f) << 4 | (v1Bytes[1] & 0xf0) >> 4, (v1Bytes[1] & 0x0f) << 4 | (v1Bytes[2] & 0xf0) >> 4, 0x60 | v1Bytes[2] & 0x0f, v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
}
}),
"[project]/node_modules/uuid/dist/esm-node/v35.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DNS",
    ()=>DNS,
    "URL",
    ()=>URL,
    "default",
    ()=>v35
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/parse.js [app-route] (ecmascript)");
;
;
function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    const bytes = [];
    for(let i = 0; i < str.length; ++i){
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
        var _namespace;
        if (typeof value === 'string') {
            value = stringToBytes(value);
        }
        if (typeof namespace === 'string') {
            namespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(namespace);
        }
        if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
        }
        // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;
        if (buf) {
            offset = offset || 0;
            for(let i = 0; i < 16; ++i){
                buf[offset + i] = bytes[i];
            }
            return buf;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(bytes);
    }
    // Function#name is not settable on some platforms (#270)
    try {
        generateUUID.name = name;
    } catch (err) {}
    // For CommonJS default export support
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
}
}),
"[project]/node_modules/uuid/dist/esm-node/md5.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHash('md5').update(bytes).digest();
}
const __TURBOPACK__default__export__ = md5;
}),
"[project]/node_modules/uuid/dist/esm-node/v3.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v35.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$md5$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/md5.js [app-route] (ecmascript)");
;
;
const v3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])('v3', 0x30, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$md5$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v3;
}),
"[project]/node_modules/uuid/dist/esm-node/native.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const __TURBOPACK__default__export__ = {
    randomUUID: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomUUID
};
}),
"[project]/node_modules/uuid/dist/esm-node/v4.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/native.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/rng.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
;
;
;
function v4(options, buf, offset) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].randomUUID && !buf && !options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;
    // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}),
"[project]/node_modules/uuid/dist/esm-node/sha1.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHash('sha1').update(bytes).digest();
}
const __TURBOPACK__default__export__ = sha1;
}),
"[project]/node_modules/uuid/dist/esm-node/v5.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v35.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$sha1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/sha1.js [app-route] (ecmascript)");
;
;
const v5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v35$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])('v5', 0x50, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$sha1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = v5;
}),
"[project]/node_modules/uuid/dist/esm-node/v6.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>v6
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v1.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1ToV6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v1ToV6.js [app-route] (ecmascript)");
;
;
;
function v6(options = {}, buf, offset = 0) {
    // v6 is v1 with different field layout, so we start with a v1 UUID, albeit
    // with slightly different behavior around how the clock_seq and node fields
    // are randomized, which is why we call v1 with _v6: true.
    let bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
        ...options,
        _v6: true
    }, new Uint8Array(16));
    // Reorder the fields to v6 layout.
    bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1ToV6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(bytes);
    // Return as a byte array if requested
    if (buf) {
        for(let i = 0; i < 16; i++){
            buf[offset + i] = bytes[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(bytes);
}
}),
"[project]/node_modules/uuid/dist/esm-node/v6ToV1.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>v6ToV1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
;
;
function v6ToV1(uuid) {
    const v6Bytes = typeof uuid === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(uuid) : uuid;
    const v1Bytes = _v6ToV1(v6Bytes);
    return typeof uuid === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(v1Bytes) : v1Bytes;
}
// Do the field transformation needed for v6 -> v1
function _v6ToV1(v6Bytes) {
    return Uint8Array.of((v6Bytes[3] & 0x0f) << 4 | v6Bytes[4] >> 4 & 0x0f, (v6Bytes[4] & 0x0f) << 4 | (v6Bytes[5] & 0xf0) >> 4, (v6Bytes[5] & 0x0f) << 4 | v6Bytes[6] & 0x0f, v6Bytes[7], (v6Bytes[1] & 0x0f) << 4 | (v6Bytes[2] & 0xf0) >> 4, (v6Bytes[2] & 0x0f) << 4 | (v6Bytes[3] & 0xf0) >> 4, 0x10 | (v6Bytes[0] & 0xf0) >> 4, (v6Bytes[0] & 0x0f) << 4 | (v6Bytes[1] & 0xf0) >> 4, v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
}
}),
"[project]/node_modules/uuid/dist/esm-node/v7.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/rng.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
;
;
/**
 * UUID V7 - Unix Epoch time-based UUID
 *
 * The IETF has published RFC9562, introducing 3 new UUID versions (6,7,8). This
 * implementation of V7 is based on the accepted, though not yet approved,
 * revisions.
 *
 * RFC 9562:https://www.rfc-editor.org/rfc/rfc9562.html Universally Unique
 * IDentifiers (UUIDs)

 *
 * Sample V7 value:
 * https://www.rfc-editor.org/rfc/rfc9562.html#name-example-of-a-uuidv7-value
 *
 * Monotonic Bit Layout: RFC rfc9562.6.2 Method 1, Dedicated Counter Bits ref:
 *     https://www.rfc-editor.org/rfc/rfc9562.html#section-6.2-5.1
 *
 *   0                   1                   2                   3 0 1 2 3 4 5 6
 *   7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |                          unix_ts_ms                           |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |          unix_ts_ms           |  ver  |        seq_hi         |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |var|               seq_low               |        rand         |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  |                             rand                              |
 *  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 * seq is a 31 bit serialized counter; comprised of 12 bit seq_hi and 19 bit
 * seq_low, and randomly initialized upon timestamp change. 31 bit counter size
 * was selected as any bitwise operations in node are done as _signed_ 32 bit
 * ints. we exclude the sign bit.
 */ let _seqLow = null;
let _seqHigh = null;
let _msecs = 0;
function v7(options, buf, offset) {
    options = options || {};
    // initialize buffer and pointer
    let i = buf && offset || 0;
    const b = buf || new Uint8Array(16);
    // rnds is Uint8Array(16) filled with random bytes
    const rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    // milliseconds since unix epoch, 1970-01-01 00:00
    const msecs = options.msecs !== undefined ? options.msecs : Date.now();
    // seq is user provided 31 bit counter
    let seq = options.seq !== undefined ? options.seq : null;
    // initialize local seq high/low parts
    let seqHigh = _seqHigh;
    let seqLow = _seqLow;
    // check if clock has advanced and user has not provided msecs
    if (msecs > _msecs && options.msecs === undefined) {
        _msecs = msecs;
        // unless user provided seq, reset seq parts
        if (seq !== null) {
            seqHigh = null;
            seqLow = null;
        }
    }
    // if we have a user provided seq
    if (seq !== null) {
        // trim provided seq to 31 bits of value, avoiding overflow
        if (seq > 0x7fffffff) {
            seq = 0x7fffffff;
        }
        // split provided seq into high/low parts
        seqHigh = seq >>> 19 & 0xfff;
        seqLow = seq & 0x7ffff;
    }
    // randomly initialize seq
    if (seqHigh === null || seqLow === null) {
        seqHigh = rnds[6] & 0x7f;
        seqHigh = seqHigh << 8 | rnds[7];
        seqLow = rnds[8] & 0x3f; // pad for var
        seqLow = seqLow << 8 | rnds[9];
        seqLow = seqLow << 5 | rnds[10] >>> 3;
    }
    // increment seq if within msecs window
    if (msecs + 10000 > _msecs && seq === null) {
        if (++seqLow > 0x7ffff) {
            seqLow = 0;
            if (++seqHigh > 0xfff) {
                seqHigh = 0;
                // increment internal _msecs. this allows us to continue incrementing
                // while staying monotonic. Note, once we hit 10k milliseconds beyond system
                // clock, we will reset breaking monotonicity (after (2^31)*10000 generations)
                _msecs++;
            }
        }
    } else {
        // resetting; we have advanced more than
        // 10k milliseconds beyond system clock
        _msecs = msecs;
    }
    _seqHigh = seqHigh;
    _seqLow = seqLow;
    // [bytes 0-5] 48 bits of local timestamp
    b[i++] = _msecs / 0x10000000000 & 0xff;
    b[i++] = _msecs / 0x100000000 & 0xff;
    b[i++] = _msecs / 0x1000000 & 0xff;
    b[i++] = _msecs / 0x10000 & 0xff;
    b[i++] = _msecs / 0x100 & 0xff;
    b[i++] = _msecs & 0xff;
    // [byte 6] - set 4 bits of version (7) with first 4 bits seq_hi
    b[i++] = seqHigh >>> 4 & 0x0f | 0x70;
    // [byte 7] remaining 8 bits of seq_hi
    b[i++] = seqHigh & 0xff;
    // [byte 8] - variant (2 bits), first 6 bits seq_low
    b[i++] = seqLow >>> 13 & 0x3f | 0x80;
    // [byte 9] 8 bits seq_low
    b[i++] = seqLow >>> 5 & 0xff;
    // [byte 10] remaining 5 bits seq_low, 3 bits random
    b[i++] = seqLow << 3 & 0xff | rnds[10] & 0x07;
    // [bytes 11-15] always random
    b[i++] = rnds[11];
    b[i++] = rnds[12];
    b[i++] = rnds[13];
    b[i++] = rnds[14];
    b[i++] = rnds[15];
    return buf || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeStringify"])(b);
}
const __TURBOPACK__default__export__ = v7;
}),
"[project]/node_modules/uuid/dist/esm-node/version.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/validate.js [app-route] (ecmascript)");
;
function version(uuid) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Invalid UUID');
    }
    return parseInt(uuid.slice(14, 15), 16);
}
const __TURBOPACK__default__export__ = version;
}),
"[project]/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$max$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "NIL",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$nil$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "parse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "stringify",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v1ToV6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1ToV6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v5$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v6ToV1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v6ToV1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "v7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v7$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "validate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "version",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$max$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/max.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$nil$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/nil.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/stringify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v1.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v1ToV6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v1ToV6.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v3.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v4.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v5$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v5.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v6$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v6.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v6ToV1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v6ToV1.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v7$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/v7.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/validate.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$version$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-node/version.js [app-route] (ecmascript)");
}),
"[project]/node_modules/standardwebhooks/dist/timing_safe_equal.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timingSafeEqual = void 0;
function assert(expr, msg = "") {
    if (!expr) {
        throw new Error(msg);
    }
}
function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
    }
    if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
    }
    assert(a instanceof DataView);
    assert(b instanceof DataView);
    const length = a.byteLength;
    let out = 0;
    let i = -1;
    while(++i < length){
        out |= a.getUint8(i) ^ b.getUint8(i);
    }
    return out === 0;
}
exports.timingSafeEqual = timingSafeEqual;
}),
"[project]/node_modules/standardwebhooks/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Webhook = exports.WebhookVerificationError = void 0;
const timing_safe_equal_1 = __turbopack_context__.r("[project]/node_modules/standardwebhooks/dist/timing_safe_equal.js [app-route] (ecmascript)");
const base64 = __turbopack_context__.r("[project]/node_modules/@stablelib/base64/lib/base64.js [app-route] (ecmascript)");
const sha256 = __turbopack_context__.r("[project]/node_modules/fast-sha256/sha256.js [app-route] (ecmascript)");
const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
class ExtendableError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, ExtendableError.prototype);
        this.name = "ExtendableError";
        this.stack = new Error(message).stack;
    }
}
class WebhookVerificationError extends ExtendableError {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, WebhookVerificationError.prototype);
        this.name = "WebhookVerificationError";
    }
}
exports.WebhookVerificationError = WebhookVerificationError;
class Webhook {
    constructor(secret, options){
        if (!secret) {
            throw new Error("Secret can't be empty.");
        }
        if ((options === null || options === void 0 ? void 0 : options.format) === "raw") {
            if (secret instanceof Uint8Array) {
                this.key = secret;
            } else {
                this.key = Uint8Array.from(secret, (c)=>c.charCodeAt(0));
            }
        } else {
            if (typeof secret !== "string") {
                throw new Error("Expected secret to be of type string");
            }
            if (secret.startsWith(Webhook.prefix)) {
                secret = secret.substring(Webhook.prefix.length);
            }
            this.key = base64.decode(secret);
        }
    }
    verify(payload, headers_) {
        const headers = {};
        for (const key of Object.keys(headers_)){
            headers[key.toLowerCase()] = headers_[key];
        }
        const msgId = headers["webhook-id"];
        const msgSignature = headers["webhook-signature"];
        const msgTimestamp = headers["webhook-timestamp"];
        if (!msgSignature || !msgId || !msgTimestamp) {
            throw new WebhookVerificationError("Missing required headers");
        }
        const timestamp = this.verifyTimestamp(msgTimestamp);
        const computedSignature = this.sign(msgId, timestamp, payload);
        const expectedSignature = computedSignature.split(",")[1];
        const passedSignatures = msgSignature.split(" ");
        const encoder = new globalThis.TextEncoder();
        for (const versionedSignature of passedSignatures){
            const [version, signature] = versionedSignature.split(",");
            if (version !== "v1") {
                continue;
            }
            if ((0, timing_safe_equal_1.timingSafeEqual)(encoder.encode(signature), encoder.encode(expectedSignature))) {
                return JSON.parse(payload.toString());
            }
        }
        throw new WebhookVerificationError("No matching signature found");
    }
    sign(msgId, timestamp, payload) {
        if (typeof payload === "string") {} else if (payload.constructor.name === "Buffer") {
            payload = payload.toString();
        } else {
            throw new Error("Expected payload to be of type string or Buffer.");
        }
        const encoder = new TextEncoder();
        const timestampNumber = Math.floor(timestamp.getTime() / 1000);
        const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
        const expectedSignature = base64.encode(sha256.hmac(this.key, toSign));
        return `v1,${expectedSignature}`;
    }
    verifyTimestamp(timestampHeader) {
        const now = Math.floor(Date.now() / 1000);
        const timestamp = parseInt(timestampHeader, 10);
        if (isNaN(timestamp)) {
            throw new WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too new");
        }
        return new Date(timestamp * 1000);
    }
}
exports.Webhook = Webhook;
Webhook.prefix = "whsec_";
}),
"[project]/node_modules/@stablelib/base64/lib/base64.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (b.hasOwnProperty(p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Package base64 implements Base64 encoding and decoding.
 */ // Invalid character used in decoding to indicate
// that the character to decode is out of range of
// alphabet and cannot be decoded.
var INVALID_BYTE = 256;
/**
 * Implements standard Base64 encoding.
 *
 * Operates in constant time.
 */ var Coder = function() {
    // TODO(dchest): methods to encode chunk-by-chunk.
    function Coder(_paddingCharacter) {
        if (_paddingCharacter === void 0) {
            _paddingCharacter = "=";
        }
        this._paddingCharacter = _paddingCharacter;
    }
    Coder.prototype.encodedLength = function(length) {
        if (!this._paddingCharacter) {
            return (length * 8 + 5) / 6 | 0;
        }
        return (length + 2) / 3 * 4 | 0;
    };
    Coder.prototype.encode = function(data) {
        var out = "";
        var i = 0;
        for(; i < data.length - 2; i += 3){
            var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            out += this._encodeByte(c >>> 1 * 6 & 63);
            out += this._encodeByte(c >>> 0 * 6 & 63);
        }
        var left = data.length - i;
        if (left > 0) {
            var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            if (left === 2) {
                out += this._encodeByte(c >>> 1 * 6 & 63);
            } else {
                out += this._paddingCharacter || "";
            }
            out += this._paddingCharacter || "";
        }
        return out;
    };
    Coder.prototype.maxDecodedLength = function(length) {
        if (!this._paddingCharacter) {
            return (length * 6 + 7) / 8 | 0;
        }
        return length / 4 * 3 | 0;
    };
    Coder.prototype.decodedLength = function(s) {
        return this.maxDecodedLength(s.length - this._getPaddingLength(s));
    };
    Coder.prototype.decode = function(s) {
        if (s.length === 0) {
            return new Uint8Array(0);
        }
        var paddingLength = this._getPaddingLength(s);
        var length = s.length - paddingLength;
        var out = new Uint8Array(this.maxDecodedLength(length));
        var op = 0;
        var i = 0;
        var haveBad = 0;
        var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
        for(; i < length - 4; i += 4){
            v0 = this._decodeChar(s.charCodeAt(i + 0));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v0 << 2 | v1 >>> 4;
            out[op++] = v1 << 4 | v2 >>> 2;
            out[op++] = v2 << 6 | v3;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
            haveBad |= v2 & INVALID_BYTE;
            haveBad |= v3 & INVALID_BYTE;
        }
        if (i < length - 1) {
            v0 = this._decodeChar(s.charCodeAt(i));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            out[op++] = v0 << 2 | v1 >>> 4;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
        }
        if (i < length - 2) {
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            out[op++] = v1 << 4 | v2 >>> 2;
            haveBad |= v2 & INVALID_BYTE;
        }
        if (i < length - 3) {
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v2 << 6 | v3;
            haveBad |= v3 & INVALID_BYTE;
        }
        if (haveBad !== 0) {
            throw new Error("Base64Coder: incorrect characters for decoding");
        }
        return out;
    };
    // Standard encoding have the following encoded/decoded ranges,
    // which we need to convert between.
    //
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  +   /
    // Index:   0 - 25                    26 - 51              52 - 61   62  63
    // ASCII:  65 - 90                    97 - 122             48 - 57   43  47
    //
    // Encode 6 bits in b into a new character.
    Coder.prototype._encodeByte = function(b) {
        // Encoding uses constant time operations as follows:
        //
        // 1. Define comparison of A with B using (A - B) >>> 8:
        //          if A > B, then result is positive integer
        //          if A <= B, then result is 0
        //
        // 2. Define selection of C or 0 using bitwise AND: X & C:
        //          if X == 0, then result is 0
        //          if X != 0, then result is C
        //
        // 3. Start with the smallest comparison (b >= 0), which is always
        //    true, so set the result to the starting ASCII value (65).
        //
        // 4. Continue comparing b to higher ASCII values, and selecting
        //    zero if comparison isn't true, otherwise selecting a value
        //    to add to result, which:
        //
        //          a) undoes the previous addition
        //          b) provides new value to add
        //
        var result = b;
        // b >= 0
        result += 65;
        // b > 25
        result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
        // b > 51
        result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
        // b > 61
        result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
        // b > 62
        result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
        return String.fromCharCode(result);
    };
    // Decode a character code into a byte.
    // Must return 256 if character is out of alphabet range.
    Coder.prototype._decodeChar = function(c) {
        // Decoding works similar to encoding: using the same comparison
        // function, but now it works on ranges: result is always incremented
        // by value, but this value becomes zero if the range is not
        // satisfied.
        //
        // Decoding starts with invalid value, 256, which is then
        // subtracted when the range is satisfied. If none of the ranges
        // apply, the function returns 256, which is then checked by
        // the caller to throw error.
        var result = INVALID_BYTE; // start with invalid character
        // c == 43 (c > 42 and c < 44)
        result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
        // c == 47 (c > 46 and c < 48)
        result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
        // c > 47 and c < 58
        result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
        // c > 64 and c < 91
        result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
        // c > 96 and c < 123
        result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
        return result;
    };
    Coder.prototype._getPaddingLength = function(s) {
        var paddingLength = 0;
        if (this._paddingCharacter) {
            for(var i = s.length - 1; i >= 0; i--){
                if (s[i] !== this._paddingCharacter) {
                    break;
                }
                paddingLength++;
            }
            if (s.length < 4 || paddingLength > 2) {
                throw new Error("Base64Coder: incorrect padding");
            }
        }
        return paddingLength;
    };
    return Coder;
}();
exports.Coder = Coder;
var stdCoder = new Coder();
function encode(data) {
    return stdCoder.encode(data);
}
exports.encode = encode;
function decode(s) {
    return stdCoder.decode(s);
}
exports.decode = decode;
/**
 * Implements URL-safe Base64 encoding.
 * (Same as Base64, but '+' is replaced with '-', and '/' with '_').
 *
 * Operates in constant time.
 */ var URLSafeCoder = function(_super) {
    __extends(URLSafeCoder, _super);
    function URLSafeCoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // URL-safe encoding have the following encoded/decoded ranges:
    //
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  -   _
    // Index:   0 - 25                    26 - 51              52 - 61   62  63
    // ASCII:  65 - 90                    97 - 122             48 - 57   45  95
    //
    URLSafeCoder.prototype._encodeByte = function(b) {
        var result = b;
        // b >= 0
        result += 65;
        // b > 25
        result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
        // b > 51
        result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
        // b > 61
        result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
        // b > 62
        result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
        return String.fromCharCode(result);
    };
    URLSafeCoder.prototype._decodeChar = function(c) {
        var result = INVALID_BYTE;
        // c == 45 (c > 44 and c < 46)
        result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
        // c == 95 (c > 94 and c < 96)
        result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
        // c > 47 and c < 58
        result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
        // c > 64 and c < 91
        result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
        // c > 96 and c < 123
        result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
        return result;
    };
    return URLSafeCoder;
}(Coder);
exports.URLSafeCoder = URLSafeCoder;
var urlSafeCoder = new URLSafeCoder();
function encodeURLSafe(data) {
    return urlSafeCoder.encode(data);
}
exports.encodeURLSafe = encodeURLSafe;
function decodeURLSafe(s) {
    return urlSafeCoder.decode(s);
}
exports.decodeURLSafe = decodeURLSafe;
exports.encodedLength = function(length) {
    return stdCoder.encodedLength(length);
};
exports.maxDecodedLength = function(length) {
    return stdCoder.maxDecodedLength(length);
};
exports.decodedLength = function(s) {
    return stdCoder.decodedLength(s);
};
}),
"[project]/node_modules/fast-sha256/sha256.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function(root, factory) {
    // Hack to make all exports of this module sha256 function object properties.
    var exports = {};
    factory(exports);
    var sha256 = exports["default"];
    for(var k in exports){
        sha256[k] = exports[k];
    }
    if (("TURBOPACK compile-time value", "object") === 'object' && typeof module.exports === 'object') {
        module.exports = sha256;
    } else if (typeof define === 'function' && define.amd) {
        ((r)=>r !== undefined && __turbopack_context__.v(r))(function() {
            return sha256;
        }(__turbopack_context__.r, exports, module));
    } else {
        root.sha256 = sha256;
    }
})(/*TURBOPACK member replacement*/ __turbopack_context__.e, function(exports) {
    "use strict";
    exports.__esModule = true;
    // SHA-256 (+ HMAC and PBKDF2) for JavaScript.
    //
    // Written in 2014-2016 by Dmitry Chestnykh.
    // Public domain, no warranty.
    //
    // Functions (accept and return Uint8Arrays):
    //
    //   sha256(message) -> hash
    //   sha256.hmac(key, message) -> mac
    //   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
    //
    //  Classes:
    //
    //   new sha256.Hash()
    //   new sha256.HMAC(key)
    //
    exports.digestLength = 32;
    exports.blockSize = 64;
    // SHA-256 constants
    var K = new Uint32Array([
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0x0fc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x06ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
    ]);
    function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while(len >= 64){
            a = v[0];
            b = v[1];
            c = v[2];
            d = v[3];
            e = v[4];
            f = v[5];
            g = v[6];
            h = v[7];
            for(i = 0; i < 16; i++){
                j = pos + i * 4;
                w[i] = (p[j] & 0xff) << 24 | (p[j + 1] & 0xff) << 16 | (p[j + 2] & 0xff) << 8 | p[j + 3] & 0xff;
            }
            for(i = 16; i < 64; i++){
                u = w[i - 2];
                t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
                u = w[i - 15];
                t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
                w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
            }
            for(i = 0; i < 64; i++){
                t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
                t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
                h = g;
                g = f;
                f = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
            }
            v[0] += a;
            v[1] += b;
            v[2] += c;
            v[3] += d;
            v[4] += e;
            v[5] += f;
            v[6] += g;
            v[7] += h;
            pos += 64;
            len -= 64;
        }
        return pos;
    }
    // Hash implements SHA256 hash algorithm.
    var Hash = function() {
        function Hash() {
            this.digestLength = exports.digestLength;
            this.blockSize = exports.blockSize;
            // Note: Int32Array is used instead of Uint32Array for performance reasons.
            this.state = new Int32Array(8); // hash state
            this.temp = new Int32Array(64); // temporary state
            this.buffer = new Uint8Array(128); // buffer for data to hash
            this.bufferLength = 0; // number of bytes in buffer
            this.bytesHashed = 0; // number of total bytes hashed
            this.finished = false; // indicates whether the hash was finalized
            this.reset();
        }
        // Resets hash state making it possible
        // to re-use this instance to hash other data.
        Hash.prototype.reset = function() {
            this.state[0] = 0x6a09e667;
            this.state[1] = 0xbb67ae85;
            this.state[2] = 0x3c6ef372;
            this.state[3] = 0xa54ff53a;
            this.state[4] = 0x510e527f;
            this.state[5] = 0x9b05688c;
            this.state[6] = 0x1f83d9ab;
            this.state[7] = 0x5be0cd19;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
        };
        // Cleans internal buffers and re-initializes hash state.
        Hash.prototype.clean = function() {
            for(var i = 0; i < this.buffer.length; i++){
                this.buffer[i] = 0;
            }
            for(var i = 0; i < this.temp.length; i++){
                this.temp[i] = 0;
            }
            this.reset();
        };
        // Updates hash state with the given data.
        //
        // Optionally, length of the data can be specified to hash
        // fewer bytes than data.length.
        //
        // Throws error when trying to update already finalized hash:
        // instance must be reset to use it again.
        Hash.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
                dataLength = data.length;
            }
            if (this.finished) {
                throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
                while(this.bufferLength < 64 && dataLength > 0){
                    this.buffer[this.bufferLength++] = data[dataPos++];
                    dataLength--;
                }
                if (this.bufferLength === 64) {
                    hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                    this.bufferLength = 0;
                }
            }
            if (dataLength >= 64) {
                dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
                dataLength %= 64;
            }
            while(dataLength > 0){
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            return this;
        };
        // Finalizes hash state and puts hash into out.
        //
        // If hash was already finalized, puts the same value.
        Hash.prototype.finish = function(out) {
            if (!this.finished) {
                var bytesHashed = this.bytesHashed;
                var left = this.bufferLength;
                var bitLenHi = bytesHashed / 0x20000000 | 0;
                var bitLenLo = bytesHashed << 3;
                var padLength = bytesHashed % 64 < 56 ? 64 : 128;
                this.buffer[left] = 0x80;
                for(var i = left + 1; i < padLength - 8; i++){
                    this.buffer[i] = 0;
                }
                this.buffer[padLength - 8] = bitLenHi >>> 24 & 0xff;
                this.buffer[padLength - 7] = bitLenHi >>> 16 & 0xff;
                this.buffer[padLength - 6] = bitLenHi >>> 8 & 0xff;
                this.buffer[padLength - 5] = bitLenHi >>> 0 & 0xff;
                this.buffer[padLength - 4] = bitLenLo >>> 24 & 0xff;
                this.buffer[padLength - 3] = bitLenLo >>> 16 & 0xff;
                this.buffer[padLength - 2] = bitLenLo >>> 8 & 0xff;
                this.buffer[padLength - 1] = bitLenLo >>> 0 & 0xff;
                hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
                this.finished = true;
            }
            for(var i = 0; i < 8; i++){
                out[i * 4 + 0] = this.state[i] >>> 24 & 0xff;
                out[i * 4 + 1] = this.state[i] >>> 16 & 0xff;
                out[i * 4 + 2] = this.state[i] >>> 8 & 0xff;
                out[i * 4 + 3] = this.state[i] >>> 0 & 0xff;
            }
            return this;
        };
        // Returns the final hash digest.
        Hash.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
        };
        // Internal function for use in HMAC for optimization.
        Hash.prototype._saveState = function(out) {
            for(var i = 0; i < this.state.length; i++){
                out[i] = this.state[i];
            }
        };
        // Internal function for use in HMAC for optimization.
        Hash.prototype._restoreState = function(from, bytesHashed) {
            for(var i = 0; i < this.state.length; i++){
                this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
        };
        return Hash;
    }();
    exports.Hash = Hash;
    // HMAC implements HMAC-SHA256 message authentication algorithm.
    var HMAC = function() {
        function HMAC(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
                new Hash().update(key).finish(pad).clean();
            } else {
                for(var i = 0; i < key.length; i++){
                    pad[i] = key[i];
                }
            }
            for(var i = 0; i < pad.length; i++){
                pad[i] ^= 0x36;
            }
            this.inner.update(pad);
            for(var i = 0; i < pad.length; i++){
                pad[i] ^= 0x36 ^ 0x5c;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for(var i = 0; i < pad.length; i++){
                pad[i] = 0;
            }
        }
        // Returns HMAC state to the state initialized with key
        // to make it possible to run HMAC over the other data with the same
        // key without creating a new instance.
        HMAC.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
        };
        // Cleans HMAC state.
        HMAC.prototype.clean = function() {
            for(var i = 0; i < this.istate.length; i++){
                this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
        };
        // Updates state with provided data.
        HMAC.prototype.update = function(data) {
            this.inner.update(data);
            return this;
        };
        // Finalizes HMAC and puts the result in out.
        HMAC.prototype.finish = function(out) {
            if (this.outer.finished) {
                this.outer.finish(out);
            } else {
                this.inner.finish(out);
                this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
        };
        // Returns message authentication code.
        HMAC.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
        };
        return HMAC;
    }();
    exports.HMAC = HMAC;
    // Returns SHA256 hash of data.
    function hash(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
    }
    exports.hash = hash;
    // Function hash is both available as module.hash and as default export.
    exports["default"] = hash;
    // Returns HMAC-SHA256 of data under the key.
    function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
    }
    exports.hmac = hmac;
    // Fills hkdf buffer like this:
    // T(1) = HMAC-Hash(PRK, T(0) | info | 0x01)
    function fillBuffer(buffer, hmac, info, counter) {
        // Counter is a byte value: check if it overflowed.
        var num = counter[0];
        if (num === 0) {
            throw new Error("hkdf: cannot expand more");
        }
        // Prepare HMAC instance for new data with old key.
        hmac.reset();
        // Hash in previous output if it was generated
        // (i.e. counter is greater than 1).
        if (num > 1) {
            hmac.update(buffer);
        }
        // Hash in info if it exists.
        if (info) {
            hmac.update(info);
        }
        // Hash in the counter.
        hmac.update(counter);
        // Output result to buffer and clean HMAC instance.
        hmac.finish(buffer);
        // Increment counter inside typed array, this works properly.
        counter[0]++;
    }
    var hkdfSalt = new Uint8Array(exports.digestLength); // Filled with zeroes.
    function hkdf(key, salt, info, length) {
        if (salt === void 0) {
            salt = hkdfSalt;
        }
        if (length === void 0) {
            length = 32;
        }
        var counter = new Uint8Array([
            1
        ]);
        // HKDF-Extract uses salt as HMAC key, and key as data.
        var okm = hmac(salt, key);
        // Initialize HMAC for expanding with extracted key.
        // Ensure no collisions with `hmac` function.
        var hmac_ = new HMAC(okm);
        // Allocate buffer.
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for(var i = 0; i < length; i++){
            if (bufpos === buffer.length) {
                fillBuffer(buffer, hmac_, info, counter);
                bufpos = 0;
            }
            out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
    }
    exports.hkdf = hkdf;
    // Derives a key from password and salt using PBKDF2-HMAC-SHA256
    // with the given number of iterations.
    //
    // The number of bytes returned is equal to dkLen.
    //
    // (For better security, avoid dkLen greater than hash length - 32 bytes).
    function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for(var i = 0; i * len < dkLen; i++){
            var c = i + 1;
            ctr[0] = c >>> 24 & 0xff;
            ctr[1] = c >>> 16 & 0xff;
            ctr[2] = c >>> 8 & 0xff;
            ctr[3] = c >>> 0 & 0xff;
            prf.reset();
            prf.update(salt);
            prf.update(ctr);
            prf.finish(u);
            for(var j = 0; j < len; j++){
                t[j] = u[j];
            }
            for(var j = 2; j <= iterations; j++){
                prf.reset();
                prf.update(u).finish(u);
                for(var k = 0; k < len; k++){
                    t[k] ^= u[k];
                }
            }
            for(var j = 0; j < len && i * len + j < dkLen; j++){
                dk[i * len + j] = t[j];
            }
        }
        for(var i = 0; i < len; i++){
            t[i] = u[i] = 0;
        }
        for(var i = 0; i < 4; i++){
            ctr[i] = 0;
        }
        prf.clean();
        return dk;
    }
    exports.pbkdf2 = pbkdf2;
});
}),
"[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Resend",
    ()=>Resend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postal$2d$mime$2f$src$2f$postal$2d$mime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/postal-mime/src/postal-mime.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$svix$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/svix/dist/index.js [app-route] (ecmascript)");
;
;
//#region package.json
var version = "6.11.0";
//#endregion
//#region src/common/utils/build-pagination-query.ts
/**
* Builds a query string from pagination options
* @param options - Pagination options containing limit and either after or before (but not both)
* @returns Query string (without leading '?') or empty string if no options
*/ function buildPaginationQuery(options) {
    const searchParams = new URLSearchParams();
    if (options.limit !== void 0) searchParams.set("limit", options.limit.toString());
    if ("after" in options && options.after !== void 0) searchParams.set("after", options.after);
    if ("before" in options && options.before !== void 0) searchParams.set("before", options.before);
    return searchParams.toString();
}
//#endregion
//#region src/api-keys/api-keys.ts
var ApiKeys = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload, options = {}) {
        return await this.resend.post("/api-keys", payload, options);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/api-keys?${queryString}` : "/api-keys";
        return await this.resend.get(url);
    }
    async remove(id) {
        return await this.resend.delete(`/api-keys/${id}`);
    }
};
//#endregion
//#region src/automation-runs/automation-runs.ts
var AutomationRuns = class {
    constructor(resend){
        this.resend = resend;
    }
    async get(options) {
        return await this.resend.get(`/automations/${options.automationId}/runs/${options.runId}`);
    }
    async list(options) {
        const queryString = buildPaginationQuery(options);
        const searchParams = new URLSearchParams(queryString);
        if (options.status) {
            const statusValue = Array.isArray(options.status) ? options.status.join(",") : options.status;
            searchParams.set("status", statusValue);
        }
        const qs = searchParams.toString();
        const url = qs ? `/automations/${options.automationId}/runs?${qs}` : `/automations/${options.automationId}/runs`;
        return await this.resend.get(url);
    }
};
//#endregion
//#region src/common/utils/parse-automation-to-api-options.ts
function parseStepConfig(step) {
    switch(step.type){
        case "trigger":
            return {
                key: step.key,
                type: step.type,
                config: {
                    event_name: step.config.eventName
                }
            };
        case "delay":
            return {
                key: step.key,
                type: step.type,
                config: step.config
            };
        case "send_email":
            return {
                key: step.key,
                type: step.type,
                config: {
                    template: step.config.template,
                    subject: step.config.subject,
                    from: step.config.from,
                    reply_to: step.config.replyTo
                }
            };
        case "wait_for_event":
            return {
                key: step.key,
                type: step.type,
                config: {
                    event_name: step.config.eventName,
                    timeout: step.config.timeout,
                    filter_rule: step.config.filterRule
                }
            };
        case "condition":
            return {
                key: step.key,
                type: step.type,
                config: step.config
            };
        case "contact_update":
            return {
                key: step.key,
                type: step.type,
                config: {
                    first_name: step.config.firstName,
                    last_name: step.config.lastName,
                    unsubscribed: step.config.unsubscribed,
                    properties: step.config.properties
                }
            };
        case "contact_delete":
            return {
                key: step.key,
                type: step.type,
                config: step.config
            };
        case "add_to_segment":
            return {
                key: step.key,
                type: step.type,
                config: {
                    segment_id: step.config.segmentId
                }
            };
    }
}
function parseConnection(connection) {
    return {
        from: connection.from,
        to: connection.to,
        type: connection.type
    };
}
function parseAutomationToApiOptions(automation) {
    return {
        name: automation.name,
        status: automation.status,
        steps: automation.steps.map(parseStepConfig),
        connections: automation.connections.map(parseConnection)
    };
}
function parseEventToApiOptions(event) {
    return {
        event: event.event,
        contact_id: event.contactId,
        email: event.email,
        payload: event.payload
    };
}
//#endregion
//#region src/automations/automations.ts
var Automations = class {
    constructor(resend){
        this.resend = resend;
        this.runs = new AutomationRuns(this.resend);
    }
    async create(payload) {
        return await this.resend.post("/automations", parseAutomationToApiOptions(payload));
    }
    async list(options = {}) {
        const params = [
            buildPaginationQuery(options)
        ];
        if (options.status) params.push(`status=${encodeURIComponent(options.status)}`);
        const qs = params.filter(Boolean).join("&");
        const url = qs ? `/automations?${qs}` : "/automations";
        return await this.resend.get(url);
    }
    async get(id) {
        return await this.resend.get(`/automations/${id}`);
    }
    async remove(id) {
        return await this.resend.delete(`/automations/${id}`);
    }
    async update(id, payload) {
        const apiPayload = {};
        if (payload.name !== void 0) apiPayload.name = payload.name;
        if (payload.status !== void 0) apiPayload.status = payload.status;
        if (payload.steps !== void 0) apiPayload.steps = payload.steps.map(parseStepConfig);
        if (payload.connections !== void 0) apiPayload.connections = payload.connections.map(parseConnection);
        return await this.resend.patch(`/automations/${id}`, apiPayload);
    }
    async stop(id) {
        return await this.resend.post(`/automations/${id}/stop`);
    }
};
//#endregion
//#region src/common/utils/parse-email-to-api-options.ts
function parseAttachments(attachments) {
    return attachments?.map((attachment)=>({
            content: attachment.content,
            filename: attachment.filename,
            path: attachment.path,
            content_type: attachment.contentType,
            content_id: attachment.contentId
        }));
}
function parseEmailToApiOptions(email) {
    return {
        attachments: parseAttachments(email.attachments),
        bcc: email.bcc,
        cc: email.cc,
        from: email.from,
        headers: email.headers,
        html: email.html,
        reply_to: email.replyTo,
        scheduled_at: email.scheduledAt,
        subject: email.subject,
        tags: email.tags,
        text: email.text,
        to: email.to,
        template: email.template ? {
            id: email.template.id,
            variables: email.template.variables
        } : void 0,
        topic_id: email.topicId
    };
}
//#endregion
//#region src/render.ts
async function render(node) {
    let render;
    try {
        ({ render } = await Promise.resolve().then(()=>{
            const e = new Error("Cannot find module '@react-email/render'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }));
    } catch  {
        throw new Error("Failed to render React component. Make sure to install `@react-email/render` or `@react-email/components`.");
    }
    return render(node);
}
//#endregion
//#region src/batch/batch.ts
var Batch = class {
    constructor(resend){
        this.resend = resend;
    }
    async send(payload, options) {
        return this.create(payload, options);
    }
    async create(payload, options) {
        const emails = [];
        for (const email of payload){
            if (email.react) {
                email.html = await render(email.react);
                email.react = void 0;
            }
            emails.push(parseEmailToApiOptions(email));
        }
        return await this.resend.post("/emails/batch", emails, {
            ...options,
            headers: {
                "x-batch-validation": options?.batchValidation ?? "strict",
                ...options?.headers
            }
        });
    }
};
//#endregion
//#region src/broadcasts/broadcasts.ts
var Broadcasts = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload, options = {}) {
        if (payload.react) payload.html = await render(payload.react);
        return await this.resend.post("/broadcasts", {
            name: payload.name,
            segment_id: payload.segmentId,
            audience_id: payload.audienceId,
            preview_text: payload.previewText,
            from: payload.from,
            html: payload.html,
            reply_to: payload.replyTo,
            subject: payload.subject,
            text: payload.text,
            topic_id: payload.topicId,
            send: payload.send,
            scheduled_at: payload.scheduledAt
        }, options);
    }
    async send(id, payload) {
        return await this.resend.post(`/broadcasts/${id}/send`, {
            scheduled_at: payload?.scheduledAt
        });
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/broadcasts?${queryString}` : "/broadcasts";
        return await this.resend.get(url);
    }
    async get(id) {
        return await this.resend.get(`/broadcasts/${id}`);
    }
    async remove(id) {
        return await this.resend.delete(`/broadcasts/${id}`);
    }
    async update(id, payload) {
        if (payload.react) payload.html = await render(payload.react);
        return await this.resend.patch(`/broadcasts/${id}`, {
            name: payload.name,
            segment_id: payload.segmentId,
            audience_id: payload.audienceId,
            from: payload.from,
            html: payload.html,
            text: payload.text,
            subject: payload.subject,
            reply_to: payload.replyTo,
            preview_text: payload.previewText,
            topic_id: payload.topicId
        });
    }
};
//#endregion
//#region src/common/utils/parse-contact-properties-to-api-options.ts
function parseContactPropertyFromApi(contactProperty) {
    return {
        id: contactProperty.id,
        key: contactProperty.key,
        createdAt: contactProperty.created_at,
        type: contactProperty.type,
        fallbackValue: contactProperty.fallback_value
    };
}
function parseContactPropertyToApiOptions(contactProperty) {
    if ("key" in contactProperty) return {
        key: contactProperty.key,
        type: contactProperty.type,
        fallback_value: contactProperty.fallbackValue
    };
    return {
        fallback_value: contactProperty.fallbackValue
    };
}
//#endregion
//#region src/contact-properties/contact-properties.ts
var ContactProperties = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(options) {
        const apiOptions = parseContactPropertyToApiOptions(options);
        return await this.resend.post("/contact-properties", apiOptions);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/contact-properties?${queryString}` : "/contact-properties";
        const response = await this.resend.get(url);
        if (response.data) return {
            data: {
                ...response.data,
                data: response.data.data.map((apiContactProperty)=>parseContactPropertyFromApi(apiContactProperty))
            },
            headers: response.headers,
            error: null
        };
        return response;
    }
    async get(id) {
        if (!id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const response = await this.resend.get(`/contact-properties/${id}`);
        if (response.data) return {
            data: {
                object: "contact_property",
                ...parseContactPropertyFromApi(response.data)
            },
            headers: response.headers,
            error: null
        };
        return response;
    }
    async update(payload) {
        if (!payload.id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const apiOptions = parseContactPropertyToApiOptions(payload);
        return await this.resend.patch(`/contact-properties/${payload.id}`, apiOptions);
    }
    async remove(id) {
        if (!id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        return await this.resend.delete(`/contact-properties/${id}`);
    }
};
//#endregion
//#region src/contacts/segments/contact-segments.ts
var ContactSegments = class {
    constructor(resend){
        this.resend = resend;
    }
    async list(options) {
        if (!options.contactId && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const identifier = options.email ? options.email : options.contactId;
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/contacts/${identifier}/segments?${queryString}` : `/contacts/${identifier}/segments`;
        return await this.resend.get(url);
    }
    async add(options) {
        if (!options.contactId && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const identifier = options.email ? options.email : options.contactId;
        return this.resend.post(`/contacts/${identifier}/segments/${options.segmentId}`);
    }
    async remove(options) {
        if (!options.contactId && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const identifier = options.email ? options.email : options.contactId;
        return this.resend.delete(`/contacts/${identifier}/segments/${options.segmentId}`);
    }
};
//#endregion
//#region src/contacts/topics/contact-topics.ts
var ContactTopics = class {
    constructor(resend){
        this.resend = resend;
    }
    async update(payload) {
        if (!payload.id && !payload.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const identifier = payload.email ? payload.email : payload.id;
        return this.resend.patch(`/contacts/${identifier}/topics`, payload.topics);
    }
    async list(options) {
        if (!options.id && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        const identifier = options.email ? options.email : options.id;
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/contacts/${identifier}/topics?${queryString}` : `/contacts/${identifier}/topics`;
        return this.resend.get(url);
    }
};
//#endregion
//#region src/contacts/contacts.ts
var Contacts = class {
    constructor(resend){
        this.resend = resend;
        this.topics = new ContactTopics(this.resend);
        this.segments = new ContactSegments(this.resend);
    }
    async create(payload, options = {}) {
        if ("audienceId" in payload) {
            if ("segments" in payload || "topics" in payload) return {
                data: null,
                headers: null,
                error: {
                    message: "`audienceId` is deprecated, and cannot be used together with `segments` or `topics`. Use `segments` instead to add one or more segments to the new contact.",
                    statusCode: null,
                    name: "invalid_parameter"
                }
            };
            return await this.resend.post(`/audiences/${payload.audienceId}/contacts`, {
                unsubscribed: payload.unsubscribed,
                email: payload.email,
                first_name: payload.firstName,
                last_name: payload.lastName,
                properties: payload.properties
            }, options);
        }
        return await this.resend.post("/contacts", {
            unsubscribed: payload.unsubscribed,
            email: payload.email,
            first_name: payload.firstName,
            last_name: payload.lastName,
            properties: payload.properties,
            segments: payload.segments,
            topics: payload.topics
        }, options);
    }
    async list(options = {}) {
        const segmentId = options.segmentId ?? options.audienceId;
        if (!segmentId) {
            const queryString = buildPaginationQuery(options);
            const url = queryString ? `/contacts?${queryString}` : "/contacts";
            return await this.resend.get(url);
        }
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/segments/${segmentId}/contacts?${queryString}` : `/segments/${segmentId}/contacts`;
        return await this.resend.get(url);
    }
    async get(options) {
        if (typeof options === "string") return this.resend.get(`/contacts/${options}`);
        if (!options.id && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        if (!options.audienceId) return this.resend.get(`/contacts/${options?.email ? options?.email : options?.id}`);
        return this.resend.get(`/audiences/${options.audienceId}/contacts/${options?.email ? options?.email : options?.id}`);
    }
    async update(options) {
        if (!options.id && !options.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        if (!options.audienceId) return await this.resend.patch(`/contacts/${options?.email ? options?.email : options?.id}`, {
            unsubscribed: options.unsubscribed,
            first_name: options.firstName,
            last_name: options.lastName,
            properties: options.properties
        });
        return await this.resend.patch(`/audiences/${options.audienceId}/contacts/${options?.email ? options?.email : options?.id}`, {
            unsubscribed: options.unsubscribed,
            first_name: options.firstName,
            last_name: options.lastName,
            properties: options.properties
        });
    }
    async remove(payload) {
        if (typeof payload === "string") return this.resend.delete(`/contacts/${payload}`);
        if (!payload.id && !payload.email) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` or `email` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        if (!payload.audienceId) return this.resend.delete(`/contacts/${payload?.email ? payload?.email : payload?.id}`);
        return this.resend.delete(`/audiences/${payload.audienceId}/contacts/${payload?.email ? payload?.email : payload?.id}`);
    }
};
//#endregion
//#region src/common/utils/parse-domain-to-api-options.ts
function parseDomainToApiOptions(domain) {
    return {
        name: domain.name,
        region: domain.region,
        custom_return_path: domain.customReturnPath,
        capabilities: domain.capabilities,
        open_tracking: domain.openTracking,
        click_tracking: domain.clickTracking,
        tls: domain.tls
    };
}
//#endregion
//#region src/domains/domains.ts
var Domains = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload, options = {}) {
        return await this.resend.post("/domains", parseDomainToApiOptions(payload), options);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/domains?${queryString}` : "/domains";
        return await this.resend.get(url);
    }
    async get(id) {
        return await this.resend.get(`/domains/${id}`);
    }
    async update(payload) {
        return await this.resend.patch(`/domains/${payload.id}`, {
            click_tracking: payload.clickTracking,
            open_tracking: payload.openTracking,
            tls: payload.tls,
            capabilities: payload.capabilities
        });
    }
    async remove(id) {
        return await this.resend.delete(`/domains/${id}`);
    }
    async verify(id) {
        return await this.resend.post(`/domains/${id}/verify`);
    }
};
//#endregion
//#region src/emails/attachments/attachments.ts
var Attachments$1 = class {
    constructor(resend){
        this.resend = resend;
    }
    async get(options) {
        const { emailId, id } = options;
        return await this.resend.get(`/emails/${emailId}/attachments/${id}`);
    }
    async list(options) {
        const { emailId } = options;
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/emails/${emailId}/attachments?${queryString}` : `/emails/${emailId}/attachments`;
        return await this.resend.get(url);
    }
};
//#endregion
//#region src/emails/receiving/attachments/attachments.ts
var Attachments = class {
    constructor(resend){
        this.resend = resend;
    }
    async get(options) {
        const { emailId, id } = options;
        return await this.resend.get(`/emails/receiving/${emailId}/attachments/${id}`);
    }
    async list(options) {
        const { emailId } = options;
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/emails/receiving/${emailId}/attachments?${queryString}` : `/emails/receiving/${emailId}/attachments`;
        return await this.resend.get(url);
    }
};
//#endregion
//#region src/emails/receiving/receiving.ts
var Receiving = class {
    constructor(resend){
        this.resend = resend;
        this.attachments = new Attachments(resend);
    }
    async get(id) {
        return await this.resend.get(`/emails/receiving/${id}`);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/emails/receiving?${queryString}` : "/emails/receiving";
        return await this.resend.get(url);
    }
    async forward(options) {
        const { emailId, to, from } = options;
        const passthrough = options.passthrough !== false;
        const emailResponse = await this.get(emailId);
        if (emailResponse.error) return {
            data: null,
            error: emailResponse.error,
            headers: emailResponse.headers
        };
        const email = emailResponse.data;
        const originalSubject = email.subject || "(no subject)";
        if (passthrough) return this.forwardPassthrough(email, {
            to,
            from,
            subject: originalSubject
        });
        const forwardSubject = originalSubject.startsWith("Fwd:") ? originalSubject : `Fwd: ${originalSubject}`;
        return this.forwardWrapped(email, {
            to,
            from,
            subject: forwardSubject,
            text: "text" in options ? options.text : void 0,
            html: "html" in options ? options.html : void 0
        });
    }
    async forwardPassthrough(email, options) {
        const { to, from, subject } = options;
        if (!email.raw?.download_url) return {
            data: null,
            error: {
                name: "validation_error",
                message: "Raw email content is not available for this email",
                statusCode: 400
            },
            headers: null
        };
        const rawResponse = await fetch(email.raw.download_url);
        if (!rawResponse.ok) return {
            data: null,
            error: {
                name: "application_error",
                message: "Failed to download raw email content",
                statusCode: rawResponse.status
            },
            headers: null
        };
        const rawEmailContent = await rawResponse.text();
        const parsed = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$postal$2d$mime$2f$src$2f$postal$2d$mime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].parse(rawEmailContent, {
            attachmentEncoding: "base64"
        });
        const attachments = parsed.attachments.map((attachment)=>{
            const contentId = attachment.contentId ? attachment.contentId.replace(/^<|>$/g, "") : void 0;
            return {
                filename: attachment.filename,
                content: attachment.content.toString(),
                content_type: attachment.mimeType,
                content_id: contentId || void 0
            };
        });
        return await this.resend.post("/emails", {
            from,
            to,
            subject,
            text: parsed.text || void 0,
            html: parsed.html || void 0,
            attachments: attachments.length > 0 ? attachments : void 0
        });
    }
    async forwardWrapped(email, options) {
        const { to, from, subject, text, html } = options;
        if (!email.raw?.download_url) return {
            data: null,
            error: {
                name: "validation_error",
                message: "Raw email content is not available for this email",
                statusCode: 400
            },
            headers: null
        };
        const rawResponse = await fetch(email.raw.download_url);
        if (!rawResponse.ok) return {
            data: null,
            error: {
                name: "application_error",
                message: "Failed to download raw email content",
                statusCode: rawResponse.status
            },
            headers: null
        };
        const rawEmailContent = await rawResponse.text();
        return await this.resend.post("/emails", {
            from,
            to,
            subject,
            text,
            html,
            attachments: [
                {
                    filename: "forwarded_message.eml",
                    content: Buffer.from(rawEmailContent).toString("base64"),
                    content_type: "message/rfc822"
                }
            ]
        });
    }
};
//#endregion
//#region src/emails/emails.ts
var Emails = class {
    constructor(resend){
        this.resend = resend;
        this.attachments = new Attachments$1(resend);
        this.receiving = new Receiving(resend);
    }
    async send(payload, options = {}) {
        return this.create(payload, options);
    }
    async create(payload, options = {}) {
        if (payload.react) payload.html = await render(payload.react);
        return await this.resend.post("/emails", parseEmailToApiOptions(payload), options);
    }
    async get(id) {
        return await this.resend.get(`/emails/${id}`);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/emails?${queryString}` : "/emails";
        return await this.resend.get(url);
    }
    async update(payload) {
        return await this.resend.patch(`/emails/${payload.id}`, {
            scheduled_at: payload.scheduledAt
        });
    }
    async cancel(id) {
        return await this.resend.post(`/emails/${id}/cancel`);
    }
};
//#endregion
//#region src/events/events.ts
var Events = class {
    constructor(resend){
        this.resend = resend;
    }
    async send(payload) {
        return await this.resend.post("/events/send", parseEventToApiOptions(payload));
    }
    async create(payload) {
        return await this.resend.post("/events", payload);
    }
    async get(identifier) {
        return await this.resend.get(`/events/${encodeURIComponent(identifier)}`);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/events?${queryString}` : "/events";
        return await this.resend.get(url);
    }
    async update(identifier, payload) {
        return await this.resend.patch(`/events/${encodeURIComponent(identifier)}`, payload);
    }
    async remove(identifier) {
        return await this.resend.delete(`/events/${encodeURIComponent(identifier)}`);
    }
};
//#endregion
//#region src/logs/logs.ts
var Logs = class {
    constructor(resend){
        this.resend = resend;
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/logs?${queryString}` : "/logs";
        return await this.resend.get(url);
    }
    async get(id) {
        return await this.resend.get(`/logs/${id}`);
    }
};
//#endregion
//#region src/segments/segments.ts
var Segments = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload, options = {}) {
        return await this.resend.post("/segments", payload, options);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/segments?${queryString}` : "/segments";
        return await this.resend.get(url);
    }
    async get(id) {
        return await this.resend.get(`/segments/${id}`);
    }
    async remove(id) {
        return await this.resend.delete(`/segments/${id}`);
    }
};
//#endregion
//#region src/common/utils/get-pagination-query-properties.ts
function getPaginationQueryProperties(options = {}) {
    const query = new URLSearchParams();
    if (options.before) query.set("before", options.before);
    if (options.after) query.set("after", options.after);
    if (options.limit) query.set("limit", options.limit.toString());
    return query.size > 0 ? `?${query.toString()}` : "";
}
//#endregion
//#region src/common/utils/parse-template-to-api-options.ts
function parseVariables(variables) {
    return variables?.map((variable)=>({
            key: variable.key,
            type: variable.type,
            fallback_value: variable.fallbackValue
        }));
}
function parseTemplateToApiOptions(template) {
    return {
        name: "name" in template ? template.name : void 0,
        subject: template.subject,
        html: template.html,
        text: template.text,
        alias: template.alias,
        from: template.from,
        reply_to: template.replyTo,
        variables: parseVariables(template.variables)
    };
}
//#endregion
//#region src/templates/chainable-template-result.ts
var ChainableTemplateResult = class {
    constructor(promise, publishFn){
        this.promise = promise;
        this.publishFn = publishFn;
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    async publish() {
        const { data, error } = await this.promise;
        if (error) return {
            data: null,
            headers: null,
            error
        };
        return this.publishFn(data.id);
    }
};
//#endregion
//#region src/templates/templates.ts
var Templates = class {
    constructor(resend){
        this.resend = resend;
    }
    create(payload) {
        return new ChainableTemplateResult(this.performCreate(payload), this.publish.bind(this));
    }
    async performCreate(payload) {
        if (payload.react) {
            if (!this.renderAsync) try {
                const { renderAsync } = await Promise.resolve().then(()=>{
                    const e = new Error("Cannot find module '@react-email/render'");
                    e.code = 'MODULE_NOT_FOUND';
                    throw e;
                });
                this.renderAsync = renderAsync;
            } catch  {
                throw new Error("Failed to render React component. Make sure to install `@react-email/render`");
            }
            payload.html = await this.renderAsync(payload.react);
        }
        return this.resend.post("/templates", parseTemplateToApiOptions(payload));
    }
    async remove(identifier) {
        return await this.resend.delete(`/templates/${identifier}`);
    }
    async get(identifier) {
        return await this.resend.get(`/templates/${identifier}`);
    }
    async list(options = {}) {
        return this.resend.get(`/templates${getPaginationQueryProperties(options)}`);
    }
    duplicate(identifier) {
        return new ChainableTemplateResult(this.resend.post(`/templates/${identifier}/duplicate`), this.publish.bind(this));
    }
    async publish(identifier) {
        return await this.resend.post(`/templates/${identifier}/publish`);
    }
    async update(identifier, payload) {
        return await this.resend.patch(`/templates/${identifier}`, parseTemplateToApiOptions(payload));
    }
};
//#endregion
//#region src/topics/topics.ts
var Topics = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload) {
        const { defaultSubscription, ...body } = payload;
        return await this.resend.post("/topics", {
            ...body,
            default_subscription: defaultSubscription
        });
    }
    async list() {
        return await this.resend.get("/topics");
    }
    async get(id) {
        if (!id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        return await this.resend.get(`/topics/${id}`);
    }
    async update(payload) {
        if (!payload.id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        return await this.resend.patch(`/topics/${payload.id}`, payload);
    }
    async remove(id) {
        if (!id) return {
            data: null,
            headers: null,
            error: {
                message: "Missing `id` field.",
                statusCode: null,
                name: "missing_required_field"
            }
        };
        return await this.resend.delete(`/topics/${id}`);
    }
};
//#endregion
//#region src/webhooks/webhooks.ts
var Webhooks = class {
    constructor(resend){
        this.resend = resend;
    }
    async create(payload, options = {}) {
        return await this.resend.post("/webhooks", payload, options);
    }
    async get(id) {
        return await this.resend.get(`/webhooks/${id}`);
    }
    async list(options = {}) {
        const queryString = buildPaginationQuery(options);
        const url = queryString ? `/webhooks?${queryString}` : "/webhooks";
        return await this.resend.get(url);
    }
    async update(id, payload) {
        return await this.resend.patch(`/webhooks/${id}`, payload);
    }
    async remove(id) {
        return await this.resend.delete(`/webhooks/${id}`);
    }
    verify(payload) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$svix$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Webhook"](payload.webhookSecret).verify(payload.payload, {
            "svix-id": payload.headers.id,
            "svix-timestamp": payload.headers.timestamp,
            "svix-signature": payload.headers.signature
        });
    }
};
//#endregion
//#region src/resend.ts
const defaultBaseUrl = "https://api.resend.com";
const defaultUserAgent = `resend-node:${version}`;
const baseUrl = typeof process !== "undefined" && process.env ? process.env.RESEND_BASE_URL || defaultBaseUrl : defaultBaseUrl;
const userAgent = typeof process !== "undefined" && process.env ? process.env.RESEND_USER_AGENT || defaultUserAgent : defaultUserAgent;
var Resend = class {
    constructor(key){
        this.key = key;
        this.segments = new Segments(this);
        this.apiKeys = new ApiKeys(this);
        this.audiences = this.segments;
        this.automations = new Automations(this);
        this.batch = new Batch(this);
        this.broadcasts = new Broadcasts(this);
        this.contactProperties = new ContactProperties(this);
        this.contacts = new Contacts(this);
        this.domains = new Domains(this);
        this.emails = new Emails(this);
        this.events = new Events(this);
        this.logs = new Logs(this);
        this.templates = new Templates(this);
        this.topics = new Topics(this);
        this.webhooks = new Webhooks(this);
        if (!key) {
            if (typeof process !== "undefined" && process.env) this.key = process.env.RESEND_API_KEY;
            if (!this.key) throw new Error("Missing API key. Pass it to the constructor `new Resend(\"re_123\")`");
        }
        this.headers = new Headers({
            Authorization: `Bearer ${this.key}`,
            "User-Agent": userAgent,
            "Content-Type": "application/json"
        });
    }
    async fetchRequest(path, options = {}) {
        try {
            const response = await fetch(`${baseUrl}${path}`, options);
            if (!response.ok) try {
                const rawError = await response.text();
                return {
                    data: null,
                    error: JSON.parse(rawError),
                    headers: Object.fromEntries(response.headers.entries())
                };
            } catch (err) {
                if (err instanceof SyntaxError) return {
                    data: null,
                    error: {
                        name: "application_error",
                        statusCode: response.status,
                        message: "Internal server error. We are unable to process your request right now, please try again later."
                    },
                    headers: Object.fromEntries(response.headers.entries())
                };
                const error = {
                    message: response.statusText,
                    statusCode: response.status,
                    name: "application_error"
                };
                if (err instanceof Error) return {
                    data: null,
                    error: {
                        ...error,
                        message: err.message
                    },
                    headers: Object.fromEntries(response.headers.entries())
                };
                return {
                    data: null,
                    error,
                    headers: Object.fromEntries(response.headers.entries())
                };
            }
            return {
                data: await response.json(),
                error: null,
                headers: Object.fromEntries(response.headers.entries())
            };
        } catch  {
            return {
                data: null,
                error: {
                    name: "application_error",
                    statusCode: null,
                    message: "Unable to fetch data. The request could not be resolved."
                },
                headers: null
            };
        }
    }
    async post(path, entity, options = {}) {
        const headers = new Headers(this.headers);
        if (options.headers) for (const [key, value] of new Headers(options.headers).entries())headers.set(key, value);
        if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(entity),
            ...options,
            headers
        };
        return this.fetchRequest(path, requestOptions);
    }
    async get(path, options = {}) {
        const headers = new Headers(this.headers);
        if (options.headers) for (const [key, value] of new Headers(options.headers).entries())headers.set(key, value);
        const requestOptions = {
            method: "GET",
            ...options,
            headers
        };
        return this.fetchRequest(path, requestOptions);
    }
    async put(path, entity, options = {}) {
        const headers = new Headers(this.headers);
        if (options.headers) for (const [key, value] of new Headers(options.headers).entries())headers.set(key, value);
        const requestOptions = {
            method: "PUT",
            body: JSON.stringify(entity),
            ...options,
            headers
        };
        return this.fetchRequest(path, requestOptions);
    }
    async patch(path, entity, options = {}) {
        const headers = new Headers(this.headers);
        if (options.headers) for (const [key, value] of new Headers(options.headers).entries())headers.set(key, value);
        const requestOptions = {
            method: "PATCH",
            body: JSON.stringify(entity),
            ...options,
            headers
        };
        return this.fetchRequest(path, requestOptions);
    }
    async delete(path, query) {
        const requestOptions = {
            method: "DELETE",
            body: JSON.stringify(query),
            headers: this.headers
        };
        return this.fetchRequest(path, requestOptions);
    }
};
;
}),
"[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose-8b99e611e7552af3", () => require("mongoose-8b99e611e7552af3"));

module.exports = mod;
}),
"[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concat",
    ()=>concat,
    "decoder",
    ()=>decoder,
    "encode",
    ()=>encode,
    "encoder",
    ()=>encoder,
    "uint32be",
    ()=>uint32be,
    "uint64be",
    ()=>uint64be
]);
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers){
        buf.set(buffer, i);
        i += buffer.length;
    }
    return buf;
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function encode(string) {
    const bytes = new Uint8Array(string.length);
    for(let i = 0; i < string.length; i++){
        const code = string.charCodeAt(i);
        if (code > 127) {
            throw new TypeError('non-ASCII string encountered in encode()');
        }
        bytes[i] = code;
    }
    return bytes;
}
}),
"[project]/node_modules/jose/dist/webapi/lib/base64.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeBase64",
    ()=>decodeBase64,
    "encodeBase64",
    ()=>encodeBase64
]);
function encodeBase64(input) {
    if (Uint8Array.prototype.toBase64) {
        return input.toBase64();
    }
    const CHUNK_SIZE = 0x8000;
    const arr = [];
    for(let i = 0; i < input.length; i += CHUNK_SIZE){
        arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(''));
}
function decodeBase64(encoded) {
    if (Uint8Array.fromBase64) {
        return Uint8Array.fromBase64(encoded);
    }
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
}),
"[project]/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/base64.js [app-route] (ecmascript)");
;
;
function decode(input) {
    if (Uint8Array.fromBase64) {
        return Uint8Array.fromBase64(typeof input === 'string' ? input : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(input), {
            alphabet: 'base64url'
        });
    }
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(encoded);
    }
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeBase64"])(encoded);
    } catch  {
        throw new TypeError('The input to be decoded is not correctly encoded.');
    }
}
function encode(input) {
    let unencoded = input;
    if (typeof unencoded === 'string') {
        unencoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(unencoded);
    }
    if (Uint8Array.prototype.toBase64) {
        return unencoded.toBase64({
            alphabet: 'base64url',
            omitPadding: true
        });
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$base64$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encodeBase64"])(unencoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
}),
"[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JOSEAlgNotAllowed",
    ()=>JOSEAlgNotAllowed,
    "JOSEError",
    ()=>JOSEError,
    "JOSENotSupported",
    ()=>JOSENotSupported,
    "JWEDecryptionFailed",
    ()=>JWEDecryptionFailed,
    "JWEInvalid",
    ()=>JWEInvalid,
    "JWKInvalid",
    ()=>JWKInvalid,
    "JWKSInvalid",
    ()=>JWKSInvalid,
    "JWKSMultipleMatchingKeys",
    ()=>JWKSMultipleMatchingKeys,
    "JWKSNoMatchingKey",
    ()=>JWKSNoMatchingKey,
    "JWKSTimeout",
    ()=>JWKSTimeout,
    "JWSInvalid",
    ()=>JWSInvalid,
    "JWSSignatureVerificationFailed",
    ()=>JWSSignatureVerificationFailed,
    "JWTClaimValidationFailed",
    ()=>JWTClaimValidationFailed,
    "JWTExpired",
    ()=>JWTExpired,
    "JWTInvalid",
    ()=>JWTInvalid
]);
class JOSEError extends Error {
    static code = 'ERR_JOSE_GENERIC';
    code = 'ERR_JOSE_GENERIC';
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JWTExpired extends JOSEError {
    static code = 'ERR_JWT_EXPIRED';
    code = 'ERR_JWT_EXPIRED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    static code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    code = 'ERR_JOSE_ALG_NOT_ALLOWED';
}
class JOSENotSupported extends JOSEError {
    static code = 'ERR_JOSE_NOT_SUPPORTED';
    code = 'ERR_JOSE_NOT_SUPPORTED';
}
class JWEDecryptionFailed extends JOSEError {
    static code = 'ERR_JWE_DECRYPTION_FAILED';
    code = 'ERR_JWE_DECRYPTION_FAILED';
    constructor(message = 'decryption operation failed', options){
        super(message, options);
    }
}
class JWEInvalid extends JOSEError {
    static code = 'ERR_JWE_INVALID';
    code = 'ERR_JWE_INVALID';
}
class JWSInvalid extends JOSEError {
    static code = 'ERR_JWS_INVALID';
    code = 'ERR_JWS_INVALID';
}
class JWTInvalid extends JOSEError {
    static code = 'ERR_JWT_INVALID';
    code = 'ERR_JWT_INVALID';
}
class JWKInvalid extends JOSEError {
    static code = 'ERR_JWK_INVALID';
    code = 'ERR_JWK_INVALID';
}
class JWKSInvalid extends JOSEError {
    static code = 'ERR_JWKS_INVALID';
    code = 'ERR_JWKS_INVALID';
}
class JWKSNoMatchingKey extends JOSEError {
    static code = 'ERR_JWKS_NO_MATCHING_KEY';
    code = 'ERR_JWKS_NO_MATCHING_KEY';
    constructor(message = 'no applicable key found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSMultipleMatchingKeys extends JOSEError {
    [Symbol.asyncIterator];
    static code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    constructor(message = 'multiple matching keys found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSTimeout extends JOSEError {
    static code = 'ERR_JWKS_TIMEOUT';
    code = 'ERR_JWKS_TIMEOUT';
    constructor(message = 'request timed out', options){
        super(message, options);
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    static code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    constructor(message = 'signature verification failed', options){
        super(message, options);
    }
}
}),
"[project]/node_modules/jose/dist/webapi/lib/crypto_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkEncCryptoKey",
    ()=>checkEncCryptoKey,
    "checkSigCryptoKey",
    ()=>checkSigCryptoKey
]);
const unusable = (name, prop = 'algorithm.name')=>new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
const isAlgorithm = (algorithm, name)=>algorithm.name === name;
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function checkHashLength(algorithm, expected) {
    const actual = getHashLength(algorithm.hash);
    if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
}
function getNamedCurve(alg) {
    switch(alg){
        case 'ES256':
            return 'P-256';
        case 'ES384':
            return 'P-384';
        case 'ES512':
            return 'P-521';
        default:
            throw new Error('unreachable');
    }
}
function checkUsage(key, usage) {
    if (usage && !key.usages.includes(usage)) {
        throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
    }
}
function checkSigCryptoKey(key, alg, usage) {
    switch(alg){
        case 'HS256':
        case 'HS384':
        case 'HS512':
            {
                if (!isAlgorithm(key.algorithm, 'HMAC')) throw unusable('HMAC');
                checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
                break;
            }
        case 'RS256':
        case 'RS384':
        case 'RS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSASSA-PKCS1-v1_5')) throw unusable('RSASSA-PKCS1-v1_5');
                checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
                break;
            }
        case 'PS256':
        case 'PS384':
        case 'PS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-PSS')) throw unusable('RSA-PSS');
                checkHashLength(key.algorithm, parseInt(alg.slice(2), 10));
                break;
            }
        case 'Ed25519':
        case 'EdDSA':
            {
                if (!isAlgorithm(key.algorithm, 'Ed25519')) throw unusable('Ed25519');
                break;
            }
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            {
                if (!isAlgorithm(key.algorithm, alg)) throw unusable(alg);
                break;
            }
        case 'ES256':
        case 'ES384':
        case 'ES512':
            {
                if (!isAlgorithm(key.algorithm, 'ECDSA')) throw unusable('ECDSA');
                const expected = getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, 'algorithm.namedCurve');
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usage);
}
function checkEncCryptoKey(key, alg, usage) {
    switch(alg){
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            {
                if (!isAlgorithm(key.algorithm, 'AES-GCM')) throw unusable('AES-GCM');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW':
            {
                if (!isAlgorithm(key.algorithm, 'AES-KW')) throw unusable('AES-KW');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'ECDH':
            {
                switch(key.algorithm.name){
                    case 'ECDH':
                    case 'X25519':
                        break;
                    default:
                        throw unusable('ECDH or X25519');
                }
                break;
            }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW':
            if (!isAlgorithm(key.algorithm, 'PBKDF2')) throw unusable('PBKDF2');
            break;
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-OAEP')) throw unusable('RSA-OAEP');
                checkHashLength(key.algorithm, parseInt(alg.slice(9), 10) || 1);
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usage);
}
}),
"[project]/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invalidKeyInput",
    ()=>invalidKeyInput,
    "withAlg",
    ()=>withAlg
]);
function message(msg, actual, ...types) {
    types = types.filter(Boolean);
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(', ')}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === 'function' && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === 'object' && actual != null) {
        if (actual.constructor?.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
const invalidKeyInput = (actual, ...types)=>message('Key must be ', actual, ...types);
const withAlg = (alg, actual, ...types)=>message(`Key for the ${alg} algorithm must be `, actual, ...types);
}),
"[project]/node_modules/jose/dist/webapi/lib/signing.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkKeyLength",
    ()=>checkKeyLength,
    "sign",
    ()=>sign,
    "verify",
    ()=>verify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/crypto_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-route] (ecmascript)");
;
;
;
function checkKeyLength(alg, key) {
    if (alg.startsWith('RS') || alg.startsWith('PS')) {
        const { modulusLength } = key.algorithm;
        if (typeof modulusLength !== 'number' || modulusLength < 2048) {
            throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
        }
    }
}
function subtleAlgorithm(alg, algorithm) {
    const hash = `SHA-${alg.slice(-3)}`;
    switch(alg){
        case 'HS256':
        case 'HS384':
        case 'HS512':
            return {
                hash,
                name: 'HMAC'
            };
        case 'PS256':
        case 'PS384':
        case 'PS512':
            return {
                hash,
                name: 'RSA-PSS',
                saltLength: parseInt(alg.slice(-3), 10) >> 3
            };
        case 'RS256':
        case 'RS384':
        case 'RS512':
            return {
                hash,
                name: 'RSASSA-PKCS1-v1_5'
            };
        case 'ES256':
        case 'ES384':
        case 'ES512':
            return {
                hash,
                name: 'ECDSA',
                namedCurve: algorithm.namedCurve
            };
        case 'Ed25519':
        case 'EdDSA':
            return {
                name: 'Ed25519'
            };
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            return {
                name: alg
            };
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
async function getSigKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["invalidKeyInput"])(key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
        }
        return crypto.subtle.importKey('raw', key, {
            hash: `SHA-${alg.slice(-3)}`,
            name: 'HMAC'
        }, false, [
            usage
        ]);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkSigCryptoKey"])(key, alg, usage);
    return key;
}
async function sign(alg, key, data) {
    const cryptoKey = await getSigKey(alg, key, 'sign');
    checkKeyLength(alg, cryptoKey);
    const signature = await crypto.subtle.sign(subtleAlgorithm(alg, cryptoKey.algorithm), cryptoKey, data);
    return new Uint8Array(signature);
}
async function verify(alg, key, signature, data) {
    const cryptoKey = await getSigKey(alg, key, 'verify');
    checkKeyLength(alg, cryptoKey);
    const algorithm = subtleAlgorithm(alg, cryptoKey.algorithm);
    try {
        return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
    } catch  {
        return false;
    }
}
}),
"[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDisjoint",
    ()=>isDisjoint,
    "isJWK",
    ()=>isJWK,
    "isObject",
    ()=>isObject,
    "isPrivateJWK",
    ()=>isPrivateJWK,
    "isPublicJWK",
    ()=>isPublicJWK,
    "isSecretJWK",
    ()=>isSecretJWK
]);
const isObjectLike = (value)=>typeof value === 'object' && value !== null;
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
function isDisjoint(...headers) {
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
}
const isJWK = (key)=>isObject(key) && typeof key.kty === 'string';
const isPrivateJWK = (key)=>key.kty !== 'oct' && (key.kty === 'AKP' && typeof key.priv === 'string' || typeof key.d === 'string');
const isPublicJWK = (key)=>key.kty !== 'oct' && key.d === undefined && key.priv === undefined;
const isSecretJWK = (key)=>key.kty === 'oct' && typeof key.k === 'string';
}),
"[project]/node_modules/jose/dist/webapi/lib/is_key_like.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertCryptoKey",
    ()=>assertCryptoKey,
    "isCryptoKey",
    ()=>isCryptoKey,
    "isKeyLike",
    ()=>isKeyLike,
    "isKeyObject",
    ()=>isKeyObject
]);
function assertCryptoKey(key) {
    if (!isCryptoKey(key)) {
        throw new Error('CryptoKey instance expected');
    }
}
const isCryptoKey = (key)=>{
    if (key?.[Symbol.toStringTag] === 'CryptoKey') return true;
    try {
        return key instanceof CryptoKey;
    } catch  {
        return false;
    }
};
const isKeyObject = (key)=>key?.[Symbol.toStringTag] === 'KeyObject';
const isKeyLike = (key)=>isCryptoKey(key) || isKeyObject(key);
}),
"[project]/node_modules/jose/dist/webapi/lib/check_key_type.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkKeyType",
    ()=>checkKeyType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/invalid_key_input.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/is_key_like.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)");
;
;
;
const tag = (key)=>key?.[Symbol.toStringTag];
const jwkMatchesOp = (alg, key, usage)=>{
    if (key.use !== undefined) {
        let expected;
        switch(usage){
            case 'sign':
            case 'verify':
                expected = 'sig';
                break;
            case 'encrypt':
            case 'decrypt':
                expected = 'enc';
                break;
        }
        if (key.use !== expected) {
            throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
        }
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
    }
    if (Array.isArray(key.key_ops)) {
        let expectedKeyOp;
        switch(true){
            case usage === 'sign' || usage === 'verify':
            case alg === 'dir':
            case alg.includes('CBC-HS'):
                expectedKeyOp = usage;
                break;
            case alg.startsWith('PBES2'):
                expectedKeyOp = 'deriveBits';
                break;
            case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
                if (!alg.includes('GCM') && alg.endsWith('KW')) {
                    expectedKeyOp = usage === 'encrypt' ? 'wrapKey' : 'unwrapKey';
                } else {
                    expectedKeyOp = usage;
                }
                break;
            case usage === 'encrypt' && alg.startsWith('RSA'):
                expectedKeyOp = 'wrapKey';
                break;
            case usage === 'decrypt':
                expectedKeyOp = alg.startsWith('RSA') ? 'unwrapKey' : 'deriveBits';
                break;
        }
        if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
            throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
        }
    }
    return true;
};
const symmetricTypeCheck = (alg, key, usage)=>{
    if (key instanceof Uint8Array) return;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecretJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isKeyLike"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array'));
    }
    if (key.type !== 'secret') {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage)=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        switch(usage){
            case 'decrypt':
            case 'sign':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrivateJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation must be a private JWK`);
            case 'encrypt':
            case 'verify':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPublicJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation must be a public JWK`);
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isKeyLike"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
    }
    if (key.type === 'secret') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (key.type === 'public') {
        switch(usage){
            case 'sign':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
            case 'decrypt':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
        }
    }
    if (key.type === 'private') {
        switch(usage){
            case 'verify':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
            case 'encrypt':
                throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
        }
    }
};
function checkKeyType(alg, key, usage) {
    switch(alg.substring(0, 2)){
        case 'A1':
        case 'A2':
        case 'di':
        case 'HS':
        case 'PB':
            symmetricTypeCheck(alg, key, usage);
            break;
        default:
            asymmetricTypeCheck(alg, key, usage);
    }
}
}),
"[project]/node_modules/jose/dist/webapi/lib/validate_crit.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateCrit",
    ()=>validateCrit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
;
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== 'string' || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        }
        if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
}),
"[project]/node_modules/jose/dist/webapi/lib/jwk_to_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jwkToKey",
    ()=>jwkToKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
;
const unsupportedAlg = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
function subtleMapping(jwk) {
    let algorithm;
    let keyUsages;
    switch(jwk.kty){
        case 'AKP':
            {
                switch(jwk.alg){
                    case 'ML-DSA-44':
                    case 'ML-DSA-65':
                    case 'ML-DSA-87':
                        algorithm = {
                            name: jwk.alg
                        };
                        keyUsages = jwk.priv ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](unsupportedAlg);
                }
                break;
            }
        case 'RSA':
            {
                switch(jwk.alg){
                    case 'PS256':
                    case 'PS384':
                    case 'PS512':
                        algorithm = {
                            name: 'RSA-PSS',
                            hash: `SHA-${jwk.alg.slice(-3)}`
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'RS256':
                    case 'RS384':
                    case 'RS512':
                        algorithm = {
                            name: 'RSASSA-PKCS1-v1_5',
                            hash: `SHA-${jwk.alg.slice(-3)}`
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'RSA-OAEP':
                    case 'RSA-OAEP-256':
                    case 'RSA-OAEP-384':
                    case 'RSA-OAEP-512':
                        algorithm = {
                            name: 'RSA-OAEP',
                            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
                        };
                        keyUsages = jwk.d ? [
                            'decrypt',
                            'unwrapKey'
                        ] : [
                            'encrypt',
                            'wrapKey'
                        ];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](unsupportedAlg);
                }
                break;
            }
        case 'EC':
            {
                switch(jwk.alg){
                    case 'ES256':
                    case 'ES384':
                    case 'ES512':
                        algorithm = {
                            name: 'ECDSA',
                            namedCurve: ({
                                ES256: 'P-256',
                                ES384: 'P-384',
                                ES512: 'P-521'
                            })[jwk.alg]
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ECDH-ES':
                    case 'ECDH-ES+A128KW':
                    case 'ECDH-ES+A192KW':
                    case 'ECDH-ES+A256KW':
                        algorithm = {
                            name: 'ECDH',
                            namedCurve: jwk.crv
                        };
                        keyUsages = jwk.d ? [
                            'deriveBits'
                        ] : [];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](unsupportedAlg);
                }
                break;
            }
        case 'OKP':
            {
                switch(jwk.alg){
                    case 'Ed25519':
                    case 'EdDSA':
                        algorithm = {
                            name: 'Ed25519'
                        };
                        keyUsages = jwk.d ? [
                            'sign'
                        ] : [
                            'verify'
                        ];
                        break;
                    case 'ECDH-ES':
                    case 'ECDH-ES+A128KW':
                    case 'ECDH-ES+A192KW':
                    case 'ECDH-ES+A256KW':
                        algorithm = {
                            name: jwk.crv
                        };
                        keyUsages = jwk.d ? [
                            'deriveBits'
                        ] : [];
                        break;
                    default:
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](unsupportedAlg);
                }
                break;
            }
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
    return {
        algorithm,
        keyUsages
    };
}
async function jwkToKey(jwk) {
    if (!jwk.alg) {
        throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    }
    const { algorithm, keyUsages } = subtleMapping(jwk);
    const keyData = {
        ...jwk
    };
    if (keyData.kty !== 'AKP') {
        delete keyData.alg;
    }
    delete keyData.use;
    return crypto.subtle.importKey('jwk', keyData, algorithm, jwk.ext ?? (jwk.d || jwk.priv ? false : true), jwk.key_ops ?? keyUsages);
}
}),
"[project]/node_modules/jose/dist/webapi/lib/normalize_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeKey",
    ()=>normalizeKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwk_to_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/jwk_to_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/is_key_like.js [app-route] (ecmascript)");
;
;
;
;
const unusableForAlg = 'given KeyObject instance cannot be used for this algorithm';
let cache;
const handleJWK = async (key, jwk, alg, freeze = false)=>{
    cache ||= new WeakMap();
    let cached = cache.get(key);
    if (cached?.[alg]) {
        return cached[alg];
    }
    const cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwk_to_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwkToKey"])({
        ...jwk,
        alg
    });
    if (freeze) Object.freeze(key);
    if (!cached) {
        cache.set(key, {
            [alg]: cryptoKey
        });
    } else {
        cached[alg] = cryptoKey;
    }
    return cryptoKey;
};
const handleKeyObject = (keyObject, alg)=>{
    cache ||= new WeakMap();
    let cached = cache.get(keyObject);
    if (cached?.[alg]) {
        return cached[alg];
    }
    const isPublic = keyObject.type === 'public';
    const extractable = isPublic ? true : false;
    let cryptoKey;
    if (keyObject.asymmetricKeyType === 'x25519') {
        switch(alg){
            case 'ECDH-ES':
            case 'ECDH-ES+A128KW':
            case 'ECDH-ES+A192KW':
            case 'ECDH-ES+A256KW':
                break;
            default:
                throw new TypeError(unusableForAlg);
        }
        cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, isPublic ? [] : [
            'deriveBits'
        ]);
    }
    if (keyObject.asymmetricKeyType === 'ed25519') {
        if (alg !== 'EdDSA' && alg !== 'Ed25519') {
            throw new TypeError(unusableForAlg);
        }
        cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
            isPublic ? 'verify' : 'sign'
        ]);
    }
    switch(keyObject.asymmetricKeyType){
        case 'ml-dsa-44':
        case 'ml-dsa-65':
        case 'ml-dsa-87':
            {
                if (alg !== keyObject.asymmetricKeyType.toUpperCase()) {
                    throw new TypeError(unusableForAlg);
                }
                cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
                    isPublic ? 'verify' : 'sign'
                ]);
            }
    }
    if (keyObject.asymmetricKeyType === 'rsa') {
        let hash;
        switch(alg){
            case 'RSA-OAEP':
                hash = 'SHA-1';
                break;
            case 'RS256':
            case 'PS256':
            case 'RSA-OAEP-256':
                hash = 'SHA-256';
                break;
            case 'RS384':
            case 'PS384':
            case 'RSA-OAEP-384':
                hash = 'SHA-384';
                break;
            case 'RS512':
            case 'PS512':
            case 'RSA-OAEP-512':
                hash = 'SHA-512';
                break;
            default:
                throw new TypeError(unusableForAlg);
        }
        if (alg.startsWith('RSA-OAEP')) {
            return keyObject.toCryptoKey({
                name: 'RSA-OAEP',
                hash
            }, extractable, isPublic ? [
                'encrypt'
            ] : [
                'decrypt'
            ]);
        }
        cryptoKey = keyObject.toCryptoKey({
            name: alg.startsWith('PS') ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5',
            hash
        }, extractable, [
            isPublic ? 'verify' : 'sign'
        ]);
    }
    if (keyObject.asymmetricKeyType === 'ec') {
        const nist = new Map([
            [
                'prime256v1',
                'P-256'
            ],
            [
                'secp384r1',
                'P-384'
            ],
            [
                'secp521r1',
                'P-521'
            ]
        ]);
        const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
        if (!namedCurve) {
            throw new TypeError(unusableForAlg);
        }
        const expectedCurve = {
            ES256: 'P-256',
            ES384: 'P-384',
            ES512: 'P-521'
        };
        if (expectedCurve[alg] && namedCurve === expectedCurve[alg]) {
            cryptoKey = keyObject.toCryptoKey({
                name: 'ECDSA',
                namedCurve
            }, extractable, [
                isPublic ? 'verify' : 'sign'
            ]);
        }
        if (alg.startsWith('ECDH-ES')) {
            cryptoKey = keyObject.toCryptoKey({
                name: 'ECDH',
                namedCurve
            }, extractable, isPublic ? [] : [
                'deriveBits'
            ]);
        }
    }
    if (!cryptoKey) {
        throw new TypeError(unusableForAlg);
    }
    if (!cached) {
        cache.set(keyObject, {
            [alg]: cryptoKey
        });
    } else {
        cached[alg] = cryptoKey;
    }
    return cryptoKey;
};
async function normalizeKey(key, alg) {
    if (key instanceof Uint8Array) {
        return key;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        return key;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isKeyObject"])(key)) {
        if (key.type === 'secret') {
            return key.export();
        }
        if ('toCryptoKey' in key && typeof key.toCryptoKey === 'function') {
            try {
                return handleKeyObject(key, alg);
            } catch (err) {
                if (err instanceof TypeError) {
                    throw err;
                }
            }
        }
        let jwk = key.export({
            format: 'jwk'
        });
        return handleJWK(key, jwk, alg);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"])(key)) {
        if (key.k) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(key.k);
        }
        return handleJWK(key, key, alg, true);
    }
    throw new Error('unreachable');
}
}),
"[project]/node_modules/jose/dist/webapi/lib/helpers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertNotSet",
    ()=>assertNotSet,
    "decodeBase64url",
    ()=>decodeBase64url,
    "digest",
    ()=>digest,
    "unprotected",
    ()=>unprotected
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript)");
;
const unprotected = Symbol();
function assertNotSet(value, name) {
    if (value) {
        throw new TypeError(`${name} can only be called once`);
    }
}
function decodeBase64url(value, label, ErrorClass) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(value);
    } catch  {
        throw new ErrorClass(`Failed to base64url decode the ${label}`);
    }
}
async function digest(algorithm, data) {
    const subtleDigest = `SHA-${algorithm.slice(-3)}`;
    return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
}
}),
"[project]/node_modules/jose/dist/webapi/jws/flattened/sign.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlattenedSign",
    ()=>FlattenedSign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$signing$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/signing.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/check_key_type.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/validate_crit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/normalize_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/helpers.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
class FlattenedSign {
    #payload;
    #protectedHeader;
    #unprotectedHeader;
    constructor(payload){
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError('payload must be an instance of Uint8Array');
        }
        this.#payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#protectedHeader, 'setProtectedHeader');
        this.#protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#unprotectedHeader, 'setUnprotectedHeader');
        this.#unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this.#protectedHeader && !this.#unprotectedHeader) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDisjoint"])(this.#protectedHeader, this.#unprotectedHeader)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
        }
        const joseHeader = {
            ...this.#protectedHeader,
            ...this.#unprotectedHeader
        };
        const extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"], new Map([
            [
                'b64',
                true
            ]
        ]), options?.crit, this.#protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has('b64')) {
            b64 = this.#protectedHeader.b64;
            if (typeof b64 !== 'boolean') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
            }
        }
        const { alg } = joseHeader;
        if (typeof alg !== 'string' || !alg) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkKeyType"])(alg, key, 'sign');
        let payloadS;
        let payloadB;
        if (b64) {
            payloadS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(this.#payload);
            payloadB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(payloadS);
        } else {
            payloadB = this.#payload;
            payloadS = '';
        }
        let protectedHeaderString;
        let protectedHeaderBytes;
        if (this.#protectedHeader) {
            protectedHeaderString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(JSON.stringify(this.#protectedHeader));
            protectedHeaderBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(protectedHeaderString);
        } else {
            protectedHeaderString = '';
            protectedHeaderBytes = new Uint8Array();
        }
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["concat"])(protectedHeaderBytes, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])('.'), payloadB);
        const k = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeKey"])(key, alg);
        const signature = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$signing$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sign"])(alg, k, data);
        const jws = {
            signature: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(signature),
            payload: payloadS
        };
        if (this.#unprotectedHeader) {
            jws.header = this.#unprotectedHeader;
        }
        if (this.#protectedHeader) {
            jws.protected = protectedHeaderString;
        }
        return jws;
    }
}
}),
"[project]/node_modules/jose/dist/webapi/jws/compact/sign.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompactSign",
    ()=>CompactSign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jws/flattened/sign.js [app-route] (ecmascript)");
;
class CompactSign {
    #flattened;
    constructor(payload){
        this.#flattened = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FlattenedSign"](payload);
    }
    setProtectedHeader(protectedHeader) {
        this.#flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    async sign(key, options) {
        const jws = await this.#flattened.sign(key, options);
        if (jws.payload === undefined) {
            throw new TypeError('use the flattened module for creating JWS with b64: false');
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}
}),
"[project]/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JWTClaimsBuilder",
    ()=>JWTClaimsBuilder,
    "secs",
    ()=>secs,
    "validateClaimsSet",
    ()=>validateClaimsSet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)");
;
;
;
const epoch = (date)=>Math.floor(date.getTime() / 1000);
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function secs(str) {
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
        throw new TypeError('Invalid time period format');
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch(unit){
        case 'sec':
        case 'secs':
        case 'second':
        case 'seconds':
        case 's':
            numericDate = Math.round(value);
            break;
        case 'minute':
        case 'minutes':
        case 'min':
        case 'mins':
        case 'm':
            numericDate = Math.round(value * minute);
            break;
        case 'hour':
        case 'hours':
        case 'hr':
        case 'hrs':
        case 'h':
            numericDate = Math.round(value * hour);
            break;
        case 'day':
        case 'days':
        case 'd':
            numericDate = Math.round(value * day);
            break;
        case 'week':
        case 'weeks':
        case 'w':
            numericDate = Math.round(value * week);
            break;
        default:
            numericDate = Math.round(value * year);
            break;
    }
    if (matched[1] === '-' || matched[4] === 'ago') {
        return -numericDate;
    }
    return numericDate;
}
function validateInput(label, input) {
    if (!Number.isFinite(input)) {
        throw new TypeError(`Invalid ${label} input`);
    }
    return input;
}
const normalizeTyp = (value)=>{
    if (value.includes('/')) {
        return value.toLowerCase();
    }
    return `application/${value.toLowerCase()}`;
};
const checkAudiencePresence = (audPayload, audOption)=>{
    if (typeof audPayload === 'string') {
        return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
        return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
};
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
    let payload;
    try {
        payload = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(encodedPayload));
    } catch  {}
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"])(payload)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWT Claims Set must be a top-level JSON object');
    }
    const { typ } = options;
    if (typ && (typeof protectedHeader.typ !== 'string' || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "typ" JWT header value', payload, 'typ', 'check_failed');
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [
        ...requiredClaims
    ];
    if (maxTokenAge !== undefined) presenceCheck.push('iat');
    if (audience !== undefined) presenceCheck.push('aud');
    if (subject !== undefined) presenceCheck.push('sub');
    if (issuer !== undefined) presenceCheck.push('iss');
    for (const claim of new Set(presenceCheck.reverse())){
        if (!(claim in payload)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`missing required "${claim}" claim`, payload, claim, 'missing');
        }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [
        issuer
    ]).includes(payload.iss)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "iss" claim value', payload, 'iss', 'check_failed');
    }
    if (subject && payload.sub !== subject) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "sub" claim value', payload, 'sub', 'check_failed');
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === 'string' ? [
        audience
    ] : audience)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "aud" claim value', payload, 'aud', 'check_failed');
    }
    let tolerance;
    switch(typeof options.clockTolerance){
        case 'string':
            tolerance = secs(options.clockTolerance);
            break;
        case 'number':
            tolerance = options.clockTolerance;
            break;
        case 'undefined':
            tolerance = 0;
            break;
        default:
            throw new TypeError('Invalid clockTolerance option type');
    }
    const { currentDate } = options;
    const now = epoch(currentDate || new Date());
    if ((payload.iat !== undefined || maxTokenAge) && typeof payload.iat !== 'number') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"iat" claim must be a number', payload, 'iat', 'invalid');
    }
    if (payload.nbf !== undefined) {
        if (typeof payload.nbf !== 'number') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"nbf" claim must be a number', payload, 'nbf', 'invalid');
        }
        if (payload.nbf > now + tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"nbf" claim timestamp check failed', payload, 'nbf', 'check_failed');
        }
    }
    if (payload.exp !== undefined) {
        if (typeof payload.exp !== 'number') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"exp" claim must be a number', payload, 'exp', 'invalid');
        }
        if (payload.exp <= now - tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTExpired"]('"exp" claim timestamp check failed', payload, 'exp', 'check_failed');
        }
    }
    if (maxTokenAge) {
        const age = now - payload.iat;
        const max = typeof maxTokenAge === 'number' ? maxTokenAge : secs(maxTokenAge);
        if (age - tolerance > max) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTExpired"]('"iat" claim timestamp check failed (too far in the past)', payload, 'iat', 'check_failed');
        }
        if (age < 0 - tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"iat" claim timestamp check failed (it should be in the past)', payload, 'iat', 'check_failed');
        }
    }
    return payload;
}
class JWTClaimsBuilder {
    #payload;
    constructor(payload){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"])(payload)) {
            throw new TypeError('JWT Claims Set MUST be an object');
        }
        this.#payload = structuredClone(payload);
    }
    data() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(JSON.stringify(this.#payload));
    }
    get iss() {
        return this.#payload.iss;
    }
    set iss(value) {
        this.#payload.iss = value;
    }
    get sub() {
        return this.#payload.sub;
    }
    set sub(value) {
        this.#payload.sub = value;
    }
    get aud() {
        return this.#payload.aud;
    }
    set aud(value) {
        this.#payload.aud = value;
    }
    set jti(value) {
        this.#payload.jti = value;
    }
    set nbf(value) {
        if (typeof value === 'number') {
            this.#payload.nbf = validateInput('setNotBefore', value);
        } else if (value instanceof Date) {
            this.#payload.nbf = validateInput('setNotBefore', epoch(value));
        } else {
            this.#payload.nbf = epoch(new Date()) + secs(value);
        }
    }
    set exp(value) {
        if (typeof value === 'number') {
            this.#payload.exp = validateInput('setExpirationTime', value);
        } else if (value instanceof Date) {
            this.#payload.exp = validateInput('setExpirationTime', epoch(value));
        } else {
            this.#payload.exp = epoch(new Date()) + secs(value);
        }
    }
    set iat(value) {
        if (value === undefined) {
            this.#payload.iat = epoch(new Date());
        } else if (value instanceof Date) {
            this.#payload.iat = validateInput('setIssuedAt', epoch(value));
        } else if (typeof value === 'string') {
            this.#payload.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value));
        } else {
            this.#payload.iat = validateInput('setIssuedAt', value);
        }
    }
}
}),
"[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignJWT",
    ()=>SignJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jws/compact/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-route] (ecmascript)");
;
;
;
class SignJWT {
    #protectedHeader;
    #jwt;
    constructor(payload = {}){
        this.#jwt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimsBuilder"](payload);
    }
    setIssuer(issuer) {
        this.#jwt.iss = issuer;
        return this;
    }
    setSubject(subject) {
        this.#jwt.sub = subject;
        return this;
    }
    setAudience(audience) {
        this.#jwt.aud = audience;
        return this;
    }
    setJti(jwtId) {
        this.#jwt.jti = jwtId;
        return this;
    }
    setNotBefore(input) {
        this.#jwt.nbf = input;
        return this;
    }
    setExpirationTime(input) {
        this.#jwt.exp = input;
        return this;
    }
    setIssuedAt(input) {
        this.#jwt.iat = input;
        return this;
    }
    setProtectedHeader(protectedHeader) {
        this.#protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        const sig = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompactSign"](this.#jwt.data());
        sig.setProtectedHeader(this.#protectedHeader);
        if (Array.isArray(this.#protectedHeader?.crit) && this.#protectedHeader.crit.includes('b64') && this.#protectedHeader.b64 === false) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs MUST NOT use unencoded payload');
        }
        return sig.sign(key, options);
    }
}
}),
"[project]/node_modules/jose/dist/webapi/lib/validate_algorithms.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateAlgorithms",
    ()=>validateAlgorithms
]);
function validateAlgorithms(option, algorithms) {
    if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some((s)=>typeof s !== 'string'))) {
        throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
        return undefined;
    }
    return new Set(algorithms);
}
}),
"[project]/node_modules/jose/dist/webapi/jws/flattened/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flattenedVerify",
    ()=>flattenedVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$signing$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/signing.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/helpers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/type_checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/check_key_type.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/validate_crit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/validate_algorithms.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/normalize_key.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
async function flattenedVerify(jws, key, options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"])(jws)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Flattened JWS must be an object');
    }
    if (jws.protected === undefined && jws.header === undefined) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== undefined && typeof jws.protected !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected Header incorrect type');
    }
    if (jws.payload === undefined) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload missing');
    }
    if (typeof jws.signature !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Signature missing or incorrect type');
    }
    if (jws.header !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"])(jws.header)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Unprotected Header incorrect type');
    }
    let parsedProt = {};
    if (jws.protected) {
        try {
            const protectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(jws.protected);
            parsedProt = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(protectedHeader));
        } catch  {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected Header is invalid');
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$type_checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDisjoint"])(parsedProt, jws.header)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
    }
    const joseHeader = {
        ...parsedProt,
        ...jws.header
    };
    const extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"], new Map([
        [
            'b64',
            true
        ]
    ]), options?.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has('b64')) {
        b64 = parsedProt.b64;
        if (typeof b64 !== 'boolean') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
    }
    const { alg } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateAlgorithms"])('algorithms', options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSEAlgNotAllowed"]('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (b64) {
        if (typeof jws.payload !== 'string') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload must be a string');
        }
    } else if (typeof jws.payload !== 'string' && !(jws.payload instanceof Uint8Array)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload must be a string or an Uint8Array instance');
    }
    let resolvedKey = false;
    if (typeof key === 'function') {
        key = await key(parsedProt, jws);
        resolvedKey = true;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkKeyType"])(alg, key, 'verify');
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["concat"])(jws.protected !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(jws.protected) : new Uint8Array(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])('.'), typeof jws.payload === 'string' ? b64 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encode"])(jws.payload) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(jws.payload) : jws.payload);
    const signature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeBase64url"])(jws.signature, 'signature', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]);
    const k = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$normalize_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeKey"])(key, alg);
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$signing$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verify"])(alg, k, signature, data);
    if (!verified) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSSignatureVerificationFailed"]();
    }
    let payload;
    if (b64) {
        payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeBase64url"])(jws.payload, 'payload', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]);
    } else if (typeof jws.payload === 'string') {
        payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(jws.payload);
    } else {
        payload = jws.payload;
    }
    const result = {
        payload
    };
    if (jws.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key: k
        };
    }
    return result;
}
}),
"[project]/node_modules/jose/dist/webapi/jws/compact/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compactVerify",
    ()=>compactVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jws/flattened/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/buffer_utils.js [app-route] (ecmascript)");
;
;
;
async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(jws);
    }
    if (typeof jws !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Compact JWS must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
    if (length !== 3) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Invalid Compact JWS');
    }
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flattenedVerify"])({
        payload,
        protected: protectedHeader,
        signature
    }, key, options);
    const result = {
        payload: verified.payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === 'function') {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
}),
"[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jwtVerify",
    ()=>jwtVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jws/compact/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
;
;
;
async function jwtVerify(jwt, key, options) {
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compactVerify"])(jwt, key, options);
    if (verified.protectedHeader.crit?.includes('b64') && verified.protectedHeader.b64 === false) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs MUST NOT use unencoded payload');
    }
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateClaimsSet"])(verified.protectedHeader, verified.payload, options);
    const result = {
        payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === 'function') {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__10_1rt5._.js.map