import workerpool from "workerpool";
import "./style.css";

var pool = workerpool.pool(
  new URL("./worker/CompiledWorker.js", import.meta.url).href,
  {
    maxWorkers: 3,
  }
);

pool
  .exec("fibonacci", [10])
  .then(function (f) {
    document.querySelector("#result").innerHTML = `Result: ${f}`;
    console.log("res", f);
  })
  .catch(function (error) {
    document.querySelector("#result").innerHTML = `Error: ${error.message}`;
    console.log("error", error);
  });
