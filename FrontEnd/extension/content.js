$(function() {


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



  const base_url = "https://www.canlii.org/en/";
  // Function to get url from case ID:
  function getUrl(case_id) {
    let id_nospace = case_id.replace(/\s+/g, "").toLowerCase();
    let id_split = case_id.toLowerCase().split(" ");
    let year = id_split[0];
    let court = id_split[1];
    let num = id_split[2];
    let court_url_id = map_courtURL_to_jurisdiction[court].court_url_id;
    let jur = map_courtURL_to_jurisdiction[court].jur;
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

  
  var s = new Search(["sentence 1 is this one", "but sentence 2 may be better", "is sentence three the one"]);
  var sentence_index = s.find_sentence_in_case("is sentence three the one") // output:2 (which indicates the third sentence due to 0 as start)
  console.log(sentence_index);

});


