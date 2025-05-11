//Middleware for initializing context object
export function contextMiddleware(req, res, next) {
    req.context = {};
    next();
}