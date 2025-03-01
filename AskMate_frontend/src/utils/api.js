const apiUrl = import.meta.env.VITE_API_URL;


export async function apiGet(endpoint) {

    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }


    return await response.json();
}


export async function apiPut(endpoint, data) {
    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }
    return await response.json();
}

export async function apiPost(endpoint, data) {
    console.log(`${BACKEND_URL}${endpoint}`);

    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return await response.json();
}

export async function apiDelete(endpoint) {
    console.log(`${BACKEND_URL}${endpoint}`);

    const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("API request failed");
    }

}