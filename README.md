# Operta

*Operta* is a web application that allows users to upload a source text and receive a list of possible biblical references to the Latin Vulgate Bible from within that source text.  Below, you will find the server installation guide, as well as tips for everyday users who will be accessing the website on their own local machines (after it has already been uploaded to a server).

## Server Installation
First you must install the main dependencies, which includes any libraries, third-party tools, and languages we used in the development of *Operta*.  Second, you must create the index and load it into the database, for without the index the web application will produce no reference results.  Third, you must install the Tesseract OCR software to the server.  Unfortunately it is not pre-installed when you clone the repository.  Without this installed, the OCR functionality will not work.

### Main dependencies
1. Install [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community).
  1. Ensure that you properly syslink the Mongo executable / add it to your system's relevant environment variables.
2. Install [Node](https://nodejs.org/en/).
  1. Here is [another link](https://docs.npmjs.com/getting-started/installing-node) for help in the Node installation process.
  2. Again, ensure that you properly add Node to your system's path / environment variables as needed.
3. Install [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
4. Inside of the Vulgate-Capstone/vulgate_bible folder is a .jar file (mongo-java-driver-3.2.1).  Add this file to your Java classpath.
5. Run `npm install` inside of the main project directory, Vulgate-Capstone, to ensure that all dependencies for node have been properly installed.

### Running the index
1. Open your command line and run the command to start MongoDB.  On a Macintosh system, this command was `mongod`. On a Windows system, this required navigating into the `MongoDB` folder located in `C:\Program Files\` and finding and running `mongod.exe`.
2. Open another command line instance and navigate to the Vulgate-Capstone/vulgate_bible directory.  Run the command `npm install` once more just to make sure that every dependency is loaded.  Compile and run `rootsToDB.java`.   Then, compile and run `java indexer 2`.  Once this is finished, run `java indexer 3`.  This, combined with having started the MongoDB from before, will build the 2-word and 3-word indices and store the results in the database.

### Installing the Tesseract OCR software
Tip: When attempting to run the OCR software through the web application, you may be faced with an error while it is trying to process the uploaded PNG file.  This is likely due to the fact that you did not properly install the trained language data from [Tesseract's trained language data GitHub page.](https://github.com/tesseract-ocr/tessdata)  You will need to grab the `lat.traineddata` file from that page and add it to the proper folder.  This may change depending on where you installed the Tesseract OCR application itself.  If installed on a Macintosh computer using Homebrew, you want to place the `lat.traineddata` file in `/usr/local/Cellar/tesseract/3.04.01/share/tessdata`. If installed on a Windows computer, you want to place the `lat.traineddata` file in `C:\Program Files\Tesseract OCR\tessdata`. Essentially, locate where your `tessdata` folder is located, and place the trained data file inside of this folder.

1. Relatively simple as a Macintosh user, especially using [Homebrew](http://brew.sh/).  In fact, this is one of two ways that both use the command line.  So, unfortunatley, it isn't quite as user friendly as simply Downloading and Installing like one might be used to, but still relatively simple.  Once you have installed Homebrew, using the instructions on the website linked, simply run `brew install tesseract --all-languages` in the command line and you should be good to go.
2. As a Windows user, download the `lat.traineddata` from [Tesseract's trained language data GitHub page.](https://github.com/tesseract-ocr/tessdata) Find where your `tessdata` folder is (most likely `C:\Program Files\Tesseract OCR\tessdata`) and put move `lat.traineddata` into that folder.

### Running the web application itself
1. If it is not already running, start MongoDB by running `mongod` in your command line.
2. Navigate to the main project directory, Vulgate-Capstone, and run the command `node server.js`.
3. Navigate to `localhost:8080` to access the main page of the web application.

## End User Installation
Assuming the web application was properly installed on some server, the end user simply needs to download and install the Tesseract OCR software on their own local machine.

Tip from above: When attempting to run the OCR software through the web application, you may be faced with an error while it is trying to process the uploaded PNG file.  This is likely due to the fact that you did not properly install the trained language data from [Tesseract's trained language data GitHub page.](https://github.com/tesseract-ocr/tessdata)  You will need to grab the `lat.traineddata` file from that page and add it to the proper folder.  This may change depending on where you installed the Tesseract OCR application itself.  If installed on a Macintosh computer using Homebrew, you want to place the `lat.traineddata` file in `/usr/local/Cellar/tesseract/3.04.01/share/tessdata`. If installed on a Windows computer, you want to place the `lat.traineddata` file in `C:\Program Files\Tesseract OCR\tessdata`. Essentially, locate where your `tessdata` folder is located, and place the trained data file inside of this folder.

### Installing the Tesseract OCR Software
1. Relatively simple as a Macintosh user, especially using [Homebrew](http://brew.sh/).  In fact, this is one of two ways that both use the command line.  So, unfortunatley, it isn't quite as user friendly as simply Downloading and Installing like one might be used to, but still relatively simple.  Once you have installed Homebrew, using the instructions on the website linked, simply run `brew install tesseract --all-languages` in the command line and you should be good to go.
2. For Windows, a .exe file is available for the installation of the Tesseract.  Simply head over to [Tesseract's download page](https://github.com/tesseract-ocr/tesseract/wiki/Downloads) and download one of the 3rd party Window's installers.  Run that .exe, and the Tesseract should be installed at `C:\Program Files\Tesseract OCR\`.

