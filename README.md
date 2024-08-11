# Trade Parsing and Balance Calculator
 
## Overview
 
This project provides an API to parse cryptocurrency trade data from CSV files, store it in a MongoDB database, and retrieve asset-wise balances at specific timestamps.
 
## Endpoints
 
### 1. Serve the Index HTML
 
**Endpoint:** `GET /`
 
**Description:** Serves the `index.html` file located in the `views` directory.
 
**Usage:** Access this endpoint in a web browser to upload the CSV file.
 
### 2. Upload and Analyze CSV
 
**Endpoint:** `POST /analyse-csv`
 
**Description:** Uploads a CSV file, parses its data, and stores it in the MongoDB database.
 
**Request:**
- **File:** `file` (required) - The CSV file to be uploaded.
 
**Response:**
- **Success:** Returns a JSON object with the parsed CSV data.
- **Error:** Returns a JSON object with an error message if the file is missing or invalid.
 
**Example Request:**
```bash
curl -X POST http://localhost:3000/analyse-csv -F "file=@path/to/file.csv"
```
 
**Example Response:**
```json
{
  "result": [
    {
      "UTC_Time": "2022-09-28 12:00:00",
      "Operation": "buy",
      "Market": "BTC/INR",
      "Buy/Sell Amount": 25,
      "Price": 50000
    },
    ...
  ]
}
```
 
### 3. Get User Balance
 
**Endpoint:** `POST /get-balance`
 
**Description:** Retrieves the asset-wise balance of the account at a specific timestamp.
 
**Request:**
- **Body:** JSON object containing a `timestamp` property (required).
 
**Example Request:**
```bash
curl -X POST http://localhost:3000/get-balance -H "Content-Type: application/json" -d '{"timestamp": "2022-09-28 12:00:00"}'
```
 
**Example Response:**
```json
{
  "BTC": 15,
  "MATIC": 100
}
```
 
**Error Response:**
- **Error:** Returns a JSON object with an error message if the timestamp is missing or invalid.
 
## Setup and Installation
 
1. **Clone the repository:**
   ```bash
   git clone https://github.com/debayangg/koinx-assignment.git
   cd koinx-assignment
   ```
 
2. **Install dependencies:**
   ```bash
   npm install
   ```
 
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the necessary environment variables, including database connection details or change mongodbURI in `src/db/connection.js` to your local mongo server.
 
4. **Start the server:**
   ```bash
   npm start
   ```
 
   The server will listen on the port defined in your environment variable `PORT` or default to `3000`.
