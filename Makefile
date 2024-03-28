build: install-deps install-ncc
	ncc build src/index.js --license licenses.txt

install-deps:
	npm ci

install-ncc:
	npm i -g @vercel/ncc
