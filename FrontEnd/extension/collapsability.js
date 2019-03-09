$(function() {


  // Judge declarations:
  const judge_declaration_regex = /(judge?ment|reason).+delivered\s+by:?\s*$/s;
  const judge_declarations = $("p").filter(function() {
    return judge_declaration_regex.test($(this).text());
  });
  // Remove all elements before first judge declaration:
  judge_declarations.eq(0).prevAll().remove();

  judge_declarations.each(function() {
    console.log(`Judge declaration: ${$(this).text()}`);
  });


  // Get authoring judges:
  const authoring_judge_regex = /JJ?\.\W*$|(The\sChief\sJustice):?\W*$/i;
  const authoring_judges = $("[style='text-transform:uppercase'],.JudgeJuge").filter(function() {
    return authoring_judge_regex.test($(this).text());
  });
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
    console.log(`Judge names: ${judge_names}`);
    $(this).text(judge_names);
    // Find para element:
    let parent = $(this).closest("p");
    // If there is a previous para like "The following are the reasons delivered by:", remove it:
    let prev = parent.prev();
    if (judge_declaration_regex.test(prev.text())) {prev.remove();}
    // Make the start of the text after the judge names span look nice:
    let next_sib = this.nextSibling;
    if (next_sib) {
      let new_next = next_sib.nodeValue.replace(/^\s*—\s*/i, "");
      next_sib.nodeValue = new_next;
    }
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
  // Remove judge declarations:
  judge_declarations.remove();

  console.log(`Chief justice: ${chief_justice}`);
  console.log(`Judges: ${judges}`);

  // Go back and change any instances of "THE CHIEF JUSTICE" in authoring_judges to the judge's name:
  if (chief_justice) {
    $(".kp-cjauthor").text(`${chief_justice.toUpperCase()} C.J.`);
  }





  // HEADINGS:
  // Find headings:
  const heading_class_regex = /^Title\d+LevelTitre\d+Niveau|^TitleTitre-AltT/;
  const heading_regex = /^([A-Za-z0-9]{1,4}\.|\([A-Za-z0-9]{1,4}\))\s+["“'’]?\w+/i;
  const headings = $("p").filter(function() {
    return heading_class_regex.test($(this).attr("class"));
  }).add($(".MsoNormal")).filter(function() {
    return heading_regex.test($(this).text());
  }).add(".kp-authoring-judges");
  // }).add($(".MsoNormal, .kp-authoring-judges")).filter(function() {
  //   return ($(this).hasClass("kp-authoring-judges") || heading_regex.test($(this).text()));
  // });
  // Remove extra whitespace characters:
  headings.each(function() {
    $(this).text($(this).text().replace(/\s+/g, " ").trim());
  });









  // COLLAPSABILITY:
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
    // console.log(`-- Running function on '${heading_text}'...`);

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
        console.log(`Function getWriteListType: Heading '${heading_text}' could be either alphabetical or Roman numeral; going with alphabetical`);
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

  headings.each(function() {
    let rank = getWriteListType($(this).text());
    let following_para_num = getParaNum($(this).nextAll(".kp-para").eq(0));
    $(this).data({rank:rank, following_para_num:following_para_num});
  });
  function getRank(heading) {
    return heading.data("rank");
  }
  function getFollowingParaNum(heading) {
    return heading.data("following_para_num");
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
    // headings_obj[$(this).text()]["para_range"] = [following_para_num, end_para_num];
    $(this).data("para_range", [following_para_num, end_para_num]);
  });
  function getParaRange(heading) {
    // return headings_obj[$(heading).text()].para_range;
    return heading.data("para_range");
  }
  headings.each(function() {
    let para_range = getParaRange($(this));
    let new_para_range_element_text = (para_range[0] === para_range[1]) ? `¶${para_range[0]}` : `¶${para_range[0]}-${para_range[1]}`;
    let new_para_range_element = $(document.createElement("span"))
      .text(new_para_range_element_text)
      .addClass("kp-para-range")
      .appendTo($(this));
  });
  // headings.each(function() {
  //   console.log($(this).text(), getRank($(this)));
  // });
  headings.addClass("kp-heading");

  // Indent headings according to rank:
  headings.each(function() {
    let rank = getRank($(this));
    let margin_left_value = `${(rank * 20)}pt`;
    $(this).css("margin-left", margin_left_value);
    // let top_value = `${(rank * 28 + 33)}px`;
    // $(this).css("top", top_value);
  });
  // Add triangles to headings:
  headings.each(function() {
    let triangle = $("<div></div>").addClass("triangle");
    $(this).prepend(triangle);
  });
















  // All headings should start collapsed:
  // collapseAll();

  // Make headings collapse/expand on click:
  headings.click(function() {
    if ($(this).hasClass("collapsed")) {
      expandHeading($(this));
    } else {
      collapseHeading($(this));
    }
  });
  function changeTriangleDirection(heading, direction) {
    let triangle = heading.find(".triangle");
    if (direction === "down") {
      triangle.addClass("triangle-down");
      triangle.removeClass("triangle-right");
    }
    if (direction === "right") {
      triangle.addClass("triangle-right");
      triangle.removeClass("triangle-down");
    }
  }
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

    // Change triangle direction:
    changeTriangleDirection(heading, "down");

    heading.removeClass("collapsed");
  }
  function collapseHeading(heading) {
    heading.nextUntilEqualOrSuperordinate().hide();
    changeTriangleDirection(heading, "right");
    heading.addClass("collapsed");
  }
  function expandAll() {
    headings.each(function() {
      expandHeading($(this));
    });
  }
  function collapseAll() {
    headings.each(function() {
      collapseHeading($(this));
    });
  }

  // Add 'expand all' button:
  let expand_all_button = $("<p></p>")
    .text("Expand all")
    .addClass("kp-expand-all")
    .click(function() {
      expandAll();
    });
  $(".documentcontent").prepend(expand_all_button);








  // SCROLLING:
  const top_bar_height = 33;
  const top_bar_height_minus_margin = 17;


  // $(window).scroll(function() {
  //   let doc_scroll_top = $(document).scrollTop();
  //   console.log(`doc_scroll_top: ${doc_scroll_top}`);
  //   headings.not("[position='fixed']").each(function() {
  //     let pos_rel_to_viewport = $(this).offset().top - doc_scroll_top;
  //     console.log(`pos_rel_to_viewport: ${pos_rel_to_viewport}`);
  //     let rank = getRank($(this));
  //     let sticky_point = rank * 28 + 33;
  //     console.log(`sticky_point: ${sticky_point}`);
  //     if (pos_rel_to_viewport <= sticky_point) {
  //       $(this).css({position:"fixed", top:sticky_point});
  //     }
  //   });
  // });
  // headings.each(function() {
  //   let rank = getRank($(this));
  //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
  //   $(this).sticky({topSpacing:sticky_point});
  // });
  // function stickHeading(heading) {
  //   let rank = getRank(heading);
  //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
  //   heading.sticky({topSpacing:sticky_point});
  // }
  // stickHeading(headings.eq(0));
  // stickHeading(headings.eq(1));




  var controller = new ScrollMagic.Controller();
  $(document.getElementsByClassName("kp-heading")).each(function() {
    let rank = getRank($(this));
    let element_offset = $(this).offset().top;
    let scene = new ScrollMagic.Scene({
      offset: element_offset - top_bar_height - (rank * 28)
      // duration: 400
    })
    .setPin(this);
    controller.addScene(scene);
  });
  //
  // function stickHeading(heading) {
  //   let rank = getRank(heading);
  //   let sticky_point = rank * 28 + top_bar_height_minus_margin;
  //   heading.sticky({topSpacing:sticky_point});
  // }
  // headings.eq(0).attr("id", "scrolltest")
  // var controller = new ScrollMagic.Controller();
  // var scene = new ScrollMagic.Scene({
  //   offset: 100, // start scene after scrolling for 100px
  //   duration: 400 // pin the element for 400px of scrolling
  // })
  // .setPin(document.getElementsByClassName("kp-heading")[0]);
  // controller.addScene(scene);









});
