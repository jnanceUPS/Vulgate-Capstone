$(document).ready(function(){
        var sentence = "et protulit terra herbam virentem et adferentem semen iuxta genus suum lignumque faciens fructum et habens unumquodque sementem secundum speciem suam et vidit Deus quod esset bonum"
        var words = sentence.split(" ");
        for (var i = 0; i < words.length; i++){
            console.log(stem(words[i]));
        }
});

//given a word, stems it
var stem = function(word){
        
        word = stemQUE(word);

        if ((word.endsWith("ibus") || word.endsWith("arum") || word.endsWith("erum") || word.endsWith("orum") || word.endsWith("ebus")) && word.length >= 6) {
            return word.slice(0,word.length-4);
        } else  if ((word.endsWith("ius") || word.endsWith("uum") || word.endsWith("ium")) && word.length >= 5) {
            return word.slice(0,word.length-3);
        } else  if ((word.endsWith("ae") || word.endsWith("am") || word.endsWith("as") || word.endsWith("em") || word.endsWith("es")
                || word.endsWith("ia") || word.endsWith("is") || word.endsWith("nt") || word.endsWith("os") || word.endsWith("ud")
                || word.endsWith("um") || word.endsWith("us") || word.endsWith("ei") || word.endsWith("ui") || word.endsWith("im")) 
                && word.length >= 4) {
            return word.slice(0,word.length-2);
        } else  if ((word.endsWith("a") || word.endsWith("e") || word.endsWith("i") || word.endsWith("o") || word.endsWith("u")) && word.length >= 3) {
            return word.slice(0,word.length-1);
        }


        if (word.endsWith("iuntur") || word.endsWith("erunt") || word.endsWith("untur") || word.endsWith("iunt") || word.endsWith("unt")) {
                // 'iuntur' 'erunt' 'untur' 'iunt' 'unt' -> 'i'
            return this.wordSuffixToI(word);
        } else  if (word.endsWith("beris") || word.endsWith("bor") || word.endsWith("bo")) {
                // 'beris' 'bor' 'bo' -> 'bi'
            return this.wordSuffixToBI(word);
        } else  if (word.endsWith("ero") && word.length >= 5) {
                // 'ero' -> 'eri'
            word[word.length -1] = 'i';
            return word.slice(0,word.length);
        } else  if ((word.endsWith("mini") || word.endsWith("ntur") || word.endsWith("stis")) && word.length >= 6) {
                // 'mini' 'ntur' 'stis' -> delete
            return word.slice(0,word.length-4);
        } else  if ((word.endsWith("mus") || word.endsWith("mur") || word.endsWith("ris") || word.endsWith("sti") || word.endsWith("tis") || word.endsWith("tur")) && word.length >= 5) {
                // 'mus' 'ris' 'sti' 'tis' 'tur' -> delete
            return word.slice(0,word.length-3);
        } else  if ((word.endsWith("ns") || word.endsWith("nt") || word.endsWith("ri")) && word.length >= 4) {
                // 'ns' 'nt' 'ri' -> delete
            return word.slice(0,word.length-2);
        } else  if ((word.endsWith("m") || word.endsWith("r") || word.endsWith("s") || word.endsWith("t")) && word.length >= 3) {
                // 'm' 'r' 's' 't' -> delete
            return word.slice(0,word.length-1);
        }
                
                // stem nothing
            return word.slice(0,word.length);
    }       




/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Latin Stemmer.
 * based on http://snowball.tartarus.org/otherapps/schinke/intro.html
 * @author Markus Klose

        //TODO queList as txt file an property in schema.xml ???
        
        
        /** list contains words ending with 'que' that should not be stemmed */
        // initialize the queList
