from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    auth0_domain: str = Field(..., alias="AUTH0_DOMAIN")
    auth0_api_audience: str = Field(..., alias="AUTH0_API_AUDIENCE")
    auth0_issuer: str = Field(..., alias="AUTH0_ISSUER")
    auth0_algorithms: str = Field(..., alias="AUTH0_ALGORITHMS")
    namespace: str = Field(..., alias="APP_NAME_NAMESPACE")

    model_config = {
        "env_file": ".env",
        "populate_by_name": True,
    }

    @property
    def role_claim(self) -> str:
        return f"{self.namespace}/role"


settings = Settings()  # type: ignore
