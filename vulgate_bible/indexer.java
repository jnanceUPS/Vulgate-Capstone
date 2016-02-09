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

		String[] stopwords = {"et","in","est","ad","non","qui","ejus","de","ut","cum","sunt","eum","que","me","quod",
		"a","quia","enim","te","eos","per","si","eorum","ego","ei","sed","ex","hec","omnes","eis","vos","dixit",
		"tibi","vobis","eo","mihi","ait","erat","ab","usque","pro","rex","quam","quoniam","ne","eam","tua",
		"erit","hoc","dicit","nec","nos","mea","suum","suis","tu","dicens","tuum","sum","suam","quid","meum",
		"ipse","suo","tui","quoque","sua","erant","se","neque","illi","illis","quis","deo","es","quem","illius",
		"tuam","ea","mei","post","nobis","quo","meam","nunc","meus","tuo","sic","cumque","sit","omni","illum",
		"tuus","aut","atque","sui","meo","quibus","esset","ille","illa","his","ac","fuit","tue","fuerit","tuis",
		"sue","hic","qua","sibi","esse","quos","illo","ubi","ipsi","suos","suas","illos","illud","dicentes",
		"etiam","erunt","nostri","malum","at","quidem","estis","cui","vestra","hi","tuos","quas","meis","hanc",
		"vestris","cujus","sumus","mee","dico","nam","vel","sive","illam","tecum","iste","vestri","hujus","eas",
		"vestrum","noster","quidam","tamquam","suorum","meos","amen","tuas","mecum","tuorum","nostrum","illorum",
		"hac","nostra","vester","nostris","ipso","earum","hunc","ipsum","sint","dices","fuerint","ideo","ipsa",
		"nostro","isti","ipsius","tam","eris","istum","quidquam","meas","ero","quorum","vestre","quidquid","vestro",
		"quicumque","vivit","ipsis","vestros","aliquid","ipsorum","tamen","huic","vestram","nostre","isto","nostros",
		"nobiscum","huc","suarum","illic","vestrorum","eadem","nostras","eodem","nostram","eritis","suus","hos",
		"istam","quodcumque","dicitur","dicat","dicent","fui","dixisti","dicam","dicis","istis","quocumque"};
		Arrays.sort(stopwords);

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
				if (Arrays.binarySearch(stopwords, word)>= 0) continue; //if the word is a stopword, skip

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
		// Path file = Paths.get("indexer.txt");
		// List<String> output = new ArrayList<>();

		// for (Map.Entry<String,List<String>> e : map.entrySet()){
		// 	output.add(e.getKey() + "\t" + e.getValue());
		// }
		// try {
		// 	Files.write(file, output, Charset.forName("UTF-8"));
		// } catch(IOException e){ e.printStackTrace(); }
	}
}
