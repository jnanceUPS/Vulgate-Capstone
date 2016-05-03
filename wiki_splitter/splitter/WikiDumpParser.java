import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * This class initializes the Wiktionary dump file and
 * goes through it in plain line-by-line fashion using
 * a BufferedReader.  If it comes across a "<page>" tag,
 * it knows to start parsing.  It will build the contents
 * of that page until it hits the ending "</page>" tag.
 *
 * If the page is deemed valid it will be written using a
 * PageWriter object.
 *
 * @author  Joshua Nance
 * @version  1.0
 */
public class WikiDumpParser {

	private static final String BEGIN_PAGE = "<page>"; // marks the start of a word entry in the Wiktionary XML data dump file
	private static final String END_PAGE = "</page>"; // marks the end of a word entry in the Wiktionary XML data dump file
	private static final String TITLE = "<title>"; // the tag that contains a page's title information

	/**
	 * This method will parse the main XML dump file, constructing
	 * individual XMLPage objects as it goes and writing them using
	 * a PageWriter object if they are valid.
	 * 
	 * @param filename The name of the Wiktionary XML dump file.
	 */
	public static void parseFile(String filename) {

		try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {

			String line = "";
			XMLPage page = null;
			String title = "";

			while((line = reader.readLine()) != null) {

				// construct a new page as soon as you hit
				// the beginning "<page>" tag
				if (line.contains(BEGIN_PAGE)) {
					page = new XMLPage(); 
				}

				if (page != null) {
					page.addLine(line);
				}

				if (line.contains(TITLE)) {
					StringBuilder sb = new StringBuilder();
					line = line.trim();

					String name = line.substring(7,line.length()-8); 
					
					sb.append(name);
					sb.append(".txt");
					title = sb.toString();

					page.setTitle(title);

				}

				// if you've reached the end of the page
				if (line.contains(END_PAGE)) {

					// and the title and contents are relevant
					if (page.hasValidTitle() && page.containsLatinEntry())

						// write the XMLPage to a file
						PageWriter pw = new PageWriter(title);
						pw.writePage(page);
						page = null;
					}
					else {
						page = null;
					}
				}
			}

		} catch (IOException e) {
			System.out.println("Could not find file.");
			e.printStackTrace();
		}
	}
}