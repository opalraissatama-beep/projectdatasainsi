from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    text: str = Field(min_length=1)
    source: str = "protected"


class VulnerableRequest(BaseModel):
    text: str = Field(min_length=1)


class DetectionResponse(BaseModel):
    status: str
    prediction: str
    confidence: float
    message: str | None = None
    blocked: bool = False
