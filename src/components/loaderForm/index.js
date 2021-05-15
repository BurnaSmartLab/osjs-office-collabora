import React, { createRef, useEffect } from 'react';

export default function LoaderForm(props) {
    const formElem = createRef();
    
    useEffect(() => {
        formElem.current.submit()
    });

    return (
        <div style={{ display: "none" }}>
            <form ref={formElem} action={props.url} encType="multipart/form-data" method="post" target="collabora-online-viewer"
                id="collabora-submit-form">
                <input name="access_token" value={props.token} type="hidden" id="access-token" />
                <input type="submit" value="" />
            </form>
        </div>

    );
}
