describe("DocsApp", function() {
  beforeEach(function() {
    this.docsList = new DocsList([
      {code: 1, title: 'Один'},
      {code: 3, title: 'Три'},
      {code: 10, title: 'Десять'},
      {code: 141, title: 'Сто сорок один'}
    ]);    
  });

  describe("Поведение модели Doc", function() {
    beforeEach(function() {
      this.doc = new Doc({code: 10, title: 'Some Title'});
    });
    
    it("Модель должна быть invalid если 'code' пустой", function() {
      this.doc = new Doc({code: '', title: 'Some Title'});
      expect(this.doc.isValid()).toBeFalsy();
    });
    
    it("Модель должна быть invalid если 'code' не число", function() {
      this.doc = new Doc({code: '', title: 'Some Title'});
      expect(this.doc.isValid()).toBeFalsy();
    });
    
    it("Модель должна быть invalid если 'title' пустой", function() {
      this.doc = new Doc({code: 5, title: ''});
      expect(this.doc.isValid()).toBeFalsy();
    });
    
    it("toDelete должен меняться между true и false при вызове toggleDelete", function() {
      this.doc.toggleDelete(); 
      expect(this.doc.get("toDelete")).toBeTruthy();
      this.doc.toggleDelete(); 
      expect(this.doc.get("toDelete")).toBeFalsy();
    });    
  });
  
  describe("Поведение коллекции DocsList", function() {
    it("toDelete() возвращает модели помеченные для удаления", function() {
      this.docsList.at(1).toggleDelete(); 
      this.docsList.at(2).toggleDelete();
      
      expect(this.docsList.toDelete()).toContain(this.docsList.at(1));
      expect(this.docsList.toDelete()).toContain(this.docsList.at(2));
      expect(this.docsList.toDelete()).not.toContain(this.docsList.at(3));
    });
    
    it("Поиск возвращает корректные модели", function() {
      this.docsList.searchText = 'ин';
      var searchList = this.docsList.search();

      expect(this.docsList.search()).toContain(this.docsList.at(0));
      expect(this.docsList.search()).toContain(this.docsList.at(3));
      expect(this.docsList.search()).not.toContain(this.docsList.at(1));
    });    
  });
  
  describe("Поведение Views", function() {
    describe("Поведение ErrorView", function() {
      beforeEach(function() {
        this.errorView = new ErrorView({}); 
      });
      
      it("Выводит правильное сообщение об ошибке, в соответствующем диве", function() {
        var newModel = this.docsList.create(new Doc({code: '', title: 'Some Title'})); 
        this.errorView.showErrors(newModel);
        
        expect(this.errorView.$el).toHaveHtml('<p>Введите "Код"</p>');
      });
      
      it("Выводит правильное сообщение об ошибке и убирает старое", function() {
        var newModel = this.docsList.create(new Doc({code: 10, title: ''})); 
        this.errorView.showErrors(newModel);
        
        expect(this.errorView.$el).toHaveHtml('<p>Введите "Наименование"</p>');
        
        this.errorView.hideErrors();
        
        var newModel = this.docsList.create(new Doc({code: 'NaN', title: ''})); 
        this.errorView.showErrors(newModel);
        
        expect(this.errorView.$el).toHaveHtml('<p>Код должен быть числом, Введите "Наименование"</p>');
      });       
    });
    
    describe("Поведение DocView и DocEditView", function() {
      beforeEach(function() {
        this.docsListView = new DocsListView({collection: this.docsList}); 
        this.docsListView.addAll();
      });
      
      it("Прячет span и показывает input при двойном щелчке", function() {
        var tr  = this.docsListView.$("tbody tr:first-child");
        var span = tr.find('td.title span').trigger('dblclick');
        var input = tr.find('td.title input');

        expect(tr.find('td.title span')).toHaveClass('hidden');
        expect(tr.find('td.title input')).not.toHaveClass('hidden');
      });      
      
      it("Изменяет код и наименование документа", function() {
        var e  = this.docsListView.$("tbody tr:first-child").find('td.title input').trigger('dblclick');
        e.keyCode = 13;
        
        this.docsListView.collectionViewed[0].edit(e);        
        this.docsListView.collectionViewed[0].editView.inputCode.val(20);
        this.docsListView.collectionViewed[0].editView.inputTitle.val('Двадцать');        
        this.docsListView.collectionViewed[0].close(e);

        expect(this.docsListView.collection.at(0).attributes.title).toBe('Двадцать');
      });
    });
    
    describe("Поведение SortView", function() {
      beforeEach(function() {
        this.sortView = new SortView({collection: this.docsList});
      });
      
      it("Корректно сортирует коллекцию по коду", function() {
        this.sortView.sortByCode();
        expect(this.docsList.at(0).get('code')).toEqual(141);
        this.sortView.sortByCode();
        expect(this.docsList.at(0).get('code')).toEqual(1);
      });
      
      it("Корректно сортирует коллекцию по наименованию", function() {      
        this.sortView.sortByTitle();
        expect(this.docsList.at(0).get('title')).toEqual('Три');
        this.sortView.sortByTitle();
        expect(this.docsList.at(0).get('title')).toEqual('Десять');          
      });
    });
    
    describe("Поведение CreateDocView", function() {
      beforeEach(function() {
        this.createDocView = new CreateDocView({collection: this.docsList});
      });

      it("Отображает и скрывает поля для добавления документа", function() {
        this.createDocView.showCreateInputs();
        expect(this.createDocView.$(".create-data")).not.toHaveClass("hidden");
        
        this.createDocView.hideCreateInputs();
        expect(this.createDocView.$(".create-data")).toHaveClass("hidden");
      });
      
      it("Добавляет новый документ", function() {
        this.createDocView.$("input.code").val(51);
        this.createDocView.$("input.title").val('Пятьдесят один');
       
        var e = this.createDocView.$("input.title").trigger('keypress');
        e.keyCode = 13;
        this.createDocView.createOnEnter(e);
        expect(this.createDocView.collection.length).toBe(5);
      });      
    });
    
    describe("Поведение DeleteItemsView", function() {
      beforeEach(function() {
        this.docsListView = new DocsListView({collection: this.docsList}); 
        this.docsListView.addAll();
        this.deleteItemsView = new DeleteItemsView({collection: this.docsList}); 
      });
      
      it("Удаляет документ при клике на иконке", function() {
        var tr  = this.docsListView.$("tbody tr:first-child");
        var e = tr.find('.doc-delete').trigger('click');

        expect(this.docsListView.collection.length).toBe(3);
      });
      
      it("Удаляет все документы при клике на чекбоксе в заголовке", function() {
        this.docsListView.toggleDeleleAll();
        var ee = this.deleteItemsView.$el.find("a").trigger('click');

        expect(this.docsListView.collection.length).toBe(0);
      });      
    });
  });
});