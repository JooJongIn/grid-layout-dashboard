const isLocal = false;
export const isOldList = false;



export const dashobardDBUrl = isLocal ? "http://localhost:9000" : vite_api_url;
export const userDBUrl = isLocal ? "http://localhost:8080" : vite_login_url;

export const dataJsonPath = data_json_path;

// export const dashobardDBUrl = isLocal ? "http://localhost:9000" : import.meta.env.VITE_API_URL
// export const dashobardDBUrl = isLocal ? "http://localhost:9000" : "http://211.241.188.12:9000"
