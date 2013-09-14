define(["jquery", "backbone"],
	function($, Backbone) {

    var ScrollTableView = Backbone.View.extend({
      el: "#docs-table-wrapper",
      
      events: {
				"scroll"	: "detectScroll"
      },
      
			detectScroll: function() {
				var triggerPoint = 60;
				if(this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight) {
					docsapp.loadDataView.loadData();
				}
			}
		});
			
			return ScrollTableView;
	});		