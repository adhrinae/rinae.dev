'use client'

import {Link} from 'next-view-transitions'
import {useFSRoute} from 'nextra/hooks'
import * as React from 'react';

type Props = {
    href: string;
    target?: string;
    children: React.ReactNode;
};

export function NavbarLink(props: Props) {
    const pathname = useFSRoute();
    const {href, target = ""} = props;
    return (
        <Link
            href={href}
            className="no-underline hover:underline focus:underline aria-[current]:font-bold"
            aria-current={href === pathname || undefined}
            target={target}
            {...props}
        />
    )
}