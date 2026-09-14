"""Clean HTTP error envelope: {message, details}; no DB internals."""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def _field_errors(exc: RequestValidationError) -> dict[str, str]:
    details: dict[str, str] = {}
    for error in exc.errors():
        loc = [str(part) for part in error.get("loc", []) if str(part) not in {"body", "query", "path"}]
        field = loc[-1] if loc else "request"
        details.setdefault(field, str(error.get("msg", "Invalid value.")))
    return details


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"message": "Validation failed.", "details": _field_errors(exc)})

    @app.exception_handler(StarletteHTTPException)
    async def http_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        status = exc.status_code or 500
        detail = exc.detail
        if isinstance(detail, dict):
            message = str(detail.get("message", "Request failed."))
            details = detail.get("details")
        else:
            message = str(detail or "Request failed.")
            details = None
        return JSONResponse(status_code=status, content={"message": message, "details": details})
