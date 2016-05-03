/**
 * Everything in this "class" was also at some point
 * in the main Extractor.java file.
 *
 * Every piece of code in here was used to either
 * test the Extractor in its current state, or to
 * get enough information about the Wiktionary data
 * to get the Extractor to that state.
 *
 * Strings like
 * 	===Noun/Verb/Adj/etc===
 * 	====Noun/Verb/Adj/etc====
 * were used to indicate that a "Part of Speech"
 * portion of the wiki data had been reached, where
 * information relevant to the root and its classification
 * may appear.
 *
 * 
 */

private class ExtractorThrowouts {

	private HashMap<String, HashMap<String,String>> codes;

	/* TESTING FIELDS */
	private int numNouns = 0;
	private int numVerbs = 0;
	private int numAdjcs = 0;
	private int numParts = 0;
	private int numOther = 0;

	// the h3 version
	private final String NOUN1 = "===Noun==="; // part of speech
	private final String VERB1 = "===Verb==="; // part of speech
	private final String ADJECTIVE1 = "===Adjective==="; // part of speech
	private final String PARTICIPLE1 = "===Participle==="; // part of speech
	private final String ADVERB1 = "===Adverb==="; // part of speech
	private final String GERUND1 = "===Gerund==="; // part of speech

	// the h4 version (perhaps nested inside another h3 for example)
	private final String NOUN2 = "====Noun===="; // part of speech
	private final String VERB2 = "====Verb===="; // part of speech
	private final String ADJECTIVE2 = "====Adjective===="; // part of speech
	private final String PARTICIPLE2 = "====Participle===="; // part of speech
	private final String ADVERB2 = "====Adverb===="; // part of speech
	private final String GERUND2 = "====Gerund===="; // part of speech

	private final String OTHER = "===Other==="; // anything that is not one of the above for parts of speech

	private final ArrayList<String> NEXT_LINE_CODES =
		new ArrayList<String>(
			Arrays.asList(
				"{{la-verb-form", "{{la-noun-form", "{{la-pronoun-form", "{{la-adj-form", "{{la-adj-comp-form",
				"{{la-noun form", "{{la-num-form", "{{la-adj form", "{{la-proper-noun-form", "{{la-proper noun-form",
				"{{la-gerund-form"
				));

	/**
	 * The main workhorse of the Extractor class.
	 * This method will go through each of the individual entries in the main source directory
	 * (as specified in the constructor) and will call the relevant methods to extract the
	 * information needed from each of these files.
	 * The title of each file will correspond to the key in the final output.
	 * The root word will correspond to the value in the final output.
	 */
	private void extractTest() {

		if (this.dir.exists() && this.dir.isDirectory()) {

			File[] files = this.dir.listFiles();

			if (files != null) {

				for (File f : files) {

					/*
					Each text file corresponds to an individual word (one entry in Wiktionary).
					This system will assign to each word one of five possible categorizations:
						Noun, Verb,Adjective, Participle, Other
					Each categorization has an associated parsing method, because each one requires
					a different parsing strategy than the others.
					 */
					String category = this.getCategory(f);

					if (category.equals(NOUN1)) {
						this.findCodes(NOUN1, f);
						// this.numNouns++;
					}
					if (category.equals(VERB1)) {
						this.findCodes(VERB1, f);
						// this.numVerbs++;
					}
					if (category.equals(ADJECTIVE1)) {
						this.findCodes(ADJECTIVE1, f);
						// this.numAdjcs++;
					}
					if (category.equals(PARTICIPLE1)) {
						this.findCodes(PARTICIPLE1, f);
						// this.numParts++;
					}
					if (category.equals(OTHER)) {
						this.findCodes(OTHER, f);
						// this.numOther++;
					}
				}
			}
		}
	}

