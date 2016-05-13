# Operta

*Operta* is a web application that allows users to upload a source text and receive a list of possible biblical references to the Latin Vulgate bible from within that source text.  Below, you will find the server installation guide, as well as tips for everyday users who will be accessing the website on their own local machines (after it has already been uploaded to a server).

# Server Installation

## Main dependencies
1. Install [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community).
  1. Ensure that you properly syslink the Mongo executable / add it to your system's relevant environment variables.
2. Install [Node](https://nodejs.org/en/).
  1. Here is [another link](https://docs.npmjs.com/getting-started/installing-node) for help in the Node installation process.
  2. Again, ensure that you properly add Node to your system's path / environment variables as needed.
3. Install [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
4. Inside of the Vulgate-Capstone/vulgate_bible folder is a .jar file (mongo-java-driver-3.2.1).  Add this file to your Java classpath.
5. Run `npm install` inside of the main project directory, Vulgate-Capstone, to ensure that all dependencies for node have been properly installed.

## Running the index
1. Open your command line and run the command to start MongoDB.  On a Macintosh system, this command was `mongod`.
2. Open another command line instance and navigate to the Vulgate-Capstone/vulgate_bible directory.  Run the command `npm install` once more just to make sure that every dependency is loaded.  Then, compile and run `java indexer 2`.  Once this is finished, run `java indexer 3`.  This, combined with having started the MongoDB from before, will build the 2-word and 3-word indices and store the results in the database.

## Installing the Tesseract OCR software
1. ...

## Running the web application itself
1. If it is not already running, start MongoDB by running `mongod` in your command line.
2. Navigate to the main project directory, Vulgate-Capstone, and run the command `node server.js`.
3. Navigate to `localhost:8080` to access the main page of the web application.
