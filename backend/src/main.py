from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HelloResponse(BaseModel):
    message: str


@app.get(
    "/hello",
    operation_id="getHello",
    summary="挨拶を返すAPI",
    description="シンプルなテスト用エンドポイント。Helloメッセージを返す。",
    response_model=HelloResponse,
)
def hello():
    return {"message": "Hello from FastAPI"}
