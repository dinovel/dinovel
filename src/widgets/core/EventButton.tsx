import * as React from 'react';

export type EventButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

export const EventButton = (props: EventButtonProps) => {
    return (
        <button {...props} >
            {props.children}
        </button>
    );
}
