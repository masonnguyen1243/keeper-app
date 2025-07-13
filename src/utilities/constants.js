let apiRoot = "";

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8080";
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://keeper-api-neqe.onrender.com";
}

//https://keeper-api-neqe.onrender.com
console.log(apiRoot);

export const API_ROOT = apiRoot;
