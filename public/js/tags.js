(function($) {

  $.fn.tagcloud.defaults = {
      size: { start: 0.9, end: 2, unit: "rem" },
      color: { start: "#A28669", end: "#806A53" }
  };

  $(function () {
      $("#tag_cloud a").tagcloud();
  });

})(jQuery);
