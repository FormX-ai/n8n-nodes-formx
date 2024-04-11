N8N_NODE_PACKAGE_NAME := n8n-nodes-formx

.PHONY: vendor
vendor:
	npm install n8n -g

.PHONY: lint
lint:
	npm run lint

.PHONY: build
build:
	npm run build

.PHONY: initial-setup
initial-setup: build
	npm link

.PHONY: start
start:
	n8n start

.PHONY: reload
reload: build start


