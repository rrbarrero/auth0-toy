.PHONY: build start local-be-run local-fe-run local-dev local-be-debug

build:
	docker-compose build

start: build
	docker-compose up -d && docker-compose logs -f

local-be-run:
	uv run --directory be python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001

local-fe-run:
	cd fe && npm run dev

local-be-debug:
	uv run --directory be python -m debugpy --listen 0.0.0.0:5678 --wait-for-client -m uvicorn main:app --reload --host 0.0.0.0 --port 8001