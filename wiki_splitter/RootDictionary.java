import java.util.HashMap;
import java.util.ArrayList;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class RootDictionary {

	private HashMap<String, ArrayList<String>> dictionary;

	public RootDictionary() {
		this.dictionary = new HashMap<String, ArrayList<String>>();
	}

	public void addRoot(String key, String val) {

		if (!this.dictionary.containsKey(key)) {
			this.dictionary.put(key, new ArrayList<String>());
		}

		ArrayList<String> vals = this.dictionary.get(key);
		if (!vals.contains(val)) {
			vals.add(val);
		}

	}

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