import java.util.HashMap;
import java.util.ArrayList;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * This class serves as a wrapper for the HashMap that contains
 * root word data.  The dictionar is itself a Hashmap whose
 * keys are Strings and whose values are ArrayLists of Strings.
 *
 * A small example of how this would look:
 * 		unrootedWord => rootOne, rootTwo, ..., rootN
 *
 * This representation allows you to record multiple roots, should a word have more than one.
 * 
 * @author  Joshua Nance
 * @version  1.0
 */
public class RootDictionary {

	private HashMap<String, ArrayList<String>> dictionary;

	/**
	 * Creates a new RootDictionary object.
	 * 
	 */
	public RootDictionary() {
		this.dictionary = new HashMap<String, ArrayList<String>>();
	}

	/**
	 * Adds a root to the dictionary.
	 * 
	 * @param key The unrooted word.
	 * @param val The root word.
	 */
	public void addRoot(String key, String val) {

		if (!this.dictionary.containsKey(key)) {
			this.dictionary.put(key, new ArrayList<String>());
		}

		ArrayList<String> vals = this.dictionary.get(key);
		if (!vals.contains(val)) {
			vals.add(val);
		}

	}

	/**
	 * This method will write the entire dictionary to a given file.
	 * 
	 * @param filename The name of the file to write to.
	 */
	public void writeToFile(String filename) {
		File file = new File(filename);
		FileOutputStream stream = null;

		try {

			if (!file.exists()) {
				file.createNewFile();
			}

			stream = new FileOutputStream(file);

			for (String s : this.dictionary.keySet()) {

				String key = s.toString();
				byte[] keyBytes = key.getBytes();
				stream.write(keyBytes);

				String mapping = "=";
				byte[] mappingBytes = mapping.getBytes();
				stream.write(mappingBytes);

				ArrayList<String> vals = this.dictionary.get(s);
				for (String root : vals) {
					byte[] rootBytes = root.getBytes();
					stream.write(rootBytes);

					String separator = ";";
					byte[] separatorBytes = separator.getBytes();
					stream.write(separatorBytes);
				}

				String nl = "\n";
				byte[] nlBytes = nl.getBytes();
				stream.write(nlBytes);

				stream.flush();
			}

			stream.close();

		} catch (IOException e) {
			System.out.println("Could not create stream for file: " + file.getName());
			e.printStackTrace();
		}


	}

	/**
	 * Testing method to check that the right information is getting recorded.
	 * Not important for production.
	 */
	public void printDictionary() {
		for (String s : this.dictionary.keySet()) {
			String key = s.toString();
			System.out.print(key + "=");
			ArrayList<String> vals = this.dictionary.get(s);
			for (String str : vals) {
				System.out.print(str + ";");
			}
		}
	}
}