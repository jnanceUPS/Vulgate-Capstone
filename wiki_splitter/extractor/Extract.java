import java.util.Arrays;
import java.io.*;

/**
 * This class calls the Extractor's extract method, which
 * gets the root extraction process started.
 *
 * The Wiktionary data must first be split into individual
 * text files using the splitter files.
 */
public class Extract{
	public static void main(String[] args) {
		Extractor extractor = new Extractor("pages");
		extractor.extract();

		RootDictionary dict = extractor.getDictionary();
		dict.writeToFile("dictionary.txt");
	}
}