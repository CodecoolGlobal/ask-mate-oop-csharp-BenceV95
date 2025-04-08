


export async function apiGet(endpoint) {

    const response = await fetch(`/api/${endpoint}`, {
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
    const response = await fetch(`/api/${endpoint}`, {
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

    const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const ad = await response.json()
        //console.log("error msg", ad.message);
        throw new Error(ad.message);
    }

    return await response.json();
}

export async function apiDelete(endpoint) {

    const response = await fetch(`/api/${endpoint}`, {
        method: "DELETE",
        credentials: "include"
    });
    
    if (!response.ok) {
        throw new Error("API request failed");
    }

    if (response.headers.get("Content-Type")?.includes("application/json")) {
        return await response.json();
    }
      
}