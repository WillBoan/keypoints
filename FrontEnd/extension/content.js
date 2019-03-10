$(function() {

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





  // MAKE THE HTML SENSIBLE/REMOVE USELESS STUFF:
  // Remove section divs (unwrapping their contents):
  const section_divs = $("[class^='Section']");
  section_divs.children().unwrap();
  // Remove spacers:
  const spacers = $(".MsoNormal").filter(function() {
    return /^\s+$/i.test($(this).text());
  });
  spacers.remove();
  // Remove useless spans:
  const useless_spans = $(".documentcontent,.WordSection1").children().filter(function() {
    return $(this).text().trim().length === 0;
  });
  useless_spans.remove();
  // Remove explicit attributes (margin-left and text-indent):
  $(".documentcontent").find("*").css({"margin-left":"", "text-indent":""});
  // Fix para indents:
  const indent_spans = $("span[style='font:7.0pt \"Times New Roman\"']");
  const new_indent = "\u2003".repeat(2);
  indent_spans.each(function(index) {
    $(this).text(new_indent);
  });


  // PARA AND PARA ANCHOR ELEMENTS:
  // Array of DOM paragraph number elements:
  const para_anchors = $(".paragAnchor");
  // Array of DOM paragraph elements:
  // ----(Assumes that the paragraphs's element
  // ----is the closest ancestor with the 'p' tag)
  const para_elements = para_anchors.closest("p");
  para_elements.addClass("kp-para");
  // Function to find the paragraph's element:
  // ----(Based on para_elements)
  function getParaElement(para_num) {
    return para_elements.eq(para_num - 1);
  }
  // Function to get para_num from para element:
  function getParaNum(para_element) {
    return para_num = Number($(para_element).find(".paragAnchor").text());
  }
  // Get last para_num:
  let last_para_num = getParaNum(para_elements.last());
  // Remove elements after last para:
  para_elements.last().nextAll().remove();


  // $("style").remove();
  // let stylesheets = $("[rel='stylesheet']");
  // console.log(`${stylesheets.length} stylesheets`);
  // stylesheets.eq(6).remove();
  // $("[href='https://cdn1.canlii.org/css/A.canlii-global.css.pagespeed.cf.GWYYTlf3fV.css']").remove();







  // CITATION DATA:
  // Test input; represents cited paragraph numbers
  const unindexed_citation_data = [
    {para:10, citing_case:"2008 FC 991", citing_para:21},
    {para:12, citing_case:"2008 FC 991", citing_para:22},
    {para:50, citing_case:"2008 FC 991", citing_para:37},
    {para:12, citing_case:"2009 SCC 12", citing_para:4},
    {para:9, citing_case:"2016 FCA 93", citing_para:49},
    {para:18, citing_case:"2011 SCC 61", citing_para:41},
    {para:36, citing_case:"2010 BCCA 191", citing_para:34}
  ];
  // Reorganize the unindexed_citation_data, indexing by para number:
  // ----The final data structure should end up in this format:
  // ----citation_data = {
  // ----  10: [{citing_case:"2008 FC 991", citing_para:21}],
  // ----  12: [
  // ----    {citing_case:"2008 FC 991", citing_para:22},
  // ----    {citing_case:"2009 SCC 12", citing_para:4}
  // ----  ]
  // ----};
  let citation_data = {};
  unindexed_citation_data.forEach((x) => {
    citation_data[x.para] = (citation_data[x.para] || []);
    citation_data[x.para].push(
      {citing_case:x.citing_case,
      citing_para:x.citing_para}
    );
  });


  // CITATION COUNTS:
  function getCitationCount(para_num) {
    return citation_data[para_num].length;
  }
  // Const for how many times the most cited para has been cited:
  const highest_cit_count = Math.max(...Object.values(citation_data).map((x) => x.length));
  // Function to calculate the proportion of
  // how many times a paragraph has been
  // cited relative to the most cited paragraph:
  function calcCountProportion(para_num) {
    return getCitationCount(para_num) / highest_cit_count;
  }


  // PARAGRAPH COLORING:
  const darkest_color = [225, 100, 0];
  const lightest_color = [255, 255, 255];
  // Function that calculates an RGB component value:
  function calcColorComponent(n, count_proportion) {
    return lightest_color[n] - ((lightest_color[n] - darkest_color[n]) * count_proportion);
  }
  // Function that calculates the highlight color for a paragraph,
  // based on how much the paragraph has been cited:
  function calcHighlightColor(para_num) {
    let count_proportion = calcCountProportion(para_num);
    let color = [
      calcColorComponent(0, count_proportion),
      calcColorComponent(1, count_proportion),
      calcColorComponent(2, count_proportion)
    ];
    let final_color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    return final_color;
  }
  // Main function to apply highlight background color:
  // ----(Also writes the highlight_color to modified_paras)
  function applyHighlight(para_num, para) {
    let highlight_color = calcHighlightColor(para_num);
    modified_paras[para_num] = {highlight_color: highlight_color};
    $(para).css("background-color", highlight_color);
  }


  // LINKS:
  // Const
  const jurisdiction_map = {
    // Federal:
    scc: {court_url_id:"scc", jur:"ca"},
    fca: {court_url_id:"fca", jur:"ca"},
    fc: {court_url_id:"fct", jur:"ca"}, // Weird one: fc vs fct
    tcc: {court_url_id:"tcc", jur:"ca"},
    // BC:
    bcca: {court_url_id:"bcca", jur:"bc"},
    bcsc: {court_url_id:"bcsc", jur:"bc"},
    bcpc: {court_url_id:"bcpc", jur:"bc"},
    // AB:
    abca: {court_url_id:"abca", jur:"ab"},
    abqb: {court_url_id:"abqb", jur:"ab"},
    abpc: {court_url_id:"abpc", jur:"ab"},
    // SK:
    skca: {court_url_id:"skca", jur:"sk"},
    skqb: {court_url_id:"skqb", jur:"sk"},
    skpc: {court_url_id:"skpc", jur:"sk"},
    skdc: {court_url_id:"skdc", jur:"sk"}, // NOTE: 1983 CanLII 2300 (SKDC) would be an ID
    skufc: {court_url_id:"skufc", jur:"sk"}, // NOTE: 1983 CanLII 2405 (SK UFC) would be an ID
    // MB:
    mbca: {court_url_id:"mbca", jur:"mb"},
    mbqb: {court_url_id:"mbqb", jur:"mb"},
    mbpc: {court_url_id:"mbpc", jur:"mb"},
    // ON:
    onca: {court_url_id:"onca", jur:"on"},
    onsc: {court_url_id:"onsc", jur:"on"},
    onscdc: {court_url_id:"onscdc", jur:"on"}, // https://www.canlii.org/en/on/onscdc/doc/2018/2018onsc484/2018onsc484.html
    onscsm: {court_url_id:"onscsm", jur:"on"}, // Weird one
    oncj: {court_url_id:"oncj", jur:"on"},
    // QC:
    qcca: {court_url_id:"qcca", jur:"qc"},
    qccs: {court_url_id:"qccs", jur:"qc"},
    qccq: {court_url_id:"qccq", jur:"qc"},
    qctdp: {court_url_id:"qctdp", jur:"qc"},
    qctp: {court_url_id:"qctp", jur:"qc"},
    qccm: {court_url_id:"qccm", jur:"qc"}, // Weird one
    // NB:
    nbca: {court_url_id:"nbca", jur:"nb"},
    nbqb: {court_url_id:"nbqb", jur:"nb"},
    nbpc: {court_url_id:"nbpc", jur:"nb"},
    // NS:
    nsca: {court_url_id:"nsca", jur:"ns"},
    nssc: {court_url_id:"nssc", jur:"ns"},
    nssf: {court_url_id:"nssf", jur:"ns"},
    nspc: {court_url_id:"nspc", jur:"ns"},
    nssm: {court_url_id:"nssm", jur:"ns"},
    nspb: {court_url_id:"nspr", jur:"ns"}, // Weird one: nspb vs nspr
    nsfc: {court_url_id:"nsfc", jur:"ns"},
    // PE:
    peca: {court_url_id:"pescad", jur:"pe"}, // Weird one: peca vs pescad
    pesc: {court_url_id:"pesctd", jur:"pe"}, // Weird one: pesc vs pesctd
    // NL:
    nlca: {court_url_id:"nlca", jur:"nl"},
    nlsc: {court_url_id:"nlsc", jur:"nl"},
    nlpc: {court_url_id:"nlpc", jur:"nl"}, // Weird one (CanLII)
    nlma: {court_url_id:"nlma", jur:"nl"},
    // YK:
    ykca: {court_url_id:"ykca", jur:"yk"},
    yksc: {court_url_id:"yksc", jur:"yk"},
    yktc: {court_url_id:"yktc", jur:"yk"},
    yksm: {court_url_id:"yksm", jur:"yk"},
    // NT:
    nwtca: {court_url_id:"ntca", jur:"nt"}, // Weird one: nwtca vs ntca
    nwtsc: {court_url_id:"ntsc", jur:"nt"}, // Weird one: nwtsc vs ntsc
    nwttc: {court_url_id:"nttc", jur:"nt"}, // Weird one: nwttc vs nttc
    // nwttc: {court_url_id:"ntyjc", jur:"nt"}, // Weird one: nwttc vs ntyjc; NOTE: same key as previous
    // NU:
    nuca: {court_url_id:"nuca", jur:"nu"},
    nucj: {court_url_id:"nucj", jur:"nu"},
    yjcn: {court_url_id:"nuyc", jur:"nu"}, // Weird one: yjcn vs nuyc
  };
  const base_url = "https://www.canlii.org/en/";
  // Function to get url from case ID:
  function getUrl(case_id) {
    let id_nospace = case_id.replace(/\s+/g, "").toLowerCase();
    let id_split = case_id.toLowerCase().split(" ");
    let year = id_split[0];
    let court = id_split[1];
    let num = id_split[2];
    let court_url_id = jurisdiction_map[court].court_url_id;
    let jur = jurisdiction_map[court].jur;
    let url = base_url + `${jur}/${court_url_id}/doc/${year}/${id_nospace}/${id_nospace}.html`;
    return url;
  }
  // Function to create links for all of the citations for a paragraph,
  // and append the links to the end of the paragraphs:
  function createAppendLinks(para_num, para) {
    // Create an <a> element for each link:
    let citing_cases_html = citation_data[para_num].map((x) => {
      let link_text = x.citing_case + " ¶" + x.citing_para;
      let link_url = getUrl(x.citing_case) + `#par${x.citing_para}`;
      let link_html = `<a href=${link_url}>${link_text}</a>`;
      return link_html;
    }).join("</br>");
    // Wrap these <a> elements in two <divs>:
    let final_html =
      `<div class="kp-citing-case-link-cont">
        <div class="kp-citing-case-link">
          ${citing_cases_html}
        </div>
      </div>`;
    // Append the links to the para element:
    $(para).append(final_html);
  }





  // MAIN PARAGRAPH MODIFICATION:
  // Object for modified para properties:
  // ----This is so that later we can get properties
  // ----(eg highlight color) from para numbers
  modified_paras = {};
  // Highlight and create/append links for the cited paragraphs:
  Object.keys(citation_data).forEach((para_num) => {

    // Get parent element:
    let para = getParaElement(para_num);
    // Attach the para_num within the para element, and add
    // a class to indicate that the para has been modified:
    $(para).attr("data-para-num", para_num);
    $(para).addClass("kp-modified-para");

    // Apply highlight color:
    applyHighlight(para_num, para);

    // Create and append the links:
    createAppendLinks(para_num, para);
  });


  // MOUSEOVER LOGIC FOR CITED PARAS:
  const mouseover_color = "rgb(234, 234, 234)";
  // Hide and set mouseover color for the citing case links:
  $(".kp-citing-case-link").hide();
  $(".kp-citing-case-link").css("background-color", mouseover_color);
  // Mouseover functions:
  $(".kp-modified-para").hover(
    function mouseOver() {
      $(this).css("background-color", mouseover_color);
      $(this).find(".kp-citing-case-link").show(150);
    },
    function mouseOut() {
      let para_num = $(this).attr("data-para-num");
      let highlight_color = modified_paras[para_num].highlight_color;
      $(this).css("background-color", highlight_color);
      $(this).find(".kp-citing-case-link").hide(150);
    }
  );












































































  // FIND JUDGE DECLARATIONS
  // Judge declarations are the paragraphs like
  // "The judgment of McLachlin C.J. and Bastarache,
  // LeBel, Fish and Abella JJ. was delivered by".
  // The paragraphs before the first judge declaration will
  // be the pre-judgment material, which includes the headnotes.
  const judge_declaration_regex = /(judge?ment|reason).+delivered\s+by:?\s*$/s;
  const judge_declarations = $("p").filter(function() {
    return judge_declaration_regex.test($(this).text());
  });
  // Find the pre-judgment material:
  const before_judgment = judge_declarations.first().prevAll();
  // const before_judgment = $(".documentcontent").contents().first().nextUntil(judge_declarations);


  // HEADNOTES
  // Find the 'Present:' paragraph:
  const present_regex = /^\s*Present:/;
  const present_par = before_judgment.filter(function() {
    return present_regex.test($(this).text());
  });
  if (present_par.length > 1) {
    console.log("ERROR: more than 1 present_par found");
  }
  // Find the 'Cases Cited' paragraph:
  const cases_cited_regex = /^\s*Cases\s+Cited\s*$/i;
  const cases_cited_par = before_judgment.filter(function() {
    return cases_cited_regex.test($(this).text());
  });
  if (cases_cited_par.length > 1) {
    console.log("ERROR: more than 1 cases_cited_par found");
  }
  // Find headnotes paragraph 1 (by finding
  // the first paragraph after the present_par
  // that doesn't start with an <i> tag
  // (but skipping the paragraph
  // immediately after the present_par)):
  const headnotes_par1 = present_par.next().nextUntil(judge_declarations).filter(function() {
    return !$(this).contents().first().is("i");
  }).first();
  // Find the rest of the headnotes paragraphs:
  const headnotes = headnotes_par1.prev().nextUntil(cases_cited_par);
  // Get the text of the headnotes paragraphs:
  const headnotes_para_texts = headnotes.map(function() {
    return cleanText($(this).text());
  }).get();
  function cleanText(string) {
    return string.trim().replace(/\s+/ig, " ");
  }
  // Remove refs like '[42] [45-49]' from end of headnotes paras; and
  // extract 'Per McLachlin C.J. and Bastarache, LeBel, Fish and Abella JJ.:'
  const headnotes_end_para_ref_regex = /\[(\d+(?:[-‑]\d+)?)\]/g;
  const per_regex = /^Per\s.+?:/;
  headnotes_para_texts.forEach(function(para_text, index, array) {
    array[index] = para_text
      .replace(headnotes_end_para_ref_regex, "")
      .replace(per_regex, "")
      .trim();
  });

  // SEPARATE HEADNOTES INTO SENTENCES
  // Main regex to find the punctuation that should separate sentences:
  // const full_stop_regex = /(?<=\w{2})(?:(?:\.|\.{4}|\s*(?:\.\s*){4}|[!?]{1,3})["”'’]?(?=(?:\s+[A-Z0-9"“”'‘’(]|$))|\.(?=(?:\s*\.){3}\w)|(?:\.\s*){4}$)/g;
  const full_stop_regex = /(?:(?<=\w{4}["”'’]?)[.!?]["”'’]?|\b(\w{2,3})\.)(?=\s+[A-Z0-9"“”'‘’(]|$)/g;
  const acceptable_abreviations = ['v','no','st','mt','mr','ms','sr','jr','mrs'];
  // Main function to split sentences, using full_stop_regex.
  // Returns an array of split sentences.
  function sentenceSplit(string) {
    let sentence_array = [];
    let myArray;
    let last_index = 0;
    while ((myArray = full_stop_regex.exec(string)) !== null) {
      if (!myArray[1] || ($.inArray(myArray[1].toLowerCase(), acceptable_abreviations) == -1)) {
        let sentence = string.slice(last_index, full_stop_regex.lastIndex).trim();
        sentence_array.push(sentence);
        last_index = full_stop_regex.lastIndex;
      }
    }
    return sentence_array;
  }
  // Function to determine if 2 arrays are equal:
  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // You might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  // Run sentenceSplit on the headnotes:
  let headnotes_sentences = [];
  headnotes_para_texts.forEach(function(para_text, index, array) {
    let this_para_sentences = sentenceSplit(para_text);
    headnotes_sentences.push(...this_para_sentences);
  });
  headnotes_sentences.forEach(x => {console.log(x)});



  // // Trying out the sentenceSplit on the golden rules test sentences:
  // let n_correct = 0;
  // let n_incorrect = 0;
  // GOLDEN_RULES.forEach(x => {
  //   let input = x.input;
  //   let output = x.output;
  //   let my_output = sentenceSplit(input);
  //   if (arraysEqual(output, my_output)) {
  //     n_correct += 1;
  //   } else {
  //     n_incorrect += 1;
  //     console.log(`Input: ${input}`);
  //     console.log(`Output: [${output}]`);
  //     console.log(`My output: [${my_output}]`);
  //     console.log("–––––");
  //   }
  // });
  // console.log(`Correct: ${n_correct}, incorrect: ${n_incorrect}`);





























//   // Get authoring judges:
//   const authoring_judge_regex = /JJ?\.\W*$|(The\sChief\sJustice):?\W*$/i;
//   const authoring_judges = $("[style='text-transform:uppercase'],.JudgeJuge").filter(function() {
//     return authoring_judge_regex.test($(this).text());
//   });
//   authoring_judges.addClass("kp-authoring-judges");
//
//   // Move and reformat the authoring judge elements:
//   authoring_judges.each(function(index) {
//     // Reformat judge names:
//     let judge_names = $(this).text()
//       .trim()
//       .replace(/\s*—\s*$/i, "")
//       .replace(/\s+/ig, " ")
//       .trim()
//       .toUpperCase();
//     console.log(`Judge names: ${judge_names}`);
//     $(this).text(judge_names);
//     // Find para element:
//     let parent = $(this).closest("p");
//     // If there is a previous para like "The following are the reasons delivered by:", remove it:
//     let prev = parent.prev();
//     if (judge_declaration_regex.test(prev.text())) {prev.remove();}
//     // Make the start of the text after the judge names span look nice:
//     let next_sib = this.nextSibling;
//     if (next_sib) {
//       let new_next = next_sib.nodeValue.replace(/^\s*—\s*/i, "");
//       next_sib.nodeValue = new_next;
//     }
//     // Move the authoring judges element, and turn it into a <p>:
//     let new_authoring_judges_element = $(document.createElement("p"))
//       .text(judge_names)
//       .addClass("kp-authoring-judges")
//       .insertBefore(parent);
//     // If this is an instance of "THE CHIEF JUSTICE", add a class to say so:
//     if (judge_names == "THE CHIEF JUSTICE") {
//       new_authoring_judges_element.addClass("kp-cjauthor");
//     }
//     $(this).remove();
//     // If the parent is now empty, remove it:
//     if (parent.text().length === 0) {parent.remove()}
//   });
//
//
//   function capitalize(str) {
//     return str.split(" ")
//       .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
//       .join(" ");
//   }
//
//   // Get Chief Justice:
//   // const judge_name_regex_part = /([^\s\d.,:;!?'"`/\\|_()[\]{}]+)/;
//   // const chief_justice_regex = new RegExp(judge_name_regex_part.source + /\s+C\.?J\.?/.source, "im");
//   const judge_regex = /[^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=,|\s+and|\s+JJ?\b\.?)/gm;
//   const chief_justice_regex = /[^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=\s+C\.?J\.?)/m;
//   // const judge_regex = /(\w{2})/gm;
//   // [^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=,|\s+and|\s+JJ\.?)|([^\s\d.,:;!?'"`/\\|_()[\]{}]+)(?=\s+C\.?J\.?)
//   // console.log(chief_justice_regex);
//   // console.log(chief_justice_regex.source);
//   let chief_justice;
//   let judges = [];
//   judge_declarations.add($(authoring_judges)).each(function() {
//     let cj_match = $(this).text().match(chief_justice_regex);
//     if (cj_match) {
//       chief_justice = cj_match[0];
//     }
//     let j_match = $(this).text().match(judge_regex);
//     if (j_match) {
//       j_match.forEach(function(m) {
//         let capitalized_m = capitalize(m);
//         if ($.inArray(capitalized_m, judges) === -1) {
//           judges.push(capitalized_m);
//         }
//       });
//     }
//   });
//   // Remove judge declarations:
//   judge_declarations.remove();
//
//   console.log(`Chief justice: ${chief_justice}`);
//   console.log(`Judges: ${judges}`);
//
//   // Go back and change any instances of "THE CHIEF JUSTICE" in authoring_judges to the judge's name:
//   if (chief_justice) {
//     $(".kp-cjauthor").text(`${chief_justice.toUpperCase()} C.J.`);
//   }
//
//
//
//
//
//   // HEADINGS:
//   // Find headings:
//   const heading_class_regex = /^Title\d+LevelTitre\d+Niveau|^TitleTitre-AltT/;
//   const heading_regex = /^([A-Za-z0-9]{1,4}\.|\([A-Za-z0-9]{1,4}\))\s+["“'’]?\w+/i;
//   const headings = $("p").filter(function() {
//     return heading_class_regex.test($(this).attr("class"));
//   }).add($(".MsoNormal")).filter(function() {
//     return heading_regex.test($(this).text());
//   }).add(".kp-authoring-judges");
//   // }).add($(".MsoNormal, .kp-authoring-judges")).filter(function() {
//   //   return ($(this).hasClass("kp-authoring-judges") || heading_regex.test($(this).text()));
//   // });
//   // Remove extra whitespace characters:
//   headings.each(function() {
//     $(this).text(cleanText($(this).text()));
//   });
//
//
//
//
//
//
//
//
//
//   // COLLAPSABILITY:
//   // Organize headings:
//   const alphabet = [
//     'a','b','c','d','e','f','g','h','i','j','k','l','m',
//     'n','o','p','q','r','s','t','u','v','w','x','y','z'
//   ];
//   const roman_numerals = [
//     'i','ii','iii','iv','v','vi','vii','viii','ix','x',
//     'xi','xii','xiii','xiv','xv','xvi','xvii','xviii','xix','xx'
//   ];
//   const list_prefix_regex = /^([A-Z\s]+[CJ]J?\b\.?)|^(?:([A-Z]+)|([a-z]+)|([0-9]+))\.|^\((?:([A-Z]+)|([a-z]+)|([0-9]+))\)/;
//   // 0 -> BINNE J.
//   // 1 -> A.
//   // 2 -> a.
//   // 3 -> 1.
//   // 4 -> (A)
//   // 5 -> (a)
//   // 6 -> (1)
//   // 7 -> I.
//   // 8 -> i.
//   // 10 -> (I) NOTE—skipped 9 (so that later we can just add 6 to go from alphabet to roman numerals)
//   // 11 -> (i)
//   var type_num_ranks = [];
//   var type_num_ranks_obj = [];
//
//   // type_num_ranks_obj = [
//   //   {type_num: 0, position: 3}
//   // ];
//   function getWriteListType(heading_text) {
//     // console.log(`-- Running function on '${heading_text}'...`);
//
//     let prefix_match = list_prefix_regex.exec(heading_text);
//     let type_num = prefix_match.slice(1).findIndex((x) => x !== undefined);
//     let prefix_char = prefix_match[type_num + 1];
//
//     // Check if this type_num is in type_num_ranks:
//     let in_ranks = $.inArray(type_num, type_num_ranks);
//     let rank = null;
//     let pos = null;
//
//     // Calculate rank (if it is later found to be a RN, this rank may change):
//     if (in_ranks > -1) {
//       rank = in_ranks;
//     } else {
//       rank = type_num_ranks.length;
//     }
//
//     // Handle Roman numerals:
//     let is_letter = $.inArray(type_num, [1,2,4,5]);
//     if (is_letter > -1) {
//       let al_arr_pos = $.inArray(prefix_char.toLowerCase(), alphabet);
//       // console.log(`al_arr_pos = ${al_arr_pos}`);
//       let rn_arr_pos = $.inArray(prefix_char.toLowerCase(), roman_numerals);
//       // console.log(`rn_arr_pos = ${rn_arr_pos}`);
//
//       // If it could be alphabetical, calculate what pos would be:
//       if (al_arr_pos > -1) {
//         if (in_ranks > -1) {
//           pos = Number(type_num_ranks_obj[rank].position) + 1;
//         } else {
//           pos = 0;
//         }
//       }
//
//       // If it could be a RN, calculate what type_num, pos and rank would be:
//       let type_num_RN = null;
//       let in_ranks_RN = null;
//       let rank_RN = null;
//       let pos_RN = null;
//       if (rn_arr_pos > -1) {
//         // Calculate type_num_RN:
//         type_num_RN = type_num + 6;
//         in_ranks_RN = $.inArray(type_num_RN, type_num_ranks);
//         // Calculate pos_RN and rank_RN:
//         if (in_ranks_RN > -1) {
//           rank_RN = in_ranks_RN;
//           pos_RN = Number(type_num_ranks_obj[rank_RN].position) + 1;
//         } else {
//           rank_RN = type_num_ranks.length;
//           pos_RN = 0;
//         }
//       }
//
//       if (al_arr_pos === pos && rn_arr_pos === pos_RN) {
//         console.log(`Function getWriteListType: Heading '${heading_text}' could be either alphabetical or Roman numeral; going with alphabetical`);
//       } else if (rn_arr_pos === pos_RN) {
//         // console.log(`RN found to work!`);
//         type_num = type_num_RN;
//         rank = rank_RN;
//         pos = pos_RN;
//         in_ranks = in_ranks_RN;
//       } else if (al_arr_pos === pos) {
//         // console.log(`Alphabetical found to work!`);
//       } else {
//         console.log(`Heading '${heading_text}' seems to be neither alphabetical nor Roman numeral`);
//       }
//       if (al_arr_pos === -1 && rn_arr_pos === -1) {
//         console.log(`ERROR: Heading '${heading_text}' isn't in alphabet or RN arrays`);
//       }
//     } else {
//       pos = Number(prefix_char) - 1;
//     }
//
//     // Write info:
//     if (in_ranks > -1) {
//       let old_pos = type_num_ranks_obj[rank].position;
//       type_num_ranks_obj[rank].position = pos;
//       // console.log(`Writing: Updating pos –– type_num = ${type_num}, old_pos = ${old_pos}, pos = ${pos}, rank = ${rank}`);
//     } else {
//       type_num_ranks.push(type_num);
//       type_num_ranks_obj.push({type_num:type_num, position:pos});
//       // console.log(`Writing, type_num = ${type_num}, pos = ${pos}, rank = ${rank}`);
//     }
//
//     // Delete further ranks:
//     type_num_ranks = type_num_ranks.slice(0, rank + 1);
//     type_num_ranks_obj = type_num_ranks_obj.slice(0, rank + 1);
//
//     return rank;
//     // console.log(`-- Finished function on '${heading_text}'`);
//     // console.log("");
//   }
//
//   headings.each(function() {
//     let rank = getWriteListType($(this).text());
//     let following_para_num = getParaNum($(this).nextAll(".kp-para").eq(0));
//     $(this).data({rank:rank, following_para_num:following_para_num});
//   });
//   function getRank(heading) {
//     return heading.data("rank");
//   }
//   function getFollowingParaNum(heading) {
//     return heading.data("following_para_num");
//   }
//
//   // JQUERY PLUGINS:
//   $.fn.nextUntilEqualOrSuperordinate = function() {
//     let rank = getRank(this);
//     return this.nextUntil(headings.filter(function() {
//       return getRank($(this)) <= rank;
//     }));
//   };
//   $.fn.nextEqualOrSuperordinate = function() {
//     return this.nextUntilEqualOrSuperordinate().last().next();
//   };
//   $.fn.subordinateTo = function(heading) {
//     let heading_rank = getRank(heading);
//     return this.filter(function() {
//       return getRank($(this)) > heading_rank;
//     });
//   };
//
//   // Determine included para ranges for each heading:
//   headings.each(function() {
//     let rank = getRank($(this));
//     let following_para_num = getFollowingParaNum($(this));
//     let next_equal_or_superordinate = $(this).nextEqualOrSuperordinate();
//     let end_para_num;
//     if (next_equal_or_superordinate.length === 1) {
//       end_para_num = getFollowingParaNum(next_equal_or_superordinate) - 1;
//     } else if (next_equal_or_superordinate.length === 0) {
//       end_para_num = last_para_num;
//     }
//     // headings_obj[$(this).text()]["para_range"] = [following_para_num, end_para_num];
//     $(this).data("para_range", [following_para_num, end_para_num]);
//   });
//   function getParaRange(heading) {
//     // return headings_obj[$(heading).text()].para_range;
//     return heading.data("para_range");
//   }
//   headings.each(function() {
//     let para_range = getParaRange($(this));
//     let new_para_range_element_text = (para_range[0] === para_range[1]) ? `¶${para_range[0]}` : `¶${para_range[0]}-${para_range[1]}`;
//     let new_para_range_element = $(document.createElement("span"))
//       .text(new_para_range_element_text)
//       .addClass("kp-para-range")
//       .appendTo($(this));
//   });
//   // headings.each(function() {
//   //   console.log($(this).text(), getRank($(this)));
//   // });
//   headings.addClass("kp-heading");
//
//   // Indent headings according to rank:
//   headings.each(function() {
//     let rank = getRank($(this));
//     let margin_left_value = `${(rank * 20)}pt`;
//     $(this).css("margin-left", margin_left_value);
//     // let top_value = `${(rank * 28 + 33)}px`;
//     // $(this).css("top", top_value);
//   });
//   // Add triangles to headings:
//   headings.each(function() {
//     let triangle = $("<div></div>").addClass("triangle");
//     $(this).prepend(triangle);
//   });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//   // All headings should start collapsed:
//   collapseAll();
//
//   // Make headings collapse/expand on click:
//   headings.click(function() {
//     if ($(this).hasClass("collapsed")) {
//       expandHeading($(this));
//     } else {
//       collapseHeading($(this));
//     }
//   });
//   function changeTriangleDirection(heading, direction) {
//     let triangle = heading.find(".triangle");
//     if (direction === "down") {
//       triangle.addClass("triangle-down");
//       triangle.removeClass("triangle-right");
//     }
//     if (direction === "right") {
//       triangle.addClass("triangle-right");
//       triangle.removeClass("triangle-down");
//     }
//   }
//   function expandHeading(heading) {
//     // OPTION 1: Expanding a heading automatically expands all subheadings
//     // let paras_to_show = heading.nextUntil(headings.filter(function() {
//     //   return getRank($(this)) <= rank;
//     // }));
//
//     // OPTION 2: When expanding a heading, it will remember which subheadings were expanded and which weren't
//     // Figure out which paras shouldn't be shown
//     // (because they're in a collapsed heading):
//     let paras_not_to_show = $();
//     let collapsed_subheadings = $(".kp-heading.collapsed").subordinateTo(heading);
//     collapsed_subheadings.each(function() {
//       let next_paras = $(this).nextUntilEqualOrSuperordinate();
//       paras_not_to_show = paras_not_to_show.add(next_paras);
//     });
//     let paras_to_show = heading.nextUntilEqualOrSuperordinate().not(paras_not_to_show);
//     paras_to_show.show();
//
//     // Change triangle direction:
//     changeTriangleDirection(heading, "down");
//
//     heading.removeClass("collapsed");
//   }
//   function collapseHeading(heading) {
//     heading.nextUntilEqualOrSuperordinate().hide();
//     changeTriangleDirection(heading, "right");
//     heading.addClass("collapsed");
//   }
//   function expandAll() {
//     headings.each(function() {
//       expandHeading($(this));
//     });
//   }
//   function collapseAll() {
//     headings.each(function() {
//       collapseHeading($(this));
//     });
//   }
//
//   // Add 'expand all' button:
//   // let expand_collapse_button = $("<p></p>")
//   //   .text("Expand all")
//   //   .addClass("kp-expand-all")
//   //   .click(function() {
//   //     if ($(this).text() === "Expand all") {
//   //       expandAll();
//   //       $(this).text("Collapse all");
//   //     } else {
//   //       collapseAll();
//   //       $(this).text("Expand all");
//   //     }
//   //   });
//   // $(".documentcontent").prepend(expand_collapse_button);
//   let expand_all_button = $("<p></p>")
//     .text("Expand all")
//     .click(function() {
//       expandAll();
//     });
//   let collapse_all_button = $("<p></p>")
//     .text("Collapse all")
//     .click(function() {
//       collapseAll();
//     });
//   $(".documentcontent").prepend(expand_all_button, collapse_all_button);
//
//
//
//
//
//   // SCROLLING:
//   // const top_bar_height = 33;
//   // const top_bar_height_minus_margin = 17;
//   // var controller = new ScrollMagic.Controller();
//   // $(document.getElementsByClassName("kp-heading")).each(function() {
//   //   let rank = getRank($(this));
//   //   let element_offset = $(this).offset().top;
//   //   let scene = new ScrollMagic.Scene({
//   //     offset: element_offset - top_bar_height - (rank * 28)
//   //     // duration: 400
//   //   })
//   //   .setPin(this);
//   //   controller.addScene(scene);
//   // });
//
//
// // OLD SCROLLING WAY 1:
//   // $(window).scroll(function() {
//   //   let doc_scroll_top = $(document).scrollTop();
//   //   console.log(`doc_scroll_top: ${doc_scroll_top}`);
//   //   headings.not("[position='fixed']").each(function() {
//   //     let pos_rel_to_viewport = $(this).offset().top - doc_scroll_top;
//   //     console.log(`pos_rel_to_viewport: ${pos_rel_to_viewport}`);
//   //     let rank = getRank($(this));
//   //     let sticky_point = rank * 28 + 33;
//   //     console.log(`sticky_point: ${sticky_point}`);
//   //     if (pos_rel_to_viewport <= sticky_point) {
//   //       $(this).css({position:"fixed", top:sticky_point});
//   //     }
//   //   });
//   // });
//   // headings.each(function() {
//   //   let rank = getRank($(this));
//   //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
//   //   $(this).sticky({topSpacing:sticky_point});
//   // });
//   // function stickHeading(heading) {
//   //   let rank = getRank(heading);
//   //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
//   //   heading.sticky({topSpacing:sticky_point});
//   // }
//   // stickHeading(headings.eq(0));
//   // stickHeading(headings.eq(1));
// // OLD SCROLLING WAY 2:
//   // function stickHeading(heading) {
//   //   let rank = getRank(heading);
//   //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
//   //   heading.sticky({topSpacing:sticky_point});
//   // }
//   // headings.eq(0).attr("id", "scrolltest")
//   // var controller = new ScrollMagic.Controller();
//   // var scene = new ScrollMagic.Scene({
//   //   offset: 100, // start scene after scrolling for 100px
//   //   duration: 400 // pin the element for 400px of scrolling
//   // })
//   // .setPin(document.getElementsByClassName("kp-heading")[0]);
//   // controller.addScene(scene);
//
//
//
//
//






});
