
var test_paras = [10, 12, 12, 9, 18, 12, 50];

// From https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
var counts = {};
var highest_count = 0;
test_paras.forEach(function(i) {
  counts[i] = (counts[i] || 0) + 1;
  if (highest_count < counts[i]) {highest_count = counts[i]}
});

var para_anchors = document.getElementsByClassName('paragAnchor');

// Paragraph coloring:
var darkest_color = [225, 100, 0];
var lightest_color = [255, 255, 255];
function final_color_component(comp, count_proportion) {
  return lightest_color[comp] - ((lightest_color[comp] - darkest_color[comp]) * count_proportion);
}


test_paras.forEach(function(n) {
  let para_anchor = para_anchors[n - 1];

  let count_proportion = counts[n] / highest_count;
  let final_color = [
    final_color_component(0, count_proportion),
    final_color_component(1, count_proportion),
    final_color_component(2, count_proportion)
  ];

  let para = para_anchor.parentNode;
  para.style.backgroundColor = `rgb(${final_color[0]}, ${final_color[1]}, ${final_color[2]})`;
});
