define(["backbone", "backbone-localstorage", "models/doc"],
	function(Backbone, bl, Doc) {

    var DocsList = Backbone.Collection.extend({
      model: Doc,
      sortField: '',
      codeSortOrder: 'desc',
      titleSortOrder: 'desc',      
      searchText: '',
      
      localStorage: new Store("docs"),
  
      toDelete: function() {
        return this.filter(function(model){ return model.get('toDelete'); });
      },
      
      search: function() {
        return this.filter(function(model){ return model.get('title').indexOf(this.searchText) == -1 ? false : true; }, this);
      },
      
      comparator: function(a,b) {
        var aComp, bComp, returnVal;

				aComp = a.get(this.sortField);
				bComp = b.get(this.sortField);

				if(aComp == bComp) {
					returnVal = 0;
				}
				else {
					if(this[this.sortField + 'SortOrder'] === 'asc') {
						returnVal = aComp > bComp ? 1 : -1;
					}
					else if(this[this.sortField + 'SortOrder'] === 'desc') {
						returnVal = aComp < bComp ? 1 : -1;
					}
				}

				return returnVal;
      }
    });
		
		return DocsList;
	});		