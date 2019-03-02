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
  // Remove elements before 2 elements before para 1:
  // getParaElement(1).prev().prev().prevAll().remove();








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
    let id_nospace = case_id.replace(/ /g, "").toLowerCase();
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















  // COLLAPSIBILITY:
  // Judge declarations:
  const judge_declaration_regex = /(judge?ment|reason).+delivered\s+by:?\s*$/s;
  const judge_declarations = $("p").filter(function() {
    return judge_declaration_regex.test($(this).text());
  });
  // Remove all elements before first judge declaration:
  judge_declarations.eq(0).prevAll().remove();



  // Get authoring judges:
  const authoring_judge_regex = /JJ?\.\W*$|(The\sChief\sJustice):?\W*$/i;
  const authoring_judges = $("[style='text-transform:uppercase'],.JudgeJuge").filter(function() {
    return authoring_judge_regex.test($(this).text());
  });
  // Remove material before first authoring judge:
  // authoring_judges.eq(0).closest("p").prev().prevAll().remove();

  authoring_judges.addClass("kp-authoring-judges");

  // Move and reformat the authoring judge elements:
  authoring_judges.each(function(index) {
    // Reformat judge names:
    let judge_names = $(this).text()
      .trim()
      .replace(/\s*—\s*$/i, "")
      .replace(/\s+/ig, " ")
      .trim()
      .toUpperCase();
    $(this).text(judge_names);
    // Find para element:
    let parent = $(this).closest("p");
    // If there is a previous para like "The following are the reasons delivered by:", remove it:
    // let prev = parent.prev();
    // if (judge_declaration_regex.test(prev.text())) {prev.remove();}
    // Make the start of the text after the judge names span look nice:
    let next = this.nextSibling;
    let new_next = next.nodeValue.replace(/^\s*—\s*/i, "");
    next.nodeValue = new_next;
    // Move the authoring judges element, and turn it into a <p>:
    let new_authoring_judges_element = $(document.createElement("p"))
      .text(judge_names)
      .addClass("kp-authoring-judges")
      .insertBefore(parent);
    // If this is an instance of "THE CHIEF JUSTICE", add a class to say so:
    if (judge_names == "THE CHIEF JUSTICE") {
      new_authoring_judges_element.addClass("kp-cjauthor");
    }
    $(this).remove();
    // If the parent is now empty, remove it:
    if (parent.text().length === 0) {parent.remove()}
  });


  function capitalize(str) {
    return str.split(" ")
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(" ");
  }

  // Get Chief Justice:
  // const judge_name_regex_part = /([^\s\d.,:;!?'"`/\\|_()[\]{}]+)/;
  // const chief_justice_regex = new RegExp(judge_name_regex_part.source + /\s+C\.?J\.?/.source, "im");
  const judge_regex = /[^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=,|\s+and|\s+JJ?\b\.?)/gm;
  const chief_justice_regex = /[^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=\s+C\.?J\.?)/m;
  // const judge_regex = /(\w{2})/gm;
  // [^\s\d.,:;!?'"`/\\|_()[\]{}]+(?=,|\s+and|\s+JJ\.?)|([^\s\d.,:;!?'"`/\\|_()[\]{}]+)(?=\s+C\.?J\.?)
  // console.log(chief_justice_regex);
  // console.log(chief_justice_regex.source);
  let chief_justice;
  let judges = [];
  judge_declarations.add($(authoring_judges)).each(function() {
    let cj_match = $(this).text().match(chief_justice_regex);
    if (cj_match) {
      chief_justice = cj_match[0];
    }
    let j_match = $(this).text().match(judge_regex);
    if (j_match) {
      j_match.forEach(function(m) {
        let capitalized_m = capitalize(m);
        if ($.inArray(capitalized_m, judges) === -1) {
          judges.push(capitalized_m);
        }
      });
    }
  });
  console.log(`Chief justice: ${chief_justice}`);
  console.log(`Judges: ${judges}`);

  // Go back and change any instances of "THE CHIEF JUSTICE" in authoring_judges to the judge's name:
  $(".kp-cjauthor").text(`${chief_justice.toUpperCase()} C.J.`);




  // HEADINGS:
  // Find headings:
  const heading_regex = /^([A-Za-z0-9]{1,4}\.|\([A-Za-z0-9]{1,4}\))\s+["“'’]?\w+/i;
  const heading_class_regex = /^Title\d+LevelTitre\d+Niveau/;
  const headings = $("p").filter(function() {
    return heading_class_regex.test($(this).attr("class"));
  }).add($(".MsoNormal, .kp-authoring-judges")).filter(function() {
    return ($(this).hasClass("kp-authoring-judges") || heading_regex.test($(this).text()));
  });
  // Remove extra whitespace characters:
  headings.each(function() {
    $(this).text($(this).text().replace(/\s+/g, " ").trim());
    console.log($(this).text());
  });




  // Organize headings:
  const alphabet = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z'
  ];
  const roman_numerals = [
    'i','ii','iii','iv','v','vi','vii','viii','ix','x',
    'xi','xii','xiii','xiv','xv','xvi','xvii','xviii','xix','xx'
  ];
  const list_prefix_regex = /^([A-Z\s]+[CJ]J?\b\.?)|^(?:([A-Z]+)|([a-z]+)|([0-9]+))\.|^\((?:([A-Z]+)|([a-z]+)|([0-9]+))\)/;
  // 0 -> BINNE J.
  // 1 -> A.
  // 2 -> a.
  // 3 -> 1.
  // 4 -> (A)
  // 5 -> (a)
  // 6 -> (1)
  // 7 -> I.
  // 8 -> i.
  // 10 -> (I) NOTE—skipped 9 (so that later we can just add 6 to go from alphabet to roman numerals)
  // 11 -> (i)
  var type_num_ranks = [];
  var type_num_ranks_obj = [];

  // type_num_ranks_obj = [
  //   {type_num: 0, position: 3}
  // ];
  function getWriteListType(heading_text) {
    console.log(`-- Running function on '${heading_text}'...`);

    let prefix_match = list_prefix_regex.exec(heading_text);
    let type_num = prefix_match.slice(1).findIndex((x) => x !== undefined);
    let prefix_char = prefix_match[type_num + 1];

    // Check if this type_num is in type_num_ranks:
    let in_ranks = $.inArray(type_num, type_num_ranks);
    let rank = null;
    let pos = null;

    // Calculate rank (if it is later found to be a RN, this rank may change):
    if (in_ranks > -1) {
      rank = in_ranks;
    } else {
      rank = type_num_ranks.length;
    }

    // Handle Roman numerals:
    let is_letter = $.inArray(type_num, [1,2,4,5]);
    if (is_letter > -1) {
      let al_arr_pos = $.inArray(prefix_char.toLowerCase(), alphabet);
      // console.log(`al_arr_pos = ${al_arr_pos}`);
      let rn_arr_pos = $.inArray(prefix_char.toLowerCase(), roman_numerals);
      // console.log(`rn_arr_pos = ${rn_arr_pos}`);

      // If it could be alphabetical, calculate what pos would be:
      if (al_arr_pos > -1) {
        if (in_ranks > -1) {
          pos = Number(type_num_ranks_obj[rank].position) + 1;
        } else {
          pos = 0;
        }
      }

      // If it could be a RN, calculate what type_num, pos and rank would be:
      let type_num_RN = null;
      let in_ranks_RN = null;
      let rank_RN = null;
      let pos_RN = null;
      if (rn_arr_pos > -1) {
        // Calculate type_num_RN:
        type_num_RN = type_num + 6;
        in_ranks_RN = $.inArray(type_num_RN, type_num_ranks);
        // Calculate pos_RN and rank_RN:
        if (in_ranks_RN > -1) {
          rank_RN = in_ranks_RN;
          pos_RN = Number(type_num_ranks_obj[rank_RN].position) + 1;
        } else {
          rank_RN = type_num_ranks.length;
          pos_RN = 0;
        }
      }

      if (al_arr_pos === pos && rn_arr_pos === pos_RN) {
        // Let's hope it doesn't come to this...
        console.log(`ERROR: Unclear if heading '${heading_text}' is alphabetical or Roman numeral`);
      } else if (rn_arr_pos === pos_RN) {
        // console.log(`RN found to work!`);
        type_num = type_num_RN;
        rank = rank_RN;
        pos = pos_RN;
        in_ranks = in_ranks_RN;
      } else if (al_arr_pos === pos) {
        // console.log(`Alphabetical found to work!`);
      } else {
        console.log(`Heading '${heading_text}' seems to be neither alphabetical nor Roman numeral`);
      }
      if (al_arr_pos === -1 && rn_arr_pos === -1) {
        console.log(`ERROR: Heading '${heading_text}' isn't in alphabet or RN arrays`);
      }
    } else {
      pos = Number(prefix_char) - 1;
    }

    // Write info:
    if (in_ranks > -1) {
      let old_pos = type_num_ranks_obj[rank].position;
      type_num_ranks_obj[rank].position = pos;
      // console.log(`Writing: Updating pos –– type_num = ${type_num}, old_pos = ${old_pos}, pos = ${pos}, rank = ${rank}`);
    } else {
      type_num_ranks.push(type_num);
      type_num_ranks_obj.push({type_num:type_num, position:pos});
      // console.log(`Writing, type_num = ${type_num}, pos = ${pos}, rank = ${rank}`);
    }

    // Delete further ranks:
    type_num_ranks = type_num_ranks.slice(0, rank + 1);
    type_num_ranks_obj = type_num_ranks_obj.slice(0, rank + 1);

    return rank;
    // console.log(`-- Finished function on '${heading_text}'`);
    // console.log("");
  }


  var headings_obj = {};
  headings.each(function() {
    let rank = getWriteListType($(this).text());
    let following_para_num = getParaNum($(this).nextAll(".kp-para").eq(0));
    console.log(following_para_num);
    headings_obj[$(this).text()] = {rank:rank, following_para_num:following_para_num};
  });
  function getHeadingText(heading) {
    return heading.contents().eq(0).text();
  }
  function getRank(heading) {
    return headings_obj[getHeadingText(heading)].rank;
  }
  function getFollowingParaNum(heading) {
    return headings_obj[getHeadingText(heading)].following_para_num;
  }

  // JQUERY PLUGINS:
  $.fn.nextUntilEqualOrSuperordinate = function() {
    let rank = getRank(this);
    return this.nextUntil(headings.filter(function() {
      return getRank($(this)) <= rank;
    }));
  };
  $.fn.nextEqualOrSuperordinate = function() {
    return this.nextUntilEqualOrSuperordinate().last().next();
  };
  $.fn.subordinateTo = function(heading) {
    let heading_rank = getRank(heading);
    return this.filter(function() {
      return getRank($(this)) > heading_rank;
    });
  };

  // Determine included para ranges for each heading:
  headings.each(function() {
    let rank = getRank($(this));
    let following_para_num = getFollowingParaNum($(this));
    let next_equal_or_superordinate = $(this).nextEqualOrSuperordinate();
    let end_para_num;
    if (next_equal_or_superordinate.length === 1) {
      end_para_num = getFollowingParaNum(next_equal_or_superordinate) - 1;
    } else if (next_equal_or_superordinate.length === 0) {
      end_para_num = last_para_num;
    }
    headings_obj[$(this).text()]["para_range"] = [following_para_num, end_para_num];
  });
  function getParaRange(heading) {
    return headings_obj[$(heading).text()].para_range;
  }
  headings.each(function() {
    let para_range = getParaRange($(this));
    let new_para_range_element = $(document.createElement("span"))
      .text(`¶${para_range[0]}-${para_range[1]}`)
      .addClass("kp-para-range")
      .appendTo($(this));
  });
  // headings.each(function() {
  //   console.log($(this).text(), getRank($(this)));
  // });









  headings.addClass("kp-heading");










  headings.each(function() {
    collapseHeading($(this));
  });

  // Make headings collapse/expand on click:
  headings.click(function() {
    if ($(this).hasClass("collapsed")) {
      expandHeading($(this));
    } else {
      collapseHeading($(this));
    }
  });

  function expandHeading(heading) {
    // OPTION 1: Expanding a heading automatically expands all subheadings
    // let paras_to_show = heading.nextUntil(headings.filter(function() {
    //   return getRank($(this)) <= rank;
    // }));

    // OPTION 2: When expanding a heading, it will remember which subheadings were expanded and which weren't
    // Figure out which paras shouldn't be shown
    // (because they're in a collapsed heading):
    let paras_not_to_show = $();
    let collapsed_subheadings = $(".kp-heading.collapsed").subordinateTo(heading);
    collapsed_subheadings.each(function() {
      let next_paras = $(this).nextUntilEqualOrSuperordinate();
      paras_not_to_show = paras_not_to_show.add(next_paras);
    });
    let paras_to_show = heading.nextUntilEqualOrSuperordinate().not(paras_not_to_show);
    paras_to_show.show();
    
    heading.removeClass("collapsed");
  }
  function collapseHeading(heading) {
    heading.nextUntilEqualOrSuperordinate().hide();
    heading.addClass("collapsed");
  }





  // Fix para indents:
  const indent_spans = $("span[style='font:7.0pt \"Times New Roman\"']");
  const new_indent = "\u2003".repeat(2);
  indent_spans.each(function(index) {
    $(this).text(new_indent);
  });











});
