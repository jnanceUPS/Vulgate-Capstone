import java.io.FileOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

/**
 * This class provides a way to write an XMLPage to its
 * own .txt file whose name is the same as the title of
 * the page from Wiktionary (also the word whose details
 * the page contains).
 * 
 * @author Joshua Nance
 * @version  1.0
 */
public class PageWriter {

	private FileOutputStream stream;
	private File file;

	/**
	 * Constructs a PageWriter object.
	 * Currently this writes to a "pages" folder within
	 * the root wiki_splitter directory, but you could change this if you wish.
	 *
	 * You could also change it so that it takes in the path as an
	 * argument in the constructor, but make sure to update any calls
	 * to the PageWriter constructor within the WikiDumpParser.java file.
	 * 
	 * @param  f The name you wish to assign to the file.
	 */
	public PageWriter(String f) {

		file = new File(f);

		try {
			stream = new FileOutputStream("../pages/" + file);
		}
		catch (IOException e) {
			System.out.println("Error: " + e.getMessage());
			e.printStackTrace();
		}

	}

	/**
	 * This method will write the given XMLPage to it's own
	 * .txt file.
	 * 
	 * @param page The XMLPage to be written to file.
	 */
	public void writePage(XMLPage page) {
		ArrayList<String> contents = page.getContents();

		for (int i = 0; i < contents.size(); i++) {
			try {
				byte[] sbytes = contents.get(i).getBytes();
				stream.write(sbytes);
				stream.flush();

				if(i == contents.size() - 1)
					stream.close();
			}
			catch (IOException e) {

			}
		}

	}
}