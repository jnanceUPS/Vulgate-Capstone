/**
 * This class simply starts the process of splitting up the massive
 * Wiktionary XML dump file into more manageable, individual .txt files.
 *
 * You can find an example of where to find the relevant data dump file
 * in the wiki_dump directory.  Inside is a wiki_dump.png that shows the
 * name of the file should you ever wish to grab the most recent from
 * https://dumps.wikimedia.org/backup-index.html
 */
public class SplitWikiXML {
	public static void main(String[] args) {
		WikiDumpParser.parseFile("wiki_dump/enwiktionary-20160111-pages-meta-current.xml");
	}
}