deploy:
	rsync --exclude=.DS_Store -r src/* root@rts.cn:/var/www/rts/
