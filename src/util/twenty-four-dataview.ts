/* 
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 * 
 * @author qli5 <goodlq11[at](163|gmail).com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

class TwentyFourDataView extends DataView {
    getUint24(byteOffset: number, littleEndian = false) {
        if (littleEndian) {
            const msb = this.getUint16(byteOffset + 1) << 8;
            return msb | this.getUint8(byteOffset);
        }
        else if (byteOffset > this.byteOffset) {
            return this.getUint32(byteOffset - 1) & 0x00FFFFFF;
        }
        else {
            const msb = this.getUint8(byteOffset) << 16;
            return msb | this.getUint16(byteOffset + 1);
        }
    }

    setUint24(byteOffset: number, value: number, littleEndian = false) {
        if (littleEndian) {
            const msb = value >> 8;
            this.setUint16(byteOffset + 1, msb);
            this.setUint8(byteOffset, value);
        }
        else {
            const msb = value >> 16;
            this.setUint8(byteOffset, msb);
            this.setUint16(byteOffset + 1, value);
        }
    }

    indexOfSubArray(search: string | ArrayLike<number>, startOffset = 0, endOffset = this.byteLength - search.length + 1) {
        if (typeof search[0] !== 'number') search = new TextEncoder().encode(search as string);
        const haystack = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);

        // naive but cache effective implementation
        haystackLoop: for (let i = startOffset; i < endOffset; i++) {
            for (let j = 0; j < search.length; j++) {
                if (haystack[i + j] !== search[j]) {
                    continue haystackLoop;
                }
            }
            return i;
        }
        return -1;
    }
}

export default TwentyFourDataView;
