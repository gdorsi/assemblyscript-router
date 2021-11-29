// It must spot all the chars where decodeURIComponent(x) !== decodeURI(x)
// The chars are: # $ & + , / : ; = ? @
const uriComponentsCharMap = new Array<Array<i8>>(53);
uriComponentsCharMap[50] = new Array<i8>(103).fill(0);
uriComponentsCharMap[50][51] = 1; // # '%23'
uriComponentsCharMap[50][52] = 1; // $ '%24'
uriComponentsCharMap[50][54] = 1; // & '%26'
uriComponentsCharMap[50][66] = 1; // + '%2B'
uriComponentsCharMap[50][98] = 1; // + '%2b'
uriComponentsCharMap[50][67] = 1; // , '%2C'
uriComponentsCharMap[50][99] = 1; // , '%2c'
uriComponentsCharMap[50][70] = 1; // / '%2F'
uriComponentsCharMap[50][102] = 1; // / '%2f'

uriComponentsCharMap[51] = new Array<i8>(103).fill(0);
uriComponentsCharMap[51][65] = 1; // : '%3A'
uriComponentsCharMap[51][97] = 1; // : '%3a'
uriComponentsCharMap[51][66] = 1; // ; '%3B'
uriComponentsCharMap[51][98] = 1; // ; '%3b'
uriComponentsCharMap[51][68] = 1; // = '%3D'
uriComponentsCharMap[51][100] = 1; // = '%3d'
uriComponentsCharMap[51][70] = 1; // ? '%3F'
uriComponentsCharMap[51][102] = 1; // ? '%3f'

uriComponentsCharMap[52] = new Array<i8>(49).fill(0);
uriComponentsCharMap[52][48] = 1; // @ '%40'

let containsEncodedComponents = false;

export function getContainsEncodedComponents(): boolean {
  return containsEncodedComponents;
}

export function sanitizeUrl(url: string, length: i32): string {
  let originPath = url;
  let shouldDecode = false;
  let highChar: i32 = -1;
  let lowChar: i32 = -1;
  for (var i = 0, len = length; i < len; i++) {
    var charCode = url.charCodeAt(i);

    if (shouldDecode && !containsEncodedComponents) {
      if (highChar === 0 && uriComponentsCharMap[charCode]) {
        highChar = charCode;
        lowChar = 0;
      } else if (
        highChar &&
        lowChar === 0 &&
        uriComponentsCharMap[highChar][charCode]
      ) {
        containsEncodedComponents = true;
      } else {
        highChar = -1;
        lowChar = -1;
      }
    }

    // Some systems do not follow RFC and separate the path and query
    // string with a `;` character (code 59), e.g. `/foo;jsessionid=123456`.
    // Thus, we need to split on `;` as well as `?` and `#`.
    if (charCode === 63 || charCode === 59 || charCode === 35) {
      originPath = url.slice(0, i);
      break;
    } else if (charCode === 37) {
      shouldDecode = true;
      highChar = 0x00;
    }
  }
  const decoded = shouldDecode ? decodeURI(originPath.slice(0, length)) : originPath;

  return decoded;
}
