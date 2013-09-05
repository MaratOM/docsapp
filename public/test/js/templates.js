(function(docsapp){
	
	var templates = {};
	
	templates.search = [
	  "<input id=\"docs-search\" title=\"Вводите слова для поиска\" placeholder=\"Найти\" type=\"text\" />",
    "<a href=\"#\" class=\"clear-search button icon-clear-search-btn\" title=\"Очистить строку поиска\"></a>"
	].join("");

	templates.createDoc = [
		"<a href=\"#\"  class=\"create button icon-add-btn\" title=\"Создать документ\"></a>",
		"<div class=\"create-data hidden\" title=\"Нажмите Enter, чтобы добавить документ\">",
				"<input class=\"code\" placeholder=\"Код\" type=\"text\" />",
				"<input class=\"title\" placeholder=\"Наименование документа\" type=\"text\" />",
				"<a href=\"#\" class=\"hide-create-inputs\" title=\"Закрыть окно\">x</a>",
		"</div>" 
	].join("");

	templates.docsThead = [
		"<thead>",
			"<tr>",
				"<% if(deletingEnabled) {%><th class=\"checkbox\" title=\"Отметить все документы для удаления\"><input class=\"check\" type=\"checkbox\" /></th><%}%>",
				"<th class=\"code<% if(sortingEnabled) {%> sorted<%}%>\" title=\"Сортировать по коду документа\">Код<% if(sortingEnabled) {%><span class=\"sort-arrow\">&#8597;</span><%}%></th>",
				"<th class=\"title<% if(sortingEnabled) {%> sorted<%}%>\" title=\"Сортировать по названию документа\">Наименование документа<% if(sortingEnabled) {%><span class=\"sort-arrow\">&#8597;</span><%}%></th>",
			"</tr>",
		"</thead>" 
	].join("");
	
	templates.docsList = [
		"<% if(doc.toDelete) {var toDeleteClass='class=\"to-delete\"'}%>",
		"<% if(deletingEnabled) {%><td class=\"checkbox\"><input title=\"Отметить документ для удаления\" class=\"check\" type=\"checkbox\" <% if(doc.toDelete) {%>checked=\"checked\"<%}%> /></td><%}%>",
		"<td class=\"code\">",
			"<span <%= toDeleteClass%> title=\"Дважды кликните для редактирования\"><%= doc.code%></span>",
			"<input title=\"Нажмите Enter, чтобы сохранить изменения\" class=\"hidden\" type=\"text\" value=\"<%= doc.code%>\" />",
		"</td>",
		"<td class=\"title\">",
			"<span <%= toDeleteClass%> title=\"Дважды кликните для редактирования\"><% if(searchText !== undefined) {%><%= searchHighlight(doc.title)%><%} else {%><%= doc.title%><%}%></span>",
			"<input title=\"Нажмите Enter, чтобы сохранить изменения\" class=\"hidden\" type=\"text\" value=\"<%= doc.title%>\" />",
			"<% if(deletingEnabled) {%><span class=\"doc-delete icon-delete\" title=\"Удалить документ\"></span><%}%>",
		"</td>"
	].join("");
	
	templates.demoOption = [
		"<input title=\"Отметьте, чтобы применить опцию\" class=\"check\" type=\"checkbox\" <%if(enabled) {%>checked<%}%> value=\"<%= optionName%>\"/><%= optionTitle%>",
	].join("");		

	templates.deleteDocs = [
    "<a href=\"#\" class=\"delete button icon-delete-btn <% if(toDelete) {%>active<% }%>\" title=\"<% if(toDelete) {%>Удалить <%= toDelete%> док.<% } else{%>Выберите документы для удаления<% }%>\"></a>"
	].join("");	

	for(var temp in templates) {
		if(templates.hasOwnProperty(temp)) {
			templates[temp] = _.template(templates[temp]);
		}	
	}	
	
	docsapp.templates = templates;
	
	window.docsapp = docsapp;
 
})(window.docsapp || {});