var queList = ["atque", "quoque", "neque", "itaque", "absque", "apsque", "abusque", "adaeque", "adusque", "denique",
                                "deque", "susque", "oblique", "peraeque", "plenisque", "quandoque", "quisque", "quaeque",
                                "cuiusque", "cuique", "quemque", "quamque", "quaque", "quique", "quorumque", "quarumque",
                                "quibusque", "quosque", "quasque", "quotusquisque", "quousque", "ubique", "undique", "usque",
                                "uterque", "utique", "utroque", "utribique", "torque", "coque", "concoque", "contorque",
                                "detorque", "decoque", "excoque", "extorque", "obtorque", "optorque", "retorque", "recoque",
                                "attorque", "incoque", "intorque", "praetorque"];
        
        
        /**
         * check if token ends with 'que' and if it should be stemmed
         * @author mk
         * 
         * @param verb
         *      term buffer containing token
         * @param verb.length
         *      length of the token
         * @return 
         *      current verb.length  (verb.length - 3' if token ends with 'que'),<br/> if token should not be stemmed return -1
         */
var stemQUE = function(verb) {
                // buffer to token

                // check if token should be stemmed
                if ($.inArray(verb,queList)) {
                        // dont stem the token
                        return verb;
                }
                
                // chekc if token ends with 'que'
                if (verb.endsWith("que")) {
                        // cut of 'que'
                        return word.slice(0,word.length-3);
                }
                return verb;
        }
/**
         * removing known noun suffixe.<br/>
         * changes to the snowball - additional suffixe: arum, erum, orum, ebus, uum, ium, ei, ui, im
         * @author mk
         * 
         * @param verb
         *      term buffer containing token
         * @param verb.length
         *      length of the token
         * @return
         *      verb.length after stemming
         */
var stemAsNoun = function(verb) {
	// buffer to string

	// check longest suffix
        if ((noun.endsWith("ibus") || noun.endsWith("arum") || noun.endsWith("erum") || noun.endsWith("orum") || noun.endsWith("ebus")) && noun.length >= 6) {
        	return noun.slice(0,noun.length-4);
        } else  if ((noun.endsWith("ius") || noun.endsWith("uum") || noun.endsWith("ium")) && noun.length >= 5) {
        	return noun.slice(0,noun.length-3);
        } else  if ((noun.endsWith("ae") || noun.endsWith("am") || noun.endsWith("as") || noun.endsWith("em") || noun.endsWith("es")
        		|| noun.endsWith("ia") || noun.endsWith("is") || noun.endsWith("nt") || noun.endsWith("os") || noun.endsWith("ud")
        		|| noun.endsWith("um") || noun.endsWith("us") || noun.endsWith("ei") || noun.endsWith("ui") || noun.endsWith("im")) 
        		&& noun.length >= 4) {
        	return noun.slice(0,noun.length-2);
        } else  if ((noun.endsWith("a") || noun.endsWith("e") || noun.endsWith("i") || noun.endsWith("o") || noun.endsWith("u")) && noun.length >= 3) {
        	return noun.slice(0,noun.length-1);
        }

	// stem nothing
	return  verb.slice(0,verb.length);
}
        /**
         * removing / changing known verb suffixe.<br/>
         * @author mk
         * 
         * @param verb
         *      term buffer containing token
         * @param verb.length
         *      length of the token
         * @return
         *      verb.length after stemming
         */
