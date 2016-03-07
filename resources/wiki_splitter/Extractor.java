import java.io.FileOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.FileNotFoundException;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.Arrays;

public class Extractor {

	/* PRODUCTION FIELDS */
	private File dir;
	private File output;
	private RootDictionary dict;

	/* CONSTANTS */
	private final String XML_TEXT_TAG = "<text";

	private final String BEGIN_LATIN = "==Latin=="; // identifies the relevant latin portion of a given entry
	private final String END_LATIN = "----"; // identifies the end of the relevant latin portion
	
	private final String SPLITTER = "|"; // useful for identifying the root within a line
	private final String BRACKETS = "{{"; // root entries will contain these characters always
	private final String END_CURLY = "}"; // root entries will end with curly brackets as well

	private final int FILE_EXT_OFFSET = 4; // file extensions are all 4 chars long: ".txt"
	private final int VALID_ROOT_LENGTH = 1;

	private final ArrayList<String> IRREGULAR_CODES = new ArrayList<String>(Arrays.asList("form of", "head"));
	private final String HEAD = "head";
	private final String FORM = "form of";

	/*
	Codes are identifiers of parts of speech within the Wiktionary XML data.
	All of the inline codes below were manually determined to be relevant to
	locating a given entry's root word.
	 */
	private final ArrayList<String> INLINE_CODES =
		new ArrayList<String>(
			Arrays.asList(
				"la-noun", "la-verb", "la-proper noun", "la-adj-3rd-1E", "la-adj-3rd-2E",
				"la-adj-3rd-3E", "alternative form of", "feminine noun of", "la-adj-1&amp;2",
				"inflection of", "la-adj-comparative", "la-adj-superlative", "la-adj-comp",
				"la-location", "la-interj", "genitive singular of", "form of", "neuter plural of",
				"feminine singular of", "superlative of", "la-gerundive", "la-future participle",
				"la-present participle", "supine of", "nominative plural of", "vocative plural of",
				"accusative plural of", "contraction of", "vocative singular of", "altname",
				"plural of", "comparative of", "head", "present participle of", "la-perfect participle",
				"la-adv", "alt form"
				));

	/**
		* Creates a new Extractor object.
		* 
		* An Extractor takes in a source directory and parses all possible root words from each of those
		* files.
		* 
		* @param sourceDir The name of the directory containing the text files to be parsed.
	*/
	public Extractor(String sourceDir) {
		this.dir = new File(sourceDir);
		this.dict = new RootDictionary();
	}


	/**
	 * This method will iterate over all files within the given source directory
	 * and begin the process of root extraction for each individual file.
	 */
	public void extract() {
		if (this.dir.exists() && this.dir.isDirectory()) {
			File[] files = this.dir.listFiles();
			if (files != null) {
				for (File file : files) {
					this.findRoots(file);
				}
			}
		}
		else {
			System.out.println("The given file was not a directory, and the program cannot complete its extraction process");
		}
	}

	private void findRoots(File file) {

		if (file.exists() && file.isFile() && file.canRead()) {

			Scanner sc = null;
			boolean latinEntry = false;
			boolean hitTextTag = false;
			boolean headCodeFound = false;
			int rootCount = 0;

			try {
				sc = new Scanner(file);
				while (sc.hasNextLine()) {
					String line = sc.nextLine();

					if (line.contains(XML_TEXT_TAG)) {
						hitTextTag = true;
					}

					if (hitTextTag && line.contains(BEGIN_LATIN)) {
						latinEntry = true;
					}

					if (latinEntry && line.contains(END_LATIN)) {
						sc.close();
						return;
					}

					if (latinEntry && line.contains(BRACKETS)) {
						String code = this.getCode(line);
						if (this.INLINE_CODES.contains(code)) {
							
							if (this.IRREGULAR_CODES.contains(code)) {

								if (code.equals(HEAD)) {
									String key = this.getKey(file.getName());
									this.dict.addRoot(key,key);
									rootCount++;
								}

								if (code.equals(FORM)) {
									String root = this.getIrregularRoot(line);
									String key = this.getKey(file.getName());

									if (this.isValidRoot(root)) {
										this.dict.addRoot(key, root);
										rootCount++;										
									}

								}

							}
							else {
								String root = this.getRegularRoot(line);
								String key = this.getKey(file.getName());

								if (this.isValidRoot(root)) {
									this.dict.addRoot(key, root);
									rootCount++;
								}

							}

						}
					}
				}
				sc.close();

				if (rootCount == 0) {
					String key = this.getKey(file.getName());
					this.dict.addRoot(key,key);
					rootCount++;
				}

			} catch (FileNotFoundException e) {
				System.out.println("FILE NOT FOUND: " + file.getName());
				e.printStackTrace();
			}
		}
	}

	private String getCode(String input) {
		int start = input.indexOf(BRACKETS);
		int end = input.indexOf(SPLITTER,start);
		String code = "";
		if ((start != -1) && (end != -1)) {
			code = input.substring(start + 2, end);
		}
		return code;
	}

	/**
		* The key is the conjugated / declined / w/e form of the
		* given entry, and is the same as the name of the entry's text file
	*/
	private String getKey(String filename) {
		String key = filename.substring(0, filename.length() - FILE_EXT_OFFSET); // gets rid of the file extension ".txt"
		return key;
	}

	private String getRegularRoot(String input) {
		int first = input.indexOf(SPLITTER);
		int second = input.indexOf(SPLITTER, first + 1);

		if (second == -1) {
			second = input.indexOf(END_CURLY, first);
		}

		String root = "";
		if ((first != -1) && (second != -1)) {
			root = input.substring(first + 1, second);
		}

		return root;
	}

	private String getIrregularRoot(String input) {

		int first = input.indexOf(SPLITTER);
		int second = input.indexOf(SPLITTER, first + 1);
		int third = input.indexOf(SPLITTER, second + 1);

		if (third == -1) {
			third = input.indexOf(END_CURLY, second);
		}

		String root = "";
		if ((second != -1) && (third != -1)) {
			root = input.substring(second + 1, third);
		}

		return root;

	}

	private boolean isValidRoot(String root) {
		return (root.length() >= VALID_ROOT_LENGTH);
	}

	public RootDictionary getDictionary() {
		return this.dict;
	}
}