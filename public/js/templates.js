define(["underscore"], function(_) {
	
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

	templates.docsTHeader = [
		"<table id=\"docs-theader\">",
			"<thead>",
				"<tr>",
					"<% if(deletingEnabled) {%><th class=\"checkbox\" title=\"Отметить все документы для удаления\"><input class=\"check\" type=\"checkbox\" /></th><%}%>",
					"<th class=\"code<% if(sortingEnabled) {%> sorted<%}%>\" title=\"Сортировать по коду документа\">Код<% if(sortingEnabled) {%><span class=\"sort-arrow\">&#8597;</span><%}%></th>",
					"<th class=\"title<% if(sortingEnabled) {%> sorted<%}%>\" title=\"Сортировать по названию документа\">Наименование документа<% if(sortingEnabled) {%><span class=\"sort-arrow\">&#8597;</span><%}%></th>",
				"</tr>",
			"</thead>",
		"</table>"
	].join("");
	
	templates.docsTData = [
		"<div id=\"docs-table-wrapper\">",
			"<table id=\"docs-table\">",
			"</table>",
		"</div>"
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
	
	templates.noDocs = [
		"<tr><td colspan=3 align=center>Нет документов для просмотра</td></tr>"
	].join("");	
	
	templates.deleteDocs = [
    "<a href=\"#\" class=\"delete button icon-delete-btn <% if(toDelete) {%>active<% }%>\" title=\"<% if(toDelete) {%>Удалить <%= toDelete%> док.<% } else{%>Выберите документы для удаления<% }%>\"></a>"
	].join("");
	
	templates.loadData = [
		"<a href=\"#\" title=\"Кликните, чтобы загрузить данные из файла\" class=\"load-data\">загрузить данные из файла</a>"
	].join("");		

	templates.demoOption = [
		"<input title=\"Отметьте, чтобы применить опцию\" class=\"check\" type=\"checkbox\" <%if(enabled) {%>checked<%}%> value=\"<%= optionName%>\"/><%= optionTitle%>",
	].join("");

	for(var temp in templates) {
		if(templates.hasOwnProperty(temp)) {
			templates[temp] = _.template(templates[temp]);
		}	
	}
	
	return templates;
});