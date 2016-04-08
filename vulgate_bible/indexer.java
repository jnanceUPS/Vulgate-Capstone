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

		Map<String, List<String>> map = new HashMap<>();			
		Map<String,List<String>> rootMap = getRootMap();

		//MongoDB initialization
		MongoClient mongo = new MongoClient("localhost", 27017);
		DB db = mongo.getDB("vulgate");
		DBCollection table = db.getCollection("index");
		//table.drop();

		Scanner sc = null;
		int i = 0;
		long a = System.currentTimeMillis();
		for (File file : files){
			try {
				sc = new Scanner(file, "utf-8");
			} catch(FileNotFoundException e) { 
				e.printStackTrace(); 
			}

			List<String> indices;
			while (sc.hasNextLine()){
				String sentence = sc.nextLine();
				String[] words = sentence.split(" ");
				String index = books[i] + " [" + words[0] + "]";
				ArrayList<String> wordList = new ArrayList<>();

				for (String word : words) {
					word = Normalizer.normalize(word, Normalizer.Form.NFD); //takes off accent marks
					word = word.toLowerCase().replaceAll("\\W|\\d+", ""); //removes punctuation
					if (word.equals("")) continue; 
					if (Arrays.binarySearch(stopwords,word)>=0) continue;
					List<String> roots = rootMap.get(word);
					if (roots == null){
						if (wordList.contains(word)) continue;
						wordList.add(word);
						continue;
					}
					//for (String root : roots){
					String root = roots.get(0);
						if (wordList.contains(root)) continue;
						else wordList.add(root);
					//}
				}


			String[] x = new String[wordList.size()];
			x = wordList.toArray(x);

			Arrays.sort(x);
			String[] threeWords = null;
			if(args[0].equals("3"))
				threeWords = get3Combos(x);
			else
				threeWords = get2Combos(x);

			for (String word : threeWords) {

				indices = map.get(word);
				if (indices == null){
					indices = new ArrayList<String>();
				}
				if (!indices.contains(index)){
					indices.add(index.intern());
				}
				map.put(word, indices);		
			}
		} 
		System.out.println(i + ": " + (System.currentTimeMillis() - a));
		i++;
	}	
	System.out.println(System.currentTimeMillis() - a);

		// //writes to file
		//Path filepath = Paths.get("3ndex.txt");
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
					int wk2 = str[w2].lastIndexOf(" ");

					String keyPt2 = str[w2];
					if (wk2 >= 0){
						keyPt2 = str[w2].substring(wk2+1,str[w2].length());
					}	

					String key = str[w1] + " " + keyPt2;
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

public static String[] get3Combos(String[] arr){
	int n = arr.length;
	ArrayList<String> iter = new ArrayList<>();
	for (int a = 0; a < n-2; a++){
		for(int b = a + 1; b < n-1; b++){
			for(int c = b + 1; c < n; c++){
				iter.add(arr[a] + " " + arr[b] + " " + arr[c]);
			}
		}
	}

	String[] x = new String[iter.size()];
	x = iter.toArray(x);
	return x;
}

public static String[] get2Combos(String[] arr){
	int n = arr.length;
	ArrayList<String> iter = new ArrayList<>();
	for (int a = 0; a < n-1; a++){
		for(int b = a + 1; b < n; b++){
			iter.add(arr[a] + " " + arr[b]);
		}
	}

	String[] x = new String[iter.size()];
	x = iter.toArray(x);
	return x;
}

public static Map<String,List<String>> getRootMap(){
	Map<String, List<String>> map = new HashMap<>();
	Scanner sc = null;	
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
	return map;
}
	private static String normalize(String word){ //removes the long vowel markings
		String toReturn = word;
		toReturn = Normalizer.normalize(toReturn, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); //simply using the NOrmalizer.Form.NFD didn't remove long marks
        return pattern.matcher(toReturn).replaceAll("");// so we found this online and it works.
    }

}


