Небольшое приложение, реализующее CRUD на Django. 

UML диаграмма:
![image](https://github.com/tlyashok/course-work-django/assets/67411791/6a3bc947-6b0d-4583-8777-e3c9e833d45d)

ER диаграмма:
![image](https://github.com/tlyashok/course-work-django/assets/67411791/0358e437-ba04-42c8-ad6b-39da008a0220)

Диаграмма в нотации Питера Чена:
![image](https://github.com/tlyashok/course-work-django/assets/67411791/0d7e8829-02b1-466a-a992-eac2f63bf24e)

В приложении есть две роли: Пользователь, Администратор.

Анонимный пользователь имеет доступ к просмотру каталога товаров.

Авторизованный пользователь имеет доступ к просмотру каталога товаров, а также к добавлению товаров в корзину и формированию виртуального чека в PDF формате.

Администратор имеет доступ к админ панеле Django, в которой он может осуществлять CRUD операции над сущностями БД.

Для указания фильтров к категориям товаров используется следующий формат:  
	Формат JSON файла для сущности Categories в поле filters:
 	“Название фильтра”: [“Тип фильтра”, возможные дополнительные значения…]
	Типы фильтров:
	0 – Нет сортировки
	1 – Сортировка по возрастанию или убыванию
	2 – Поле для галочки (True или False)
	3 – Поиск по названию
	4 – Выбор из вариантов (“Производитель”: [4, “Intel”, “Amd”])
Некоторые стандартные фильтры, такие как поиск по наименованию и фильтрация по цене реализованы по умолчанию, остальные задаются специфично для каждой категории.

Для указания характеристик товара используется JSON формат:
	"Параметр": "Значение"
Все указанные в категории товара характеристики должны быть прописаны, также возможно прописать дополнительные характеристики.
