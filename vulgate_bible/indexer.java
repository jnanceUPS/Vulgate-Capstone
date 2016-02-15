import java.util.*;
import java.io.*;
import java.nio.file.*;
import java.nio.charset.*;
import java.text.Normalizer;	
import java.net.UnknownHostException;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;

/** 
*   Counts words in all files from a folder, ignores accents, numbers, and punctuation.
* 	Stores index in MongoDB server.
*   @author Lukas
**/
public class indexer {
	public static void main(String[] args){

		/*
		String[] books = {"Genesis","Exodus","Leviticus","Numeri","Deuteronomium","Josue","Judicum","Ruth","Regum I",
		"Regum II","Regum III","Regum IV","Paralipomenon I","Paralipomenon II","Esdræ","Nehemiæ","Tobiæ","Judith",
		"Esther","Job","Psalmi","Proverbia","Ecclesiastes","Canticum Canticorum","Sapientia","Ecclesiasticus","Isaias",
		"Jeremias","Lamentationes","Baruch","Ezechiel","Daniel","Osee","Joël","Amos","Abdias","Jonas","Michæa","Nahum",
		"Habacuc","Sophonias","Aggæus","Zacharias","Malachias","Machabæorum I","Machabæorum II","Matthæus","Marcus",
		"Lucas","Joannes","Actus Apostolorum","ad Romanos","ad Corinthios I","ad Corinthios II","ad Galatas",
		"ad Ephesios","ad Philippenses","ad Colossenses","ad Thessalonicenses I","ad Thessalonicenses II",
		"ad Timotheum I","ad Timotheum II","ad Titum","ad Philemonem","ad Hebræos","Jacobi","Petri I","Petri II",
		"Joannis I","Joannis II","Joannis III","Judæ","Apocalypsis"};
		*/

		//got rid of ae and e umlaut
		String[] books = {"Genesis","Exodus","Leviticus","Numeri","Deuteronomium","Josue","Judicum","Ruth","Regum I",
		"Regum II","Regum III","Regum IV","Paralipomenon I","Paralipomenon II","Esdre","Nehemie","Tobie","Judith",
		"Esther","Job","Psalmi","Proverbia","Ecclesiastes","Canticum Canticorum","Sapientia","Ecclesiasticus","Isaias",
		"Jeremias","Lamentationes","Baruch","Ezechiel","Daniel","Osee","Joel","Amos","Abdias","Jonas","Michea","Nahum",
		"Habacuc","Sophonias","Aggeus","Zacharias","Malachias","Machabeorum I","Machabeorum II","Mattheus","Marcus",
		"Lucas","Joannes","Actus Apostolorum","ad Romanos","ad Corinthios I","ad Corinthios II","ad Galatas",
		"ad Ephesios","ad Philippenses","ad Colossenses","ad Thessalonicenses I","ad Thessalonicenses II",
		"ad Timotheum I","ad Timotheum II","ad Titum","ad Philemonem","ad Hebreos","Jacobi","Petri I","Petri II",
		"Joannis I","Joannis II","Joannis III","Jude","Apocalypsis"};


		File folder = new File("ordered_version/"); 
		File[] files = folder.listFiles();

		Map<String, List<String>> map = new TreeMap<>();			
		
		//MongoDB initialization
		MongoClient mongo = new MongoClient("localhost", 27017);
		DB db = mongo.getDB("vulgate");
		DBCollection table = db.getCollection("index");

		Scanner sc = null;
		int i = 1;
		long a = System.currentTimeMillis();
		for (File file : files){
			try {
				sc = new Scanner(file);
				sc.useDelimiter("\\s+");
			} catch(FileNotFoundException e) { 
				e.printStackTrace(); 
			}

			List<String> indices;
			String index = i + ":";
			index += sc.next();
			while (sc.hasNext()){
				String word = sc.next();
				word = word.replaceAll("\u00E6","e"); //replaces "ae" with "e"
				word = Normalizer.normalize(word, Normalizer.Form.NFD); //takes off accent marks
				if (word.matches("[0-9]+:[0-9]+")) {// beginning line number
					index = i + ":" + word;
					continue;
				}
				word = word.toLowerCase().replaceAll("\\W", ""); //removes punctuation
				word = word.replaceAll("\\d+", ""); //removes numbers
				if (word.equals("")) continue; 

				indices = map.get(word);
				 if (indices == null){
				 	indices = new ArrayList<String>();
				}
				if (!indices.contains(index)){
					indices.add(index);
				}
				map.put(word, indices);		
				
			} 
			i++;
		}	
		System.out.println(System.currentTimeMillis() - a); //prints out time taken, 3-4 seconds 
		
		//puts map into MongoDB

		//table.insert(new BasicDBObject(map));

		// //writes to file
		 Path file = Paths.get("unique_words.txt");
		 List<String> output = new ArrayList<>();
		 for (String s: map.keySet())
		 output.add(s);
		 for (Map.Entry<String,List<String>> e : map.entrySet()){
		 	DBObject entry = new BasicDBObject();
		 	entry.put("_id", e.getKey());
		 	entry.put("index", e.getValue());
		 	table.insert(entry);
		 	//output.add(e.getKey() + "\t" + e.getValue());
		 }
		try {
			Files.write(file, output, Charset.forName("UTF-8"));
		} catch(IOException e){ e.printStackTrace(); }
	}
}
