export const accordian = function () {
  var accdr = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < accdr.length; i++) {
  accdr[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}}


