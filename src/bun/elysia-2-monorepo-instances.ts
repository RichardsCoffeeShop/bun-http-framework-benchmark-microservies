import { Elysia } from 'elysia'

// Setup 2: Monorepo with Elysia instances called via .handle()
// A and B are Elysia instances; public endpoint dispatches to them in-process
// without any network or eden treaty layer.

const controllerA = new Elysia()
	.get('/', () => 'H')
	.get('/id/:id', (c) => c.params.id)
	.post('/json', (c) => c.body)

const controllerB = new Elysia()
	.get('/', () => 'i')
	.get('/id/:id', (c) => (c.query.name as string | undefined) ?? '')
	.post('/json', (c) => c.body)

new Elysia()
	.get('/', async () => {
		const [a, b] = await Promise.all([
			controllerA.handle(new Request('http://internal/')).then((r) => r.text()),
			controllerB.handle(new Request('http://internal/')).then((r) => r.text())
		])
		return a + b
	})
	.get('/id/:id', async (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'
		const search = new URL(c.request.url).search
		const url = `http://internal/id/${c.params.id}${search}`
		const [a, b] = await Promise.all([
			controllerA.handle(new Request(url)).then((r) => r.text()),
			controllerB.handle(new Request(url)).then((r) => r.text())
		])
		return `${a} ${b}`
	})
	.post('/json', async (c) => {
		const init = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(c.body)
		}
		const [a, b] = await Promise.all([
			controllerA.handle(new Request('http://internal/json', init)).then((r) => r.json()),
			controllerB.handle(new Request('http://internal/json', init)).then((r) => r.json())
		])
		return { ...(a as object), ...(b as object) }
	})
	.listen(3000)
