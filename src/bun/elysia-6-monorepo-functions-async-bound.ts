import Elysia from "elysia"

const pingA = async () => 'H'
const pingB = async () => 'i'

const queryA = async (id: string) => id
const queryB = async (name: string | undefined) => name ?? ''

const bodyA = async <T extends object>(data: T): Promise<T> => ({ ...data })
const bodyB = async <T extends object>(data: T): Promise<T> => ({ ...data })

new Elysia()
	.get('/', async () => {
		await Promise.resolve()

		const [a, b] = await Promise.all([
			pingA(),
			pingB()
		])

		return a + b
	})
	.get('/id/:id', async (c) => {
		await Promise.resolve()

		c.set.headers['x-powered-by'] = 'benchmark'

		const id = c.params.id
		const name = c.query.name as string | undefined

		const [a, b] = await Promise.all([
			queryA(id),
			queryB(name)
		])

		return `${a} ${b}`
	})
	.post('/json', async (c) => {
		await Promise.resolve()

		const [a, b] = await Promise.all([
			bodyA(c.body as object),
			bodyB(c.body as object)
		])

		return { ...a, ...b }
	})
	.listen(3000)