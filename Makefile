deploy:
	rsync --exclude=.DS_Store -rvz src/* root@rts.cn:/var/www/rts/
