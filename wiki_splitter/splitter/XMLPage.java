import java.util.ArrayList;

/**
 * Wiktionary data is available as one large XML dump file.
 * Within this dump file are several <pre><page></page></pre>
 * tags, within which is contained the information for one word.
 *
 * This class will check to see if that page contains the information
 * we need to extract a Latin root.
 *
 * @author  Joshua Nance
 * @version 1.0
 */
public class XMLPage {

	private ArrayList<String> contents; // line-by-line string representation of the page
	private String title; // the word covered by the page, also the title of the page

	/**
	 * Constructs a new XMLPage Object
	 */
	public XMLPage() {
		this.contents = new ArrayList<String>();
	}

	/**
	 * Sets the title of the page.
	 * Remember that the title is the same as the word to which
	 * the page's information pertains.
	 * @param title The name of the page; the word covered by that page.
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * Returns the title of the page.
	 * @return String The title of the page.
	 */
	public String getTitle() {
		return this.title;
	}

	/**
	 * I first learned about what constituted a valid title
	 * from "Latin Word Stemming using Wiktionary"
	 * by Richard Koury and Francesca Sapsford.
	 *
	 * This method checks the criteria laid out in that paper,
	 * and marks the page title as valid if it meets those criteria.
	 * If the title is not valid, we can dont' need to parse this
	 * page and can skip it.
	 * 
	 * @return boolean Whether the title is valid or not.
	 */
	public boolean hasValidTitle() {
		boolean valid = true;

		if (this.title.contains("/"))
			valid = false;

		if (this.title.contains(":"))
			valid = false;

		if (this.title.contains("-"))
			valid = false;

		return valid;
	}

	/**
	 * If the page contains the key header we are looing for
	 * (==Latin==), then we know it contains information we want.
	 * 
	 * @return boolean Whether the page contains Latin data.
	 */
	public boolean containsLatinEntry() {
		boolean contains = false;

		for (String s : contents) {
			if (s.contains("==Latin==")) {
				contains = true;
			}
		}
		return contains;
	}

	/**
	 * Adds a line from the page data to the XMLPage's
	 * content ArrayList, and then adds a newline after it
	 * for formatting purposes.
	 * 
	 * @param line A line of content from the page being parsed.
	 */
	public void addLine(String line) {
		contents.add(line);
		contents.add("\n");
	}

	/**
	 * Returns an ArrayList containing the line-by-line
	 * contents of the XMLPage.
	 * @return ArrayList The line-by-line contents of the XMLPage.
	 */
	public ArrayList<String> getContents() {
		return this.contents;
	}

}