setup:
	yarn

dev:
	yarn dev

release:
	yarn build && yarn export
	@echo Production projects are in the ./out folder

install:
	echo upload to rts.cn
	rsync --exclude=.DS_Store -rvz out/* root@rts.cn:/var/www/rts/
