from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # Database
    database_url: str = "sqlite:///./demo.db"

    # CORS — comma-separated origins, or "*" for allow-all (dev only)
    cors_origins: str = "http://localhost:8081,http://localhost:19006"

    model_config = {"env_file": ".env"}

    @property
    def cors_origin_list(self) -> list[str]:
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
