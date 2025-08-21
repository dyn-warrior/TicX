# Default target
.DEFAULT_GOAL := help

# Variables
COMPOSE_FILE = docker-compose.yml
APP_NAME = ticx

# Help target
.PHONY: help
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
.PHONY: up
up: ## Start all services with Docker Compose
	docker-compose -f $(COMPOSE_FILE) up -d --build

.PHONY: down
down: ## Stop all services
	docker-compose -f $(COMPOSE_FILE) down

.PHONY: logs
logs: ## Show logs from all services
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: restart
restart: down up ## Restart all services

# Database
.PHONY: db-reset
db-reset: ## Reset database (drop and recreate)
	docker-compose -f $(COMPOSE_FILE) exec app npm run db:push
	docker-compose -f $(COMPOSE_FILE) exec app npm run db:seed

.PHONY: db-migrate
db-migrate: ## Run database migrations
	docker-compose -f $(COMPOSE_FILE) exec app npm run db:migrate

.PHONY: db-studio
db-studio: ## Open Prisma Studio
	docker-compose -f $(COMPOSE_FILE) exec app npm run db:studio

# Testing
.PHONY: test
test: ## Run unit tests
	docker-compose -f $(COMPOSE_FILE) exec app npm run test

.PHONY: test-e2e
test-e2e: ## Run e2e tests
	docker-compose -f $(COMPOSE_FILE) exec app npm run test:e2e

.PHONY: test-all
test-all: test test-e2e ## Run all tests

# Cleanup
.PHONY: clean
clean: ## Clean up Docker resources
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

# Local development (without Docker)
.PHONY: install
install: ## Install dependencies locally
	npm install

.PHONY: dev
dev: ## Start development server locally
	npm run dev

.PHONY: build
build: ## Build the application locally
	npm run build
