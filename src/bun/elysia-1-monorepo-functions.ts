import { Elysia } from 'elysia'

// Setup 1: Monorepo with plain function "services"
// A and B are plain functions, public endpoint composes them.

const pingA = () => 'H'
const pingB = () => 'i'

const queryA = (id: string) => id
const queryB = (name: string | undefined) => name ?? ''

const bodyA = <T extends object>(data: T): T => data
const bodyB = <T extends object>(data: T): T => data

new Elysia()
	.get('/', () => pingA() + pingB())
	.get('/id/:id', (c) => {
		c.set.headers['x-powered-by'] = 'benchmark'
		return `${queryA(c.params.id)} ${queryB(c.query.name as string | undefined)}`
	})
	.post(
		'/json',
		(c) => ({
			...bodyA(c.body as object),
			...bodyB(c.body as object)
		})
	)
	.listen(3000)
