'use client';

import React from 'react';
import Giscus from "@giscus/react";

const GiscusComments = () => {
    return (
        <Giscus
            id="comments"
            repo="phucbm/nextra-blog-starter"
            repoId="R_kgDONxvZHA"
            category="Announcements"
            categoryId="DIC_kwDONxvZHM4Cmh3a"
            mapping="pathname"
            term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="preferred_color_scheme"
            lang="en"
            loading="lazy"
        />
    );
};

export default GiscusComments;