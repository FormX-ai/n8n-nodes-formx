N8N_NODE_PACKAGE_NAME := n8n-nodes-formx

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

.PHONY: initial-setup
initial-setup: build
	npm link

.PHONY: start
start:
	n8n start

.PHONY: reload
reload: build start

.PHONY: ci
ci: check-format lint build
