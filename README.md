PageLess - endless page
=======================

Description
-----------

Pageless is a jQuery plugin.
As you scroll down you see more results coming back at you automatically.
It provides an automatic pagination in an accessible way : if javascript is disabled your standard pagination is supposed to work.

Parameters
----------

* `currentPage`: current page (params[:page])
* `distance`: distance to the end of page in px when ajax query is fired
* `loader`: selector of the loader div (ajax activity indicator)
* `loaderHtml`: html code of the div if loader not used
* `loaderImage`: image inside the loader
* `loaderMsg`: displayed ajax message
* `pagination`: selector of the paginator divs. (if javascript is disabled paginator is required)
* `params`: paramaters for the ajax query, you can pass auth_token here
* `totalPages`: total number of pages
* `url`: URL used to request more data
* `scrape`: A function to modify the incoming data. (Doesn't do anything by default)
* `complete`: A function to call when a new page has been loaded (optional)
* `end`: A function to call when the last page has been loaded (optional)

Requirements
------------

* [jQuery](http://download.jquery.com)


Then just navigate to http://localhost:3000 and enjoy!

Demo (Rails 3)
----

[Demo](https://github.com/jney/jquery.pageless.demo) is a Rails 3 app that just runs. It demonstrates the basic usage of pageless scrolling.

    $ bundle install
    $ rails s

Then just navigate to http://localhost:3000 and enjoy!

Usage
-----

    $('#results').pageless({ totalPages: 10
                           , url: '/articles/'
                           , loaderMsg: 'Loading more results'
                           });

Thanks to
---------

* http://codemonky.com/post/34940898
* http://www.unspace.ca/discover/pageless/
* http://famspam.com/facebox

Contributors
------------

* [Jean-Sébastien Ney](https://github.com/jney)
* [Alexander Lang](https://github.com/langalex)
* [Lukas Rieder](https://github.com/Overbryd)
