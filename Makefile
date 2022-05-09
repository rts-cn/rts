setup:
	yarn

dev:
	yarn dev

release:
	yarn build && yarn export
	@echo Production projects are in the ./out folder

install:
	echo upload to xswitch.cn
	rsync -avz out/*  root@xswitch.cn:/var/www/xswitch/
