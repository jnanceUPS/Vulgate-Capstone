import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class WikiDumpParser {

	private static final String BEGIN_PAGE = "<page>";
	private static final String END_PAGE = "</page>";
	private static final String TITLE = "<title>";

	public static void parseFile(String filename) {

		try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {

			String line = "";
			XMLPage page = null;
			String title = "";

			while((line = reader.readLine()) != null) {

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

				if (line.contains(END_PAGE)) {

					if (page.hasValidTitle() && page.containsLatinEntry()) {
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
			e.printStackTrace();
		}
	}

}





























