function Search() {
  //TEST DATA//
  //STOPWORDS are words we don't want to be included in search
  const STOPWORDS = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];
  
  // Sentence that is being searched for
  var TEST_SENTENCE = "His probationary period was extended twice and the employer reprimanded him on three separate occasions during the course of his employment."
  
  // Sentences that are being searched through
  var caseSentences = [
    {
        title: "He held a position under the Civil Service Act and was an office holder at pleasure",
        sentenceNumber: 1
    },
    {
        title: "The appellants probationary period was extended twice, to the maximum 12 months.",
        sentenceNumber: 2
    },
    {
        title: "At the end of each probationary period, the appellant was given a performance review",
        sentenceNumber: 3
    }
  ]

  // String -> String
  function removeStopwordsFromSentence(sentence){
    sentenceWordList = sentence.split(" ");
    for (var i = 0; i < STOPWORDS.length; i++) {
      sentenceWordList = sentenceWordList.filter(word => word != STOPWORDS[i]);
    }
    console.log(sentenceWordList)
    trimmedSentence = sentenceWordList.join(" ")
    console.log(trimmedSentence)
    return trimmedSentence;
  }


  //Formatting Test Data//
  TEST_SENTENCE = removeStopwordsFromSentence(TEST_SENTENCE)
  console.log(TEST_SENTENCE)
  //Remove stopwords from all sentences being searched through
  for (var i = 0; i<caseSentences.length; i++) {
    caseSentences[i].title = removeStopwordsFromSentence(caseSentences[i].title);
  }







  //Configuring options for Fuse library
  var options = {
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

  //Initializing Fuse search library
  var fuse = new Fuse(caseSentences, options);
  //Generate search result//
  var result = fuse.search(TEST_SENTENCE);
  console.log(result)

  //Print to browser setence numbers of the best matches in order of best match to worst
  for (var i = 0; i<result.length; i++){
    document.write(result[i].sentenceNumber + ", ")
  }
}

var s = new Search();