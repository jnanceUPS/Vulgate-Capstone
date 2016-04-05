import java.util.*;
import java.io.*;
import java.nio.file.*;
import java.nio.charset.*;
import java.text.Normalizer;	
import java.net.UnknownHostException;
import java.util.regex.Pattern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;

/** 
*   Takes root file, ignores accents, numbers, and punctuation.
* 	Stores roots in MongoDB server.
*   @author Lukas
**/
public class rootsToDB {
	public static void main(String[] args){
		
		Map<String, List<String>> map = new TreeMap<>();			
		
		//MongoDB initialization
		MongoClient mongo = new MongoClient("localhost", 27017);
		DB db = mongo.getDB("vulgate");
		DBCollection table = db.getCollection("roots");
		table.drop();

		Scanner sc = null;
		long a = System.currentTimeMillis();
		File file = new File("dictionary2.txt");
		try {
			sc = new Scanner(file, "utf-8");
		} catch(FileNotFoundException e) { 
			e.printStackTrace(); 
		}
		List<String> indices;
		while (sc.hasNextLine()){
			String sentence = sc.nextLine();
			sentence = normalize(sentence);
			//System.out.println(sentence);
			String[] words = sentence.split("=");

			String key = words[0];
			String[] roots = words[1].split(";");

			ArrayList<String> wordList = new ArrayList<>();

			for (String word : roots) {
				if (word.equals("")) continue; 
				wordList.add(word);
			}

			map.put(key, wordList);
		}	

		System.out.println(System.currentTimeMillis() - a);

		// //writes to file
		//Path filepath = Paths.get("roots.txt");
		//List<String> output = new ArrayList<>();
		// for (String s: map.keySet())
		// 	output.add(s);
		System.out.println(map.entrySet().size());
		for (Map.Entry<String,List<String>> e : map.entrySet()){
			DBObject entry = new BasicDBObject();
			entry.put("_id", e.getKey());
			entry.put("index", e.getValue());
			table.insert(entry);
			//output.add(e.getKey() + "\t " + e.getValue());
		}
		// try {
		// 	Files.write(filepath, output, Charset.forName("UTF-8"));
		// } catch(IOException e){ e.printStackTrace(); }
	}
	private static String normalize(String word){ //removes the long vowel markings
		String toReturn = word;
		toReturn = Normalizer.normalize(toReturn, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); //simply using the NOrmalizer.Form.NFD didn't remove long marks
        return pattern.matcher(toReturn).replaceAll("");// so we found this online and it works.
    }
}


