pretty_path0 = ./**.js
pretty_path1 = ./src/**/**.js
pretty_path2 = ./src/**.js
pretty_path3 = ./src/**/**/**.js
scssFromPath = ./resources/scss/style.scss
scssToPath = ./public/assets/css/style.css

scssCombPath = ./resources/scss/


server:
	python manage.py runsslserver 8000 --key localhost.key --certificate localhost.crt

sass:
	node_modules/.bin/node-sass --sourcemap=false --watch $(scssFromPath) $(scssToPath)

sassBuild:
	node_modules/.bin/node-sass --sourcemap=false $(scssFromPath) $(scssToPath) --output-style compressed

pretty:
	prettier ${pretty_path0} --write && prettier ${pretty_path1} --write && prettier ${pretty_path2} --write && prettier ${pretty_path3} --write && make csscomb

csscomb:
	csscomb ${scssCombPath}

create:
	python manage.py news_create && python manage.py space_create && python manage.py account_create

init:
	python manage.py migrate account account_token space && make create
