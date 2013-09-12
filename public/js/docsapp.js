define("docsapp",
  ["jquery", "underscore", "backbone", "backbone-localstorage",
   "models/doc", "models/demooption",
   "collections/docs", "collections/demooptions",
   "views/error", "views/doc", "views/docedit", "views/sort", "views/search", "views/create", "views/docs",
   "views/loaddata","views/delete", "views/demooption", "views/demooptions"],
	function($, _, Backbone, bl,
    Doc, DemoOption,
    DocsList, DemoOptionsList,
    ErrorView, DocView, DocEditView, SortView, SearchView, CreateDocView, DocsListView,
    LoadDataView, DeleteItemsView, DemoOptionView, DemoOptionsListView) {
  
    var docsapp = {};

    docsapp.MainDocsAppView = Backbone.View.extend({
      initialize: function() {
        docsapp.docsList         = new DocsList();
        docsapp.creatingEnabled  = this.options.creatingEnabled || false;
        docsapp.sortingEnabled   = this.options.sortingEnabled || false;
        docsapp.deletingEnabled  = this.options.deletingEnabled || false;
        docsapp.searchingEnabled = this.options.searchingEnabled || false;
        docsapp.editingEnabled   = this.options.editingEnabled || false;
        
        this.render();
      },      
      
      render: function() {
        docsapp.contentEl = $('.content');
        docsapp.toolbarEl = $('.toolbar');
        docsapp.demoEl = $('.demo');        

        docsapp.errorView = new ErrorView({});  
        docsapp.docsListView = new DocsListView({collection: docsapp.docsList});

        if(docsapp.searchingEnabled) {
          docsapp.searchView = {};
          docsapp.searchView = new SearchView({collection : docsapp.docsList});
        }
        if(docsapp.creatingEnabled) {
          docsapp.createDocView = new CreateDocView({collection : docsapp.docsList});
        } 
        if(docsapp.deletingEnabled) {
          docsapp.deleteItemsView = new DeleteItemsView({collection : docsapp.docsList});   
        }
        if(docsapp.sortingEnabled) {
          docsapp.sortView = new SortView({collection : docsapp.docsList});
        }

        new LoadDataView();

        docsapp.demoOptionsListView = new DemoOptionsListView({
          collection: new DemoOptionsList([
            {optionName: 'creatingEnabled', optionTitle: 'Добавление', enabled: docsapp.creatingEnabled},
            {optionName: 'searchingEnabled', optionTitle: 'Поиск', enabled: docsapp.searchingEnabled},
            {optionName: 'sortingEnabled', optionTitle: 'Сортировка', enabled: docsapp.sortingEnabled},
            {optionName: 'deletingEnabled', optionTitle: 'Удаление', enabled: docsapp.deletingEnabled},
            {optionName: 'editingEnabled', optionTitle: 'Редактирование', enabled: docsapp.editingEnabled}
          ])
        }); 
        
        return this;
      }      
    });

    return docsapp;
});