import java.io.FileOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class PageWriter {

	private FileOutputStream stream;
	private File file;

	public PageWriter(String f) {

		file = new File(f);

		try {
			stream = new FileOutputStream("pages/" + file);
		}
		catch (IOException e) {
			System.out.println("ERROR BLEARGH: " + e.getMessage());
			
		}

	}

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