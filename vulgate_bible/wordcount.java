import java.util.*;
import java.io.*;
import java.nio.file.*;
import java.nio.charset.*;
import java.text.Normalizer;

/** Counts words in all files from a folder, ignores accents, numbers, and punctuation.
* 	Writes frequency of each word to a text file.
*	@author Lukas
**/
public class wordcount {
	public static void main(String[] args){

		File folder = new File("original_version/"); //
		File[] files = folder.listFiles();

    	Map<String, Integer> map = new HashMap<>();			
		
		Scanner sc = null;

		for (File file : files){
			try {
				sc = new Scanner(file);
				sc.useDelimiter(" ");
			} catch(FileNotFoundException e) { e.printStackTrace(); }
		
			while (sc.hasNextLine()){
				String word = sc.next();
				word = Normalizer.normalize(word, Normalizer.Form.NFD); //takes of accent marks
				word = word.toLowerCase().replaceAll("\\W", ""); //removes punctuation
				word = word.replaceAll("\\d+", ""); //removes numbers
				if (word.equals("")) continue; 
				Integer n = map.get(word);
	    	    n = (n == null) ? 1 : ++n; //adds to frequency 
	    	    map.put(word, n);
			}
		}
		
		//sorts
		map = MapUtil.sortByValue(map);
		
		//writes to file
		Path file = Paths.get("wordcount.txt");
		List<String> output = new ArrayList<>();
		
		for (Map.Entry<String,Integer> e : map.entrySet()){
			output.add(e.getValue() + "\t" + e.getKey());
		}
		try {
		Files.write(file, output, Charset.forName("UTF-8"));
		} catch(IOException e){ e.printStackTrace(); }
	}
}

//hashmap sorter, reversed so largest appears first	
class MapUtil
{
    public static <K, V extends Comparable<? super V>> Map<K, V> 
        sortByValue( Map<K, V> map )
    {
        List<Map.Entry<K, V>> list = new LinkedList<Map.Entry<K, V>>( map.entrySet() );
        Collections.sort( list, new Comparator<Map.Entry<K, V>>()
        {
            public int compare( Map.Entry<K, V> o1, Map.Entry<K, V> o2 )
            {
                return (o2.getValue()).compareTo( o1.getValue() );
            }
        } );

        Map<K, V> result = new LinkedHashMap<K, V>();
        for (Map.Entry<K, V> entry : list)
        {
            result.put( entry.getKey(), entry.getValue() );
        }
        return result;
    }
}
