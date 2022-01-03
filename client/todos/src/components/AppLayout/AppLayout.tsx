import React, { PropsWithChildren } from 'react';

export function AppLayout(props: PropsWithChildren<Record<never, never>>) {
    return (
        <div>
            {props.children}
        </div>
    );
}
