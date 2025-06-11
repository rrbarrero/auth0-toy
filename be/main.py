from fastapi import Depends, FastAPI, HTTPException, Security
from config import settings
from fastapi.middleware.cors import CORSMiddleware
from common.auth.verfy_token import VerifyToken

app = FastAPI()
auth = VerifyToken(settings)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def admin_validator(payload: dict = Depends(auth.verify)):
    """
    Accept the payload already validated by VerifyToken and verify the role.
    """
    if payload.get(settings.role_claim) != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return payload


@app.get("/api/public")
def public():
    """No access token required to access this route"""

    result = {
        "status": "success",
        "msg": (
            "Hello from a public endpoint! You don't need to be "
            "authenticated to see this."
        ),
    }
    return result


@app.get("/api/private")
def private(auth_result: str = Security(auth.verify)):
    """A valid access token is required to access this route"""
    return auth_result


@app.get("/api/private-scoped")
def private_scoped(auth_result: str = Security(auth.verify, scopes=["read:messages"])):
    """A valid access token and an appropriate scope are required to access
    this route
    """

    return auth_result


@app.get("/api/private-scoped-admin")
def private_scoped_admin(
    auth_result: str = Security(admin_validator, scopes=["read:messages"])
):
    """A valid access token and an appropriate scope are required to access
    this route
    """

    return auth_result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
