let apiRoot = "";

console.log("import.meta.env", import.meta.env);
console.log("process.env", process.env);

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8080";
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://keeper-api-neqe.onrender.com";
}

// export const API_ROOT = "";
export const API_ROOT = apiRoot;
