import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

// Setup 3: Microservices via in-process Eden Treaty
// A and B are Elysia instances; public endpoint calls them through
// `treaty(instance)` clients (no network, but full eden treaty overhead).

const controllerA = new Elysia()
	.get('/', () => 'H')
	.get('/id/:id', (c) => c.params.id)
	.post('/json', (c) => c.body)

const controllerB = new Elysia()
	.get('/', () => 'i')
	.get('/id/:id', (c) => (c.query.name as string | undefined) ?? '')
	.post('/json', (c) => c.body)

const clientA = treaty(controllerA)
const clientB = treaty(controllerB)

new Elysia()
	.get('/', async () => {
		const [{ data: a }, { data: b }] = await Promise.all([
			clientA.get(),
			clientB.get()
		])
		return (a as string) + (b as string)
	})
	.get('/id/:id', async (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'
		const id = c.params.id
		const name = c.query.name as string
		const [{ data: a }, { data: b }] = await Promise.all([
			clientA.id({ id }).get({ query: { name } }),
			clientB.id({ id }).get({ query: { name } })
		])
		return `${a} ${b}`
	})
	.post('/json', async (c) => {
		const [{ data: a }, { data: b }] = await Promise.all([
			clientA.json.post(c.body as any),
			clientB.json.post(c.body as any)
		])
		return { ...(a as object), ...(b as object) }
	})
	.listen(3000)
