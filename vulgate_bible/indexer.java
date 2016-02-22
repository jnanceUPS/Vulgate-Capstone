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

		String[] stopwords = {"ille","illa","illud","illi","illae","illius","illorum","illarum","illis","illum","illam",
		"illos","illas","illo","ac","at","atque","aut","et","nec","non","sed","vel","antequam","cum","dum","si","usque",
		"ut","qui","quae","quod","cuius","cui","quem","quam","quo","qua","quorum","quarum","quibus","quos","quas","ante",
		"per","ad","propter","circum","super","contra","versus","inter","extra","intra","trans","post","sub","in","ob",
		"praeter","a","ab","sine","de","pro","prae","e","ex","est","ejus","sunt","eum","que","me","quia","enim","te",
		"eos","eorum","ego","ei","hec","omnes","eis","vos","dixit","tibi","vobis","eo","mihi","ait","erat","rex",
		"quoniam","ne","eam","tua","erit","hoc","dicit","nos","mea","suum","suis","tu","dicens","tuum","sum","suam",
		"quid","meum","ipse","suo","tui","quoque","sua","erant","se","neque","quis","deo","es","tuam","ea","mei","nobis",
		"meam","nunc","meus","tuo","sic","cumque","sit","omni","tuus","sui","meo","esset","his","fuit","tue","fuerit",
		"tuis","sue","hic","sibi","esse","ubi","ipsi","suos","suas","dicentes","etiam","erunt","nostri","malum","quidem",
		"estis","vestra","hi","tuos","meis","hanc","vestris","cujus","sumus","mee","dico","nam","sive","tecum","iste",
		"vestri","hujus","eas","vestrum","noster","quidam","tamquam","suorum","meos","amen","tuas","mecum","tuorum",
		"nostrum","hac","nostra","vester","nostris","ipso","earum","hunc","ipsum","sint","dices","fuerint","ideo","ipsa",
		"nostro","isti","ipsius","tam","eris","istum","quidquam","meas","ero","vestre","quidquid","vestro","quicumque",
		"vivit","ipsis","vestros","aliquid","ipsorum","tamen","huic","vestram","nostre","isto","nostros","nobiscum","huc",
		"suarum","illic","vestrorum","eadem","nostras","eodem","nostram","eritis","suus","hos","istam","quodcumque",
		"dicitur","dicat","dicent","fui","dixisti","dicam","dicis","istis","quocumque","adhic","aliqui","aliquis","an",
		"apud","autem","cur","deinde","ergo","etsi","fio","haud","iam","idem","igitur","infra","interim","is","ita",
		"magis","modo","ox","necque","nisi","o","possum","quare","quilibet","quisnam","quisquam","quisque","quisquis",
		"tum","uel","uero","unus"};
		Arrays.sort(stopwords);


		File folder = new File("ordered_version/"); 
		File[] files = folder.listFiles();

		Map<String, List<String>> map = new TreeMap<>();			
		
		//MongoDB initialization
		MongoClient mongo = new MongoClient("localhost", 27017);
		DB db = mongo.getDB("vulgate");
		DBCollection table = db.getCollection("index");

		Scanner sc = null;
		int i = 0;
		long a = System.currentTimeMillis();
		for (File file : files){
			try {
				sc = new Scanner(file);
				sc.useDelimiter("\\s+");
			} catch(FileNotFoundException e) { 
				e.printStackTrace(); 
			}

			List<String> indices;
			String index = books[i] + " [" + sc.next() + "]";
			while (sc.hasNext()){
				String word = sc.next();
				word = word.replaceAll("\u00E6","e"); //replaces "ae" with "e"
				word = Normalizer.normalize(word, Normalizer.Form.NFD); //takes off accent marks
				if (word.matches("[0-9]+:[0-9]+")) {// beginning line number
					index = books[i] + " [" + word + "]";
					continue;
				}
				word = word.toLowerCase().replaceAll("\\W", ""); //removes punctuation
				word = word.replaceAll("\\d+", ""); //removes numbers
				if (word.equals("")) continue; 
				if (Arrays.binarySearch(stopwords,word)>=0) continue;

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
		
		//map = getMatchingWords(map);
				
		System.out.println(System.currentTimeMillis() - a);

		// //writes to file
		Path filepath = Paths.get("unique_words.txt");
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
			Files.write(filepath, output, Charset.forName("UTF-8"));
		} catch(IOException e){ e.printStackTrace(); }
	}

	public static Map<String, List<String>> getMatchingWords(Map<String, List<String>> map){

	String[] str = new String[map.size()];
	str = map.keySet().toArray(str);


	Map m = new TreeMap<String,List<String>>();

	for (int w1 = 0; w1 < str.length-1; w1++){
		for(int w2 = w1+1; w2 < str.length; w2++){
			List<String> inds1 = map.get(str[w1]);
			List<String> inds2 = map.get(str[w2]);
			for(String i : inds1){
				if (inds2.contains(i)) {
					String key = str[w1] + " " + str[w2];
					List<String> val = (List<String>) m.get(key);
					if (val == null){
						val = new ArrayList<String>();
					}
					if (!val.contains(i)){
						val.add(i);
					}
					m.put(key, val);

				}
			}

		}
	} 	
	return m;
}
}


