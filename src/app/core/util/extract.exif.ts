import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ExtractExif {
    getYear(file: Blob): Subject<string> {
        let originalYear = '';
        let $year = new Subject<string>();
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = (event) => {
            const buffer = event.target!.result as ArrayBuffer;
            const dataView = new DataView(buffer);
            let offset = 0;
            let yearOffset = 0;
            while (offset < dataView.byteLength) {
                if ( //Exif v2.0
                    dataView.getUint8(offset) === 0x43 && // C
                    dataView.getUint8(offset + 1) === 0x72 && // r
                    dataView.getUint8(offset + 2) === 0x65 && // e
                    dataView.getUint8(offset + 3) === 0x61 && // a
                    dataView.getUint8(offset + 4) === 0x74 && // t
                    dataView.getUint8(offset + 5) === 0x65 && // e
                    dataView.getUint8(offset + 6) === 0x44 && // D
                    dataView.getUint8(offset + 7) === 0x61 && // a
                    dataView.getUint8(offset + 8) === 0x74 && // t
                    dataView.getUint8(offset + 9) === 0x65 && // e
                    dataView.getUint8(offset + 10) === 0x3d && // =
                    dataView.getUint8(offset + 11) === 0x22 // "
                ) {
                    yearOffset = offset + 11;
                    break;
                } else if ( //Exif v1.0
                    dataView.getUint8(offset) === 0x43 && // C
                    dataView.getUint8(offset + 1) === 0x72 && // r
                    dataView.getUint8(offset + 2) === 0x65 && // e
                    dataView.getUint8(offset + 3) === 0x61 && // a
                    dataView.getUint8(offset + 4) === 0x74 && // t
                    dataView.getUint8(offset + 5) === 0x65 && // e
                    dataView.getUint8(offset + 6) === 0x44 && // D
                    dataView.getUint8(offset + 7) === 0x61 && // a
                    dataView.getUint8(offset + 8) === 0x74 && // t
                    dataView.getUint8(offset + 9) === 0x65 && // e
                    dataView.getUint8(offset + 10) === 0x3e // >
                ) {
                    yearOffset = offset + 10;
                    break;
                }
                offset++;
            }
            let yearChars = [];
            for (let i = 1; i <= 4; i++) {
                yearChars.push(dataView.getUint8(yearOffset + i));
            }
            yearChars.forEach((element) => {
                originalYear = originalYear + String.fromCharCode(element);
            });
            $year.next(originalYear);
        };
        return $year;
    }
}
