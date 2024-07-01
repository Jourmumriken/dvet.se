import React from "react";
import Cookies from "js-cookie";

const me = () => {
    const [isUploading, setIsUploading] = React.useState(false);

    const onSubmitAction = (e) => {
        e.preventDefault();
        setIsUploading(true);

        const resField = document.getElementById("photos-response-field");
        const fields = document.getElementById("photos-post-data");
        const data = new FormData(fields);

        fetch("/photos/post", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Cookies.get("dv-token")}`
            },
            body: data
        })
            .then(r => r.json())
            .then(r => {
                if (r.ok) {
                    resField.innerHTML = r.ok;
                } else {
                    resField.innerHTML = `Error: ${r.err}`;
                }
            })
            .catch(e => resField.innerText = `Error: ${e}`)
            .finally(() => setIsUploading(false));
    };

    return <div>
        <div id="photos-response-field"></div>
        <form id="photos-post-data" action="/photos/post" method="post" enctype="multipart/form-data">
            <label for="folder">Folder:</label>
            <input type="text" id="folder" name="folder" />
            <br /><br />
            <label for="files">Select files:</label>
            <input type="file" id="files" name="files" multiple accept="image/png, image/gif, image/jpeg, video/mp4" />
            <br /><br />
            <input onClick={onSubmitAction} type="submit" value={isUploading ? "Uploading..." : "Upload"} disabled={isUploading} />
        </form>
    </div>;
};

export default me;