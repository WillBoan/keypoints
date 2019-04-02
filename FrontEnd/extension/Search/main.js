
//Search
//case_sentences_for_indexing: List of Strings
//When Search is instantiated as a new object, it must be given all the sentences in the case full text to be indexed

//Example of Search usage
//var s = new Search(["sentence 1 is this one", "but sentence 2 may be better", "is sentence three the one"]);
//var sentence_index = s.find_sentence_in_case("is sentence three the one") // output:2 (which indicates the third sentence due to 0 as start)

function Search(case_sentences_for_indexing) {

  //Configuring options for Fuse library
  var fuse_options = {
    shouldSort: true,
    includeScore: false,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 200,
    minMatchCharLength: 1,
    keys: [
      "title"
    ]
  };


  //TEST DATA//
  //STOPWORDS are words we don't want to be included in search
  const STOPWORDS = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];
  
  // Sentences that are being searched through
  var caseSentences = case_sentences_for_indexing;

  removeStopwordsFromCaseSentences();

  //Initializing Fuse search library
  var fuse = new Fuse(caseSentences, fuse_options);


  // String -> String
  function removeStopwordsFromSentence(sentence){
    sentenceWordList = sentence.split(" ");
    for (var i = 0; i < STOPWORDS.length; i++) {
      sentenceWordList = sentenceWordList.filter(word => word != STOPWORDS[i]);
    }
    //console.log(sentenceWordList);
    trimmedSentence = sentenceWordList.join(" ")
    //console.log(trimmedSentence);
    return trimmedSentence;
  }

  function removeStopwordsFromCaseSentences(){
   for (var i = 0; i<caseSentences.length; i++) {
    caseSentences[i] = removeStopwordsFromSentence(caseSentences[i]);
    }
  }



  this.find_sentence_in_case = function(sentence_to_be_found) {
    trimmedSentence = removeStopwordsFromSentence(sentence_to_be_found);
    var result = fuse.search(trimmedSentence);
    //console.log(result[0]);
    return result[0];
  }
  
}
