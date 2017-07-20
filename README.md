These are instructions for running the art-api-exam, created by the talented and Mr. Worthington.

## Getting Started

1.  - Clone this repo to your local machine and install the project's dependencies

  ```
  $ git clone https://github.com/zebrastealer/art-api-exam
  $ cd art-api-exam
  $ yarn
  ```

### Step 2 - Establish environment variables

- In order for the project to run, a CouchDB database must be created and connected to the project.
- During development an IBM cloudant (couchDB) database was used.  A free 30 day trial Cloudant account may be available at the following URL:
  ```
  https://www.ibm.com/analytics/us/en/technology/cloud-data-services/cloudant/
    ```

- Once your database has been configured you'll need to add your COUCHDB_URL and COUCHDB_NAME to the **.ENV** file in the root directory of the art-api-exam project.

- The format for adding the COUCHDB_URL is the following:

  ```
  https://**key**:**password**@**url_of_couch_db**
  ```


### Step 3 - Populate your database
- The **load-data.js** file, located in the root directory of the **art-api-exam** project contains code for bulk adding documents to your database.  The file contains a sample constant "art", commented out, which may be used as a template for creating new documents for bulk upload.
- Add your own data, then modify the **db.bulkDocs** function to reference your own constant.
```
db.bulkDocs(**YOURCONSTANT**, function(err, res) {
  console.log('add new art', **YOURCONSTANT**)
  if (err) {
    return console.log(err)
  }
  console.log('art created')
  console.log(JSON.stringify(res, null, 2))
})
```

- Add an index if desired.  The **load-index.js** located in the root directory of the **art-api-exam**
- An example index (commented out) is included within the **load-index.js** file to use as a template for creating a new index.
- Additional document on creating indexes and the numerous options that can be used may be found here:

```
https://pouchdb.com/api.html#create_index
```

Once you are ready to bulk load data and/or create and index, you may do so by executing these commands from a terminal window or command line.

-Bulk load documents:
```
npm run loaddata

```
-Create indexes
```
npm run createindex
```

### Step 4 - Start the API

- Everything should be configured for you to start the API. From the termianl or cmd prompt run the following:

```
npm start
```

After the API has started you can use **POSTMAN** to GET/PUT/DELETE/READ data from your database.

-Get Postman
```
https://www.getpostman.com/
```
-SAMPLE QUERIES:

**GET**
-all art:
```
http://localhost:**PORT#**/art/
```
-Specific art work by Id:
```
http://localhost:**PORT#**/art/**_ID**
```
-Using a filter with optional, limit, last Item

http://localhost:**PORT#**/art/?filter=**FIELD NAME**&lastItem=**LastItem**_ID**&limit=**number_of_results**

**POST**
-Add new art, using Post in body:
```
http://localhost:**PORT#**/art
```
-Required fields:
```
'name','movement','artist','yearCreated','museum','type'
```
**PUT**
--Update existing art:
```
http://localhost:**PORT#**/art/**_ID**
```
-Required fields:
```
'name','movement','artist','yearCreated','museum','type','_id','rev'
```

**DELETE**
-Delete art:
http://localhost:**PORT#**/art/**_ID**
