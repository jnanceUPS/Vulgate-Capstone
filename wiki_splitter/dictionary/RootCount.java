import java.io.*;
import java.util.*;

public class RootCount {
	public static void main(String[] args) {
		String filename = args[0];

		File file = new File(filename);
		boolean g2g = false;
		int rootCount = 0;
		if (file.exists() && file.isFile() && file.canRead()) {
			Scanner sc = null;
			try {
				sc = new Scanner(file);
				while (sc.hasNextLine()) {
					char separator = ';';
					String line = sc.nextLine();
					char[] ca = line.toCharArray();

					for (int i = 0; i < ca.length; i++) {
						if (ca[i] == separator) {
							rootCount = rootCount + 1;
						}
					}
				}
			} catch(FileNotFoundException e) {
				e.printStackTrace();
			}
		}
		System.out.println("Roots found: " + rootCount);
		// produces 685,270
	}
}