var stemAsVerb = function(verb) {
                // check suffixe
            if (verb.endsWith("iuntur") || verb.endsWith("erunt") || verb.endsWith("untur") || verb.endsWith("iunt") || verb.endsWith("unt")) {
                // 'iuntur' 'erunt' 'untur' 'iunt' 'unt' -> 'i'
                return this.verbSuffixToI(verb);
            } else  if (verb.endsWith("beris") || verb.endsWith("bor") || verb.endsWith("bo")) {
                // 'beris' 'bor' 'bo' -> 'bi'
                return this.verbSuffixToBI(verb);
            } else  if (verb.endsWith("ero") && verb.length >= 5) {
                // 'ero' -> 'eri'
                verb[verb.length -1] = 'i';
                return verb.slice(0,verb.length);
            } else  if ((verb.endsWith("mini") || verb.endsWith("ntur") || verb.endsWith("stis")) && verb.length >= 6) {
                // 'mini' 'ntur' 'stis' -> delete
                return verb.slice(0,verb.length-4);
            } else  if ((verb.endsWith("mus") || verb.endsWith("mur") || verb.endsWith("ris") || verb.endsWith("sti") || verb.endsWith("tis") || verb.endsWith("tur")) && verb.length >= 5) {
                // 'mus' 'ris' 'sti' 'tis' 'tur' -> delete
                return verb.slice(0,verb.length-3);
            } else  if ((verb.endsWith("ns") || verb.endsWith("nt") || verb.endsWith("ri")) && verb.length >= 4) {
                // 'ns' 'nt' 'ri' -> delete
                return verb.slice(0,verb.length-2);
            } else  if ((verb.endsWith("m") || verb.endsWith("r") || verb.endsWith("s") || verb.endsWith("t")) && verb.length >= 3) {
                // 'm' 'r' 's' 't' -> delete
                return verb.slice(0,verb.length-1);
            }
                
                // stem nothing
                return verb.slice(0,verb.length);
        }       


        /**
         * general verb suffixe
         * praesens indikativ aktiv -> o, s, t, mus, tis, (u)nt, is, it, imus, itis
         * praesens konjunktiv aktiv -> am, as, at, amus, atis, ant, iam, ias, iat, iamus, iatis, iant
         *
         * imperfekt indikativ aktiv -> bam,bas,bat,bamus,batis,bant,   ebam,ebas,ebat,ebamus,ebatis,ebant
         * imperfekt konjunktiv aktiv -> rem,res,ret,remus,retis,rent,   erem,eres,eret,eremus,eretis,erent
         *        
         * futur 1 indikativ aktiv -> bo,bis,bit,bimus,bitis,bunt,   am,es,et,emus,etis,ent,   iam,ies,iet,iemus,ietis,ient
         * futur 2 indikativ aktiv ->
         *        
         * perfekt indikativ aktiv -> i,isti,it,imus,istis,erunt,
         * perfekt konjunktiv aktiv -> erim,eris,erit,erimus,eritis,erint
         *        
         * plusquamperfekt indikativ aktiv -> eram,eras,erat,eramus,eratis,erant
         * plusquamperfekt konjunktiv aktiv -> issem,isses,isset,issemus,issetis,issent
         */
        
        // helper methods
        /**
         * replacing suffix with 'i'
         * @param verb
         *      term buffer containing token
         * @param verb.length
         *      length of the token
         * @return
         *      stemmed verb
         */
var verbSuffixToI = function(verb) {
                // 'iuntur' 'erunt' 'untur' 'iunt' 'unt' -> 'i'
                if (verb.endsWith("iuntur") && verb.length >= 8) {
                        return verb.slice(0,verb.length-5);
                } else if ((verb.endsWith("erunt") || verb.endsWith("untur")) && verb.length >= 7) {
                        verb[verb.length - 5] = 'i';
                        return verb.slice(0,verb.length-4);
                } else if (verb.endsWith("iunt") && verb.length >= 6) {;
                        return verb.slice(0,verb.length-3);
                } else if (verb.endsWith("unt") && verb.length >= 5) {
                        verb[verb.length - 3] = 'i';
                        return verb.slice(0,verb.length-2);
                } 
                return verb.slice(0,verb.length);
        }
        
        /**
         * replacing suffix with 'bi'
         * @param verb
         *      term buffer containing token
         * @param verb.length
         *      length of the token
         * @return
         *      stemmed verb
         */
var verbSuffixToBI = function(verb) {
            // 'beris' 'bor' 'bo' -> 'bi'
                if (verb.endsWith("beris") && verb.length >= 7) {
                    verb[verb.length - 4] = 'i';
                    return verb.slice(0,verb.length-3);
                } else if (verb.endsWith("bor") && verb.length >= 5) {
                    verb[verb.length - 2] = 'i';
                    return verb.slice(0,verb.length-1);
                } else if (verb.endsWith("bo") && verb.length >= 4) {;
                    verb[verb.length - 1] = 'i';
                    return verb.slice(0,verb.length);
                }
                return verb.slice(0,verb.length);
        }
