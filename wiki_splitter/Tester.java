import java.io.*;
import java.util.Scanner;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class Tester {

	private static final ArrayList<Character> EXCLUSIONS =
		new ArrayList<Character>(Arrays.asList(' ', '[', ']', '{', '}'));
	private static final CharSequence LATIN = "lang=la";

	private static boolean isValidRoot(String root) {
		boolean hasValidLength = root.length() >= 1;

		char[] rootChars = root.toCharArray();
		boolean specialCharFound = false;

		for (int i = 0; i < rootChars.length; i++) {
			if (EXCLUSIONS.contains(rootChars[i])) {
				specialCharFound = true;
			}
		}

		if (specialCharFound || root.contains(LATIN)) {
			return false;
		}
		else {
			return hasValidLength;
		}
	}

	private static final String SPLITTER = "|";
	private static final String END_CURLY = "}";

	private static String getIrregularRoot(String s) {

		String root = "";
		boolean rootFound = false;
		int leftDelim = 0;
		int rightDelim = 0;

		while (!rootFound) {

			if (leftDelim == 0) {
				leftDelim = s.indexOf(SPLITTER);
				rightDelim = s.indexOf(SPLITTER, leftDelim + 1);

				if (rightDelim == -1) {
					rightDelim = s.indexOf(END_CURLY, leftDelim);
				}
			}

			else {
				leftDelim = rightDelim;
				rightDelim = s.indexOf(SPLITTER, leftDelim + 1);

				if (rightDelim == -1) {
					rightDelim = s.indexOf(END_CURLY, leftDelim);
				}
			}

			if ((leftDelim != -1) && (rightDelim != -1)) {
				root = s.substring(leftDelim + 1, rightDelim);
			}

			// if is valid root return it
			// if it contains any disallowed symbols
			// or lang=la
			// continue the while loop
			// return it when you find it or return nothing

		}

		// int first = input.indexOf(SPLITTER);
		// int second = input.indexOf(SPLITTER, first + 1);
		// int third = input.indexOf(SPLITTER, second + 1);

		// if (third == -1) {
		// 	third = input.indexOf(END_CURLY, second);
		// }

		// String root = "";
		// if ((second != -1) && (third != -1)) {
		// 	root = input.substring(second + 1, third);
		// }
		
		String root = "";
		return root;

	}


	public static void main(String[] args) throws Exception {

		String s = "# {{form of|[[Appendix:Glossary#accusative|Accusative]] singular|medius|lang=la}}";
		getIrregularRoot(s);
		// String rootstr = "lan[gla";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "lang]la";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "lan{gla";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "langla}";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "langl a";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "lang=la";
		// System.out.println(isValidRoot(rootstr));

		//  rootstr = "langla";
		// System.out.println(isValidRoot(rootstr));
		//  rootstr = "";
		// System.out.println(isValidRoot(rootstr));

		// int c = countLines("dictionary.txt");
		// System.out.println(c);
		
		// String sdf = "D..txt";
		// String s = sdf.substring(0,sdf.length()-4);
		// System.out.println(s);

		// File file = new File("dictionary.txt");
		// File dir = new File("pages");
		// File[] listing = dir.listFiles();

		// ArrayList<String> files = new ArrayList<String>();

		// for (int i = 0; i < listing.length; i++) {
		// 	String n = listing[i].getName();
		// 	String no = n.substring(0,n.length()-4);
		// 	files.add(n);
		// }

		// Scanner sc = null;
		// ArrayList<String> rejects = new ArrayList<String>();

		// try {

		// 	sc = new Scanner(file);
		// 	while (sc.hasNextLine()) {
		// 		String line = sc.nextLine();
		// 		String key = line.substring(0,line.indexOf("="));

		// 		boolean found = false;
		// 		if (files.contains(key)) {
		// 			found = true;
		// 		}

		// 		if (!found) {
		// 			rejects.add(key);
		// 		}
		// 	}

		// } catch (IOException e) {
		// 	e.printStackTrace();
		// }

		// for (String string : rejects) {
		// 	System.out.println(string);
		// }


	}
	private static int countLines(String filename) throws IOException {
    InputStream is = new BufferedInputStream(new FileInputStream(filename));
    try {
        byte[] c = new byte[1024];
        int count = 0;
        int readChars = 0;
        boolean empty = true;
        while ((readChars = is.read(c)) != -1) {
            empty = false;
            for (int i = 0; i < readChars; ++i) {
                if (c[i] == '\n') {
                    ++count;
                }
            }
        }
        return (count == 0 && !empty) ? 1 : count;
    } finally {
        is.close();
    }
}
	// private static String getRegularRoot(String input) {
	// 	int first = input.indexOf("|");
	// 	int second = input.indexOf("|", first + 1);

	// 	if (second == -1) {
	// 		second = input.indexOf("}", first);
	// 	}

	// 	String root = "";
	// 	if ((first != -1) && (second != -1)) {
	// 		root = input.substring(first + 1, second);
	// 	}
		
	// 	return root;
	// }

	// private static String getIrregularRoot(String input) {

	// 	int first = input.indexOf("|");
	// 	int second = input.indexOf("|", first + 1);
	// 	int third = input.indexOf("|", second + 1);

	// 	if (third == -1) {
	// 		third = input.indexOf("}", second);
	// 	}

	// 	String root = "";
	// 	if ((second != -1) && (third != -1)) {
	// 		root = input.substring(second + 1, third);
	// 	}

	// 	return root;

	// }
}