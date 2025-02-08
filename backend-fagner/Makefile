.PHONY:	test
test:
	@coverage run manage.py test
	@coverage report -m
	@coverage html -d html_coverage

.PHONY: pep8
pep8:
	@flake8

.PHONY: ci
ci:
	@flake8
	@coverage run manage.py test --no-input
	@coverage report -m

.PHONY: urls
urls:
	@python manage.py show_urls
