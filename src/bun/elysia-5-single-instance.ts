import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => 'Hi')
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'

		return `${c.params.id} ${(c.query.name as string | undefined) ?? ''}`
	})
	.post('/json', (c) => c.body)
	.listen(3000)