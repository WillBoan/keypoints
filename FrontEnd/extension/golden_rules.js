/**
 * Source:
 * https://github.com/diasks2/pragmatic_segmenter
 */
const GOLDEN_RULES = [

    // BASIC
    {
        name: "Simple period to end sentence",
        input: "Hello World. My name is Jonas.",
        output: ["Hello World.", "My name is Jonas."]
    },
    {
        name: "Question mark to end sentence",
        input: "What is your name? My name is Jonas.",
        output: ["What is your name?", "My name is Jonas."]
    },
    {
        name: "Exclamation point to end sentence",
        input: "There it is! I found it.",
        output: ["There it is!", "I found it."]
    },

    // ABBREVIATIONS
    {
        name: "One letter upper case abbreviations",
        input: "My name is Jonas E. Smith.",
        output: ["My name is Jonas E. Smith."],
    },
    {
        name: "One letter lower case abbreviations",
        input: "Please turn to p. 55.",
        output: ["Please turn to p. 55."]
    },
    {
        name: "Two letter lower case abbreviations in the middle of a sentence",
        input: "Were Jane and co. at the party?",
        output: ["Were Jane and co. at the party?"]
    },
    {
        name: "Two letter upper case abbreviations in the middle of a sentence",
        input: "They closed the deal with Pitt, Briggs & Co. at noon.",
        output: ["They closed the deal with Pitt, Briggs & Co. at noon."]
    },
    {
        name: "Two letter lower case abbreviations at the end of a sentence",
        input: "Let's ask Jane and co. They should know.",
        output: ["Let's ask Jane and co.", "They should know."],
    },
    {
        name: "Two letter upper case abbreviations at the end of a sentence",
        input: "They closed the deal with Pitt, Briggs & Co. It closed yesterday.",
        output: ["They closed the deal with Pitt, Briggs & Co.", "It closed yesterday."]
    },
    {
        name: "Two letter (prepositive) abbreviations",
        input: "I can see Mt. Fuji from here.",
        output: ["I can see Mt. Fuji from here."]
    },
    {
        name: "Two letter (prepositive & postpositive) abbreviations",
        input: "St. Michael's Church is on 5th st. near the light.",
        output: ["St. Michael's Church is on 5th st. near the light."]
    },
    {
        name: "Possesive two letter abbreviations",
        input: "That is JFK Jr.'s book.",
        output: ["That is JFK Jr.'s book."]
    },
    {
        name: "Possesive two letter abbreviations (angled)",
        input: "That is JFK Jr.’s book.",
        output: ["That is JFK Jr.’s book."]
    },
    {
        name: "Multi-period abbreviations in the middle of a sentence",
        input: "I visited the U.S.A. last year.",
        output: ["I visited the U.S.A. last year."]
    },
    {
        name: "Multi-period abbreviations at the end of a sentence",
        input: "I live in the E.U. How about you?",
        output: ["I live in the E.U.", "How about you?"]
    },
    {
        name: "U.S. as sentence boundary",
        input: "I live in the U.S. How about you?",
        output: ["I live in the U.S.", "How about you?"]
    },
    {
        name: "U.S. as non sentence boundary with next word capitalized",
        input: "I work for the U.S. Government in Virginia.",
        output: ["I work for the U.S. Government in Virginia."],
    },
    {
        name: "U.S. as non sentence boundary",
        input: "I have lived in the U.S. for 20 years.",
        output: ["I have lived in the U.S. for 20 years."]
    },
    {
        name: "A.M. / P.M. as non sentence boundary and sentence boundary",
        input: "At 5 a.m. Mr. Smith went to the bank. He left the bank at 6 P.M. Mr. Smith then went to the store.",
        output: [
            "At 5 a.m. Mr. Smith went to the bank.",
            "He left the bank at 6 P.M.",
            "Mr. Smith then went to the store."
        ],
    },

    // NUMBERS
    {
        name: "Number as non sentence boundary",
        input: "She has $100.00 in her bag.",
        output: ["She has $100.00 in her bag."]
    },
    {
        name: "Number as sentence boundary",
        input: "She has $100.00. It is in her bag.",
        output: ["She has $100.00.", "It is in her bag."]
    },

    // QUOTATION MARKS
    {
        name: "Single quotations inside sentence",
        input: "She turned to him, 'This is great.' she said.",
        output: ["She turned to him, 'This is great.' she said."]
    },
    {
        name: "Single quotations inside sentence (angled)",
        input: "She turned to him, ‘This is great.’ she said.",
        output: ["She turned to him, ‘This is great.’ she said."]
    },
    {
        name: "Double quotations inside sentence",
        input: 'She turned to him, "This is great." she said.',
        output: ['She turned to him, "This is great." she said.']
    },
    {
        name: "Double quotations inside sentence (angled)",
        input: 'She turned to him, “This is great.” she said.',
        output: ['She turned to him, “This is great.” she said.']
    },
    {
        name: "Single quotations at the end of a sentence",
        input: "She turned to him, 'This is great.' She held the book out to show him.",
        output: ["She turned to him, 'This is great.'", "She held the book out to show him."],
    },
    {
        name: "Single quotations at the end of a sentence (angled)",
        input: "She turned to him, ‘This is great.’ She held the book out to show him.",
        output: ["She turned to him, ‘This is great.’", "She held the book out to show him."],
    },
    {
        name: "Double quotations at the end of a sentence",
        input: 'She turned to him, "This is great." She held the book out to show him.',
        output: ['She turned to him, "This is great."', "She held the book out to show him."],
    },
    {
        name: "Double quotations at the end of a sentence (angled)",
        input: 'She turned to him, “This is great.” She held the book out to show him.',
        output: ['She turned to him, “This is great.”', "She held the book out to show him."],
    },
    {
        name: "Single quotations before period",
        input: "She was an office-holder 'at pleasure'. He was not.",
        output: ["She was an office-holder 'at pleasure'.", "He was not."]
    },
    {
        name: "Single quotations before period (angled)",
        input: "She was an office-holder ‘at pleasure’. He was not.",
        output: ["She was an office-holder ‘at pleasure’.", "He was not."]
    },
    {
        name: "Double quotations before period",
        input: 'She was an office-holder "at pleasure". He was not.',
        output: ['She was an office-holder "at pleasure".', "He was not."]
    },
    {
        name: "Double quotations before period (angled)",
        input: 'She was an office-holder “at pleasure”. He was not.',
        output: ['She was an office-holder “at pleasure”.', "He was not."]
    },
    {
        name: "Single quotations before next sentence",
        input: "She could tell he was happy. 'Why are you happy?' she asked.",
        output: ["She could tell he was happy.", "'Why are you happy?' she asked."]
    },
    {
        name: "Single quotations before next sentence (angled)",
        input: "She could tell he was happy. ‘Why are you happy?’ she asked.",
        output: ["She could tell he was happy.", "‘Why are you happy?’ she asked."]
    },
    {
        name: "Double quotations before next sentence",
        input: 'She could tell he was happy. "Why are you happy?" she asked.',
        output: ["She could tell he was happy.", '"Why are you happy?" she asked.']
    },
    {
        name: "Double quotations before next sentence (angled)",
        input: 'She could tell he was happy. “Why are you happy?” she asked.',
        output: ["She could tell he was happy.", '“Why are you happy?” she asked.']
    },

    // DOUBLE PUNCTUATION
    {
        name: "Double punctuation (exclamation point)",
        input: "Hello!! Long time no see.",
        output: ["Hello!!", "Long time no see."]
    },
    {
        name: "Double punctuation (question mark)",
        input: "Hello?? Who is there?",
        output: ["Hello??", "Who is there?"]
    },
    {
        name: "Double punctuation (exclamation point / question mark)",
        input: "Hello!? Is that you?",
        output: ["Hello!?", "Is that you?"]
    },
    {
        name: "Double punctuation (question mark / exclamation point)",
        input: "Hello?! Is that you?",
        output: ["Hello?!", "Is that you?"]
    },

    // LISTS
    {
        name: "List (period followed by parens and no period to end item)",
        input: "1.) The first item 2.) The second item",
        output: ["1.) The first item", "2.) The second item"],
    },
    {
        name: "List (period followed by parens and period to end item)",
        input: "1.) The first item. 2.) The second item.",
        output: ["1.) The first item.", "2.) The second item."],
    },
    {
        name: "List (parens and no period to end item)",
        input: "1) The first item 2) The second item",
        output: ["1) The first item", "2) The second item"],
    },
    {
        name: "List (parens and period to end item)",
        input: "1) The first item. 2) The second item.",
        output: ["1) The first item.", "2) The second item."],
    },
    {
        name: "List (period to mark list and no period to end item)",
        input: "1. The first item 2. The second item",
        output: ["1. The first item", "2. The second item"],
    },
    {
        name: "List (period to mark list and period to end item)",
        input: "1. The first item. 2. The second item.",
        output: ["1. The first item.", "2. The second item."],
    },
    {
        name: "List with bullet",
        input: "• 9. The first item • 10. The second item",
        output: ["• 9. The first item", "• 10. The second item"],
    },
    {
        name: "List with hypthen",
        input: "⁃9. The first item ⁃10. The second item",
        output: ["⁃9. The first item", "⁃10. The second item"],
    },
    {
        name: "Alphabetical list",
        input: "a. The first item b. The second item c. The third list item",
        output: ["a. The first item", "b. The second item", "c. The third list item"],
    },
    {
        name: "Errant newlines in the middle of sentences (PDF)",
        input: "This is a sentence\ncut off in the middle because pdf.",
        output: ["This is a sentence cut off in the middle because pdf."],
    },
    {
        name: "Errant newlines in the middle of sentences",
        input: "It was a cold \nnight in the city.",
        output: ["It was a cold night in the city."],
    },
    {
        name: "Lower case list separated by newline",
        input: "features\ncontact manager\nevents, activities\n",
        output: ["features", "contact manager", "events, activities"],
    },

    // ELLIPSES
    {
        name: "Ellipsis at end of quotation",
        input:
            "Thoreau argues that by simplifying one’s life, “the laws of the universe will appear less complex. . . .”",
        output: [
            "Thoreau argues that by simplifying one’s life, “the laws of the universe will appear less complex. . . .”"
        ],
    },
    {
        name: "Ellipsis with square brackets",
        input: '"Bohr [...] used the analogy of parallel stairways [...]" (Smith 55).',
        output: ['"Bohr [...] used the analogy of parallel stairways [...]" (Smith 55).']
    },
    {
        name: "Ellipsis as sentence boundary (standard ellipsis rules)",
        input:
            "If words are left off at the end of a sentence, and that is all that is omitted, indicate the omission with ellipsis marks (preceded and followed by a space) and then indicate the end of the sentence with a period . . . . Next sentence.",
        output: [
            "If words are left off at the end of a sentence, and that is all that is omitted, indicate the omission with ellipsis marks (preceded and followed by a space) and then indicate the end of the sentence with a period . . . .",
            "Next sentence."
        ],
    },
    {
        name: "Ellipsis as sentence boundary (non-standard ellipsis rules)",
        input: "I never meant that.... She left the store.",
        output: ["I never meant that....", "She left the store."]
    },
    {
        name: "Ellipsis as non sentence boundary",
        input:
            "I wasn’t really ... well, what I mean...see . . . what I'm saying, the thing is . . . I didn’t mean it.",
        output: [
            "I wasn’t really ... well, what I mean...see . . . what I'm saying, the thing is . . . I didn’t mean it."
        ],
    },
    {
        name: "4-dot ellipsis",
        input:
            "One further habit which was somewhat weakened . . . was that of combining words into self-interpreting compounds. . . . The practice was not abandoned. . . .",
        output: [
            "One further habit which was somewhat weakened . . . was that of combining words into self-interpreting compounds.",
            ". . . The practice was not abandoned. . . ."
        ],
    },

    // MISCELLANEOUS
    {
        name: "I as a sentence boundary and I as an abbreviation",
        input: "We make a good team, you and I. Did you see Albert I. Jones yesterday?",
        output: ["We make a good team, you and I.", "Did you see Albert I. Jones yesterday?"]
    },
    {
        name: "Parenthetical inside sentence",
        input: "He teaches science (He previously worked for 5 years as an engineer.) at the local University.",
        output: ["He teaches science (He previously worked for 5 years as an engineer.) at the local University."],
    },
    {
        name: "Email addresses",
        input: "Her email is Jane.Doe@example.com. I sent her an email.",
        output: ["Her email is Jane.Doe@example.com.", "I sent her an email."]
    },
    {
        name: "Web addresses",
        input: "The site is: https://www.example.50.com/new-site/awesome_content.html. Please check it out.",
        output: ["The site is: https://www.example.50.com/new-site/awesome_content.html.", "Please check it out."]
    },
    {
        name: "Geo Coordinates",
        input: "You can find it at N°. 1026.253.553. That is where the treasure is.",
        output: ["You can find it at N°. 1026.253.553.", "That is where the treasure is."],
    },
    {
        name: "Named entities with a period",
        input: "She uses Node.js to program.",
        output: ["She uses Node.js to program."]
    },
    {
        name: "Named entities with an exclamation point",
        input: "She works at Yahoo! in the accounting department.",
        output: ["She works at Yahoo! in the accounting department."]
    }
];
