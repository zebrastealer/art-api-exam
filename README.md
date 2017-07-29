These are instructions for running the art-mysql-exam, created by the talented Mr. Worthington.  This version of the project supports connection to both a couchDB or mySQL instance, depending on the API used.  Please be aware the instructions below will identify which steps are different depending on whether you are using a couchDB or mySQL backend.

## Getting Started

1.  - Clone this repo to your local machine and install the project's dependencies

  ```
  $ git clone https://github.com/zebrastealer/art-api-exam
  $ cd art-mysql-exam
  $ yarn
  ```

### Step 2 - Establish environment variables

###For COUCHDB Backend###

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
###For MySQL Backend###
-Please skip to the MySQL Backend section of Step 3.

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
- Additional documentation on creating indexes and the numerous options that can be used may be found here:

```
https://pouchdb.com/api.html#create_index
```

Once you are ready to bulk load data and/or create an index, you may do so by executing these commands from a terminal window or command line.

-Bulk load documents:
```
npm run loaddata

```
-Create indexes
```
npm run createindex
```

###For MySQL Backend###
-These instructions assume familiarity with mysql databases along with having a running mysql database instance with access to the root user and password to install the database schema and populate the database tables and views.  

-From your MySQL terminal prompt, run the database import file -

```
cd sql-scripts
$ mysql < art-mysql-exam-gw.sql -u root -p -h 0.0.0.0 -P 3306
```
Now create a new **.ENV** file in the root directory of the art-mysql-exam project, edit the file to contain the following information - adjust the data as required to match your own configuration.

```
MYSQL_USER=root
MYSQL_HOST=0.0.0.0
MYSQL_PASSWORD=******
MYSQL_DATABASE=art-mysql-exam
DAL=./dal-sql.js

```
### Step 4 - Start the API

- Everything should be configured for you to start the API. The package.json file contains scripts configured to start either version of the backend.  From the terminal or cmd prompt you can start either version as follows.

###For COUCHDB Backend###
- The CouchDB version of the api may be started by executing this command in the terminal:
```
npm test
```

###For MySQL Backend###
- The MySQL version of the api may be started by executing this command in the terminal:
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
http://localhost:**PORT#**/art/paintings
```
-Specific art work by Id:
```
http://localhost:**PORT#**/art/paintings/:id
```
-Using a filter with optional limit

```
http://localhost:6000/art/paintings?filter=artist:Michaelangelo the Great&limit=4
```
-Using a filter with optional limit & last Item
```
http://localhost:**PORT#**/art/paintings?filter=**FIELD NAME**&lastItem=**LastItem**_ID**&limit=**number_of_results**
```
**POST**
-Add new art, using post in body:
```
http://localhost:**PORT#**/art
```
-Required fields:
```
'name','movement','artist','yearCreated','museum','type'
```

Example JSON for Create/Post:
```
{
    "name": "The Creation of Adam",
    "movement": "Renaissance",
    "artist": "Michaelangelo the Great",
    "type": "painting",
    "yearCreated": 1504,
    "museum": {
        "name": "Galleria dell'Accademia",
        "location": "Florenece"
    }
}
```
**PUT**
-Update existing art, using put:
```
http://localhost:**PORT#**/art/paintings/**_ID**
```
-Required fields:
```
'name','movement','artist','yearCreated','museum','type','_id','_rev'
```
Example JSON for update:
```
{  
   "_id": 1,
    "_rev": "blahblah"
    "name": "Painting 1",
    "artist": "Salvador Dali",
    "yearCreated": 1937,
    "movement": "surrealism"
    "museum": {
        "name": "Santa Maria delle Grazie",
        "location": "Milan"
    }

}
```
**DELETE**
-Delete art, using delete.:
```
http://localhost:**PORT#**/art/**_ID**
```
