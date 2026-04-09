import { Alert } from '@mui/material'
import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';

function FieldErrorAlert({ error, fieldName }) {
    if (!error || !error[fieldName]) return null
    return (
        <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error" sx={{ mt: 1 }}>
            {error[fieldName]?.message}
        </Alert>
    )
}

export default FieldErrorAlert