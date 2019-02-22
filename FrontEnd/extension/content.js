$(function() {

  // Test input; represents cited paragraph numbers
  const test_data = [
    {para:10, citing_case:"2008 FC 991", citing_para:21},
    {para:12, citing_case:"2008 FC 991", citing_para:22},
    {para:50, citing_case:"2008 FC 991", citing_para:37},
    {para:12, citing_case:"2009 SCC 12", citing_para:4},
    {para:9, citing_case:"2016 FCA 93", citing_para:49},
    {para:18, citing_case:"2011 SCC 61", citing_para:41},
    {para:35, citing_case:"2010 BCCA 191", citing_para:34},
    {para:36, citing_case:"2010 BCCA 191", citing_para:34}
  ];
  // Ideal formatting:
  // test_data = {
  //   9: [{citing_case:"2016 FCA 93", citing_para:49}],
  //   10: [{citing_case:"2008 FC 991", citing_para:21}],
  //   12: [
  //     {citing_case:"2008 FC 991", citing_para:22},
  //     {citing_case:"2009 SCC 12", citing_para:3},
  //     {citing_case:"2010 BCCA 191", citing_para:29}
  //   ],
  //   18: [{citing_case:"2011 SCC 61", citing_para:41}],
  //   50: [{citing_case:"2008 FC 991", citing_para:37}]
  // };
  var ideal_test_data = {};
  test_data.forEach(x => {
    ideal_test_data[x.para] = (ideal_test_data[x.para] || []);
    ideal_test_data[x.para].push(
      {citing_case:x.citing_case,
      citing_para:x.citing_para}
    );
  });




  const test_paras = Array.from(test_data, x => x.para);
  const unique_test_paras = [...new Set(test_paras)];

  // Create new object, attaching an array of citing cases to unique para nums:
  var paras_with_citations = {};
  unique_test_paras.forEach(n => {
    let citations = Array.from(test_data.filter(x => x.para === n), x => x.citing_case);
    paras_with_citations[n] = citations;
  });

  var counts = {};
  var highest_count = 0;
  test_paras.forEach(n => {
    counts[n] = (counts[n] || 0) + 1;
    if (highest_count < counts[n]) {highest_count = counts[n];}
  });

  // Array of DOM paragraph number elements:
  const para_anchors = $(".paragAnchor");
  // Main object for modified para properties:
  modified_paras = {};

  // Paragraph coloring:
  const darkest_color = [225, 100, 0];
  const lightest_color = [255, 255, 255];
  function final_color_component(comp, count_proportion) {
    return lightest_color[comp] - ((lightest_color[comp] - darkest_color[comp]) * count_proportion);
  }



  // Function to get url from case ID:
  const juridiction_map = {
    scc:["scc", "ca"],
    fca:["fca", "ca"],
    fc:["fct", "ca"],
    bcca:["bcca", "bc"]
  };
  const base_url = "https://www.canlii.org/en/";
  function getUrl(case_id) {
    let id_split = case_id.toLowerCase().split(" ");
    let id_nospace = case_id.replace(/ /g, "").toLowerCase();
    let year = id_split[0];
    let court = id_split[1];
    let num = id_split[2];
    let court_id = juridiction_map[court][0];
    let jur = juridiction_map[court][1];
    let url = base_url + `${jur}/${court_id}/doc/${year}/${id_nospace}/${id_nospace}.html`;
    return url;
  }


  // Main operation on the test_paras:
  unique_test_paras.forEach(para_num => {

    // Calculate final_color for the paragraph, based on how much this paragraph has been cited:
    let count_proportion = counts[para_num] / highest_count;
    let color = [
      final_color_component(0, count_proportion),
      final_color_component(1, count_proportion),
      final_color_component(2, count_proportion)
    ];
    let final_color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    modified_paras[para_num] = {highlight_color: final_color};

    // Get the relevant para_anchor:
    let para_anchor = para_anchors[para_num - 1];
    // Find the paragraph's element:
    // (Assumes that the paragraphs's element
    // is the closest ancestor with the 'p' tag)
    let para = para_anchor.closest("p");

    $(para).css("background-color", final_color);
    $(para).addClass("kp-modified-para");
    $(para).attr("data-para-num", para_num);

    // Create the links:
    let citing_cases_html = [];
    ideal_test_data[para_num].forEach(x => {
      let link_text = x.citing_case + " ¶" + x.citing_para;
      let link_url = getUrl(x.citing_case) + `#par${x.citing_para}`;
      let link_html = `<a href=${link_url}>${link_text}</a>`;
      citing_cases_html.push(link_html);
    });
    // Append the links:
    $(para).append("<div class=\"kp-citing-case-link-cont\"><div class=\"kp-citing-case-link\">" + citing_cases_html.join("</br>") + "</div></div>");
  });




  const mouseover_color = "rgb(234, 234, 234)";

  $(".kp-citing-case-link").hide();
  $(".kp-citing-case-link").css("background-color", mouseover_color);


  $(".kp-modified-para").hover(function() {
    $(this).css("background-color", mouseover_color);
    $(this).find(".kp-citing-case-link").show(150);
  },
  function() {
    let para_num = $(this).attr("data-para-num");
    let highlight_color = modified_paras[para_num].highlight_color;
    $(this).css("background-color", highlight_color);
    $(this).find(".kp-citing-case-link").hide(150);
  });




});
