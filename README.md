# n8n-nodes-formx

This is an n8n community node. It lets you use FormX, a document extraction service, in your n8n workflows.

FormX is a document extraction service that allows you to automate the extraction of data from various types of documents, such as receipts, invoices, and bank-statements.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Content
[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

[comment]: <> (TODO: Add installation instruction here after public n8n package is available)

## Operations

The FormX node supports the following operations:

- Action: Extract data from documents, using extractors set up in your [FormX Portal](www.formextractorai.com)
- Trigger: Listen to new extraction finish

## Credentials

To use the FormX node, you will need to [sign up for a FormX account](https://auth.formextractorai.com/signup)

You can then configure the credentials in the n8n interface by providing the [Access Token](#access-token) and [Extractor ID](#extractor-id).

### Access Token
Go to [Manage Team](https://formextractorai.com/team) to obtain an Access Token. 
Then, you

### Extractor ID
Go to [Extractors](https://formextractorai.com/extractor) to create new/select existing extractor, go to Settings, copy its id.

This node is compatible with n8n version 0.184.0 and above. We have tested the node with n8n version 0.184.0 and 0.187.0, and no known version incompatibility issues have been identified.

## Usage

To use the FormX node in your n8n workflows, simply drag and drop the node onto your canvas and configure the required inputs, such as the document to be processed and the desired extraction or classification tasks.

If you're new to n8n, you can check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation to get started.

### Example Inputs

- Microsoft OneDrive
- Google Drive
- Gmail Attachments


### Example Outputs

- Google Spreadsheets
- Excel
- Airtable
- Xero
- Quickbooks 

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [FormX documentation](https://help.formx.ai/)

## Contribution
Please refer to [Contribution.md](https://github.com/FormX-ai/n8n-nodes-formx/Contribution.md)

