import java.util.ArrayList;

public class XMLPage {

	private ArrayList<String> contents;
	private String title; 

	public XMLPage() {
		this.contents = new ArrayList<String>();
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitle() {
		return this.title;
	}

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

	public boolean containsLatinEntry() {
		boolean contains = false;

		for (String s : contents) {
			if (s.contains("==Latin==")) {
				contains = true;
			}
		}
		return contains;
	}

	public void addLine(String line) {
		contents.add(line);
		contents.add("\n");
	}

	public ArrayList<String> getContents() {
		return this.contents;
	}

}