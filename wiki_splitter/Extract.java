import java.util.Arrays;
import java.io.*;

public class Extract{
	public static void main(String[] args) {
		Extractor extractor = new Extractor("pages");
		extractor.extract();

		RootDictionary dict = extractor.getDictionary();
		dict.writeToFile("dictionary.txt");
	}
}