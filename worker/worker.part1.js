// ### Test 1: @rollup/plugin-replace
// prettier-ignore
IMPORT_WORKERPOOL

// ### Test 2: rollup-plugin-jscc

//#set _FOO = 'foo'

let bar = "$_FOO".toUpperCase();

//#if _PRODUCTION
console.log("production");
//#endif

// ### Test 3: rollup-plugin-copy-merge

/// a deliberately inefficient implementation of the fibonacci sequence
function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}