	/**
	 * This method will determine the possible subcategories that will help us later in parsing the roots
	 * 
	 * @param category The overarching category of a given entry
	 * @param f The file corresponding to the current entry
	 */
	private void findCodes(String category, File f) {

		/*
		The HashMap codes will have categories as its key values and HashMaps
		as its values.  These other HashMaps will have unique codes as its keys and the values
		will correspond to the first file that specific code was encountered in.

		E.g. codes = { "===Noun===" => { code => file.txt, code => otherfile.txt ... } ... }

		The idea is to find all the possible codes or subcategories for each category.
		Then we can identify the roots more easily when we parse each different category.
		 */
		HashMap<String, String> values = codes.get(category);
		if (values == null) { // if a given codes HashMap has yet to be instantiated
			values = new HashMap<String, String>(); // instantiate it
			codes.put(category, values); // and place it its category within the codes HashMap
		}
		
		if (f.exists() && f.isFile() && f.canRead()) {

			// we want to record the files that contained new codes so we can manually check them if needed
			String filename = f.getName(); 

			Scanner sc = null;
			boolean categoryReached = false;
			boolean latinEntry = false;
			boolean hitTextTag = false;
			
			try {
				sc = new Scanner(f);
				while (sc.hasNextLine()) {
					String line = sc.nextLine();

					if (line.contains(XML_TEXT_TAG)) {
						hitTextTag = true;
					}

					if (hitTextTag && line.contains(BEGIN_LATIN)) {
						latinEntry = true;
					}

					if (latinEntry && line.contains(category)) {
						categoryReached = true;
					}

					if (latinEntry && line.contains(END_LATIN)) {
						sc.close();
						return;
					}

					if (categoryReached && line.contains(BRACKETS) && line.contains(SPLITTER)) {
						int start = line.indexOf(BRACKETS);
						int end = line.indexOf(SPLITTER, start);

						if ((start != -1) && (end != -1)) { // current line contains both of the symbols marking a root definition
							String code = line.substring(start + 2, end);
							if (!values.containsKey(code)) {
								values.put(code, filename);
							}
						}
					}
				}
				sc.close();
			} catch (FileNotFoundException e) {
				System.out.println("FAILED TO LOCATE FILE: " + f.getName());
				e.printStackTrace();
			}
		}
	}

	/**
		* 
		* The possible categorizations include Noun, Verb, Adjective, Participle, and Other.
		* Each entry will be categorized as only one of the above.
	*/
	private String getCategory(File f) {

		if (f.exists() && f.isFile() && f.canRead()) {

			Scanner sc = null;

			/*
			Each file is guaranteed to have a Latin section, however each file may also have one or more entries
			for languages other than Latin.  We therefore must keep track of whether we have reached the relevant
			Latin entry for a given file.
			 */
			boolean latinEntry = false;
			
			try {
				sc = new Scanner(f);
				while (sc.hasNextLine()) {
					String line = sc.nextLine();

					// we've reached the relevant portion of the file
					if (line.contains(BEGIN_LATIN)) {
						latinEntry = true;
					}

					/*
					If we've reached the end of the Latin portion and the current entry
					cannot be classified under any of the four main categories we can
					simply return Other.
					 */
					if (latinEntry && line.contains(END_LATIN)) {
						sc.close();
						return OTHER;
					}

					/*
					If we've reached the Latin portion of the file, we can begin to test
					for possible categorizations of the word.
					 */
					if (latinEntry) {
						if (line.contains(NOUN1)) {
							sc.close();
							return NOUN1;
						}
						if (line.contains(VERB1)) {
							sc.close();
							return VERB1;
						}
						if (line.contains(ADJECTIVE1)) {
							sc.close();
							return ADJECTIVE1;
						}
						if (line.contains(PARTICIPLE1)) {
							sc.close();
							return PARTICIPLE1;
						}
					}
				}
			} catch (FileNotFoundException e) {
				System.out.println("FAILED TO LOCATE FILE: " + f.getName());
				e.printStackTrace();
			}
		}

		return OTHER;
	}
}