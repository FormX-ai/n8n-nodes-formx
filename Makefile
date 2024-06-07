N8N_NODE_PACKAGE_NAME := n8n-nodes-formx

.PHONY: setup
setup:
	cp .env.example .env
	cp nodes/config.env.ts nodes/config.ts

.PHONY: vendor
vendor:
	npm install n8n -g

.PHONY: format
format:
	npm run format

.PHONY: check-format
check-format:
	npm run check-format

.PHONY: lint
lint:
	npm run lint

.PHONY: lintfix
lintfix:
	npm run lintfix

.PHONY: clean
clean:
	npm run clean

.PHONY: build
build: clean
	npm run build


.PHONY: start
start:
	n8n start

.PHONY: reload
reload: build start

.PHONY: ci
ci: check-format lint build

.PHONY: publish
publish:
	cp nodes/config.production.ts nodes/config.ts
	npm publish --access=public
