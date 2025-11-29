# Airtable Form Builder

A full stack application that allows user to authenticate it self and create customize forms based on Airtable table fields, apply conditional logic, collect responses, export results, and sync Airtable with MongoDB database using webhook.

## Features

- Airtable OAuth login
- Fetch bases, tables and fields
- Form Builder UI with supported field types:
  - Short text
  - Long text
  - Single select
  - Multi-select
  - Attachments
- Conditional visibility rules with AND/OR logic
- Live preview & form rendering
- Save responses to Airtable + MongoDB
- Export responses as CSV and JSON
- Airtable sync with DB
- Logout and session handling

## Tech Stack

- Frontend -> React(Vite)
- Backend -> Node.js + Express
- Database -> MongoDB
- Authentication -> Airtable oAuth
- Synchronization -> Webhook (Airtable -> MongoDB)

## Project Structure

- Frontend(Major folders and files)
  - public
  - src
    - components
      - ConditionalRuleEditor.jsx
      - QuestionField.jsx
    - pages
      - Dashboard.jsx
      - FormBuilder.jsx
      - FormPreview.jsx
      - Login.jsx
      - Response.jsx
    - api.js
    - App.css
    - App.jsx
    - index.css
    - main.jsx
  - index.html
  - package-lock.json
  - package.json
  - README.md

## Clone Repository

```sh
git clone https://github.com/wasimAkram8529/Airtable-Form-Frontend.git
```

## Setup

```sh
cd Airtable-Form-Frontend
npm install
```

## Create .env

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Webhook Configuration

- Download ngrok

```bash
npm install -g ngrok
```

- Start the tunnel

```bash
ngrok http 5000
```

- Ngrok will generate https URL
- Update your .env of with updated https URL

```env
VITE_BACKEND_URL=<https URL>
```

- Restart Your Server
- Navigate to form builder of your frontend
- Give a name to your form(Optional)
- Select a base
- Select a table
- Select required fields in your form
- Create a new form
- Fill the form and save the response
- Go to your airtable account
- Make some changes in particular row of that response in airtable bases table
- Refresh the response you will see the updated data from airtable bases table

## How to Run

```sh
npm run dev
```

- Open "http://localhost:5173"

## Demo video

- "https://drive.google.com/file/d/1MSfLLhSGCFR7r8KG43oQXnVjh5fWbYmt/view?usp=sharing"
