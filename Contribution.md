# Contribution to n8n-nodes-formx

## Table of Content

[Prerequisites](#prerequsites)  
[Local Installation](#local-installation)
[Making Changes](#making-changes)


## Prerequsites
- Node.js 16 or above
- npm

## Making Changes
1. Make sure you have [install this node locally]((#local-installation))
2. Make your changes
3. Debug using `make reload`
4. Commit your changes
5. Submit a PR to this repository


## Local Installation 
Please note that this installation only need to be done ONCE.

1. Close this repository

2. Install n8n cli

```bash
# n8n-nodes-formx/
make vendor
```

3. Install packages

```bash
npm i
```

4. Publish this node locally

```bash
# n8n-nodes-formx/
npm run build
npm link
```


5. Initialize custom package in your local n8n instance (usually `~/.n8n`)

```bash
cd ~/.n8n # or your local n8n instance location
mkdir custom
cd custom
npm init -y # default params work fine here, remove -y if you want to customize
```

6. Install the node into your local n8n instance

```bash
# ~/.n8n/custom
npm link n8n-nodes-formx
```

7. Run your n8n instance

```bash
# n8n-nodes-formx/
make build
make start
```



