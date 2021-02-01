import React from 'react';
import {
    Dialog as DialogComponent,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

const Dialog = ({
    title = '',
    isOpen,
    maxWidth = 'md',
    fullWidth = true,
    children,
    onClose,
    button
}) => {
    return (
        <DialogComponent
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {button}
            </DialogActions>
        </DialogComponent>
    );
};

export default Dialog;