import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({isEnabled, ...props}) => {
    return (isEnabled) ? <Route {...props} /> : <Redirect to="/login"/>;
};

export default ProtectedRoute;